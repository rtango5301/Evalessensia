'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

import { Skeleton } from '@/components/ui/skeleton';
import { useDatasets, useDeleteDataset } from '@/hooks/use-datasets';
import type {
  Dataset as ApiDataset,
  DatasetSource,
  DatasetStatus as ApiDatasetStatus,
} from '@/lib/api/types';
import { useUsageQuota } from '@/hooks/use-usage-quota';
import { UsageQuotaBanner } from '@/components/ui/usage-quota-banner';

// UI Types (mapped from API types)
type UiDatasetType = 'uploaded' | 'generated';
type UiDatasetStatus = 'ready' | 'processing' | 'error';
type TypeFilter = 'all' | 'uploaded' | 'generated';

interface UiDataset {
  id: string;
  name: string;
  type: UiDatasetType;
  size: number;
  createdAt: string;
  status: UiDatasetStatus;
  description?: string;
}

// Map API source to UI type
function mapSourceToType(source: DatasetSource): UiDatasetType {
  switch (source) {
    case 'uploaded':
      return 'uploaded';
    case 'generated':
    case 'built_in':
    default:
      return 'generated';
  }
}

// Map API status to UI status
function mapApiStatusToUiStatus(status: ApiDatasetStatus): UiDatasetStatus {
  switch (status) {
    case 'completed':
      return 'ready';
    case 'in_progress':
      return 'processing';
    case 'failed':
      return 'error';
    case 'inactive':
    default:
      return 'error';
  }
}

// Convert API dataset to UI dataset
function mapApiDatasetToUiDataset(apiDataset: ApiDataset): UiDataset {
  return {
    id: apiDataset.id,
    name: apiDataset.name,
    type: mapSourceToType(apiDataset.source),
    size: apiDataset.query_count,
    createdAt: apiDataset.created_at,
    status: mapApiStatusToUiStatus(apiDataset.status),
    description: apiDataset.description,
  };
}

const typeFilters: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'uploaded', label: 'File Upload' },
  { value: 'generated', label: 'AI Generated' },
];

function getTypeBadgeStyles(type: UiDatasetType) {
  switch (type) {
    case 'uploaded':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'generated':
      return 'bg-purple-100 text-purple-700 border-purple-200';
  }
}

function getTypeIcon(type: UiDatasetType) {
  switch (type) {
    case 'uploaded':
      return 'upload_file';
    case 'generated':
      return 'auto_awesome';
  }
}

function getStatusBadgeStyles(status: UiDatasetStatus) {
  switch (status) {
    case 'ready':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'processing':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'error':
      return 'bg-red-100 text-red-700 border-red-200';
  }
}

function getStatusLabel(status: UiDatasetStatus) {
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

// Loading skeleton for table rows
function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-40" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-6 w-24 rounded-full" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-6 w-20 rounded-full" />
      </td>
      <td className="px-6 py-4 text-right">
        <Skeleton className="h-8 w-12 ml-auto" />
      </td>
    </tr>
  );
}

// Memoized table row component to avoid unnecessary re-renders
interface DatasetRowProps {
  dataset: UiDataset;
  openMenuId: string | null;
  menuPosition: { top: number; left: number } | null;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onToggleMenu: (datasetId: string, rect: DOMRect) => void;
  onCloseMenu: () => void;
  onDelete: (dataset: UiDataset) => void;
}

