import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

describe('observability proxy', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.OBSERVABILITY_BACKEND_URL;
  });

  it('forwards only an allowlisted path, query, bearer token, and response', async () => {
    process.env.OBSERVABILITY_BACKEND_URL = 'https://observability.example/';
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 207,
        headers: { 'content-type': 'application/json' },
      })
    );
    vi.stubGlobal('fetch', fetchMock);
    const request = new NextRequest(
      'http://localhost/api/observability/api/v1/projects?page=2',
      {
        headers: {
          authorization: 'Bearer user-token',
          cookie: 'private=cookie',
          'x-request-id': 'request-1',
        },
      }
    );

    const response = await GET(request, {
      params: Promise.resolve({ path: ['api', 'v1', 'projects'] }),
    });

    expect(response.status).toBe(207);
    await expect(response.json()).resolves.toEqual({ success: true });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://observability.example/api/v1/projects?page=2');
    expect(init.headers).toEqual({
      Accept: 'application/json',
      Authorization: 'Bearer user-token',
      'X-Request-ID': 'request-1',
    });
    expect(init.headers).not.toHaveProperty('Cookie');
  });

  it('rejects non-observability backend paths without fetching', async () => {
    process.env.OBSERVABILITY_BACKEND_URL = 'https://observability.example';
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const request = new NextRequest('http://localhost/api/observability/auth/register');

    const response = await GET(request, {
      params: Promise.resolve({ path: ['auth', 'register'] }),
    });

    expect(response.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects an oversized request before forwarding it', async () => {
    process.env.OBSERVABILITY_BACKEND_URL = 'https://observability.example';
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const request = new NextRequest('http://localhost/api/observability/api/v1/projects', {
      method: 'POST',
      headers: { 'content-length': '1048577' },
      body: '{}',
    });

    const response = await POST(request, {
      params: Promise.resolve({ path: ['api', 'v1', 'projects'] }),
    });

    expect(response.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns a safe gateway error when the backend is unavailable', async () => {
    process.env.OBSERVABILITY_BACKEND_URL = 'https://observability.example';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('secret upstream detail')));
    const request = new NextRequest('http://localhost/api/observability/api/v1/projects');

    const response = await GET(request, {
      params: Promise.resolve({ path: ['api', 'v1', 'projects'] }),
    });

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({ error: 'Observability backend unavailable' });
  });

  it('aborts and returns 504 when the backend exceeds the timeout', async () => {
    vi.useFakeTimers();
    process.env.OBSERVABILITY_BACKEND_URL = 'https://observability.example';
    vi.stubGlobal(
      'fetch',
      vi.fn((_url, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener('abort', () =>
            reject(new DOMException('aborted', 'AbortError'))
          );
        })
      )
    );
    const request = new NextRequest('http://localhost/api/observability/api/v1/projects');
    const pending = GET(request, {
      params: Promise.resolve({ path: ['api', 'v1', 'projects'] }),
    });

    await vi.advanceTimersByTimeAsync(15_000);
    const response = await pending;

    expect(response.status).toBe(504);
    await expect(response.json()).resolves.toEqual({ error: 'Observability backend timed out' });
    vi.useRealTimers();
  });
});
