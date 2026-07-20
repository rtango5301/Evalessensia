import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { LatencyPoint, MonitoringData } from '@/lib/observability/types';
import { ChartCard } from './chart-card';

const chartDate = (timestamp: string) =>
  new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

const seconds = (value: number | null) => (value == null ? '—' : `${value.toFixed(2)} s`);
const percent = (value: number | null) => (value == null ? '—' : `${(value * 100).toFixed(1)}%`);

function LatencyLines({ points, title }: { points: LatencyPoint[]; title: string }) {
  const data = points.map((point) => ({
    ...point,
    timestamp: chartDate(point.timestamp),
    p50: point.p50_latency_ms == null ? null : point.p50_latency_ms / 1000,
    p99: point.p99_latency_ms == null ? null : point.p99_latency_ms / 1000,
  }));
  return (
    <ChartCard title={title} subtitle="Percentiles in seconds" empty={!points.length}>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => seconds(value == null ? null : Number(value))} />
            <Legend />
            <Line dataKey="p50" name="p50" stroke="#135bec" dot={false} connectNulls={false} />
            <Line dataKey="p99" name="p99" stroke="#f59e0b" dot={false} connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function TracesCharts({ data }: { data: MonitoringData['traces'] }) {
  const counts = data.count.map((point) => ({ ...point, timestamp: chartDate(point.timestamp) }));
  const errors = data.error_rate.map((point) => ({
    ...point,
    timestamp: chartDate(point.timestamp),
  }));
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ChartCard
        title="Trace and run count"
        subtitle="Trace records and total runs by interval"
        empty={!counts.length}
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={counts}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line dataKey="trace_count" name="Trace records" stroke="#135bec" dot={false} />
              <Line dataKey="run_count" name="Total runs" stroke="#10b981" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
      <LatencyLines points={data.latency} title="Trace latency" />
      <ChartCard
        title="Trace error rate"
        subtitle="Errored traces divided by trace records"
        empty={!errors.length}
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={errors}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis
                tickFormatter={(value) => `${Number(value) * 100}%`}
                label={{ value: 'Percent', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip formatter={(value) => percent(value == null ? null : Number(value))} />
              <Line dataKey="error_rate" name="Error rate" stroke="#ef4444" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}

export function LlmCharts({ data }: { data: MonitoringData['llm_calls'] }) {
  const counts = data.count.map((point) => ({ ...point, timestamp: chartDate(point.timestamp) }));
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ChartCard
        title="LLM call count"
        subtitle="Runs where run_type is llm"
        empty={!counts.length}
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={counts}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis label={{ value: 'Calls', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="count" name="LLM calls" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
      <LatencyLines points={data.latency} title="LLM latency" />
    </div>
  );
}

export function CostTokensChart({ points }: { points: MonitoringData['cost_tokens']['points'] }) {
  const data = points.map((point) => ({ ...point, timestamp: chartDate(point.timestamp) }));
  return (
    <ChartCard
      title="Cost and tokens"
      subtitle="Trace-level totals, avoiding child-run double counting"
      empty={!points.length}
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis
              yAxisId="tokens"
              label={{ value: 'Tokens', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="cost"
              orientation="right"
              label={{ value: 'Cost', angle: 90, position: 'insideRight' }}
            />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="tokens"
              dataKey="input_tokens"
              name="Input tokens"
              stackId="tokens"
              fill="#135bec"
            />
            <Bar
              yAxisId="tokens"
              dataKey="output_tokens"
              name="Output tokens"
              stackId="tokens"
              fill="#10b981"
            />
            <Bar yAxisId="cost" dataKey="cost" name="Cost" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function ToolsCharts({ data }: { data: MonitoringData['tools'] }) {
  const points = Array.from(new Set(data.points.map((point) => point.timestamp))).map(
    (timestamp) => {
      const row: Record<string, string | number | null> = { timestamp: chartDate(timestamp) };
      data.tool_names.forEach((name) => {
        const point = data.points.find(
          (candidate) => candidate.timestamp === timestamp && candidate.tool_name === name
        );
        row[`${name}_count`] = point?.run_count ?? null;
        row[`${name}_median`] =
          point?.median_latency_ms == null ? null : point.median_latency_ms / 1000;
        row[`${name}_error`] = point?.error_rate ?? null;
      });
      return row;
    }
  );
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ChartCard
        title="Tool run count"
        subtitle="Top 10 tools by selected-period count plus Other"
        empty={!points.length}
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis label={{ value: 'Runs', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              {data.tool_names.map((name, index) => (
                <Line
                  key={name}
                  dataKey={`${name}_count`}
                  name={name}
                  stroke={['#135bec', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][index % 5]}
                  dot={false}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
      <ChartCard
        title="Tool latency"
        subtitle="Median latency in seconds by tool"
        empty={!points.length}
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => seconds(value == null ? null : Number(value))} />
              <Legend />
              {data.tool_names.map((name, index) => (
                <Line
                  key={`${name}-latency`}
                  dataKey={`${name}_median`}
                  name={`${name} median`}
                  stroke={['#135bec', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][index % 5]}
                  dot={false}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
      <div className="xl:col-span-2">
        <ChartCard
          title="Tool error rate"
          subtitle="Errors divided by runs for each tool"
          empty={!points.length}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis
                  tickFormatter={(value) => `${Number(value) * 100}%`}
                  label={{ value: 'Percent', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip formatter={(value) => percent(value == null ? null : Number(value))} />
                <Legend />
                {data.tool_names.map((name, index) => (
                  <Line
                    key={`${name}-error`}
                    dataKey={`${name}_error`}
                    name={`${name} error rate`}
                    stroke={['#135bec', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][index % 5]}
                    dot={false}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
