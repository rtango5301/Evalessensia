// @vitest-environment jsdom

import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { listProjects, listTraces } = vi.hoisted(() => ({
  listProjects: vi.fn(),
  listTraces: vi.fn(),
}));

vi.mock('next/navigation', () => ({ useParams: () => ({ projectId: 'project-1' }) }));
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.ComponentProps<'a'>) => (
    <a href={String(href)} {...props}>
      {children}
    </a>
  ),
}));
vi.mock('@/lib/observability/client', () => ({
  listProjects,
  listTraces,
  latencySeconds: (value: number | null) =>
    value == null ? '—' : `${(value / 1000).toFixed(2)} s`,
}));

import ProjectTracesPage from './page';

const project = {
  id: 'project-1',
  name: 'Agent project',
  description: null,
  created_at: '',
  trace_count: 1,
  error_rate: 0,
  avg_latency_ms: 0,
  recent_run: null,
};
const tracePage = {
  items: [
    {
      trace_id: 'trace-1',
      status: 'success',
      latency_ms: 0,
      total_tokens: 0,
      total_cost: 0,
      start_time: null,
      created_at: '',
      run_name: 'Root run',
      run_type: 'agent',
    },
  ],
  page: 1,
  limit: 25,
  total: 26,
  pages: 2,
};

describe('ProjectTracesPage', () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    listProjects.mockResolvedValue([project]);
    listTraces.mockResolvedValue(tracePage);
  });

  it('forwards search/status/type filters and pagination', async () => {
    render(<ProjectTracesPage />);
    await screen.findByText('Root run');
    fireEvent.change(screen.getByPlaceholderText(/Search trace ID/), {
      target: { value: 'needle' },
    });
    fireEvent.change(screen.getByDisplayValue('All statuses'), { target: { value: 'error' } });
    fireEvent.change(screen.getByDisplayValue('All run types'), { target: { value: 'tool' } });
    await waitFor(() =>
      expect(listTraces).toHaveBeenLastCalledWith('project-1', {
        page: 1,
        limit: 25,
        search: 'needle',
        status: 'error',
        runType: 'tool',
      })
    );
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() =>
      expect(listTraces).toHaveBeenLastCalledWith('project-1', {
        page: 2,
        limit: 25,
        search: 'needle',
        status: 'error',
        runType: 'tool',
      })
    );
  });
});
