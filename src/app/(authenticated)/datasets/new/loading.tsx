export default function NewDatasetLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
      <div>
        <div className="h-8 w-56 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-72 bg-gray-200 rounded animate-pulse mt-2" />
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gray-200 rounded-lg" />
            <div>
              <div className="h-5 w-36 bg-gray-200 rounded" />
              <div className="h-3 w-48 bg-gray-200 rounded mt-1.5" />
            </div>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="h-4 w-28 bg-gray-200 rounded mb-2" />
              <div className="h-10 w-full bg-gray-200 rounded-lg" />
            </div>
          ))}
          <div className="h-32 w-full bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
