export default function EvaluationDetailLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-4 w-32 bg-gray-200 rounded" />
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="h-8 w-64 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-48 bg-gray-200 rounded" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 h-64" />
        <div className="bg-white rounded-xl border border-slate-200 p-6 h-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
