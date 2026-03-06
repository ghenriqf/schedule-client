interface StatProps {
  label: string;
  value: number;
  icon: string;
}

export function Stat({ label, value, icon }: StatProps) {
  return (
    <div className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl bg-slate-50 border border-slate-100">
      <span>{icon}</span>

      <span className="text-lg font-bold text-slate-800">{value}</span>

      <span className="text-[10px] text-slate-400 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}
