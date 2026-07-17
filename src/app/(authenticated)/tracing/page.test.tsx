// @vitest-environment jsdom

import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { listProjects, createProject, deleteProject } = vi.hoisted(() => ({
  listProjects: vi.fn(),
  createProject: vi.fn(),
  deleteProject: vi.fn(),
}));

vi.mock('next/link', () => ({ default: ({ href, children, ...props }: React.ComponentProps<'a'>) => <a href={String(href)} {...props}>{children}</a> }));
vi.mock('@/lib/observability/client', () => ({
  listProjects,
  createProject,
  deleteProject,
  latencySeconds: (value: number | null) => value == null ? '—' : `${(value / 1000).toFixed(2)} s`,
}));

import TracingPage from './page';

const project = {
  id: 'project-1', name: 'Agent project', description: null,
  created_at: '2026-07-17T00:00:00Z', trace_count: 0,
  error_rate: 0, avg_latency_ms: 0, recent_run: null,
};

describe('TracingPage', () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    listProjects.mockResolvedValue([project]);
    createProject.mockResolvedValue({ id: 'project-2' });
    deleteProject.mockResolvedValue(undefined);
  });

  it('creates a trimmed project and refreshes the list', async () => {
    render(<TracingPage />);
    await screen.findByText('Agent project');
    fireEvent.click(screen.getByRole('button', { name: /New Project/ }));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: '  New agent  ' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: '  Description  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Project' }));

    await waitFor(() => expect(createProject).toHaveBeenCalledWith('New agent', 'Description'));
    await waitFor(() => expect(listProjects).toHaveBeenCalledTimes(2));
  });

  it('confirms deletion and refreshes the list', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<TracingPage />);
    await screen.findByText('Agent project');
    fireEvent.click(screen.getByRole('button', { name: 'Delete Agent project' }));

    await waitFor(() => expect(deleteProject).toHaveBeenCalledWith('project-1'));
    await waitFor(() => expect(listProjects).toHaveBeenCalledTimes(2));
  });
});
