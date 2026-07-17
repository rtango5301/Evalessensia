import { beforeEach, describe, expect, it, vi } from 'vitest';

const getSession = vi.fn();
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ auth: { getSession } }),
}));

import { listProjects, listTraces, latencySeconds, ObservabilityApiError } from './client';

describe('observability client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    getSession.mockResolvedValue({ data: { session: { access_token: 'user-token' } } });
  });

  it('uses the dedicated proxy and Supabase bearer token', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: [] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    );

    await expect(listProjects()).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalledWith('/api/observability/api/v1/projects', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer user-token',
      },
    });
  });

  it('encodes trace filters without dropping zero-like values', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: { items: [], page: 1, limit: 25, total: 0, pages: 0 },
        }),
        { status: 200 }
      )
    );

    await listTraces('project-id', {
      page: 1,
      limit: 25,
      status: 'error',
      runType: 'tool',
      search: 'hello world',
    });
    expect(fetchMock.mock.calls[0][0]).toBe(
      '/api/observability/api/v1/projects/project-id/traces?page=1&limit=25&status=error&search=hello+world&run_type=tool'
    );
  });

  it('preserves backend error status and envelope', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ error: { code: 'PROJECT_NOT_FOUND', message: 'Project not found' } }),
        { status: 404 }
      )
    );

    await expect(listProjects()).rejects.toEqual(
      expect.objectContaining<Partial<ObservabilityApiError>>({
        status: 404,
        code: 'PROJECT_NOT_FOUND',
        message: 'Project not found',
      })
    );
  });

  it('formats stored milliseconds as seconds', () => {
    expect(latencySeconds(1250)).toBe('1.25 s');
    expect(latencySeconds(0)).toBe('0.00 s');
    expect(latencySeconds(null)).toBe('—');
  });
});
