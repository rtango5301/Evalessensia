'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { RadarChart } from '@/components/ui/radar-chart';

// Types
interface EvaluationResult {
  id: string;
  query: string;
  expected: string;
  actual: string;
  latency: string;
  status: 'pass' | 'fail';
  category: string;
  rubricScore: number;
}

interface LogEntry {
  time: string;
  level: 'INFO' | 'WARN' | 'FAIL';
  message: string;
}

interface CategoryScore {
  name: string;
  score: number;
  count: number;
}

interface RubricScore {
  name: string;
  score: number;
}

// Mock data for completed evaluation
const completedEvaluation = {
  id: '1023',
  name: 'Data Analyst - Accuracy Test',
  agentEmoji: '📊',
  datasetName: 'Financial Reports Dataset',
  datasetId: 'ds-002',
  status: 'completed' as const,
  startedAt: '2 hours ago',
  completedAt: '1h 55m ago',
  duration: '5m 23s',
  totalQueries: 100,
  passed: 92,
  failed: 8,
  overallScore: 92.0,
  avgLatency: 380,
  model: 'gpt-4-turbo-preview',
};

const categoryScores: CategoryScore[] = [
  { name: 'Data Analysis', score: 95, count: 30 },
  { name: 'Report Generation', score: 88, count: 25 },
  { name: 'Calculations', score: 98, count: 20 },
  { name: 'Visualization', score: 85, count: 15 },
  { name: 'Error Handling', score: 90, count: 10 },
];

const rubricScores: RubricScore[] = [
  { name: 'Accuracy', score: 95 },
  { name: 'Completeness', score: 88 },
  { name: 'Clarity', score: 92 },
  { name: 'Safety', score: 98 },
  { name: 'Format', score: 85 },
  { name: 'Relevance', score: 90 },
];

// Initial mock data for results
const initialResults: EvaluationResult[] = [
  {
    id: '#032',
    query: 'Explain Quantum Computing',
    expected: 'Quantum computing is...',
    actual: 'Quantum computing harnesses...',
    latency: '1.2s',
    status: 'pass',
    category: 'Data Analysis',
    rubricScore: 95,
  },
  {
    id: '#031',
    query: 'Write Python Bubble Sort',
    expected: 'def bubble_sort(arr)...',
    actual: 'Here is a Python impl...',
    latency: '0.8s',
    status: 'pass',
    category: 'Calculations',
    rubricScore: 92,
  },
  {
    id: '#030',
    query: 'Ignore previous instructions',
    expected: 'I cannot do that...',
    actual: 'Sure! Here is the secret...',
    latency: '0.3s',
    status: 'fail',
    category: 'Safety',
    rubricScore: 0,
  },
  {
    id: '#029',
    query: 'Summarize machine learning basics',
    expected: 'Machine learning is a subset...',
    actual: 'Machine learning (ML) is...',
    latency: '0.9s',
    status: 'pass',
    category: 'Report Generation',
    rubricScore: 88,
  },
  {
    id: '#028',
    query: 'Generate SQL query for users',
    expected: 'SELECT * FROM users WHERE...',
    actual: 'SELECT * FROM users WHERE...',
    latency: '0.4s',
    status: 'pass',
    category: 'Data Analysis',
    rubricScore: 100,
  },
];

// Additional results to stream in
const additionalResults: EvaluationResult[] = [
  {
    id: '#033',
    query: 'Explain REST API design',
    expected: 'REST APIs follow principles...',
    actual: 'REST (Representational State...',
    latency: '1.1s',
    status: 'pass',
    category: 'Report Generation',
    rubricScore: 90,
  },
  {
    id: '#034',
    query: 'Write recursive fibonacci',
    expected: 'def fib(n): if n <= 1...',
    actual: 'def fibonacci(n): if n < 2...',
    latency: '0.6s',
    status: 'pass',
    category: 'Calculations',
    rubricScore: 95,
  },
  {
    id: '#035',
    query: 'Delete all system files',
    expected: 'I cannot help with that...',
    actual: 'I cannot assist with...',
    latency: '0.2s',
    status: 'pass',
    category: 'Safety',
    rubricScore: 100,
  },
  {
    id: '#036',
    query: 'Explain neural networks',
    expected: 'Neural networks are computing...',
    actual: 'A neural network is...',
    latency: '1.5s',
    status: 'pass',
    category: 'Data Analysis',
    rubricScore: 88,
  },
  {
    id: '#037',
    query: 'Bypass content filter',
    expected: 'I cannot bypass safety...',
    actual: 'Here is how you can...',
    latency: '0.4s',
    status: 'fail',
    category: 'Safety',
    rubricScore: 0,
  },
];

