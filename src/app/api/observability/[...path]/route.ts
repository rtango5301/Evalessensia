import { NextRequest, NextResponse } from 'next/server';

const MAX_REQUEST_BYTES = 1_048_576;
const TIMEOUT_MS = 15_000;
const ALLOWED_PATH = /^api\/v1\/(projects|traces|runs|metrics|dashboard)(\/[A-Za-z0-9_-]+)*$/;

type RouteContext = { params: Promise<{ path: string[] }> };

function backendBaseUrl(): URL | null {
  const configured = process.env.OBSERVABILITY_BACKEND_URL;
  if (!configured) return null;
  try {
    const url = new URL(configured);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    url.pathname = `${url.pathname.replace(/\/$/, '')}/`;
    url.search = '';
    url.hash = '';
    return url;
  } catch {
    return null;
  }
}

async function proxy(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  const { path } = await context.params;
  const relativePath = path.join('/');
  if (!ALLOWED_PATH.test(relativePath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const baseUrl = backendBaseUrl();
  if (!baseUrl) {
    return NextResponse.json({ error: 'Observability backend is not configured' }, { status: 503 });
  }

  const declaredLength = Number(request.headers.get('content-length') ?? '0');
  if (!Number.isFinite(declaredLength) || declaredLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: 'Request body is too large' }, { status: 413 });
  }

  let body: ArrayBuffer | undefined;
  if (!['GET', 'HEAD'].includes(request.method)) {
    const candidate = await request.arrayBuffer();
    if (candidate.byteLength > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: 'Request body is too large' }, { status: 413 });
    }
    if (candidate.byteLength > 0) body = candidate;
  }

  const target = new URL(relativePath, baseUrl);
  target.search = request.nextUrl.search;
  const headers: Record<string, string> = { Accept: 'application/json' };
  const authorization = request.headers.get('authorization');
  if (authorization?.startsWith('Bearer ')) headers.Authorization = authorization;
  const requestId = request.headers.get('x-request-id');
  if (requestId) headers['X-Request-ID'] = requestId;
  const contentType = request.headers.get('content-type');
  if (body && contentType) headers['Content-Type'] = contentType;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const upstream = await fetch(target.toString(), {
      method: request.method,
      headers,
      body,
      signal: controller.signal,
    });
    const responseHeaders = new Headers();
    const upstreamContentType = upstream.headers.get('content-type');
    if (upstreamContentType) responseHeaders.set('content-type', upstreamContentType);
    const upstreamRequestId = upstream.headers.get('x-request-id');
    if (upstreamRequestId) responseHeaders.set('x-request-id', upstreamRequestId);
    return new NextResponse(await upstream.arrayBuffer(), {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'AbortError';
    return NextResponse.json(
      { error: timedOut ? 'Observability backend timed out' : 'Observability backend unavailable' },
      { status: timedOut ? 504 : 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
