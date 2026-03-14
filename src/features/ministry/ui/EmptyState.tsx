interface Props {
  icon: string;
  message: string;
}

export function EmptyState({ icon, message }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 py-10">
      <span className="text-3xl opacity-30">{icon}</span>
      <p className="text-xs text-slate-400">{message}</p>
    </div>
  );
}
