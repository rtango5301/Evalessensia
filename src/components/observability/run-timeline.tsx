import React from 'react';
import type { RunNode } from '@/lib/observability/types';
import { latencySeconds } from '@/lib/observability/client';
import { StatusBadge } from './status-badge';
import { calculateTimeline, flattenRunTree } from './run-timeline-layout';

export function RunTimeline({
  root,
  selectedId,
  onSelect,
}: {
  root: RunNode;
  selectedId: string;
  onSelect: (node: RunNode) => void;
}) {
  const positions = calculateTimeline(flattenRunTree(root));
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-slate-900">Run timeline</h2>
          <p className="mt-1 text-xs text-slate-500">
            Nested run duration across the trace. Select a bar to inspect its details.
          </p>
        </div>
        <div className="text-xs text-slate-400">
          Each row remains available as text below the graphic.
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[720px] space-y-2" role="list" aria-label="Run timeline">
          {positions.map((position) => (
            <div
              key={position.id}
              role="listitem"
              className="grid grid-cols-[180px_minmax(0,1fr)] items-center gap-4"
            >
              <button
                onClick={() => onSelect(position.node)}
                aria-label={`Select ${position.node.name || 'Unnamed run'}`}
                className={`truncate rounded-md px-2 py-1 text-left text-xs font-medium ${selectedId === position.id ? 'bg-blue-50 text-[#135bec]' : 'text-slate-600 hover:bg-slate-50'}`}
                style={{ marginLeft: `${position.depth * 14}px` }}
              >
                {position.node.name || 'Unnamed run'}
              </button>
              <div className="relative h-9 rounded-md bg-slate-50" aria-hidden="true">
                <button
                  onClick={() => onSelect(position.node)}
                  aria-label={`${position.node.name || 'Unnamed run'} duration ${latencySeconds(position.node.latency_ms)}`}
                  className={`absolute top-1 h-7 min-w-[8px] rounded-md border px-2 text-left text-[11px] font-semibold text-white shadow-sm ${position.node.status === 'error' ? 'border-red-600 bg-red-500' : position.node.status === 'running' ? 'border-amber-600 bg-amber-500' : 'border-[#135bec] bg-[#135bec]'}`}
                  style={{ left: `${position.leftPercent}%`, width: `${position.widthPercent}%` }}
                >
                  <span className="sr-only">{position.node.name || 'Unnamed run'}</span>
                </button>
              </div>
              <div className="col-span-2 flex items-center gap-2 pl-2 text-xs text-slate-400">
                <StatusBadge status={position.node.status} />
                <span>{position.node.run_type || 'custom'}</span>
                <span>{latencySeconds(position.node.latency_ms)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
