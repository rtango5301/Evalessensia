'use client';

import React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getMetrics, listProjects } from '@/lib/observability/client';
import type { Metrics, Project } from '@/lib/observability/types';

const emptyMetrics: Metrics = { timestamps: [], trace_count: [], latency: [], cost: [], errors: [], tokens: [] };

export default function MonitoringPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [metrics, setMetrics] = useState<Metrics>(emptyMetrics);
  const [interval, setInterval] = useState<'hour' | 'day' | 'week'>('day');
  const [projectId, setProjectId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectData, metricData] = await Promise.all([
        listProjects(),
        getMetrics({ interval, projectId: projectId || undefined }),
      ]);
      setProjects(projectData);
      setMetrics(metricData);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to load monitoring data');
    } finally {
      setLoading(false);
    }
  }, [interval, projectId]);

  useEffect(() => { void refresh(); }, [refresh]);

  const rows = useMemo(() => metrics.timestamps.map((timestamp, index) => ({
    timestamp: new Date(timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: interval === 'hour' ? 'numeric' : undefined }),
    traces: metrics.trace_count[index] ?? 0,
    errors: metrics.errors[index] ?? 0,
    latencySeconds: (metrics.latency[index] ?? 0) / 1000,
    tokens: metrics.tokens[index] ?? 0,
    cost: metrics.cost[index] ?? 0,
  })), [interval, metrics]);

  const totals = useMemo(() => ({
    traces: metrics.trace_count.reduce((sum, value) => sum + value, 0),
    errors: metrics.errors.reduce((sum, value) => sum + value, 0),
    tokens: metrics.tokens.reduce((sum, value) => sum + value, 0),
    cost: metrics.cost.reduce((sum, value) => sum + value, 0),
    latency: metrics.latency.length ? metrics.latency.reduce((sum, value) => sum + value, 0) / metrics.latency.length / 1000 : 0,
  }), [metrics]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div><h1 className="text-3xl font-bold tracking-tight text-slate-900">Monitoring</h1><p className="mt-1 text-sm text-slate-500">Track trace volume, errors, latency, tokens, and cost over time.</p></div>
        <div className="flex flex-wrap gap-3">
          <select aria-label="Project" value={projectId} onChange={(event) => setProjectId(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#135bec]"><option value="">All projects</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select>
          <div className="flex rounded-lg border border-slate-200 bg-white p-1">{(['hour', 'day', 'week'] as const).map((value) => <button key={value} onClick={() => setInterval(value)} className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize ${interval === value ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>{value}</button>)}</div>
        </div>
      </div>

      {error && <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"><span className="material-symbols-outlined">error</span><span className="flex-1">{error}</span><button onClick={() => void refresh()} className="font-bold">Retry</button></div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[['Traces', totals.traces.toLocaleString(), 'route'], ['Errors', totals.errors.toLocaleString(), 'error'], ['Avg latency', `${totals.latency.toFixed(2)} s`, 'timer'], ['Tokens', totals.tokens.toLocaleString(), 'token'], ['Cost', `$${totals.cost.toFixed(4)}`, 'payments']].map(([label, value, icon]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><span className="material-symbols-outlined text-xl text-slate-300">{icon}</span></div><p className="mt-3 text-2xl font-bold text-slate-900">{loading ? '—' : value}</p></div>)}
      </div>

      {loading ? <div className="h-96 animate-pulse rounded-xl border border-slate-200 bg-white p-6"><div className="h-full rounded-lg bg-slate-100" /></div> : rows.length === 0 ? <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm"><span className="material-symbols-outlined text-4xl text-slate-300">monitoring</span><p className="mt-2 text-sm font-medium text-slate-600">No monitoring data for this selection</p><p className="mt-1 text-xs text-slate-400">Metrics appear after traces are ingested.</p></div> : <>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-5"><h2 className="font-bold text-slate-900">Trace health</h2><p className="mt-1 text-xs text-slate-500">Volume, errors, and average latency in seconds</p></div><div className="h-80"><ResponsiveContainer width="100%" height="100%"><LineChart data={rows}><CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" /><XAxis dataKey="timestamp" tick={{ fontSize: 11, fill: '#64748b' }} /><YAxis tick={{ fontSize: 11, fill: '#64748b' }} /><Tooltip contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0' }} /><Legend /><Line type="monotone" dataKey="traces" stroke="#135bec" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="latencySeconds" name="Latency (s)" stroke="#10b981" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div></div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-5"><h2 className="font-bold text-slate-900">Usage</h2><p className="mt-1 text-xs text-slate-500">Token consumption and cost</p></div><div className="h-80"><ResponsiveContainer width="100%" height="100%"><LineChart data={rows}><CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" /><XAxis dataKey="timestamp" tick={{ fontSize: 11, fill: '#64748b' }} /><YAxis tick={{ fontSize: 11, fill: '#64748b' }} /><Tooltip contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0' }} /><Legend /><Line type="monotone" dataKey="tokens" stroke="#f59e0b" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="cost" stroke="#8b5cf6" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div></div>
      </>}
    </div>
  );
}
