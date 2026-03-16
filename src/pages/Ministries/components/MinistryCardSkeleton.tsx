export function MinistryCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-36 bg-slate-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 bg-slate-100 rounded-lg" />
        <div className="h-3 w-full bg-slate-100 rounded-lg" />
        <div className="h-3 w-2/3 bg-slate-100 rounded-lg" />
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[0, 1, 2].map((i) => <div key={i} className="h-14 bg-slate-100 rounded-xl" />)}
        </div>
        <div className="h-8 bg-slate-100 rounded-xl mt-1" />
      </div>
    </div>
  )
}