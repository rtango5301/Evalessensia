import { beforeEach, describe, expect, it, vi } from 'vitest';

const getSession = vi.fn();
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ auth: { getSession } }),
}));

import {
  getMonitoringData,
  listProjects,
  listTraces,
  latencySeconds,
  ObservabilityApiError,
} from './client';

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

  it('requests the expanded monitoring overview with bounded filters', async () => {
    const data = {
      current: {
        trace_count: 2,
        error_count: 1,
        error_rate: 0.5,
        avg_latency_ms: 100,
        p50_latency_ms: 90,
        p95_latency_ms: 150,
        p99_latency_ms: 180,
        tokens: 12,
        cost: 0.25,
      },
      previous: null,
      points: [],
      run_distribution: [],
      recent_runs: [],
      traces: { count: [], latency: [], error_rate: [] },
      llm_calls: { count: [], latency: [] },
      cost_tokens: { points: [] },
      tools: { tool_names: [], points: [] },
    };
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ success: true, data }), { status: 200 }));

    await expect(
      getMonitoringData({
        interval: 'day',
        projectId: 'project-1',
        start: '2026-07-01T00:00:00.000Z',
        end: '2026-07-19T00:00:00.000Z',
        limit: 10,
      })
    ).resolves.toEqual(data);
    expect(fetchMock.mock.calls[0][0]).toBe(
      '/api/observability/api/v1/metrics/overview?interval=day&project_id=project-1&start=2026-07-01T00%3A00%3A00.000Z&end=2026-07-19T00%3A00%3A00.000Z&limit=10'
    );
  });
});