const DatasetRow = React.memo(function DatasetRow({
  dataset,
  openMenuId,
  menuPosition,
  menuRef,
  onToggleMenu,
  onCloseMenu,
  onDelete,
}: DatasetRowProps) {
  const router = useRouter();
  const [showExportTooltip, setShowExportTooltip] = useState(false);
  return (
    <tr
      className="hover:bg-slate-50 transition-colors cursor-pointer"
      onClick={() => router.push(`/datasets/${dataset.id}`)}
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
          <span className="material-symbols-outlined text-sm">{getTypeIcon(dataset.type)}</span>
          {dataset.type === 'uploaded' ? 'Uploaded' : 'Generated'}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-slate-600">{dataset.size} queries</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-slate-600">{formatDate(dataset.createdAt)}</span>
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
        <div className="relative inline-block" ref={openMenuId === dataset.id ? menuRef : null}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              onToggleMenu(dataset.id, rect);
            }}
            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-xl">more_vert</span>
          </button>
          {openMenuId === dataset.id && menuPosition && (
            <div
              className="fixed w-52 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 z-50 animate-dropdown"
              style={{ top: menuPosition.top, left: menuPosition.left }}
            >
              <Link
                href={`/datasets/${dataset.id}`}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg mx-2 transition-all"
                onClick={onCloseMenu}
              >
                <span className="material-symbols-outlined text-lg">visibility</span>
                View Details
              </Link>
              <Link
                href={`/evaluations/new?dataset=${dataset.id}`}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg mx-2 transition-all"
                onClick={onCloseMenu}
              >
                <span className="material-symbols-outlined text-lg">science</span>
                Run Evaluation
              </Link>
              <div
                className="relative"
                onMouseEnter={() => setShowExportTooltip(true)}
                onMouseLeave={() => setShowExportTooltip(false)}
              >
                <button
                  disabled
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-400 cursor-not-allowed rounded-lg mx-2 w-full text-left"
                >
                  <span className="material-symbols-outlined text-lg">lock</span>
                  Export
                </button>
                {showExportTooltip && (
                  <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-3 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg whitespace-nowrap z-10 shadow-lg">
                    Upgrade your membership
                    <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                  </div>
                )}
              </div>
              <div className="border-t border-slate-100 my-2 mx-2"></div>
              <button
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg mx-2 transition-all w-full text-left"
                onClick={() => onDelete(dataset)}
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
});

export default function DatasetsPage() {
  const { datasets: apiDatasets, isLoading, error, refetch } = useDatasets();
  const { deleteDataset, isDeleting } = useDeleteDataset();
  const { quota } = useUsageQuota();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Delete confirmation modal state
  const [deletingDataset, setDeletingDataset] = useState<UiDataset | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
        setMenuPosition(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Map API datasets to UI datasets
  const datasets = useMemo(() => {
    return apiDatasets.map(mapApiDatasetToUiDataset);
  }, [apiDatasets]);

  // Open delete confirmation for a dataset
  const openDeleteConfirm = useCallback((dataset: UiDataset) => {
    setDeletingDataset(dataset);
    setOpenMenuId(null);
    setMenuPosition(null);
  }, []);

  // Toggle context menu for a row
  const handleToggleMenu = useCallback((datasetId: string, rect: DOMRect) => {
    setOpenMenuId((prev) => {
      if (prev === datasetId) {
        setMenuPosition(null);
        return null;
      }
      setMenuPosition({
        top: rect.bottom + 8,
        left: rect.right - 208,
      });
      return datasetId;
    });
  }, []);

  // Close context menu
  const handleCloseMenu = useCallback(() => {
    setOpenMenuId(null);
    setMenuPosition(null);
  }, []);

  // Handle delete dataset
  const handleDelete = async () => {
    if (!deletingDataset) return;
    const success = await deleteDataset(deletingDataset.id);
    if (success) {
      setDeletingDataset(null);
      refetch();
    }
  };

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
  }, [datasets, searchQuery, typeFilter]);

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

      {quota && (
        <UsageQuotaBanner
          used={quota.datasets_used}
          limit={quota.datasets_limit}
          resourceName="datasets"
          periodEnd={quota.period_end}
        />
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

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-red-500">error</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Failed to load datasets</p>
            <p className="text-sm text-red-600">{error.message}</p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
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
              {isLoading ? (
                // Loading skeletons
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : filteredDatasets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      {datasets.length === 0 ? (
                        // Empty state - no datasets at all
                        <>
                          <span className="material-symbols-outlined text-4xl text-slate-300">
                            folder_open
                          </span>
                          <p className="text-slate-500 text-sm">No datasets yet</p>
                          <p className="text-slate-400 text-xs">
                            Create your first dataset to get started
                          </p>
                          <Link
                            href="/datasets/new"
                            className="mt-2 flex items-center gap-2 bg-[#135bec] hover:bg-[#135bec]/90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all"
                          >
                            <span className="material-symbols-outlined text-lg">add</span>
                            Create Dataset
                          </Link>
                        </>
                      ) : (
                        // No results for current filter
                        <>
                          <span className="material-symbols-outlined text-4xl text-slate-300">
                            search_off
                          </span>
                          <p className="text-slate-500 text-sm">No datasets found</p>
                          <p className="text-slate-400 text-xs">
                            Try adjusting your search or filter criteria
                          </p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDatasets.map((dataset) => (
                  <DatasetRow
                    key={dataset.id}
                    dataset={dataset}
                    openMenuId={openMenuId}
                    menuPosition={menuPosition}
                    menuRef={menuRef}
                    onToggleMenu={handleToggleMenu}
                    onCloseMenu={handleCloseMenu}
                    onDelete={openDeleteConfirm}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Summary */}
      {!isLoading && filteredDatasets.length > 0 && (
        <div className="text-sm text-slate-500">
          Showing {filteredDatasets.length} of {datasets.length} datasets
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingDataset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !isDeleting && setDeletingDataset(null)}
          />
          <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-red-600 text-2xl">warning</span>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900">Delete Dataset</h3>
              <p className="text-sm text-slate-600 mt-2">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-slate-900">{deletingDataset.name}</span>? This
                action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 w-full pt-2">
              <button
                onClick={() => setDeletingDataset(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">
                      progress_activity
                    </span>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
