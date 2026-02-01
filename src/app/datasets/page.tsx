'use client';

import Link from 'next/link';
import { useState, useMemo, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Types
type DatasetType = 'uploaded' | 'generated';
type DatasetStatus = 'ready' | 'processing' | 'error';
type TypeFilter = 'all' | 'uploaded' | 'generated';

interface Dataset {
  id: string;
  name: string;
  type: DatasetType;
  size: number; // number of queries
  createdAt: string;
  status: DatasetStatus;
}

// Mock data
const datasets: Dataset[] = [
  {
    id: 'ds-001',
    name: 'Customer Support Q&A',
    type: 'uploaded',
    size: 150,
    createdAt: '2024-01-15',
    status: 'ready',
  },
  {
    id: 'ds-002',
    name: 'Financial Reports Dataset',
    type: 'generated',
    size: 200,
    createdAt: '2024-01-14',
    status: 'ready',
  },
  {
    id: 'ds-003',
    name: 'Blog Posts Dataset',
    type: 'uploaded',
    size: 75,
    createdAt: '2024-01-13',
    status: 'ready',
  },
  {
    id: 'ds-004',
    name: 'Code Review Samples',
    type: 'generated',
    size: 300,
    createdAt: '2024-01-12',
    status: 'ready',
  },
  {
    id: 'ds-005',
    name: 'Multi-language Dataset',
    type: 'uploaded',
    size: 500,
    createdAt: '2024-01-11',
    status: 'ready',
  },
  {
    id: 'ds-006',
    name: 'Safety Test Cases',
    type: 'generated',
    size: 100,
    createdAt: '2024-01-10',
    status: 'processing',
  },
  {
    id: 'ds-007',
    name: 'Edge Cases Collection',
    type: 'uploaded',
    size: 50,
    createdAt: '2024-01-09',
    status: 'error',
  },
];

const typeFilters: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'uploaded', label: 'File Upload' },
  { value: 'generated', label: 'AI Generated' },
];

function getTypeBadgeStyles(type: DatasetType) {
  switch (type) {
    case 'uploaded':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'generated':
      return 'bg-purple-100 text-purple-700 border-purple-200';
  }
}

function getTypeIcon(type: DatasetType) {
  switch (type) {
    case 'uploaded':
      return 'upload_file';
    case 'generated':
      return 'auto_awesome';
  }
}

function getStatusBadgeStyles(status: DatasetStatus) {
  switch (status) {
    case 'ready':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'processing':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'error':
      return 'bg-red-100 text-red-700 border-red-200';
  }
}

function getStatusLabel(status: DatasetStatus) {
  switch (status) {
    case 'ready':
      return 'Ready';
    case 'processing':
      return 'Processing';
    case 'error':
      return 'Error';
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function DatasetsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const filteredDatasets = useMemo(() => {
    const result = datasets.filter((dataset) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === '' ||
        dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dataset.id.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by type
      const matchesType = typeFilter === 'all' || dataset.type === typeFilter;

      return matchesSearch && matchesType;
    });

    // Sort by newest first
    return [...result].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [searchQuery, typeFilter]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Datasets</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your evaluation datasets and test cases.
          </p>
        </div>
        <Link
          href="/datasets/new"
          className="flex items-center gap-2 bg-[#135bec] hover:bg-[#135bec]/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm shadow-[#135bec]/30 w-fit"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          New Dataset
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
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-slate-100 text-slate-900 text-sm placeholder-slate-500 focus:ring-2 focus:ring-[#135bec] focus:bg-white transition-all"
            />
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

          {/* Type Chips */}
          <div className="flex gap-2 overflow-x-auto py-1">
            {typeFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setTypeFilter(filter.value)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                  typeFilter === filter.value
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                )}
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
                  Name
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Created On
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDatasets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-4xl text-slate-300">
                        search_off
                      </span>
                      <p className="text-slate-500 text-sm">No datasets found</p>
                      <p className="text-slate-400 text-xs">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDatasets.map((dataset) => (
                  <tr
                    key={dataset.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => (window.location.href = `/datasets/${dataset.id}`)}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900">{dataset.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
                          getTypeBadgeStyles(dataset.type)
                        )}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {getTypeIcon(dataset.type)}
                        </span>
                        {dataset.type === 'uploaded' ? 'Uploaded' : 'Generated'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{dataset.size} queries</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {formatDate(dataset.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
                          getStatusBadgeStyles(dataset.status)
                        )}
                      >
                        {dataset.status === 'processing' && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                          </span>
                        )}
                        {getStatusLabel(dataset.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div
                        className="relative inline-block"
                        ref={openMenuId === dataset.id ? menuRef : null}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === dataset.id ? null : dataset.id);
                          }}
                          className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">more_vert</span>
                        </button>
                        {openMenuId === dataset.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                            <Link
                              href={`/datasets/${dataset.id}`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <span className="material-symbols-outlined text-lg">visibility</span>
                              View Details
                            </Link>
                            <Link
                              href={`/evaluations/new?dataset=${dataset.id}`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <span className="material-symbols-outlined text-lg">science</span>
                              Run Evaluation
                            </Link>
                            <button
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors w-full text-left"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <span className="material-symbols-outlined text-lg">download</span>
                              Export
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
      {filteredDatasets.length > 0 && (
        <div className="text-sm text-slate-500">
          Showing {filteredDatasets.length} of {datasets.length} datasets
        </div>
      )}
    </div>
  );
}
