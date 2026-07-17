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
