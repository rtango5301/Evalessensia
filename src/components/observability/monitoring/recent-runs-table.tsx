import React from 'react';
import Link from 'next/link';
import type { RecentRun } from '@/lib/observability/types';
import { latencySeconds } from '@/lib/observability/client';
import { StatusBadge } from '../status-badge';
import { formatCurrency } from './formatters';

export function RecentRunsTable({ runs }: { runs: RecentRun[] }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="font-bold text-slate-900">Recent runs</h2>
        <p className="mt-1 text-xs text-slate-500">
          Jump from aggregate metrics to an individual trace.
        </p>
      </div>
      {runs.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-slate-400">No runs in this period</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-3">Run</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Started</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Tokens</th>
                <th className="px-6 py-3">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {runs.map((run) => (
                <tr key={run.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/tracing/traces/${run.trace_id}`}
                      className="font-medium text-[#135bec] hover:underline"
                    >
                      {run.name || 'Unnamed run'}
                    </Link>
                    <p className="mt-1 font-mono text-xs text-slate-400">
                      {run.run_type || 'custom'}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">{run.project_name}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={run.status} />
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {run.start_time ? new Date(run.start_time).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {latencySeconds(run.latency_ms)}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {run.total_tokens.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(run.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
