// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { RunDetail } from './run-detail';
import type { RunNode } from '@/lib/observability/types';

const run: RunNode = {
  id: 'run-1',
  name: 'Agent',
  run_type: 'agent',
  status: 'success',
  latency_ms: 1250,
  input_tokens: 1,
  output_tokens: 2,
  cost: 0.03,
  start_time: '2026-07-16T10:00:00Z',
  end_time: '2026-07-16T10:00:01.250Z',
  input: { prompt: 'hello' },
  output: { answer: 'world' },
  error: null,
  metadata: {},
  attributes: { runtime: 'rust', sdk_version: '0.1.0' },
  tags: ['production'],
  children: [],
};

describe('RunDetail', () => {
  it('renders Attributes immediately after Output and keeps zero-safe runtime data', () => {
    render(<RunDetail run={run} />);
    const headings = screen.getAllByRole('heading').map((heading) => heading.textContent);
    expect(headings).toEqual(expect.arrayContaining(['Input', 'Output', 'Attributes']));
    expect(headings.indexOf('Attributes')).toBe(headings.indexOf('Output') + 1);
    expect(screen.getByText('runtime')).toBeInTheDocument();
    expect(screen.getByText('rust')).toBeInTheDocument();
    expect(screen.getByText(/Latency: 1\.25 s/)).toBeInTheDocument();
  });
});
