'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { CircularProgress } from '@/components/ui/circular-progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data for reports
const mockReports = [
  {
    id: 'EVAL-1024',
    date: '2024-01-28',
    agent: 'Support Bot v2.4',
    agentEmoji: '🤖',
    passRate: 92.5,
    latency: 245,
    cost: 1.24,
  },
  {
    id: 'EVAL-1023',
    date: '2024-01-28',
    agent: 'Data Analyst',
    agentEmoji: '📊',
    passRate: 88.0,
    latency: 312,
    cost: 2.15,
  },
  {
    id: 'EVAL-1022',
    date: '2024-01-27',
    agent: 'Content Writer',
    agentEmoji: '📝',
    passRate: 45.0,
    latency: 189,
    cost: 0.87,
  },
  {
    id: 'EVAL-1021',
    date: '2024-01-27',
    agent: 'Code Reviewer',
    agentEmoji: '🔍',
    passRate: 98.5,
    latency: 567,
    cost: 3.42,
  },
  {
    id: 'EVAL-1020',
    date: '2024-01-26',
    agent: 'Translation Bot',
    agentEmoji: '🌐',
    passRate: 76.0,
    latency: 198,
    cost: 1.05,
  },
  {
    id: 'EVAL-1019',
    date: '2024-01-26',
    agent: 'Support Bot v2.3',
    agentEmoji: '🤖',
    passRate: 62.0,
    latency: 234,
    cost: 1.18,
  },
  {
    id: 'EVAL-1018',
    date: '2024-01-25',
    agent: 'Research Assistant',
    agentEmoji: '📚',
    passRate: 95.0,
    latency: 423,
    cost: 2.87,
  },
  {
    id: 'EVAL-1017',
    date: '2024-01-25',
    agent: 'Email Classifier',
    agentEmoji: '📧',
    passRate: 89.5,
    latency: 156,
    cost: 0.65,
  },
];

// Mock data for charts
const passRateTrendData = [
  { date: 'Jan 22', value: 82 },
  { date: 'Jan 23', value: 85 },
  { date: 'Jan 24', value: 79 },
  { date: 'Jan 25', value: 88 },
  { date: 'Jan 26', value: 84 },
  { date: 'Jan 27', value: 91 },
  { date: 'Jan 28', value: 87 },
];

const agentComparisonData = [
  { agent: 'Code Reviewer', passRate: 98.5, color: '#10b981' },
  { agent: 'Research Assistant', passRate: 95.0, color: '#10b981' },
  { agent: 'Support Bot', passRate: 92.5, color: '#10b981' },
  { agent: 'Email Classifier', passRate: 89.5, color: '#10b981' },
  { agent: 'Data Analyst', passRate: 88.0, color: '#10b981' },
  { agent: 'Translation Bot', passRate: 76.0, color: '#f59e0b' },
];

const latencyData = [
  { date: 'Jan 22', p50: 180, p90: 320, p99: 520 },
  { date: 'Jan 23', p50: 195, p90: 340, p99: 480 },
  { date: 'Jan 24', p50: 165, p90: 290, p99: 510 },
  { date: 'Jan 25', p50: 210, p90: 380, p99: 590 },
  { date: 'Jan 26', p50: 175, p90: 310, p99: 470 },
  { date: 'Jan 27', p50: 190, p90: 330, p99: 520 },
  { date: 'Jan 28', p50: 185, p90: 325, p99: 495 },
];

const costData = [
  { date: 'Jan 22', compute: 8.5, api: 4.2, storage: 1.2 },
  { date: 'Jan 23', compute: 9.2, api: 5.1, storage: 1.3 },
  { date: 'Jan 24', compute: 7.8, api: 3.9, storage: 1.1 },
  { date: 'Jan 25', compute: 10.5, api: 5.8, storage: 1.5 },
  { date: 'Jan 26', compute: 8.9, api: 4.5, storage: 1.2 },
  { date: 'Jan 27', compute: 9.8, api: 5.3, storage: 1.4 },
  { date: 'Jan 28', compute: 9.1, api: 4.8, storage: 1.3 },
];

const agents = [
  'Support Bot',
  'Data Analyst',
  'Content Writer',
  'Code Reviewer',
  'Translation Bot',
  'Research Assistant',
  'Email Classifier',
];

