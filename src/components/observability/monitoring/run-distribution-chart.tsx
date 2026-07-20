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
import type { RunDistributionItem } from '@/lib/observability/types';
import { ChartCard } from './chart-card';

export function RunDistributionChart({ items }: { items: RunDistributionItem[] }) {
  return (
    <ChartCard
      title="Run types and status"
      subtitle="How your execution tree is composed"
      empty={!items.length}
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={items} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="run_type" width={90} />
            <Tooltip />
            <Legend />
            <Bar dataKey="success" name="Success" stackId="status" fill="#10b981" />
            <Bar dataKey="error" name="Error" stackId="status" fill="#ef4444" />
            <Bar dataKey="running" name="Running" stackId="status" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
