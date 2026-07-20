import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MetricPoint } from '@/lib/observability/types';
import { ChartCard } from './chart-card';

export function HealthChart({ points }: { points: MetricPoint[] }) {
  const data = points.map((point) => ({
    ...point,
    timestamp: new Date(point.timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    }),
  }));
  return (
    <ChartCard
      title="Trace health"
      subtitle="Trace volume and errors over time"
      empty={!points.length}
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="trace_count"
              name="Traces"
              stroke="#135bec"
              fill="#dbeafe"
            />
            <Area type="monotone" dataKey="errors" name="Errors" stroke="#ef4444" fill="#fee2e2" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
