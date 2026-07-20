import type { RunNode } from '@/lib/observability/types';

export interface FlattenedRun {
  node: RunNode;
  depth: number;
}

export interface TimelinePosition {
  id: string;
  node: RunNode;
  depth: number;
  leftPercent: number;
  widthPercent: number;
  startMs: number;
  endMs: number;
}

export function flattenRunTree(node: RunNode, depth = 0): FlattenedRun[] {
  return [{ node, depth }, ...node.children.flatMap((child) => flattenRunTree(child, depth + 1))];
}

function runTimes(item: FlattenedRun): [number, number] | null {
  const start = item.node.start_time ? Date.parse(item.node.start_time) : null;
  const end = item.node.end_time ? Date.parse(item.node.end_time) : null;
  if (start == null || Number.isNaN(start)) return null;
  const calculatedEnd =
    end != null && !Number.isNaN(end) ? end : start + (item.node.latency_ms ?? 0);
  return [start, Math.max(start, calculatedEnd)];
}

export function calculateTimeline(items: FlattenedRun[]): TimelinePosition[] {
  const knownTimes = items.flatMap((item) => {
    const times = runTimes(item);
    return times ? [times[0], times[1]] : [];
  });
  const domainStart = knownTimes.length ? Math.min(...knownTimes) : 0;
  const domainEnd = knownTimes.length ? Math.max(...knownTimes) : 1;
  const domain = Math.max(domainEnd - domainStart, 1);
  return items.map((item) => {
    const times = runTimes(item) ?? [domainStart, domainStart];
    const startMs = times[0];
    const endMs = Math.max(times[1], startMs + Math.max(item.node.latency_ms ?? 0, 1));
    return {
      id: item.node.id,
      node: item.node,
      depth: item.depth,
      startMs,
      endMs,
      leftPercent: Math.max(0, ((startMs - domainStart) / domain) * 100),
      widthPercent: Math.max(1, ((endMs - startMs) / domain) * 100),
    };
  });
}