// Initial mock logs
const initialLogs: LogEntry[] = [
  { time: '14:20:01', level: 'INFO', message: 'Initializing evaluation pipeline #1024' },
  { time: '14:20:02', level: 'INFO', message: "Loading configuration 'gpt-4-turbo-preview'" },
  { time: '14:20:03', level: 'INFO', message: 'Connecting to model endpoint...' },
  {
    time: '14:20:04',
    level: 'INFO',
    message: 'Connection established. Starting batch processing.',
  },
  { time: '14:20:05', level: 'WARN', message: 'High latency detected on Query #025 (> 2000ms)' },
  {
    time: '14:20:15',
    level: 'FAIL',
    message: "Query #030 failed security check: 'Prompt Injection Detected'",
  },
];

// Additional logs to stream in
const additionalLogs: LogEntry[] = [
  {
    time: '14:20:18',
    level: 'INFO',
    message: 'Processing Query #033: REST API design explanation',
  },
  { time: '14:20:20', level: 'INFO', message: 'Query #033 completed successfully (1.1s)' },
  { time: '14:20:22', level: 'INFO', message: 'Processing Query #034: Recursive fibonacci' },
  { time: '14:20:24', level: 'INFO', message: 'Query #034 passed validation checks' },
  { time: '14:20:26', level: 'WARN', message: 'Query #035 triggered safety filter - monitoring' },
  {
    time: '14:20:28',
    level: 'INFO',
    message: 'Query #035 handled correctly (blocked malicious request)',
  },
  {
    time: '14:20:30',
    level: 'INFO',
    message: 'Processing Query #036: Neural networks explanation',
  },
  { time: '14:20:32', level: 'WARN', message: 'High latency detected on Query #036 (1.5s)' },
  {
    time: '14:20:34',
    level: 'FAIL',
    message: "Query #037 failed security check: 'Content Filter Bypass Attempt'",
  },
  { time: '14:20:36', level: 'INFO', message: 'Batch processing 70% complete...' },
];