type TypeFilter = 'all' | 'accuracy' | 'security' | 'latency';

const typeFilters: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'accuracy', label: 'Accuracy' },
  { value: 'security', label: 'Security' },
  { value: 'latency', label: 'Latency' },
];

function getPassRateColor(rate: number): string {
  if (rate >= 80) return 'text-green-600';
  if (rate >= 60) return 'text-amber-600';
  return 'text-red-600';
}

function getPassRateBgColor(rate: number): string {
  if (rate >= 80) return 'bg-green-100';
  if (rate >= 60) return 'bg-amber-100';
  return 'bg-red-100';
}

// Simple SVG Line Chart
function LineChart({
  data,
  color = '#135bec',
}: {
  data: { date: string; value: number }[];
  color?: string;
}) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;
  const padding = 20;
  const width = 280;
  const height = 120;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((d.value - minValue) / range) * chartHeight;
    return `${x},${y}`;
  });

  const areaPoints = [
    `${padding},${padding + chartHeight}`,
    ...points,
    `${padding + chartWidth},${padding + chartHeight}`,
  ].join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
        <line
          key={i}
          x1={padding}
          y1={padding + chartHeight * ratio}
          x2={padding + chartWidth}
          y2={padding + chartHeight * ratio}
          stroke="#e2e8f0"
          strokeWidth="1"
        />
      ))}

      {/* Area fill */}
      <polygon points={areaPoints} fill={color} fillOpacity="0.1" />

      {/* Line */}
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {data.map((d, i) => {
        const x = padding + (i / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((d.value - minValue) / range) * chartHeight;
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
      })}

      {/* X-axis labels */}
      {data.map((d, i) => {
        const x = padding + (i / (data.length - 1)) * chartWidth;
        return (
          <text
            key={i}
            x={x}
            y={height - 2}
            textAnchor="middle"
            className="text-[8px] fill-slate-400"
          >
            {d.date.split(' ')[1]}
          </text>
        );
      })}
    </svg>
  );
}

