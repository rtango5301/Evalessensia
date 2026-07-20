export function formatMilliseconds(value: number | null): string {
  return value == null ? '—' : `${(value / 1000).toFixed(2)} s`;
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatCurrency(value: number): string {
  return `$${value.toFixed(4)}`;
}

export function periodDelta(current: number, previous: number | null): string | null {
  if (previous == null) return null;
  if (previous === 0) return current === 0 ? '0.0%' : 'new';
  const change = ((current - previous) / Math.abs(previous)) * 100;
  return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
}
