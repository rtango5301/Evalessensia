export type EvaluationStatus = 'completed' | 'running' | 'failed';
export type TestCaseStatus = 'passed' | 'failed';

export interface EvaluationMetrics {
  overallScore: number;
  scoreDelta: number;
  testsPassed: number;
  testsTotal: number;
  avgLatency: number;
  latencyDelta: number;
}

export interface PerformanceData {
  labels: string[];
  baseline: number[];
  current: number[];
  summary: {
    label: string;
    value: number;
  }[];
}

export interface EvaluationRun {
  id: string;
  projectName: string;
  status: EvaluationStatus;
  startedAt: Date;
  duration: number;
  metrics: EvaluationMetrics;
  performance: PerformanceData;
}

export interface TestCase {
  id: string;
  status: TestCaseStatus;
  inputPrompt: string;
  metric: string;
  score: number;
  latency: number;
}