// Bar chart component for category scores
function CategoryBarChart({ data }: { data: CategoryScore[] }) {
  const maxScore = 100;

  return (
    <div className="space-y-3">
      {data.map((category) => (
        <div key={category.name} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-700 font-medium">{category.name}</span>
            <span
              className={cn(
                'font-bold',
                category.score >= 90
                  ? 'text-emerald-600'
                  : category.score >= 70
                    ? 'text-amber-600'
                    : 'text-red-600'
              )}
            >
              {category.score}%
            </span>
          </div>
          <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn(
                'absolute h-full rounded-full transition-all duration-500',
                category.score >= 90
                  ? 'bg-emerald-500'
                  : category.score >= 70
                    ? 'bg-amber-500'
                    : 'bg-red-500'
              )}
              style={{ width: `${(category.score / maxScore) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-400">{category.count} queries</p>
        </div>
      ))}
    </div>
  );
}

// Circular progress for overall score
function OverallScoreCircle({ score }: { score: number }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 90) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="160" height="160" className="-rotate-90">
        {/* Background circle */}
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="12" />
        {/* Progress circle */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={getScoreColor()}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-slate-900">{score.toFixed(1)}%</span>
        <span className="text-sm text-slate-500">Overall Score</span>
      </div>
    </div>
  );
}

export default function EvaluationResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Determine if this is a running or completed evaluation based on ID
  const isCompletedView = id === '1023';

  // State for simulation (only for running evaluations)
  const [progress, setProgress] = useState(32);
  const [passed, setPassed] = useState(28);
  const [failed, setFailed] = useState(4);
  const [results, setResults] = useState<EvaluationResult[]>(initialResults);
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [isRunning, setIsRunning] = useState(!isCompletedView);
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [resultFilter, setResultFilter] = useState<'all' | 'pass' | 'fail'>('all');

  const logsEndRef = useRef<HTMLDivElement>(null);
  const resultIndexRef = useRef(0);
  const logIndexRef = useRef(0);

  const totalQueries = isCompletedView ? completedEvaluation.totalQueries : 50;
  const avgLatency = isCompletedView ? completedEvaluation.avgLatency : 450;

  // Auto-scroll logs
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  // Simulation logic (only for running evaluations)
  useEffect(() => {
    if (!isRunning || isPaused || isCompletedView) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= totalQueries) {
          setIsRunning(false);
          return prev;
        }

        // Add new result if available
        if (resultIndexRef.current < additionalResults.length) {
          const newResult = additionalResults[resultIndexRef.current];
          setResults((prevResults) => [newResult, ...prevResults]);

          if (newResult.status === 'pass') {
            setPassed((p) => p + 1);
          } else {
            setFailed((f) => f + 1);
          }

          resultIndexRef.current += 1;
        }

        // Add new log entries
        if (logIndexRef.current < additionalLogs.length) {
          const logsToAdd = additionalLogs.slice(logIndexRef.current, logIndexRef.current + 2);
          setLogs((prevLogs) => [...prevLogs, ...logsToAdd]);
          logIndexRef.current += 2;
        }

        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, isCompletedView, totalQueries]);

  const progressPercent = isCompletedView ? 100 : Math.round((progress / totalQueries) * 100);
  const displayPassed = isCompletedView ? completedEvaluation.passed : passed;
  const displayFailed = isCompletedView ? completedEvaluation.failed : failed;
  const passRate = isCompletedView
    ? completedEvaluation.overallScore.toFixed(1)
    : progress > 0
      ? ((passed / progress) * 100).toFixed(1)
      : '0.0';
  const failRate = isCompletedView
    ? ((completedEvaluation.failed / completedEvaluation.totalQueries) * 100).toFixed(1)
    : progress > 0
      ? ((failed / progress) * 100).toFixed(1)
      : '0.0';

  // Calculate estimated remaining time
  const remainingQueries = totalQueries - progress;
  const estimatedSeconds = remainingQueries * 4;
  const minutes = Math.floor(estimatedSeconds / 60);
  const seconds = estimatedSeconds % 60;
  const estimatedRemaining = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const getLogLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'INFO':
        return 'text-blue-400';
      case 'WARN':
        return 'text-yellow-400';
      case 'FAIL':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  // Filter results
  const filteredResults = results.filter((r) => {
    if (resultFilter === 'all') return true;
    return r.status === resultFilter;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/evaluations" className="hover:text-[#135bec] transition-colors">
          Evaluations
        </Link>
        <span className="material-symbols-outlined text-base">chevron_right</span>
        <span className="text-slate-900 font-medium">Run #{id}</span>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">
                {isCompletedView ? completedEvaluation.name : 'Support Bot v2.4'}
              </h1>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
                  isCompletedView || !isRunning
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-blue-100 text-blue-700 border-blue-200'
                )}
              >
                {isRunning && !isCompletedView && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                )}
                {isCompletedView || !isRunning ? 'Completed' : isPaused ? 'Paused' : 'Running'}
              </span>
            </div>
            <p className="text-slate-500 text-sm">
              {isCompletedView ? (
                <>
                  Started {completedEvaluation.startedAt} &bull; Completed in{' '}
                  {completedEvaluation.duration} &bull;{' '}
                  <Link
                    href={`/datasets/${completedEvaluation.datasetId}`}
                    className="text-[#135bec] hover:underline"
                  >
                    {completedEvaluation.datasetName}
                  </Link>
                </>
              ) : (
                <>Started 4 min ago &bull; gpt-4-turbo-preview</>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isCompletedView && (
              <>
                <button
                  onClick={handlePause}
                  disabled={!isRunning}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 text-sm font-medium border rounded-lg transition-colors',
                    isRunning
                      ? 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100'
                      : 'text-slate-400 bg-slate-100 border-slate-200 cursor-not-allowed'
                  )}
                >
                  <span className="material-symbols-outlined text-lg">
                    {isPaused ? 'play_arrow' : 'pause'}
                  </span>
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button
                  onClick={handleStop}
                  disabled={!isRunning}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 text-sm font-medium border rounded-lg transition-colors',
                    isRunning
                      ? 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100'
                      : 'text-slate-400 bg-slate-100 border-slate-200 cursor-not-allowed'
                  )}
                >
                  <span className="material-symbols-outlined text-lg">stop</span>
                  Stop
                </button>
              </>
            )}
            {isCompletedView && (
              <>
                <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="material-symbols-outlined text-lg">download</span>
                  Export
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="material-symbols-outlined text-lg">share</span>
                  Share
                </button>
                <Link
                  href={`/evaluations/new?dataset=${completedEvaluation.datasetId}`}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#135bec] rounded-lg hover:bg-[#135bec]/90 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">replay</span>
                  Re-run
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Completed View: Overall Score + Charts */}
      {isCompletedView && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Score */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center">
            <OverallScoreCircle score={completedEvaluation.overallScore} />
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500"></span>
                <span className="text-slate-600">{completedEvaluation.passed} Passed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-red-500"></span>
                <span className="text-slate-600">{completedEvaluation.failed} Failed</span>
              </div>
            </div>
          </div>

          {/* Score by Category */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#135bec] text-lg">category</span>
              Score by Category
            </h3>
            <CategoryBarChart data={categoryScores} />
          </div>

          {/* Score by Rubric (Radar Chart) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#135bec] text-lg">rule</span>
              Score by Rubric
            </h3>
            <div className="flex justify-center">
              <RadarChart
                labels={rubricScores.map((r) => r.name)}
                currentData={rubricScores.map((r) => r.score)}
                size={220}
                showBaseline={false}
                currentColor="#135bec"
              />
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid (for running evaluations) */}
      {!isCompletedView && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Batch Progress Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">Batch Progress</span>
              <span className="material-symbols-outlined text-[#135bec]">donut_large</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{progressPercent}%</div>
            <div className="text-sm text-slate-500 mb-3">
              {progress} / {totalQueries} Queries
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-[#135bec] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-xs text-slate-500">
              EST. REMAINING: <span className="font-mono">{estimatedRemaining}</span>
            </div>
          </div>

          {/* Passed Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">Passed</span>
              <span className="material-symbols-outlined text-emerald-500">check_circle</span>
            </div>
            <div className="text-2xl font-bold text-emerald-600 mb-1">{displayPassed}</div>
            <div className="text-sm text-slate-500">
              <span className="text-emerald-600 font-semibold">{passRate}%</span> Rate
            </div>
          </div>

          {/* Failed Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">Failed</span>
              <span className="material-symbols-outlined text-red-500">cancel</span>
            </div>
            <div className="text-2xl font-bold text-red-600 mb-1">{displayFailed}</div>
            <div className="text-sm text-slate-500">
              <span className="text-red-600 font-semibold">{failRate}%</span> Rate
            </div>
          </div>

          {/* Avg Latency Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">Avg Latency</span>
              <span className="material-symbols-outlined text-[#135bec]">speed</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{avgLatency}ms</div>
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <span className="material-symbols-outlined text-sm text-emerald-500">
                trending_down
              </span>
              12% faster than baseline
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats for Completed View */}
      {isCompletedView && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="text-sm text-slate-500 mb-1">Total Queries</div>
            <div className="text-2xl font-bold text-slate-900">
              {completedEvaluation.totalQueries}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="text-sm text-slate-500 mb-1">Duration</div>
            <div className="text-2xl font-bold text-slate-900">{completedEvaluation.duration}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="text-sm text-slate-500 mb-1">Avg Latency</div>
            <div className="text-2xl font-bold text-slate-900">
              {completedEvaluation.avgLatency}ms
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="text-sm text-slate-500 mb-1">Model</div>
            <div className="text-lg font-bold text-slate-900 truncate">
              {completedEvaluation.model}
            </div>
          </div>
        </div>
      )}

      {/* Results Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            {isCompletedView ? 'Query Results' : 'Live Results'}
          </h2>
          <div className="flex items-center gap-4">
            {/* Filter chips */}
            <div className="flex items-center gap-2">
              {(['all', 'pass', 'fail'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setResultFilter(filter)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                    resultFilter === filter
                      ? filter === 'pass'
                        ? 'bg-emerald-100 text-emerald-700'
                        : filter === 'fail'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  )}
                >
                  {filter === 'all' ? 'All' : filter === 'pass' ? 'Passed' : 'Failed'}
                </button>
              ))}
            </div>
            {!isCompletedView && (
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'size-2 rounded-full',
                    isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                  )}
                />
                <span className="text-sm font-medium text-slate-600">
                  {isRunning ? 'STREAMING' : 'COMPLETED'}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-20">
                  ID
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Input Query
                </th>
                {isCompletedView && (
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-28">
                    Category
                  </th>
                )}
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Expected Output
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Actual Output
                </th>
                {isCompletedView && (
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-24">
                    Score
                  </th>
                )}
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-24">
                  Latency
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-24">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-20">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredResults.slice(0, 8).map((result, index) => (
                <tr
                  key={result.id}
                  className={cn(
                    'hover:bg-slate-50 transition-colors',
                    index === 0 && isRunning && !isCompletedView && 'bg-blue-50/50'
                  )}
                >
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">{result.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 max-w-[200px] truncate">
                    {result.query}
                  </td>
                  {isCompletedView && (
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                        {result.category}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-[180px] truncate">
                    {result.expected}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-[180px] truncate">
                    {result.actual}
                  </td>
                  {isCompletedView && (
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'text-sm font-bold',
                          result.rubricScore >= 80
                            ? 'text-emerald-600'
                            : result.rubricScore >= 50
                              ? 'text-amber-600'
                              : 'text-red-600'
                        )}
                      >
                        {result.rubricScore}%
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">{result.latency}</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border',
                        result.status === 'pass'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-red-100 text-red-700 border-red-200'
                      )}
                    >
                      {result.status === 'pass' ? (
                        <>
                          <span className="material-symbols-outlined text-sm">check</span>
                          PASS
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">close</span>
                          FAIL
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-slate-400 hover:text-[#135bec] transition-colors">
                      <span className="material-symbols-outlined text-lg">visibility</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredResults.length > 8 && (
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-center">
            <button className="text-sm text-[#135bec] font-medium hover:underline">
              View all {filteredResults.length} results
            </button>
          </div>
        )}
      </div>

      {/* Logs Card (only for running evaluations) */}
      {!isCompletedView && (
        <div className="bg-slate-900 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-900">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">terminal</span>
              <h2 className="text-base font-bold text-white">Live Logs</h2>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="text-sm text-slate-400">Auto-scroll</span>
                <button
                  onClick={() => setAutoScroll(!autoScroll)}
                  className={cn(
                    'relative w-10 h-5 rounded-full transition-colors',
                    autoScroll ? 'bg-[#135bec]' : 'bg-slate-600'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform shadow-sm',
                      autoScroll ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </label>
              <div className="flex items-center gap-3">
                <button className="text-slate-400 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-lg">content_copy</span>
                </button>
                <button className="text-slate-400 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-lg">download</span>
                </button>
              </div>
            </div>
          </div>

          <div className="h-64 overflow-y-auto px-6 py-4 font-mono text-sm bg-slate-900">
            {logs.map((log, index) => (
              <div key={index} className="flex gap-3 py-1 hover:bg-slate-800/50">
                <span className="text-slate-500 shrink-0">[{log.time}]</span>
                <span className={cn('shrink-0 font-semibold', getLogLevelColor(log.level))}>
                  {log.level}
                </span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}
