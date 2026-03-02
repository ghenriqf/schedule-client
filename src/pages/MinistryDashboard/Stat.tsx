export function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 text-center">
      <p className="text-[10px] text-slate-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-base font-semibold text-slate-900 mt-1">{value}</p>
    </div>
  );
}
