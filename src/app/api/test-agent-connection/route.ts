import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidExternalUrl, isResolvedIpSafe } from '@/lib/validation/url';

export type AgentValidationStatus =
  | 'agent_valid'
  | 'not_agent_url'
  | 'reachable_not_agent'
  | 'unreachable'
  | 'timeout'
  | 'ssrf_blocked'
  | 'invalid_url'
  | 'server_error';

export interface AgentValidationResponse {
  status: AgentValidationStatus;
  responseTime?: number;
  httpStatus?: number;
  errorMessage?: string;
}

// In-memory rate limiter: userId -> { count, windowStart }
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(userId, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) return false;

  entry.count++;
  return true;
}

const FETCH_TIMEOUT_MS = 10_000;

export async function POST(request: NextRequest) {
  // Auth check
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json<AgentValidationResponse>(
      { status: 'unreachable', errorMessage: 'Auth not configured' },
      { status: 500 }
    );
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json<AgentValidationResponse>(
      { status: 'unreachable', errorMessage: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Rate limit
  if (!checkRateLimit(user.id)) {
    return NextResponse.json<AgentValidationResponse>(
      { status: 'unreachable', errorMessage: 'Rate limited' },
      { status: 429 }
    );
  }

  // Parse and validate input
  let url: string;
  try {
    const body = await request.json();
    if (typeof body?.url !== 'string' || !body.url.trim()) {
      return NextResponse.json<AgentValidationResponse>(
        { status: 'invalid_url', errorMessage: 'URL is required' },
        { status: 400 }
      );
    }
    url = body.url.trim();
  } catch {
    return NextResponse.json<AgentValidationResponse>(
      { status: 'invalid_url', errorMessage: 'Invalid request body' },
      { status: 400 }
    );
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return NextResponse.json<AgentValidationResponse>({
      status: 'invalid_url',
      errorMessage: 'Malformed URL',
    });
  }

  // SSRF checks
  if (!isValidExternalUrl(url)) {
    return NextResponse.json<AgentValidationResponse>({
      status: 'ssrf_blocked',
      errorMessage: 'Internal/private URLs are not allowed',
    });
  }

  const hostname = new URL(url).hostname;
  const ipSafe = await isResolvedIpSafe(hostname);
  if (!ipSafe) {
    return NextResponse.json<AgentValidationResponse>({
      status: 'ssrf_blocked',
      errorMessage: 'URL resolves to a private IP address',
    });
  }

  // Send POST with empty JSON body to test if it's an API endpoint
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), FETCH_TIMEOUT_MS);

  const startTime = performance.now();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
      signal: abortController.signal,
    });

    clearTimeout(timeoutId);
    const responseTime = Math.round(performance.now() - startTime);

    // 5xx → server error
    if (response.status >= 500) {
      return NextResponse.json<AgentValidationResponse>({
        status: 'server_error',
        responseTime,
        httpStatus: response.status,
        errorMessage: `Server returned ${response.status}`,
      });
    }

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      // JSON response — confirmed API endpoint (200, 400, 401, 422 all valid)
      return NextResponse.json<AgentValidationResponse>({
        status: 'agent_valid',
        responseTime,
        httpStatus: response.status,
      });
    }

    if (contentType.includes('text/html')) {
      // HTML response — this is a webpage, not an agent
      return NextResponse.json<AgentValidationResponse>({
        status: 'not_agent_url',
        responseTime,
        httpStatus: response.status,
        errorMessage: 'URL returned HTML instead of JSON. Agent URLs should be API endpoints.',
      });
    }

    // Other content types — reachable but inconclusive
    return NextResponse.json<AgentValidationResponse>({
      status: 'reachable_not_agent',
      responseTime,
      httpStatus: response.status,
      errorMessage: `Unexpected content-type: ${contentType || 'none'}`,
    });
  } catch (err) {
    clearTimeout(timeoutId);

    if (abortController.signal.aborted) {
      return NextResponse.json<AgentValidationResponse>({
        status: 'timeout',
        errorMessage: 'Connection timed out after 10 seconds',
      });
    }

    return NextResponse.json<AgentValidationResponse>({
      status: 'unreachable',
      errorMessage: err instanceof Error ? err.message : 'Connection failed',
    });
  }
}
