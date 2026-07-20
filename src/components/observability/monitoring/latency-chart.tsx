import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MetricPoint } from '@/lib/observability/types';
import { ChartCard } from './chart-card';

export function LatencyChart({ points }: { points: MetricPoint[] }) {
  const data = points.map((point) => ({
    ...point,
    timestamp: new Date(point.timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    }),
    avg: point.avg_latency_ms == null ? null : point.avg_latency_ms / 1000,
    p50: point.p50_latency_ms == null ? null : point.p50_latency_ms / 1000,
    p99: point.p99_latency_ms == null ? null : point.p99_latency_ms / 1000,
  }));
  return (
    <ChartCard
      title="Latency percentiles"
      subtitle="Average, p50, and p99 latency in seconds"
      empty={!points.length}
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip
              formatter={(value) => (value == null ? '—' : `${Number(value).toFixed(2)} s`)}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="avg"
              name="Average"
              stroke="#135bec"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="p50"
              name="p50"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="p99"
              name="p99"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-xs text-slate-400">
        Missing percentile observations are shown as gaps.
      </p>
    </ChartCard>
  );
}