// Horizontal Bar Chart
function HorizontalBarChart({
  data,
}: {
  data: { agent: string; passRate: number; color: string }[];
}) {
  const maxValue = 100;

  return (
    <div className="flex flex-col gap-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-28 text-xs text-slate-600 truncate">{item.agent}</div>
          <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(item.passRate / maxValue) * 100}%`,
                backgroundColor:
                  item.passRate >= 80 ? '#10b981' : item.passRate >= 60 ? '#f59e0b' : '#ef4444',
              }}
            />
          </div>
          <div className="w-12 text-xs font-medium text-slate-700 text-right">{item.passRate}%</div>
        </div>
      ))}
    </div>
  );
}

// Latency Area Chart
function LatencyChart({
  data,
}: {
  data: { date: string; p50: number; p90: number; p99: number }[];
}) {
  const maxValue = Math.max(...data.flatMap((d) => [d.p50, d.p90, d.p99]));
  const padding = 20;
  const width = 280;
  const height = 120;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const getPoints = (key: 'p50' | 'p90' | 'p99') =>
    data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - (d[key] / maxValue) * chartHeight;
      return `${x},${y}`;
    });

  const getAreaPoints = (key: 'p50' | 'p90' | 'p99') => {
    const points = getPoints(key);
    return [
      `${padding},${padding + chartHeight}`,
      ...points,
      `${padding + chartWidth},${padding + chartHeight}`,
    ].join(' ');
  };

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={i}
            x1={padding}
            y1={padding + chartHeight * ratio}
            x2={padding + chartWidth}
            y2={padding + chartHeight * ratio}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}

        {/* P99 Area */}
        <polygon points={getAreaPoints('p99')} fill="#ef4444" fillOpacity="0.15" />
        <polyline
          points={getPoints('p99').join(' ')}
          fill="none"
          stroke="#ef4444"
          strokeWidth="1.5"
        />

        {/* P90 Area */}
        <polygon points={getAreaPoints('p90')} fill="#f59e0b" fillOpacity="0.2" />
        <polyline
          points={getPoints('p90').join(' ')}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.5"
        />

        {/* P50 Area */}
        <polygon points={getAreaPoints('p50')} fill="#10b981" fillOpacity="0.25" />
        <polyline
          points={getPoints('p50').join(' ')}
          fill="none"
          stroke="#10b981"
          strokeWidth="1.5"
        />
      </svg>
      <div className="flex items-center justify-center gap-4 mt-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          <span className="text-xs text-slate-500">p50</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-amber-500" />
          <span className="text-xs text-slate-500">p90</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-red-500" />
          <span className="text-xs text-slate-500">p99</span>
        </div>
      </div>
    </div>
  );
}

// Stacked Bar Chart for Cost
function CostChart({
  data,
}: {
  data: { date: string; compute: number; api: number; storage: number }[];
}) {
  const maxValue = Math.max(...data.map((d) => d.compute + d.api + d.storage));
  const barWidth = 24;
  const gap = 12;
  const padding = 20;
  const width = data.length * (barWidth + gap) + padding * 2;
  const height = 120;
  const chartHeight = height - padding * 2;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={i}
            x1={padding}
            y1={padding + chartHeight * ratio}
            x2={width - padding}
            y2={padding + chartHeight * ratio}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}

        {/* Bars */}
        {data.map((d, i) => {
          const x = padding + i * (barWidth + gap);
          const computeHeight = (d.compute / maxValue) * chartHeight;
          const apiHeight = (d.api / maxValue) * chartHeight;
          const storageHeight = (d.storage / maxValue) * chartHeight;

          return (
            <g key={i}>
              {/* Storage */}
              <rect
                x={x}
                y={padding + chartHeight - storageHeight}
                width={barWidth}
                height={storageHeight}
                fill="#94a3b8"
                rx="2"
              />
              {/* API */}
              <rect
                x={x}
                y={padding + chartHeight - storageHeight - apiHeight}
                width={barWidth}
                height={apiHeight}
                fill="#f59e0b"
                rx="2"
              />
              {/* Compute */}
              <rect
                x={x}
                y={padding + chartHeight - storageHeight - apiHeight - computeHeight}
                width={barWidth}
                height={computeHeight}
                fill="#135bec"
                rx="2"
              />
            </g>
          );
        })}
      </svg>
      <div className="flex items-center justify-center gap-4 mt-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-[#135bec]" />
          <span className="text-xs text-slate-500">Compute</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-amber-500" />
          <span className="text-xs text-slate-500">API</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-slate-400" />
          <span className="text-xs text-slate-500">Storage</span>
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter reports
  const filteredReports = useMemo(() => {
    return mockReports.filter((report) => {
      if (selectedAgents.length > 0 && !selectedAgents.some((a) => report.agent.includes(a))) {
        return false;
      }
      return true;
    });
  }, [selectedAgents]);

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats calculations
  const totalEvaluations = mockReports.length;
  const avgPassRate = mockReports.reduce((acc, r) => acc + r.passRate, 0) / mockReports.length;
  const avgLatency = Math.round(
    mockReports.reduce((acc, r) => acc + r.latency, 0) / mockReports.length
  );
  const totalCost = mockReports.reduce((acc, r) => acc + r.cost, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">
            Track evaluation performance and trends across your agents.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#135bec] hover:bg-[#135bec]/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm shadow-[#135bec]/30 w-fit">
          <span className="material-symbols-outlined text-xl">download</span>
          Export Report
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Select */}
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40 bg-white border-slate-200">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          {/* Agent Select */}
          <Select
            value={selectedAgents[0] || 'all'}
            onValueChange={(val) => setSelectedAgents(val === 'all' ? [] : [val])}
          >
            <SelectTrigger className="w-44 bg-white border-slate-200">
              <SelectValue placeholder="All Agents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              {agents.map((agent) => (
                <SelectItem key={agent} value={agent}>
                  {agent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Divider */}
          <div className="h-8 w-px bg-slate-200 hidden lg:block"></div>

          {/* Type Filter Chips */}
          <div className="flex gap-2 overflow-x-auto py-1">
            {typeFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setTypeFilter(filter.value)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                  typeFilter === filter.value
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Evaluations */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Evaluations</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{totalEvaluations}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="material-symbols-outlined text-sm text-emerald-500">
                  trending_up
                </span>
                <span className="text-xs font-medium text-emerald-600">+12%</span>
                <span className="text-xs text-slate-400">vs last period</span>
              </div>
            </div>
            <div className="size-12 rounded-xl bg-[#135bec]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-[#135bec]">assessment</span>
            </div>
          </div>
        </div>

        {/* Average Pass Rate */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Average Pass Rate</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{avgPassRate.toFixed(1)}%</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="material-symbols-outlined text-sm text-emerald-500">
                  trending_up
                </span>
                <span className="text-xs font-medium text-emerald-600">+5.2%</span>
                <span className="text-xs text-slate-400">vs last period</span>
              </div>
            </div>
            <CircularProgress
              value={avgPassRate}
              size={56}
              strokeWidth={6}
              showValue={false}
              trackColor="#e2e8f0"
              progressColor={
                avgPassRate >= 80 ? '#10b981' : avgPassRate >= 60 ? '#f59e0b' : '#ef4444'
              }
            />
          </div>
        </div>

        {/* Average Latency */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Average Latency</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{avgLatency}ms</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="material-symbols-outlined text-sm text-red-500">
                  trending_down
                </span>
                <span className="text-xs font-medium text-red-600">+8ms</span>
                <span className="text-xs text-slate-400">vs last period</span>
              </div>
            </div>
            <div className="size-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-amber-600">speed</span>
            </div>
          </div>
        </div>

        {/* Total Cost */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Cost</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">${totalCost.toFixed(2)}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs text-slate-400">
                  ${(totalCost / totalEvaluations).toFixed(2)} per eval
                </span>
              </div>
            </div>
            <div className="size-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-emerald-600">payments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pass Rate Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900">Pass Rate Trend</h3>
              <p className="text-xs text-slate-500 mt-0.5">Daily average pass rate</p>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded-full">
              <span className="material-symbols-outlined text-sm text-emerald-500">
                trending_up
              </span>
              <span className="text-xs font-medium text-emerald-600">+6.1%</span>
            </div>
          </div>
          <div className="h-32">
            <LineChart data={passRateTrendData} color="#135bec" />
          </div>
        </div>

        {/* Agent Comparison */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900">Agent Comparison</h3>
              <p className="text-xs text-slate-500 mt-0.5">Pass rate by agent</p>
            </div>
          </div>
          <HorizontalBarChart data={agentComparisonData} />
        </div>

        {/* Latency Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900">Latency Distribution</h3>
              <p className="text-xs text-slate-500 mt-0.5">Response time percentiles (ms)</p>
            </div>
          </div>
          <div className="h-32">
            <LatencyChart data={latencyData} />
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900">Cost Analysis</h3>
              <p className="text-xs text-slate-500 mt-0.5">Daily cost breakdown</p>
            </div>
            <div className="text-xs text-slate-500">
              Total: <span className="font-bold text-slate-700">$96.40</span>
            </div>
          </div>
          <div className="h-32">
            <CostChart data={costData} />
          </div>
        </div>
      </div>

      {/* Detailed Reports Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-900">Detailed Reports</h3>
          <p className="text-xs text-slate-500 mt-0.5">Individual evaluation results</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Eval ID
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Pass Rate
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Latency
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Cost
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-4xl text-slate-300">
                        search_off
                      </span>
                      <p className="text-slate-500 text-sm">No reports found</p>
                      <p className="text-slate-400 text-xs">Try adjusting your filter criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{report.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{report.agentEmoji}</span>
                        <span className="text-sm font-medium text-slate-900">{report.agent}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-slate-500">#{report.id}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded text-xs font-bold',
                          getPassRateColor(report.passRate),
                          getPassRateBgColor(report.passRate)
                        )}
                      >
                        {report.passRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-mono text-slate-600">{report.latency}ms</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-medium text-slate-700">
                        ${report.cost.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center gap-1 text-sm font-medium text-[#135bec] hover:text-[#0f4bcc] transition-colors">
                        View
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div className="text-sm text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredReports.length)} of{' '}
              {filteredReports.length} reports
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center size-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'flex items-center justify-center size-8 rounded-lg text-sm font-medium transition-colors',
                    currentPage === page
                      ? 'bg-[#135bec] text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center size-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
