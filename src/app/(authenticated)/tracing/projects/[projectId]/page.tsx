'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { latencySeconds, listProjects, listTraces } from '@/lib/observability/client';
import type { Project, TracePage } from '@/lib/observability/types';
import { StatusBadge } from '@/components/observability/status-badge';

const emptyPage: TracePage = { items: [], page: 1, limit: 25, total: 0, pages: 0 };

export default function ProjectTracesPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [traces, setTraces] = useState<TracePage>(emptyPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [runType, setRunType] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [projects, tracePage] = await Promise.all([
        listProjects(),
        listTraces(projectId, { page, limit: 25, search, status, runType }),
      ]);
      setProject(projects.find((item) => item.id === projectId) ?? null);
      setTraces(tracePage);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to load traces');
    } finally {
      setLoading(false);
    }
  }, [page, projectId, runType, search, status]);

  useEffect(() => {
    const timeout = setTimeout(() => void refresh(), 200);
    return () => clearTimeout(timeout);
  }, [refresh]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/tracing" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-[#135bec]"><span className="material-symbols-outlined text-lg">arrow_back</span>Projects</Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{project?.name || 'Project traces'}</h1>
        <p className="mt-1 text-sm text-slate-500">Search and inspect every trace recorded for this project.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1 md:max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-xl text-slate-400">search</span>
          <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search trace ID or run name…" className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#135bec]" />
        </div>
        <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#135bec]"><option value="">All statuses</option><option value="running">Running</option><option value="success">Success</option><option value="error">Error</option></select>
        <select value={runType} onChange={(event) => { setRunType(event.target.value); setPage(1); }} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#135bec]"><option value="">All run types</option><option value="agent">Agent</option><option value="chain">Chain</option><option value="llm">LLM</option><option value="tool">Tool</option><option value="retriever">Retriever</option><option value="parser">Parser</option><option value="custom">Custom</option></select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500"><tr><th className="px-6 py-3">Run</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Started</th><th className="px-6 py-3">Latency</th><th className="px-6 py-3">Tokens</th><th className="px-6 py-3">Cost</th></tr></thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? <tr><td colSpan={6} className="px-6 py-14 text-center text-sm text-slate-400">Loading traces…</td></tr> : traces.items.length === 0 ? <tr><td colSpan={6} className="px-6 py-14 text-center"><span className="material-symbols-outlined text-4xl text-slate-300">search_off</span><p className="mt-2 text-sm text-slate-500">No traces found</p></td></tr> : traces.items.map((trace) => (
                <tr key={trace.trace_id} className="cursor-pointer hover:bg-slate-50" onClick={() => window.location.assign(`/tracing/traces/${trace.trace_id}`)}>
                  <td className="px-6 py-4"><Link href={`/tracing/traces/${trace.trace_id}`} className="text-sm font-semibold text-slate-900 hover:text-[#135bec]">{trace.run_name || trace.trace_id}</Link><p className="mt-0.5 font-mono text-xs text-slate-400">{trace.trace_id}</p><p className="mt-0.5 text-xs capitalize text-slate-500">{trace.run_type || 'custom'}</p></td>
                  <td className="px-6 py-4"><StatusBadge status={trace.status} /></td>
                  <td className="px-6 py-4 text-sm text-slate-500">{trace.start_time ? new Date(trace.start_time).toLocaleString() : '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{latencySeconds(trace.latency_ms)}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{trace.total_tokens ?? 0}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">${(trace.total_cost ?? 0).toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 text-sm text-slate-500"><span>{traces.total} trace{traces.total === 1 ? '' : 's'}</span><div className="flex items-center gap-2"><button disabled={page <= 1 || loading} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium disabled:opacity-40">Previous</button><span>Page {page} of {Math.max(traces.pages, 1)}</span><button disabled={page >= traces.pages || loading} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium disabled:opacity-40">Next</button></div></div>
      </div>
    </div>
  );
}
