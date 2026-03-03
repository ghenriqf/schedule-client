import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";

interface ScaleCardProps {
  id: number;
  ministryId: number;
  name: string;
  description: string;
  date: string;
}

export function ScaleCard({
  id,
  ministryId,
  name,
  description,
  date,
}: ScaleCardProps) {
  const formattedDate = format(new Date(date), "dd 'de' MMM, HH:mm", {
    locale: ptBR,
  });

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-base font-semibold text-slate-900 leading-snug">
          {name}
        </h3>

        <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full whitespace-nowrap">
          {formattedDate}
        </span>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
        {description || "Sem descrição disponível."}
      </p>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <Link
          to={`/ministries/${ministryId}/scales/${id}`}
          className="block w-full text-center py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-colors"
        >
          Ver detalhes
        </Link>
      </div>
    </div>
  );
}
