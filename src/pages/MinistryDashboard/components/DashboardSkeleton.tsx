export function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-6 animate-pulse">
      <div className="h-7 w-40 bg-slate-200 rounded" />

      <div className="grid grid-cols-3 gap-4">
        <div className="h-64 bg-slate-200 rounded-xl" />
        <div className="h-64 bg-slate-200 rounded-xl" />
        <div className="h-64 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}
