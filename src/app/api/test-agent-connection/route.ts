import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidExternalUrl, isResolvedIpSafe } from '@/lib/validation/url';

export type AgentValidationStatus =
  | 'agent_valid'
  | 'not_agent_url'
  | 'reachable_not_agent'
  | 'rate_limited'
  | 'unreachable'
  | 'timeout'
  | 'ssrf_blocked'
  | 'invalid_url'
  | 'server_error'
  | 'auth_failed'
  | 'bad_request';

export interface AgentValidationResponse {
  status: AgentValidationStatus;
  responseTime?: number;
  httpStatus?: number;
  errorMessage?: string;
  agentReply?: string;
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
  let model: string | undefined;
  let apiKey: string | undefined;
  let systemPrompt: string | undefined;
  try {
    const body = await request.json();
    if (typeof body?.url !== 'string' || !body.url.trim()) {
      return NextResponse.json<AgentValidationResponse>(
        { status: 'invalid_url', errorMessage: 'URL is required' },
        { status: 400 }
      );
    }
    url = body.url.trim();
    model = typeof body.model === 'string' ? body.model.slice(0, 100) : undefined;
    apiKey = typeof body.apiKey === 'string' ? body.apiKey.slice(0, 256) : undefined;
    systemPrompt =
      typeof body.systemPrompt === 'string' ? body.systemPrompt.slice(0, 1000) : undefined;
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

  // Build request dynamically — only include fields the user provided
  const fetchHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
  if (apiKey) fetchHeaders['Authorization'] = `Bearer ${apiKey}`;

  const messages: { role: string; content: string }[] = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: 'Reply with the word hello and nothing else.' });

  const requestBody: Record<string, unknown> = { messages };
  if (model) {
    requestBody.model = model;
    requestBody.max_tokens = 50;
  }

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), FETCH_TIMEOUT_MS);

  const startTime = performance.now();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: fetchHeaders,
      body: JSON.stringify(requestBody),
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

    // 401/403 → auth failed — extract the real error message from the response
    if (response.status === 401 || response.status === 403) {
      let serverMsg = 'Authentication failed. Check your API key.';
      try {
        const errorBody = await response.json();
        serverMsg =
          errorBody?.error?.message || errorBody?.message || errorBody?.detail || serverMsg;
      } catch {
        // couldn't parse error body, use default
      }
      return NextResponse.json<AgentValidationResponse>({
        status: 'auth_failed',
        responseTime,
        httpStatus: response.status,
        errorMessage: serverMsg,
      });
    }

    // 429 → rate limited (common with free-tier OpenAI accounts)
    if (response.status === 429) {
      let serverMsg = 'Rate limited. Check your API quota and usage limits.';
      try {
        const errorBody = await response.json();
        serverMsg =
          errorBody?.error?.message || errorBody?.message || errorBody?.detail || serverMsg;
      } catch {
        // couldn't parse error body, use default
      }
      return NextResponse.json<AgentValidationResponse>({
        status: 'rate_limited',
        responseTime,
        httpStatus: response.status,
        errorMessage: serverMsg,
      });
    }

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('text/html')) {
      return NextResponse.json<AgentValidationResponse>({
        status: 'not_agent_url',
        responseTime,
        httpStatus: response.status,
        errorMessage: 'URL returned HTML instead of JSON. Agent URLs should be API endpoints.',
      });
    }

    // 400/404 → bad request — try to extract server's error message
    // (OpenAI returns 404 for invalid model names)
    if (response.status === 400 || response.status === 404) {
      let serverMsg = 'Bad request';
      try {
        const errorBody = await response.json();
        serverMsg =
          errorBody?.error?.message || errorBody?.message || errorBody?.detail || serverMsg;
      } catch {
        // couldn't parse error body, use default
      }
      return NextResponse.json<AgentValidationResponse>({
        status: 'bad_request',
        responseTime,
        httpStatus: response.status,
        errorMessage: serverMsg,
      });
    }

    if (contentType.includes('application/json')) {
      // Try to extract agent reply from OpenAI-compatible response
      try {
        const jsonBody = await response.json();
        const reply = jsonBody?.choices?.[0]?.message?.content;
        if (typeof reply === 'string') {
          return NextResponse.json<AgentValidationResponse>({
            status: 'agent_valid',
            responseTime,
            httpStatus: response.status,
            agentReply: reply.slice(0, 100),
          });
        }
      } catch {
        // couldn't parse JSON body — still reachable
      }

      // JSON but not OpenAI format — treat as success
      return NextResponse.json<AgentValidationResponse>({
        status: 'reachable_not_agent',
        responseTime,
        httpStatus: response.status,
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
