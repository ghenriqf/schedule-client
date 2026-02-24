import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ministriesService } from "../services/ministries.service";
import { MinistryCard } from "../components/MinistryCard";

export function MinistriesPage() {
  const {
    data: ministries,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ministries"],
    queryFn: () => ministriesService.list(),
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Carregando ministérios...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        Erro ao carregar ministérios.
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Meus Ministérios
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
              Veja os ministérios que você participa e acompanhe suas escalas.
            </p>
            {ministries && ministries.length > 0 && (
              <p className="text-xs font-medium text-slate-400">
                {ministries.length} ministério
                {ministries.length > 1 && "s"} encontrado
                {ministries.length > 1 && "s"}
              </p>
            )}
          </div>

          <Link
            to="/ministries/create"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Criar ministério
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {ministries?.map((ministry) => (
            <MinistryCard key={ministry.id} ministry={ministry} />
          ))}
        </div>

        {ministries?.length === 0 && (
          <div className="mt-10 text-center text-slate-400">
            Você ainda não possui ministérios cadastrados.
          </div>
        )}
      </div>
    </div>
  );
}
