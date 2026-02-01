'use client';

import Link from 'next/link';
import { useState, useMemo, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SlideOverPanel } from '@/components/ui/slide-over-panel';
import { useEvaluations, useDeleteEvaluation } from '@/hooks/use-evaluations';
import type { Evaluation } from '@/lib/api/types';

type StatusFilter = 'all' | 'running' | 'completed' | 'failed';

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'running', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
];

// Map API status to UI status
function mapStatus(apiStatus: string): 'running' | 'completed' | 'failed' {
  switch (apiStatus) {
    case 'in_progress':
      return 'running';
    case 'completed':
      return 'completed';
    case 'failed':
      return 'failed';
    default:
      return 'completed';
  }
}

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

// Format date relative to now
function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// Loading skeleton component
function TableSkeleton() {
  return (
    <div className="animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-100">
          <div className="h-4 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-48 bg-slate-200 rounded" />
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-200 rounded" />
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded ml-auto" />
        </div>
      ))}
    </div>
  );
}

export default function EvaluationsPage() {
  const { evaluations, isLoading, error, refetch } = useEvaluations();
  const { deleteEvaluation, isDeleting } = useDeleteEvaluation();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // SlideOverPanel state for delete confirmation
  const [deletingRun, setDeletingRun] = useState<Evaluation | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Open delete panel for an evaluation run
  const openDeletePanel = (run: Evaluation) => {
    setDeletingRun(run);
    setDeleteConfirm(false);
    setOpenMenuId(null);
  };

  // Close delete panel
  const closeDeletePanel = () => {
    setDeletingRun(null);
    setDeleteConfirm(false);
  };

  // Handle delete action
  const handleDelete = async () => {
    if (!deletingRun) return;
    const success = await deleteEvaluation(deletingRun.id);
    if (success) {
      closeDeletePanel();
      refetch();
    }
  };

  // Find running evaluations for the banner
  const runningEvaluations = useMemo(() => {
    return evaluations.filter((run) => run.status === 'in_progress');
  }, [evaluations]);

  const filteredRuns = useMemo(() => {
    return evaluations.filter((run) => {
      const uiStatus = mapStatus(run.status);

      // Filter by search query
      const matchesSearch =
        searchQuery === '' ||
        run.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (run.dataset_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        run.id.includes(searchQuery) ||
        run.dataset_id.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by status
      const matchesStatus = statusFilter === 'all' || uiStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [evaluations, searchQuery, statusFilter]);

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
                {runningEvaluations[0].results_summary && (
                  <>
                    <span className="text-blue-600">•</span>
                    <span className="text-sm text-blue-700 font-medium">
                      {runningEvaluations[0].results_summary.passed_count +
                        runningEvaluations[0].results_summary.failed_count}
                      /{runningEvaluations[0].results_summary.total_count} completed
                    </span>
                  </>
                )}
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

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-red-500">error</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Failed to load evaluations</p>
            <p className="text-sm text-red-600">{error.message}</p>
          </div>
          <button
            onClick={() => refetch()}
            className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

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
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Score
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7}>
                    <TableSkeleton />
                  </td>
                </tr>
              ) : filteredRuns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-4xl text-slate-300">
                        {evaluations.length === 0 ? 'science' : 'search_off'}
                      </span>
                      <p className="text-slate-500 text-sm">
                        {evaluations.length === 0
                          ? 'No evaluations yet'
                          : 'No evaluation runs found'}
                      </p>
                      <p className="text-slate-400 text-xs">
                        {evaluations.length === 0 ? (
                          <Link
                            href="/evaluations/new"
                            className="text-[#135bec] hover:underline font-medium"
                          >
                            Create your first evaluation
                          </Link>
                        ) : (
                          'Try adjusting your search or filter criteria'
                        )}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRuns.map((run) => {
                  const uiStatus = mapStatus(run.status);
                  const passRate = run.results_summary
                    ? (run.results_summary.pass_rate * 100).toFixed(1)
                    : null;
                  const completed = run.results_summary
                    ? run.results_summary.passed_count + run.results_summary.failed_count
                    : 0;
                  const total = run.results_summary?.total_count || 0;

                  return (
                    <tr key={run.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-slate-500">
                          #{run.id.slice(0, 8)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-900">{run.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-500">
                            {run.dataset_id.slice(0, 8)}
                          </span>
                          <span className="text-slate-300">•</span>
                          <Link
                            href={`/datasets/${run.dataset_id}`}
                            className="text-sm text-[#135bec] hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {run.dataset_name || 'View Dataset'}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
                            getStatusBadgeStyles(uiStatus)
                          )}
                        >
                          {uiStatus === 'running' && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                          )}
                          {getStatusLabel(uiStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {formatRelativeTime(run.created_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {uiStatus === 'running' ? (
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-sm text-slate-400">
                              {completed}/{total}
                            </span>
                            {total > 0 && (
                              <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full transition-all"
                                  style={{ width: `${(completed / total) * 100}%` }}
                                />
                              </div>
                            )}
                          </div>
                        ) : passRate !== null ? (
                          <span
                            className={`text-sm font-bold ${
                              parseFloat(passRate) >= 80
                                ? 'text-green-600'
                                : parseFloat(passRate) >= 60
                                  ? 'text-amber-600'
                                  : 'text-red-600'
                            }`}
                          >
                            {passRate}%
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">--</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div
                          className="relative inline-block"
                          ref={openMenuId === run.id ? menuRef : null}
                        >
                          <button
                            onClick={() => setOpenMenuId(openMenuId === run.id ? null : run.id)}
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
                                <span className="material-symbols-outlined text-lg">
                                  visibility
                                </span>
                                View Details
                              </Link>
                              <button
                                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors w-full text-left opacity-50 cursor-not-allowed"
                                disabled
                              >
                                <span className="material-symbols-outlined text-lg">download</span>
                                Export
                              </button>
                              <div className="border-t border-slate-100 my-1"></div>
                              <button
                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                onClick={() => openDeletePanel(run)}
                              >
                                <span className="material-symbols-outlined text-lg">delete</span>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Summary */}
      {!isLoading && filteredRuns.length > 0 && (
        <div className="text-sm text-slate-500">
          Showing {filteredRuns.length} of {evaluations.length} evaluation runs
        </div>
      )}

      {/* Delete Evaluation SlideOverPanel */}
      <SlideOverPanel
        isOpen={deletingRun !== null}
        onClose={closeDeletePanel}
        title="Delete Evaluation"
        description={deletingRun ? `Evaluation #${deletingRun.id.slice(0, 8)}` : undefined}
        width="md"
      >
        {deletingRun && (
          <div className="p-6 flex flex-col gap-6">
            {/* Evaluation Info */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-medium text-slate-700">Evaluation Information</h3>
              <div className="bg-slate-50 rounded-lg p-4 flex flex-col gap-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Name</span>
                  <span className="text-sm text-slate-900 font-medium">{deletingRun.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">ID</span>
                  <span className="text-sm font-mono text-slate-600">
                    #{deletingRun.id.slice(0, 8)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Status</span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
                      getStatusBadgeStyles(mapStatus(deletingRun.status))
                    )}
                  >
                    {getStatusLabel(mapStatus(deletingRun.status))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Dataset</span>
                  <span className="text-sm text-slate-900">
                    {deletingRun.dataset_name || deletingRun.dataset_id.slice(0, 8)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Started</span>
                  <span className="text-sm text-slate-900">
                    {formatRelativeTime(deletingRun.created_at)}
                  </span>
                </div>
                {deletingRun.results_summary && (
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Score</span>
                    <span
                      className={`text-sm font-bold ${
                        deletingRun.results_summary.pass_rate * 100 >= 80
                          ? 'text-green-600'
                          : deletingRun.results_summary.pass_rate * 100 >= 60
                            ? 'text-amber-600'
                            : 'text-red-600'
                      }`}
                    >
                      {(deletingRun.results_summary.pass_rate * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium text-slate-700">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                <Link
                  href={`/evaluations/${deletingRun.id}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-base">visibility</span>
                  View Details
                </Link>
                <button
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 rounded-lg cursor-not-allowed text-left"
                  disabled
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  Export Results
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={closeDeletePanel}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* Danger Zone */}
            <div className="flex flex-col gap-2 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-medium text-red-600">Danger Zone</h3>
              {!deleteConfirm ? (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                  Delete Evaluation
                </button>
              ) : (
                <div className="flex flex-col gap-2 p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-700">
                    Are you sure you want to delete this evaluation run? This action cannot be
                    undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeleteConfirm(false)}
                      className="flex-1 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex-1 px-3 py-1.5 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </SlideOverPanel>
    </div>
  );
}
