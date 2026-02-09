import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidExternalUrl, isResolvedIpSafe } from '@/lib/validation/url';

export type McpValidationStatus =
  | 'mcp_valid'
  | 'reachable_not_mcp'
  | 'unreachable'
  | 'timeout'
  | 'ssrf_blocked'
  | 'invalid_url';

export interface McpValidationResponse {
  status: McpValidationStatus;
  responseTime?: number;
  serverInfo?: { name: string; version?: string };
  protocolVersion?: string;
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
    return NextResponse.json(
      { status: 'unreachable', errorMessage: 'Auth not configured' },
      { status: 500 }
    );
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { status: 'unreachable', errorMessage: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Rate limit
  if (!checkRateLimit(user.id)) {
    return NextResponse.json(
      { status: 'unreachable', errorMessage: 'Rate limited' },
      { status: 429 }
    );
  }

  // Parse and validate input
  let url: string;
  try {
    const body = await request.json();
    if (typeof body?.url !== 'string' || !body.url.trim()) {
      return NextResponse.json<McpValidationResponse>(
        { status: 'invalid_url', errorMessage: 'URL is required' },
        { status: 400 }
      );
    }
    url = body.url.trim();
  } catch {
    return NextResponse.json<McpValidationResponse>(
      { status: 'invalid_url', errorMessage: 'Invalid request body' },
      { status: 400 }
    );
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return NextResponse.json<McpValidationResponse>({
      status: 'invalid_url',
      errorMessage: 'Malformed URL',
    });
  }

  // SSRF checks
  if (!isValidExternalUrl(url)) {
    return NextResponse.json<McpValidationResponse>({
      status: 'ssrf_blocked',
      errorMessage: 'Internal/private URLs are not allowed',
    });
  }

  const hostname = new URL(url).hostname;
  const ipSafe = await isResolvedIpSafe(hostname);
  if (!ipSafe) {
    return NextResponse.json<McpValidationResponse>({
      status: 'ssrf_blocked',
      errorMessage: 'URL resolves to a private IP address',
    });
  }

  // Send MCP initialize handshake
  const mcpBody = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2025-03-26',
      capabilities: {},
      clientInfo: { name: 'TensorEvals', version: '1.0.0' },
    },
  });

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), FETCH_TIMEOUT_MS);

  const startTime = performance.now();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: mcpBody,
      signal: abortController.signal,
    });

    clearTimeout(timeoutId);
    const responseTime = Math.round(performance.now() - startTime);

    // Try to parse as JSON-RPC response
    let json: unknown;
    try {
      json = await response.json();
    } catch {
      // Not JSON — reachable but not MCP
      return NextResponse.json<McpValidationResponse>({
        status: 'reachable_not_mcp',
        responseTime,
        errorMessage: 'Server did not return a JSON response',
      });
    }

    // Check if it's a valid MCP initialize response
    if (
      json &&
      typeof json === 'object' &&
      'result' in json &&
      json.result &&
      typeof json.result === 'object'
    ) {
      const result = json.result as Record<string, unknown>;
      if (
        typeof result.protocolVersion === 'string' &&
        result.serverInfo &&
        typeof result.serverInfo === 'object'
      ) {
        const serverInfo = result.serverInfo as Record<string, unknown>;
        return NextResponse.json<McpValidationResponse>({
          status: 'mcp_valid',
          responseTime,
          protocolVersion: String(result.protocolVersion),
          serverInfo: {
            name: typeof serverInfo.name === 'string' ? serverInfo.name : 'Unknown',
            version: typeof serverInfo.version === 'string' ? serverInfo.version : undefined,
          },
        });
      }
    }

    // Got JSON but not a valid MCP response
    return NextResponse.json<McpValidationResponse>({
      status: 'reachable_not_mcp',
      responseTime,
      errorMessage: 'Server returned JSON but not a valid MCP initialize response',
    });
  } catch (err) {
    clearTimeout(timeoutId);

    if (abortController.signal.aborted) {
      return NextResponse.json<McpValidationResponse>({
        status: 'timeout',
        errorMessage: 'Connection timed out after 10 seconds',
      });
    }

    return NextResponse.json<McpValidationResponse>({
      status: 'unreachable',
      errorMessage: err instanceof Error ? err.message : 'Connection failed',
    });
  }
}
