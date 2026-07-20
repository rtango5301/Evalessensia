import React from 'react';
import { latencySeconds } from '@/lib/observability/client';
import type { RunNode } from '@/lib/observability/types';

function JsonBlock({ value, empty }: { value: unknown; empty: string }) {
  if (value == null || (typeof value === 'object' && Object.keys(value).length === 0)) {
    return <p className="text-sm text-slate-400">{empty}</p>;
  }
  return (
    <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-5 text-slate-100">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

export function RunDetail({ run }: { run: RunNode }) {
  const attributes = Object.entries(run.attributes ?? {});
  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold text-slate-900">{run.name || 'Unnamed run'}</h2>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
            {run.run_type || 'custom'}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
          <span>Status: {run.status || 'unknown'}</span>
          <span>Latency: {latencySeconds(run.latency_ms)}</span>
          <span>Tokens: {(run.input_tokens ?? 0) + (run.output_tokens ?? 0)}</span>
          <span>Cost: ${(run.cost ?? 0).toFixed(4)}</span>
        </div>
      </div>

      <section>
        <h3 className="mb-2 text-sm font-bold text-slate-900">Input</h3>
        <JsonBlock value={run.input} empty="No input recorded." />
      </section>

      <section>
        <h3 className="mb-2 text-sm font-bold text-slate-900">Output</h3>
        <JsonBlock value={run.output} empty="No output recorded." />
      </section>

      <section>
        <h3 className="mb-2 text-sm font-bold text-slate-900">Attributes</h3>
        {attributes.length ? (
          <dl className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 bg-white">
            {attributes.map(([key, value]) => (
              <div
                key={key}
                className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
              >
                <dt className="text-xs font-semibold text-slate-500">{key}</dt>
                <dd className="break-words text-sm text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-sm text-slate-400">No runtime attributes recorded.</p>
        )}
      </section>

      {run.error && (
        <section>
          <h3 className="mb-2 text-sm font-bold text-red-700">Error</h3>
          <pre className="overflow-x-auto rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-800">
            {run.error}
          </pre>
        </section>
      )}
    </div>
  );
}
