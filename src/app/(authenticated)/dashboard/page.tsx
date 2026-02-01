// Dashboard Page - Recent Evaluation Runs
// Route: /dashboard

'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Mock data for datasets
const datasets = [
  {
    id: 'ds-001',
    name: 'Customer Support Q&A',
    type: 'uploaded' as const,
    size: 150,
    createdAt: 'Jan 15, 2024',
    status: 'ready' as const,
  },
  {
    id: 'ds-002',
    name: 'Financial Reports Dataset',
    type: 'generated' as const,
    size: 200,
    createdAt: 'Jan 14, 2024',
    status: 'ready' as const,
  },
  {
    id: 'ds-003',
    name: 'Safety Test Cases',
    type: 'generated' as const,
    size: 100,
    createdAt: 'Jan 10, 2024',
    status: 'processing' as const,
  },
];

// Mock data for evaluation runs
const evaluationRuns = [
  {
    id: '1024',
    name: 'Support Bot - Safety Eval',
    datasetName: 'Customer Support Q&A',
    dateTime: '2 mins ago',
    status: 'running' as const,
    score: null,
    progress: 64,
  },
  {
    id: '1023',
    name: 'Data Analyst - Accuracy Test',
    datasetName: 'Financial Reports Dataset',
    dateTime: '2 hours ago',
    status: 'completed' as const,
    score: 92.0,
    progress: 100,
  },
  {
    id: '1022',
    name: 'Content Writer - Quality Check',
    datasetName: 'Blog Posts Dataset',
    dateTime: '5 hours ago',
    status: 'failed' as const,
    score: 45.0,
    progress: 100,
  },
  {
    id: '1021',
    name: 'Code Reviewer - Benchmark',
    datasetName: 'Code Review Samples',
    dateTime: '1 day ago',
    status: 'completed' as const,
    score: 98.5,
    progress: 100,
  },
  {
    id: '1020',
    name: 'Translation Bot - Language Test',
    datasetName: 'Multi-language Dataset',
    dateTime: '1 day ago',
    status: 'completed' as const,
    score: 88.0,
    progress: 100,
  },
];

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
function ActionsDropdown({ evalId }: { evalId: string }) {
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
      >
        <span className="material-symbols-outlined text-lg">more_vert</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
          <Link
            href={`/evaluations/${evalId}`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <span className="material-symbols-outlined text-base">visibility</span>
            View Details
          </Link>
          <button
            disabled
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 cursor-not-allowed w-full text-left"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Export
          </button>
          <div className="border-t border-slate-200 my-1"></div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
            <span className="material-symbols-outlined text-base">delete</span>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
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
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
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
              {evaluationRuns.map((run) => (
                <tr
                  key={run.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => (window.location.href = `/evaluations/${run.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900">{run.name}</span>
                      <span className="text-xs text-slate-500">{run.datasetName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{run.dateTime}</td>
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
                      {run.status === 'completed' && (
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                      )}
                      {run.status === 'failed' && (
                        <span className="flex h-2 w-2 rounded-full bg-red-500"></span>
                      )}
                      {getStatusLabel(run.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {run.status === 'running' ? (
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${run.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-500">{run.progress}%</span>
                      </div>
                    ) : run.score !== null ? (
                      <div className="flex items-center gap-3">
                        <span className={cn('text-sm font-bold', getScoreColor(run.score))}>
                          {run.score.toFixed(1)}%
                        </span>
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={cn('h-full rounded-full', getProgressBarColor(run.score))}
                            style={{ width: `${run.score}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">--</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <ActionsDropdown evalId={run.id} />
                  </td>
                </tr>
              ))}
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
      <div className="flex flex-col gap-4 mt-2">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
              <span className="material-symbols-outlined text-slate-600">storage</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Your Datasets</h2>
              <p className="text-slate-500 text-sm">{datasets.length} datasets</p>
            </div>
          </div>
          <Link
            href="/datasets/new"
            className="flex items-center gap-2 bg-[#135bec] hover:bg-[#135bec]/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm shadow-[#135bec]/30 w-fit"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            New Dataset
          </Link>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {datasets.map((dataset) => {
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

        {/* View All Link */}
        <div className="flex justify-center">
          <Link
            href="/datasets"
            className="text-sm font-medium text-[#135bec] hover:underline flex items-center gap-1"
          >
            View all datasets
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
