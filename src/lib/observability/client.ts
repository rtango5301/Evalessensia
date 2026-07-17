import { createClient } from '@/lib/supabase/client';
import type { Metrics, Project, RunNode, TraceDetail, TracePage } from './types';

const API_BASE = '/api/observability/api/v1';

interface Envelope<T> {
  success: boolean;
  data: T;
}

export class ObservabilityApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ObservabilityApiError';
  }
}

async function accessToken(): Promise<string> {
  const supabase = createClient();
  if (!supabase) throw new ObservabilityApiError('Supabase is not configured', 500);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) throw new ObservabilityApiError('You must be signed in', 401);
  return session.access_token;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await accessToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
  if (init.body) headers['Content-Type'] = 'application/json';
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    method: init.method ?? 'GET',
    headers,
  });
  if (!response.ok) {
    let message = `Observability request failed (${response.status})`;
    let code: string | undefined;
    try {
      const body = (await response.json()) as {
        error?: string | { message?: string; code?: string };
      };
      if (typeof body.error === 'string') message = body.error;
      else if (body.error) {
        message = body.error.message ?? message;
        code = body.error.code;
      }
    } catch {
      // Preserve the status-based fallback for non-JSON responses.
    }
    throw new ObservabilityApiError(message, response.status, code);
  }
  if (response.status === 204) return undefined as T;
  return ((await response.json()) as Envelope<T>).data;
}

export function latencySeconds(milliseconds: number | null | undefined): string {
  return milliseconds == null ? '—' : `${(milliseconds / 1000).toFixed(2)} s`;
}

export function listProjects(): Promise<Project[]> {
  return request<Project[]>('/projects');
}

export function createProject(name: string, description?: string): Promise<{ id: string }> {
  return request('/projects', {
    method: 'POST',
    body: JSON.stringify({ name, description: description || null }),
  });
}

export function deleteProject(projectId: string): Promise<void> {
  return request(`/projects/${encodeURIComponent(projectId)}`, { method: 'DELETE' });
}

export interface TraceFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  runType?: string;
}

export function listTraces(projectId: string, filters: TraceFilters = {}): Promise<TracePage> {
  const params = new URLSearchParams();
  if (filters.page != null) params.set('page', String(filters.page));
  if (filters.limit != null) params.set('limit', String(filters.limit));
  if (filters.status) params.set('status', filters.status);
  if (filters.search) params.set('search', filters.search);
  if (filters.runType) params.set('run_type', filters.runType);
  const query = params.size ? `?${params.toString()}` : '';
  return request(`/projects/${encodeURIComponent(projectId)}/traces${query}`);
}

export function getTrace(traceId: string): Promise<TraceDetail> {
  return request(`/traces/${encodeURIComponent(traceId)}`);
}

export function getTraceTree(traceId: string): Promise<RunNode> {
  return request(`/traces/${encodeURIComponent(traceId)}/tree`);
}

export function getMetrics(options: {
  interval: 'hour' | 'day' | 'week';
  projectId?: string;
  start?: string;
  end?: string;
}): Promise<Metrics> {
  const params = new URLSearchParams({ interval: options.interval });
  if (options.projectId) params.set('project_id', options.projectId);
  if (options.start) params.set('start', options.start);
  if (options.end) params.set('end', options.end);
  return request(`/metrics?${params.toString()}`);
}
