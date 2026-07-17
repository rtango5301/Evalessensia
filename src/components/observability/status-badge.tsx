import React from 'react';
import { cn } from '@/lib/utils';

export function StatusBadge({ status }: { status: string | null }) {
  const value = status || 'unknown';
  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize',
        value === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-700',
        value === 'error' && 'border-red-200 bg-red-50 text-red-700',
        value === 'running' && 'border-blue-200 bg-blue-50 text-blue-700',
        !['success', 'error', 'running'].includes(value) &&
          'border-slate-200 bg-slate-50 text-slate-600'
      )}
    >
      {value}
    </span>
  );
}
