import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MetricPoint } from '@/lib/observability/types';
import { ChartCard } from './chart-card';

export function UsageChart({ points }: { points: MetricPoint[] }) {
  const data = points.map((point) => ({
    ...point,
    timestamp: new Date(point.timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    }),
  }));
  return (
    <ChartCard
      title="Usage"
      subtitle="Token consumption and cost by interval"
      empty={!points.length}
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis yAxisId="tokens" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis yAxisId="cost" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="tokens"
              dataKey="tokens"
              name="Tokens"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="cost"
              dataKey="cost"
              name="Cost ($)"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
