import React from 'react';
import { formatCurrency, formatMilliseconds, formatPercent } from './formatters';

type MetricKind = 'count' | 'percent' | 'milliseconds' | 'currency';

export function MetricCard({
  label,
  value,
  kind = 'count',
  delta,
  icon,
}: {
  label: string;
  value: number | null;
  kind?: MetricKind;
  delta?: string | null;
  icon: string;
}) {
  const formatted =
    kind === 'percent'
      ? value == null
        ? '—'
        : formatPercent(value)
      : kind === 'milliseconds'
        ? formatMilliseconds(value)
        : kind === 'currency'
          ? formatCurrency(value ?? 0)
          : (value ?? 0).toLocaleString();
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <span className="material-symbols-outlined text-xl text-slate-300">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{formatted}</p>
      {delta && (
        <p className="mt-1 text-xs font-medium text-slate-500">{delta} vs previous period</p>
      )}
    </div>
  );
}
