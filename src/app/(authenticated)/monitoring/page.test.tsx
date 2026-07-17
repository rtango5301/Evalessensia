// @vitest-environment jsdom

import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { listProjects, getMetrics } = vi.hoisted(() => ({
  listProjects: vi.fn(),
  getMetrics: vi.fn(),
}));

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CartesianGrid: () => null,
  Legend: () => null,
  Line: () => null,
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null,
}));
vi.mock('@/lib/observability/client', () => ({ listProjects, getMetrics }));

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

describe('MonitoringPage', () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    listProjects.mockResolvedValue([project]);
    getMetrics.mockResolvedValue(emptyMetrics);
  });

  it('shows the empty state and requests selected interval and project', async () => {
    render(<MonitoringPage />);
    await screen.findByText('No monitoring data for this selection');
    fireEvent.click(screen.getByRole('button', { name: 'hour' }));
    await waitFor(() =>
      expect(getMetrics).toHaveBeenLastCalledWith({ interval: 'hour', projectId: undefined })
    );
    fireEvent.change(screen.getByLabelText('Project'), { target: { value: 'project-1' } });
    await waitFor(() =>
      expect(getMetrics).toHaveBeenLastCalledWith({ interval: 'hour', projectId: 'project-1' })
    );
  });

  it('renders a retryable safe error state', async () => {
    getMetrics
      .mockRejectedValueOnce(new Error('Metrics unavailable'))
      .mockResolvedValue(emptyMetrics);
    render(<MonitoringPage />);
    await screen.findByText('Metrics unavailable');
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    await waitFor(() => expect(getMetrics).toHaveBeenCalledTimes(2));
  });
});
