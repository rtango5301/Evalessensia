// @vitest-environment jsdom

import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { listProjects, getMetrics, getMonitoringData } = vi.hoisted(() => ({
  listProjects: vi.fn(),
  getMetrics: vi.fn(),
  getMonitoringData: vi.fn(),
}));

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AreaChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CartesianGrid: () => null,
  Legend: () => null,
  Line: ({ name }: { name?: string }) => (name ? <span>{name}</span> : null),
  Area: () => null,
  Bar: () => null,
  Tooltip: () => null,
  XAxis: ({ label }: { label?: { value?: string } }) =>
    label?.value ? <span data-testid="x-axis-label">{label.value}</span> : null,
  YAxis: () => null,
}));
vi.mock('@/lib/observability/client', () => ({
  listProjects,
  getMetrics,
  getMonitoringData,
  latencySeconds: (milliseconds: number | null | undefined) =>
    milliseconds == null ? '—' : `${(milliseconds / 1000).toFixed(2)} s`,
}));

import MonitoringPage from './page';

const emptyMetrics = {
  timestamps: [],
  trace_count: [],
  latency: [],
  cost: [],
  errors: [],
  tokens: [],
};
const project = {
  id: 'project-1',
  name: 'Agent project',
  description: null,
  created_at: '',
  trace_count: 0,
  error_rate: 0,
  avg_latency_ms: 0,
  recent_run: null,
};

const monitoringData = {
  current: {
    trace_count: 12,
    error_count: 2,
    error_rate: 2 / 12,
    avg_latency_ms: 1200,
    p50_latency_ms: 900,
    p95_latency_ms: 2400,
    p99_latency_ms: 3200,
    tokens: 420,
    cost: 1.25,
  },
  previous: null,
  points: [
    {
      timestamp: '2026-07-18T00:00:00Z',
      trace_count: 12,
      errors: 2,
      avg_latency_ms: 1200,
      p50_latency_ms: 900,
      p95_latency_ms: 2400,
      p99_latency_ms: 3200,
      tokens: 420,
      cost: 1.25,
    },
  ],
  run_distribution: [{ run_type: 'agent', running: 0, success: 8, error: 2, total: 10 }],
  recent_runs: [
    {
      id: 'run-1',
      trace_id: 'trace-1',
      project_id: 'project-1',
      project_name: 'Agent project',
      name: 'Root agent',
      run_type: 'agent',
      status: 'success',
      start_time: '2026-07-18T00:00:00Z',
      end_time: '2026-07-18T00:00:01Z',
      latency_ms: 1000,
      total_tokens: 42,
      cost: 0.12,
      error: null,
    },
  ],
  traces: {
    count: [{ timestamp: '2026-07-18T00:00:00Z', trace_count: 12, run_count: 20 }],
    latency: [
      {
        timestamp: '2026-07-18T00:00:00Z',
        p50_latency_ms: 900,
        p95_latency_ms: 2400,
        p99_latency_ms: 3200,
      },
    ],
    error_rate: [{ timestamp: '2026-07-18T00:00:00Z', error_rate: 2 / 12 }],
  },
  llm_calls: { count: [], latency: [] },
  cost_tokens: { points: [] },
  tools: { tool_names: [], points: [] },
};
const emptyMonitoringData = {
  current: {
    trace_count: 0,
    error_count: 0,
    error_rate: 0,
    avg_latency_ms: null,
    p50_latency_ms: null,
    p95_latency_ms: null,
    p99_latency_ms: null,
    tokens: 0,
    cost: 0,
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

describe('MonitoringPage', () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    listProjects.mockResolvedValue([project]);
    getMetrics.mockResolvedValue(emptyMetrics);
    getMonitoringData.mockResolvedValue(emptyMonitoringData);
  });

  it('shows the empty state and requests selected interval and project', async () => {
    render(<MonitoringPage />);
    await screen.findByText('No monitoring data for this selection');
    fireEvent.click(screen.getByRole('button', { name: 'hour' }));
    await waitFor(() =>
      expect(getMonitoringData).toHaveBeenLastCalledWith({
        interval: 'hour',
        projectId: undefined,
        limit: 25,
      })
    );
    fireEvent.change(screen.getByLabelText('Project'), { target: { value: 'project-1' } });
    await waitFor(() =>
      expect(getMonitoringData).toHaveBeenLastCalledWith({
        interval: 'hour',
        projectId: 'project-1',
        limit: 25,
      })
    );
  });

  it('renders a retryable safe error state', async () => {
    getMonitoringData
      .mockRejectedValueOnce(new Error('Metrics unavailable'))
      .mockResolvedValue(monitoringData);
    render(<MonitoringPage />);
    await screen.findByText('Metrics unavailable');
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    await waitFor(() => expect(getMonitoringData).toHaveBeenCalledTimes(2));
  });

  it('renders all analytics sections without recent runs', async () => {
    getMonitoringData.mockResolvedValueOnce(monitoringData);
    render(<MonitoringPage />);
    expect(await screen.findByText('Traces')).toBeInTheDocument();
    expect(screen.getByText('LLM Calls')).toBeInTheDocument();
    expect(screen.getByText('Cost and Tokens')).toBeInTheDocument();
    expect(screen.getByText('Tools')).toBeInTheDocument();
    expect(screen.queryByText('Recent runs')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Root agent/ })).not.toBeInTheDocument();
    expect(screen.getByText('Trace latency')).toBeInTheDocument();
    expect(screen.getByText('p99')).toBeInTheDocument();
    expect(screen.queryByText('p95')).not.toBeInTheDocument();
    expect(screen.queryByText('Time')).not.toBeInTheDocument();
  });

  it('collapses and expands sections without refetching', async () => {
    getMonitoringData.mockResolvedValueOnce(monitoringData);
    render(<MonitoringPage />);
    const traces = await screen.findByText('Traces');
    const section = traces.closest('details') as HTMLDetailsElement;

    expect(section.open).toBe(true);
    expect(getMonitoringData).toHaveBeenCalledTimes(1);
    fireEvent.click(traces);
    expect(section.open).toBe(false);
    expect(getMonitoringData).toHaveBeenCalledTimes(1);
    fireEvent.click(traces);
    expect(section.open).toBe(true);
  });
});
