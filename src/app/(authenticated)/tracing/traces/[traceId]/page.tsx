'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getTrace, getTraceTree, latencySeconds } from '@/lib/observability/client';
import type { RunNode, TraceDetail } from '@/lib/observability/types';
import { RunDetail } from '@/components/observability/run-detail';
import { StatusBadge } from '@/components/observability/status-badge';

function TreeItem({ node, selectedId, onSelect, depth = 0 }: { node: RunNode; selectedId: string; onSelect: (node: RunNode) => void; depth?: number }) {
  return (
    <div>
      <button onClick={() => onSelect(node)} style={{ paddingLeft: `${12 + depth * 18}px` }} className={`flex w-full items-center gap-2 border-l-2 py-2.5 pr-3 text-left text-sm transition-colors ${selectedId === node.id ? 'border-[#135bec] bg-blue-50 text-[#135bec]' : 'border-transparent text-slate-600 hover:bg-slate-50'}`}>
        <span className="material-symbols-outlined text-lg">{node.children.length ? 'account_tree' : 'subdirectory_arrow_right'}</span>
        <span className="min-w-0 flex-1 truncate font-medium">{node.name || 'Unnamed run'}</span>
        <span className="text-xs text-slate-400">{latencySeconds(node.latency_ms)}</span>
      </button>
      {node.children.map((child) => <TreeItem key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} depth={depth + 1} />)}
    </div>
  );
}

export default function TraceDetailPage() {
  const { traceId } = useParams<{ traceId: string }>();
  const [trace, setTrace] = useState<TraceDetail | null>(null);
  const [tree, setTree] = useState<RunNode | null>(null);
  const [selected, setSelected] = useState<RunNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([getTrace(traceId), getTraceTree(traceId)])
      .then(([traceData, treeData]) => { if (active) { setTrace(traceData); setTree(treeData); setSelected(treeData); } })
      .catch((caught) => { if (active) setError(caught instanceof Error ? caught.message : 'Failed to load trace'); });
    return () => { active = false; };
  }, [traceId]);

  if (error) return <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>;
  if (!trace || !tree || !selected) return <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-400">Loading trace…</div>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href={`/tracing/projects/${trace.project_id}`} className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-[#135bec]"><span className="material-symbols-outlined text-lg">arrow_back</span>Project traces</Link>
        <div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-bold tracking-tight text-slate-900">Trace detail</h1><StatusBadge status={trace.status} /></div>
        <p className="mt-1 font-mono text-xs text-slate-400">{trace.trace_id}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[['Latency', latencySeconds(trace.latency_ms)], ['Tokens', String(trace.total_tokens ?? 0)], ['Cost', `$${(trace.total_cost ?? 0).toFixed(4)}`], ['Started', trace.start_time ? new Date(trace.start_time).toLocaleString() : '—']].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-2 text-lg font-bold text-slate-900">{value}</p></div>)}
      </div>
      <div className="grid min-h-[560px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 lg:border-b-0 lg:border-r"><div className="border-b border-slate-200 px-4 py-3"><h2 className="text-sm font-bold text-slate-900">Execution tree</h2></div><div className="max-h-[650px] overflow-auto py-2"><TreeItem node={tree} selectedId={selected.id} onSelect={setSelected} /></div></aside>
        <main className="min-w-0 overflow-auto p-6"><RunDetail run={selected} /></main>
      </div>
    </div>
  );
}
