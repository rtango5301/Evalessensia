import { describe, expect, it } from 'vitest';
import { calculateTimeline, flattenRunTree } from './run-timeline-layout';
import type { RunNode } from '@/lib/observability/types';

const root: RunNode = {
  id: 'root',
  name: 'root',
  run_type: 'agent',
  status: 'success',
  latency_ms: 1000,
  input_tokens: 0,
  output_tokens: 0,
  cost: 0,
  start_time: '2026-07-18T00:00:00.000Z',
  end_time: '2026-07-18T00:00:01.000Z',
  input: null,
  output: null,
  error: null,
  metadata: null,
  attributes: null,
  tags: null,
  children: [
    {
      id: 'child',
      name: 'child',
      run_type: 'tool',
      status: 'success',
      latency_ms: 300,
      input_tokens: 0,
      output_tokens: 0,
      cost: 0,
      start_time: '2026-07-18T00:00:00.200Z',
      end_time: '2026-07-18T00:00:00.500Z',
      input: null,
      output: null,
      error: null,
      metadata: null,
      attributes: null,
      tags: null,
      children: [],
    },
  ],
};

describe('run timeline layout', () => {
  it('flattens nested runs and calculates relative positions', () => {
    const items = calculateTimeline(flattenRunTree(root));
    expect(items.map((item) => [item.id, item.depth])).toEqual([
      ['root', 0],
      ['child', 1],
    ]);
    expect(items[0].leftPercent).toBe(0);
    expect(items[0].widthPercent).toBe(100);
    expect(items[1].leftPercent).toBe(20);
    expect(items[1].widthPercent).toBe(30);
  });

  it('gives missing and zero-duration runs a visible safe width', () => {
    const item = {
      ...root,
      id: 'missing',
      start_time: null,
      end_time: null,
      latency_ms: 0,
      children: [],
    };
    const [position] = calculateTimeline(flattenRunTree(item));
    expect(position.leftPercent).toBeGreaterThanOrEqual(0);
    expect(position.widthPercent).toBeGreaterThan(0);
  });
});
