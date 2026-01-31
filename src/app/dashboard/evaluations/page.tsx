'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

// Mock data for evaluation runs
const evaluationRuns = [
  {
    id: '1024',
    agentName: 'Support Bot v2.4',
    agentEmoji: '🤖',
    status: 'running' as const,
    startedAt: '4 min ago',
    duration: '--',
    passRate: 87.5,
    total: 50,
    completed: 32,
  },
  {
    id: '1023',
    agentName: 'Data Analyst',
    agentEmoji: '📊',
    status: 'completed' as const,
    startedAt: '2 hours ago',
    duration: '5m 23s',
    passRate: 92.0,
    total: 100,
    completed: 100,
  },
  {
    id: '1022',
    agentName: 'Content Writer',
    agentEmoji: '📝',
    status: 'failed' as const,
    startedAt: '5 hours ago',
    duration: '1m 12s',
    passRate: 45.0,
    total: 50,
    completed: 28,
  },
  {
    id: '1021',
    agentName: 'Code Reviewer',
    agentEmoji: '🔍',
    status: 'completed' as const,
    startedAt: '1 day ago',
    duration: '12m 45s',
    passRate: 98.5,
    total: 200,
    completed: 200,
  },
  {
    id: '1020',
    agentName: 'Translation Bot',
    agentEmoji: '🌐',
    status: 'completed' as const,
    startedAt: '1 day ago',
    duration: '3m 18s',
    passRate: 88.0,
    total: 75,
    completed: 75,
  },
  {
    id: '1019',
    agentName: 'Support Bot v2.3',
    agentEmoji: '🤖',
    status: 'failed' as const,
    startedAt: '2 days ago',
    duration: '2m 05s',
    passRate: 62.0,
    total: 50,
    completed: 50,
  },
  {
    id: '1018',
    agentName: 'Research Assistant',
    agentEmoji: '📚',
    status: 'completed' as const,
    startedAt: '3 days ago',
    duration: '8m 32s',
    passRate: 95.0,
    total: 80,
    completed: 80,
  },
  {
    id: '1017',
    agentName: 'Email Classifier',
    agentEmoji: '📧',
    status: 'running' as const,
    startedAt: '1 min ago',
    duration: '--',
    passRate: 0,
    total: 120,
    completed: 15,
  },
];

type StatusFilter = 'all' | 'running' | 'completed' | 'failed';

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'running', label: 'Running' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
];

function getStatusBadgeStyles(status: 'running' | 'completed' | 'failed') {
  switch (status) {
    case 'running':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'completed':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'failed':
      return 'bg-red-100 text-red-700 border-red-200';
  }
}

function getStatusLabel(status: 'running' | 'completed' | 'failed') {
  switch (status) {
    case 'running':
      return 'Running';
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Failed';
  }
}

export default function EvaluationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredRuns = useMemo(() => {
    return evaluationRuns.filter((run) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === '' ||
        run.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        run.id.includes(searchQuery);

      // Filter by status
      const matchesStatus = statusFilter === 'all' || run.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-slate-900 text-2xl font-bold">Evaluation Runs</h1>
        <Link
          href="/evaluations/configure"
          className="flex items-center gap-2 px-4 py-2 bg-[#135bec] text-white text-sm font-medium rounded-lg hover:bg-[#0f4bcc] transition-colors"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New Evaluation
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search by agent name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent focus:outline-none transition-all"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                statusFilter === filter.value
                  ? 'bg-[#135bec] text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Agent Name
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Started
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Pass Rate
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRuns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-4xl text-slate-300">
                        search_off
                      </span>
                      <p className="text-slate-500 text-sm">No evaluation runs found</p>
                      <p className="text-slate-400 text-xs">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRuns.map((run) => (
                  <tr key={run.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-slate-500">#{run.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{run.agentEmoji}</span>
                        <span className="text-sm font-medium text-slate-900">{run.agentName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeStyles(run.status)}`}
                      >
                        {run.status === 'running' && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                          </span>
                        )}
                        {getStatusLabel(run.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{run.startedAt}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 font-mono">{run.duration}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {run.status === 'running' ? (
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-sm text-slate-400">
                            {run.completed}/{run.total}
                          </span>
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all"
                              style={{ width: `${(run.completed / run.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span
                          className={`text-sm font-bold ${
                            run.passRate >= 80
                              ? 'text-green-600'
                              : run.passRate >= 60
                                ? 'text-amber-600'
                                : 'text-red-600'
                          }`}
                        >
                          {run.passRate.toFixed(1)}%
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/evaluations/${run.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-[#135bec] hover:text-[#0f4bcc] transition-colors"
                      >
                        View Details
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Summary */}
      {filteredRuns.length > 0 && (
        <div className="text-sm text-slate-500">
          Showing {filteredRuns.length} of {evaluationRuns.length} evaluation runs
        </div>
      )}
    </div>
  );
}
