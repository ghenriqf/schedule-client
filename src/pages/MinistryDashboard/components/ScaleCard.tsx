import { useNavigate } from "react-router-dom";

interface Props {
  id: number;
  name: string;
  description?: string | null;
  date: string;
  ministryId?: number;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

export function ScaleCard({ id, name, description, date, ministryId }: Props) {
  const navigate = useNavigate();

  return (
    <div className="group flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/40 transition-all">
      <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-base shrink-0">
        🎵
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{name}</p>
        <p className="text-xs text-slate-400 truncate">
          {description || "Sem descrição"}
        </p>
        <p className="text-[11px] text-violet-500 font-medium mt-1 capitalize">
          {formatDate(date)}
        </p>
      </div>

      {ministryId && (
        <button
          onClick={() => navigate(`/ministries/${ministryId}/scales/${id}`)}
          className="self-center shrink-0 text-xs font-semibold text-slate-400 hover:text-violet-600 border border-slate-200 hover:border-violet-300 hover:bg-violet-50 px-3 py-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
        >
          Ver detalhes →
        </button>
      )}
    </div>
  );
}
