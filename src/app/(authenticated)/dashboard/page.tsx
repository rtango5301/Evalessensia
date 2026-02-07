// Dashboard Page - Recent Evaluation Runs
// Route: /dashboard

'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useEvaluations, useDeleteEvaluation } from '@/hooks/use-evaluations';
import { useDatasets } from '@/hooks/use-datasets';
import type { Evaluation, DatasetSource, DatasetStatus } from '@/lib/api/types';

// Helper to format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

// Map API status to display status
type DisplayStatus = 'running' | 'completed' | 'failed';
function mapStatus(status: Evaluation['status']): DisplayStatus {
  switch (status) {
    case 'in_progress':
      return 'running';
    case 'completed':
      return 'completed';
    case 'failed':
      return 'failed';
    default:
      return 'running';
  }
}

// Dataset mapping helpers
type UiDatasetType = 'uploaded' | 'generated';
type UiDatasetStatus = 'ready' | 'processing' | 'error';

function mapSourceToType(source: DatasetSource): UiDatasetType {
  return source === 'uploaded' ? 'uploaded' : 'generated';
}

function mapApiStatusToUiStatus(status: DatasetStatus): UiDatasetStatus {
  if (status === 'completed') return 'ready';
  if (status === 'in_progress') return 'processing';
  return 'error';
}

function formatDatasetDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getStatusBadgeStyles(status: 'running' | 'completed' | 'failed') {
  switch (status) {
    case 'running':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'completed':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
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

function getScoreColor(score: number) {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-red-600';
}

function getProgressBarColor(score: number) {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

function getDatasetStatusStyles(status: 'ready' | 'processing' | 'error') {
  switch (status) {
    case 'ready':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'processing':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'error':
      return 'bg-red-100 text-red-700 border-red-200';
  }
}

function getDatasetStatusLabel(status: 'ready' | 'processing' | 'error') {
  switch (status) {
    case 'ready':
      return 'Ready';
    case 'processing':
      return 'Processing';
    case 'error':
      return 'Error';
  }
}

function getDatasetTypeStyles(type: 'uploaded' | 'generated') {
  switch (type) {
    case 'uploaded':
      return {
        bg: 'bg-blue-100',
        icon: 'upload_file',
        iconColor: 'text-blue-600',
      };
    case 'generated':
      return {
        bg: 'bg-purple-100',
        icon: 'auto_awesome',
        iconColor: 'text-purple-600',
      };
  }
}

// Actions dropdown component
function ActionsDropdown({
  evalId,
  onDelete,
  isDeleting,
}: {
  evalId: string;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this evaluation?')) {
      onDelete(evalId);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
      >
        <span className="material-symbols-outlined text-lg">more_vert</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 z-20 animate-dropdown">
          <Link
            href={`/evaluations/${evalId}`}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg mx-2 transition-all"
          >
            <span className="material-symbols-outlined text-base">visibility</span>
            View Details
          </Link>
          <button
            disabled
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-400 cursor-not-allowed rounded-lg mx-2 w-full text-left"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Export
          </button>
          <div className="border-t border-slate-100 my-2 mx-2"></div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg mx-2 transition-all w-full text-left disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">delete</span>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { evaluations, isLoading, error, refetch } = useEvaluations();
  const { deleteEvaluation, isDeleting } = useDeleteEvaluation();
  const {
    datasets: apiDatasets,
    isLoading: datasetsLoading,
    error: datasetsError,
    refetch: refetchDatasets,
  } = useDatasets();

  // Handle delete
  const handleDelete = async (id: string) => {
    const success = await deleteEvaluation(id);
    if (success) {
      refetch();
    }
  };

  // Get recent evaluations (limit to 5)
  const recentEvaluations = evaluations.slice(0, 5);

  // Map API datasets to UI format and limit to 3
  const recentDatasets = apiDatasets
    .map((d) => ({
      id: d.id,
      name: d.name,
      type: mapSourceToType(d.source),
      size: d.query_count,
      createdAt: formatDatasetDate(d.created_at),
      status: mapApiStatusToUiStatus(d.status),
    }))
    .slice(0, 3);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Evaluations</h1>
            <p className="text-slate-500 text-sm mt-1">
              View and manage your recent evaluation runs.
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
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="animate-pulse">
            <div className="border-b border-slate-200 bg-slate-50 h-12"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-6 py-4 border-b border-slate-200 flex gap-4">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                <div className="h-4 bg-slate-200 rounded w-1/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Evaluations</h1>
            <p className="text-slate-500 text-sm mt-1">
              View and manage your recent evaluation runs.
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
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <span className="material-symbols-outlined text-red-500 text-3xl mb-2">error</span>
          <p className="text-red-800 font-medium">Failed to load evaluations</p>
          <p className="text-red-600 text-sm mt-1">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (recentEvaluations.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Evaluations</h1>
            <p className="text-slate-500 text-sm mt-1">
              View and manage your recent evaluation runs.
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
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-12 text-center">
          <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-slate-400 text-3xl">analytics</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No evaluations yet</h3>
          <p className="text-slate-500 text-sm mb-6">
            Create your first evaluation to start testing your AI agents.
          </p>
          <Link
            href="/evaluations/new"
            className="inline-flex items-center gap-2 bg-[#135bec] hover:bg-[#135bec]/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            New Evaluation
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Evaluations</h1>
          <p className="text-slate-500 text-sm mt-1">
            View and manage your recent evaluation runs.
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

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Evaluation Name
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Date/Time
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentEvaluations.map((evaluation) => {
                const displayStatus = mapStatus(evaluation.status);
                const score = evaluation.results_summary?.overall_score ?? null;
                const progress = evaluation.progress ? parseInt(evaluation.progress, 10) : 0;

                return (
                  <tr
                    key={evaluation.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => (window.location.href = `/evaluations/${evaluation.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">
                          {evaluation.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {evaluation.dataset_name || 'Unknown Dataset'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatRelativeTime(evaluation.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
                          getStatusBadgeStyles(displayStatus)
                        )}
                      >
                        {displayStatus === 'running' && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                          </span>
                        )}
                        {displayStatus === 'completed' && (
                          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                        )}
                        {displayStatus === 'failed' && (
                          <span className="flex h-2 w-2 rounded-full bg-red-500"></span>
                        )}
                        {getStatusLabel(displayStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {displayStatus === 'running' ? (
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-slate-500">{progress}%</span>
                        </div>
                      ) : score !== null ? (
                        <div className="flex items-center gap-3">
                          <span className={cn('text-sm font-bold', getScoreColor(score))}>
                            {score.toFixed(1)}%
                          </span>
                          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={cn('h-full rounded-full', getProgressBarColor(score))}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <ActionsDropdown
                        evalId={evaluation.id}
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* View All Link */}
      <div className="flex justify-center">
        <Link
          href="/evaluations"
          className="text-sm font-medium text-[#135bec] hover:underline flex items-center gap-1"
        >
          View all evaluations
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
      </div>

      {/* Datasets Section */}
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
              <span className="material-symbols-outlined text-slate-600">storage</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Your Datasets</h2>
              <p className="text-slate-500 text-sm">
                {datasetsLoading ? 'Loading...' : `${apiDatasets.length} datasets`}
              </p>
            </div>
          </div>
          <Link
            href="/datasets"
            className="text-sm font-medium text-[#135bec] hover:underline flex items-center gap-1"
          >
            View All
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        {/* Loading State */}
        {datasetsLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-pulse"
              >
                <div className="p-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                </div>
                <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="h-5 bg-slate-200 rounded w-16"></div>
                  <div className="h-3 bg-slate-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!datasetsLoading && datasetsError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-red-500 text-3xl mb-2">error</span>
            <p className="text-red-800 font-medium">Failed to load datasets</p>
            <p className="text-red-600 text-sm mt-1">{datasetsError.message}</p>
            <button
              onClick={() => refetchDatasets()}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!datasetsLoading && !datasetsError && recentDatasets.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-12 text-center">
            <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-slate-400 text-3xl">storage</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No datasets yet</h3>
            <p className="text-slate-500 text-sm mb-6">
              Create your first dataset to start evaluating your AI agents.
            </p>
            <Link
              href="/datasets/new"
              className="inline-flex items-center gap-2 bg-[#135bec] hover:bg-[#135bec]/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all"
            >
              <span className="material-symbols-outlined text-xl">add</span>
              New Dataset
            </Link>
          </div>
        )}

        {/* Card Grid */}
        {!datasetsLoading && !datasetsError && recentDatasets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentDatasets.map((dataset) => {
              const typeStyles = getDatasetTypeStyles(dataset.type);
              return (
                <Link
                  key={dataset.id}
                  href={`/datasets/${dataset.id}`}
                  className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                >
                  <div className="p-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center mb-3',
                        typeStyles.bg
                      )}
                    >
                      <span className={cn('material-symbols-outlined', typeStyles.iconColor)}>
                        {typeStyles.icon}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-medium text-slate-900 line-clamp-1 group-hover:text-[#135bec] transition-colors">
                      {dataset.name}
                    </h3>

                    {/* Meta */}
                    <p className="text-xs text-slate-500 mt-1">{dataset.size} queries</p>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border',
                        getDatasetStatusStyles(dataset.status)
                      )}
                    >
                      {dataset.status === 'processing' ? (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                        </span>
                      ) : dataset.status === 'ready' ? (
                        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      ) : (
                        <span className="flex h-1.5 w-1.5 rounded-full bg-red-500"></span>
                      )}
                      {getDatasetStatusLabel(dataset.status)}
                    </span>
                    <span className="text-xs text-slate-400">{dataset.createdAt}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* View All Link */}
        {!datasetsLoading && !datasetsError && recentDatasets.length > 0 && (
          <div className="flex justify-center">
            <Link
              href="/datasets"
              className="text-sm font-medium text-[#135bec] hover:underline flex items-center gap-1"
            >
              View all datasets
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
