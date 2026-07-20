'use client';

import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import { getMonitoringData, listProjects } from '@/lib/observability/client';
import type { MonitoringData, Project } from '@/lib/observability/types';
import {
  CostTokensChart,
  LlmCharts,
  ToolsCharts,
  TracesCharts,
} from '@/components/observability/monitoring/analytics-charts';

const emptyData: MonitoringData = {
  current: {
    trace_count: 0,
    error_count: 0,
    error_rate: 0,
    avg_latency_ms: null,
    p50_latency_ms: null,
    p95_latency_ms: null,
    p99_latency_ms: null,
    tokens: 0,
    cost: 0,
  },
  previous: null,
  points: [],
  run_distribution: [],
  recent_runs: [],
  traces: { count: [], latency: [], error_rate: [] },
  llm_calls: { count: [], latency: [] },
  cost_tokens: { points: [] },
  tools: { tool_names: [], points: [] },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details
      open
      className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-2 py-2 text-xl font-bold text-slate-900">
        {title}
        <span className="material-symbols-outlined text-slate-400 transition-transform group-open:rotate-180">
          expand_more
        </span>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

export default function MonitoringPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [data, setData] = useState<MonitoringData>(emptyData);
  const [interval, setInterval] = useState<'hour' | 'day' | 'week'>('day');
  const [projectId, setProjectId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectData, monitoringData] = await Promise.all([
        listProjects(),
        getMonitoringData({ interval, projectId: projectId || undefined, limit: 25 }),
      ]);
      setProjects(projectData);
      setData({
        ...emptyData,
        ...monitoringData,
        traces: monitoringData.traces ?? emptyData.traces,
        llm_calls: monitoringData.llm_calls ?? emptyData.llm_calls,
        cost_tokens: monitoringData.cost_tokens ?? emptyData.cost_tokens,
        tools: monitoringData.tools ?? emptyData.tools,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to load monitoring data');
    } finally {
      setLoading(false);
    }
  }, [interval, projectId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);
  const hasData =
    data.traces.count.length > 0 ||
    data.llm_calls.count.length > 0 ||
    data.cost_tokens.points.length > 0 ||
    data.tools.points.length > 0 ||
    data.current.trace_count > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Monitoring</h1>
          <p className="mt-1 text-sm text-slate-500">
            Explore traces, LLM calls, cost, tokens, and tools over time.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            aria-label="Project"
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#135bec]"
          >
            <option value="">All projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <div className="flex rounded-lg border border-slate-200 bg-white p-1">
            {(['hour', 'day', 'week'] as const).map((value) => (
              <button
                key={value}
                onClick={() => setInterval(value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize ${interval === value ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span className="material-symbols-outlined">error</span>
          <span className="flex-1">{error}</span>
          <button onClick={() => void refresh()} className="font-bold">
            Retry
          </button>
        </div>
      )}
      {loading ? (
        <div className="h-[28rem] animate-pulse rounded-xl border border-slate-200 bg-white p-6">
          <div className="h-full rounded-lg bg-slate-100" />
        </div>
      ) : !hasData ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <span className="material-symbols-outlined text-4xl text-slate-300">monitoring</span>
          <p className="mt-2 text-sm font-medium text-slate-600">
            No monitoring data for this selection
          </p>
          <p className="mt-1 text-xs text-slate-400">Metrics appear after traces are ingested.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Section title="Traces">
            <TracesCharts data={data.traces} />
          </Section>
          <Section title="LLM Calls">
            <LlmCharts data={data.llm_calls} />
          </Section>
          <Section title="Cost and Tokens">
            <CostTokensChart points={data.cost_tokens.points} />
          </Section>
          <Section title="Tools">
            <ToolsCharts data={data.tools} />
          </Section>
        </div>
      )}
    </div>
  );
}
