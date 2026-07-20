export interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  trace_count: number;
  error_rate: number;
  avg_latency_ms: number;
  recent_run: string | null;
}

export interface TraceSummary {
  trace_id: string;
  status: string | null;
  latency_ms: number | null;
  total_tokens: number | null;
  total_cost: number | null;
  start_time: string | null;
  created_at: string;
  run_name: string | null;
  run_type: string | null;
}

export interface TraceDetail extends TraceSummary {
  project_id: string;
  root_run_id: string;
  end_time: string | null;
  input_tokens: number | null;
  output_tokens: number | null;
}

export interface RunNode {
  id: string;
  name: string | null;
  run_type: string | null;
  status: string | null;
  latency_ms: number | null;
  input_tokens: number | null;
  output_tokens: number | null;
  cost: number | null;
  start_time: string | null;
  end_time: string | null;
  input: Record<string, unknown> | null;
  output: Record<string, unknown> | null;
  error: string | null;
  metadata: Record<string, unknown> | null;
  attributes: Record<string, string> | null;
  tags: string[] | null;
  children: RunNode[];
}

export interface TracePage {
  items: TraceSummary[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface Metrics {
  timestamps: string[];
  trace_count: number[];
  latency: number[];
  cost: number[];
  errors: number[];
  tokens: number[];
}

export interface MetricPoint {
  timestamp: string;
  trace_count: number;
  errors: number;
  avg_latency_ms: number | null;
  p50_latency_ms: number | null;
  p95_latency_ms: number | null;
  p99_latency_ms: number | null;
  tokens: number;
  cost: number;
}

export interface MetricsSummary {
  trace_count: number;
  error_count: number;
  error_rate: number;
  avg_latency_ms: number | null;
  p50_latency_ms: number | null;
  p95_latency_ms: number | null;
  p99_latency_ms: number | null;
  tokens: number;
  cost: number;
}

export interface RunDistributionItem {
  run_type: string;
  running: number;
  success: number;
  error: number;
  total: number;
}

export interface RecentRun {
  id: string;
  trace_id: string;
  project_id: string;
  project_name: string;
  name: string | null;
  run_type: string | null;
  status: string | null;
  start_time: string | null;
  end_time: string | null;
  latency_ms: number | null;
  total_tokens: number;
  cost: number;
  error: string | null;
}

export interface MonitoringData {
  current: MetricsSummary;
  previous: MetricsSummary | null;
  points: MetricPoint[];
  run_distribution: RunDistributionItem[];
  recent_runs: RecentRun[];
  traces: {
    count: { timestamp: string; trace_count: number; run_count: number }[];
    latency: LatencyPoint[];
    error_rate: { timestamp: string; error_rate: number }[];
  };
  llm_calls: {
    count: { timestamp: string; count: number }[];
    latency: LatencyPoint[];
  };
  cost_tokens: {
    points: {
      timestamp: string;
      cost: number;
      input_tokens: number;
      output_tokens: number;
    }[];
  };
  tools: {
    tool_names: string[];
    points: {
      timestamp: string;
      tool_name: string;
      run_count: number;
      median_latency_ms: number | null;
      error_rate: number;
    }[];
  };
}

export interface LatencyPoint {
  timestamp: string;
  p50_latency_ms: number | null;
  p95_latency_ms: number | null;
  p99_latency_ms: number | null;
}
