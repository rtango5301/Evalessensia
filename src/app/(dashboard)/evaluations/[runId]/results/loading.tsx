import { Skeleton } from '@/components/ui/skeleton';

function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-10 w-20 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <Skeleton className="h-4 w-64" />

      {/* Title row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      {/* Meta info */}
      <div className="flex gap-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-36" />
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-48" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      {/* Chart area */}
      <div className="flex items-center justify-center h-[300px]">
        <Skeleton className="h-64 w-64 rounded-full" />
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[var(--border)]">
      {/* Header */}
      <div className="p-6 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-64 rounded-lg" />
            <Skeleton className="h-9 w-32 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-6 gap-4 px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Table rows */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-[var(--border)] last:border-b-0"
        >
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-full max-w-[200px]" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}

      {/* Pagination */}
      <div className="p-4 flex items-center justify-between border-t border-[var(--border)]">
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="space-y-6">
        {/* Header skeleton */}
        <HeaderSkeleton />

        {/* Metric cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>

        {/* Chart skeleton */}
        <ChartSkeleton />

        {/* Table skeleton */}
        <TableSkeleton />
      </div>
    </div>
  );
}
