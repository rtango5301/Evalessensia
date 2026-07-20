import type { ReactNode } from 'react';
import React from 'react';

export function ChartCard({
  title,
  subtitle,
  children,
  empty = false,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  empty?: boolean;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      </div>
      {empty ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-200 text-sm text-slate-400">
          No data for this selection
        </div>
      ) : (
        children
      )}
    </section>
  );
}
