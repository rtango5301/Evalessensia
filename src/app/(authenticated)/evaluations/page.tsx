'use client';

import Link from 'next/link';
import { useState, useMemo, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Mock data for evaluation runs
const evaluationRuns = [
  {
    id: '1024',
    name: 'Support Bot - Safety Eval',
    agentEmoji: '🤖',
    datasetName: 'Customer Support Q&A',
    datasetId: 'ds-001',
    status: 'running' as const,
    startedAt: '4 min ago',
    duration: '--',
    passRate: 87.5,
    total: 50,
    completed: 32,
  },
  {
    id: '1023',
    name: 'Data Analyst - Accuracy Test',
    agentEmoji: '📊',
    datasetName: 'Financial Reports Dataset',
    datasetId: 'ds-002',
    status: 'completed' as const,
    startedAt: '2 hours ago',
    duration: '5m 23s',
    passRate: 92.0,
    total: 100,
    completed: 100,
  },
  {
    id: '1022',
    name: 'Content Writer - Quality Check',
    agentEmoji: '📝',
    datasetName: 'Blog Posts Dataset',
    datasetId: 'ds-003',
    status: 'failed' as const,
    startedAt: '5 hours ago',
    duration: '1m 12s',
    passRate: 45.0,
    total: 50,
    completed: 28,
  },
  {
    id: '1021',
    name: 'Code Reviewer - Benchmark',
    agentEmoji: '🔍',
    datasetName: 'Code Review Samples',
    datasetId: 'ds-004',
    status: 'completed' as const,
    startedAt: '1 day ago',
    duration: '12m 45s',
    passRate: 98.5,
    total: 200,
    completed: 200,
  },
  {
    id: '1020',
    name: 'Translation Bot - Language Test',
    agentEmoji: '🌐',
    datasetName: 'Multi-language Dataset',
    datasetId: 'ds-005',
    status: 'completed' as const,
    startedAt: '1 day ago',
    duration: '3m 18s',
    passRate: 88.0,
    total: 75,
    completed: 75,
  },
  {
    id: '1019',
    name: 'Support Bot - Regression',
    agentEmoji: '🤖',
    datasetName: 'Customer Support Q&A',
    datasetId: 'ds-001',
    status: 'failed' as const,
    startedAt: '2 days ago',
    duration: '2m 05s',
    passRate: 62.0,
    total: 50,
    completed: 50,
  },
  {
    id: '1018',
    name: 'Research Assistant - Eval',
    agentEmoji: '📚',
    datasetName: 'Safety Test Cases',
    datasetId: 'ds-006',
    status: 'completed' as const,
    startedAt: '3 days ago',
    duration: '8m 32s',
    passRate: 95.0,
    total: 80,
    completed: 80,
  },
  {
    id: '1017',
    name: 'Email Classifier - Test',
    agentEmoji: '📧',
    datasetName: 'Edge Cases Collection',
    datasetId: 'ds-007',
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
  { value: 'all', label: 'All Status' },
  { value: 'running', label: 'In Progress' },
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
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Failed';
  }
}

export default function EvaluationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Find running evaluations for the banner
  const runningEvaluations = useMemo(() => {
    return evaluationRuns.filter((run) => run.status === 'running');
  }, []);

  const filteredRuns = useMemo(() => {
    return evaluationRuns.filter((run) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === '' ||
        run.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        run.datasetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        run.id.includes(searchQuery) ||
        run.datasetId.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by status
      const matchesStatus = statusFilter === 'all' || run.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="flex flex-col gap-6">
      {/* In Progress Banner */}
      {runningEvaluations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              {/* Pulsing dot */}
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#135bec] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#135bec]"></span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-blue-900">Evaluation In Progress</span>
                <span className="text-blue-600">•</span>
                <span className="text-sm text-blue-800">{runningEvaluations[0].name}</span>
                <span className="text-blue-600">•</span>
                <span className="text-sm text-blue-700 font-medium">
                  {runningEvaluations[0].completed}/{runningEvaluations[0].total} completed
                </span>
              </div>
            </div>
          </div>
          {/* Show additional running evaluations if more than one */}
          {runningEvaluations.length > 1 && (
            <p className="text-xs text-blue-600 mt-2 ml-6">
              +{runningEvaluations.length - 1} more evaluation
              {runningEvaluations.length > 2 ? 's' : ''} running
            </p>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Evaluation Runs</h1>
          <p className="text-slate-500 text-sm mt-1">
            View and manage your agent evaluation history.
          </p>
        </div>
        <Link
          href="/evaluations/new"
          className="flex items-center gap-2 bg-[#135bec] hover:bg-[#135bec]/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm shadow-[#135bec]/30 w-fit"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          New Evaluation
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Search & Filters */}
        <div className="flex flex-1 w-full md:w-auto items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
            </div>
            <input
              type="text"
              placeholder="Search by name, dataset, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-slate-100 text-slate-900 text-sm placeholder-slate-500 focus:ring-2 focus:ring-[#135bec] focus:bg-white transition-all"
            />
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

          {/* Status Chips */}
          <div className="flex gap-2 overflow-x-auto py-1">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  statusFilter === filter.value
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Evaluation Name
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Dataset
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
                  Score
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRuns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
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
                        <span className="text-sm font-medium text-slate-900">{run.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500">{run.datasetId}</span>
                        <span className="text-slate-300">•</span>
                        <Link
                          href={`/datasets/${run.datasetId}`}
                          className="text-sm text-[#135bec] hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {run.datasetName}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
                          getStatusBadgeStyles(run.status)
                        )}
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
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div
                        className="relative inline-block"
                        ref={openMenuId === run.id ? menuRef : null}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === run.id ? null : run.id);
                          }}
                          className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">more_vert</span>
                        </button>
                        {openMenuId === run.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                            <Link
                              href={`/evaluations/${run.id}`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <span className="material-symbols-outlined text-lg">visibility</span>
                              View Details
                            </Link>
                            {(run.status === 'completed' || run.status === 'failed') && (
                              <button
                                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors w-full text-left"
                                onClick={() => setOpenMenuId(null)}
                              >
                                <span className="material-symbols-outlined text-lg">replay</span>
                                Re-run Evaluation
                              </button>
                            )}
                            <button
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors w-full text-left"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <span className="material-symbols-outlined text-lg">download</span>
                              Export Results
                            </button>
                            <div className="border-t border-slate-100 my-1"></div>
                            <button
                              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
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
