import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ministriesService } from "../services/ministries.service";

export function MinistryDashboardPage() {
  const { id } = useParams();

  const ministryId = useMemo(() => {
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : null;
  }, [id]);

  const {
    data: ministry,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ministry", ministryId],
    queryFn: () => ministriesService.findDetails(ministryId!),
    enabled: ministryId !== null,
  });

  const ministryImageUrl = ministry?.avatarUrl;
  if (ministryId === null) {
    return (
      <div className="p-8 text-center text-red-500">Ministério inválido.</div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Carregando ministério...
      </div>
    );
  }

  if (isError || !ministry) {
    return (
      <div className="p-8 text-center text-red-500">
        Erro ao carregar ministério.
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="min-w-0">
            <h1 className="mt-1 text-xl sm:text-2xl font-bold text-slate-800 truncate">
              {ministry.name}
            </h1>
          </div>
          <Link
            to="/ministries"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Voltar
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6 items-start">
          <aside className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="aspect-16/10 bg-slate-100">
                <img
                  src={ministryImageUrl || ""}
                  alt="Foto do ministério"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {ministry.name}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-3">
                      {ministry.description || "Sem descrição."}
                    </p>
                  </div>
                  <span className="shrink-0 inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
                    {ministry.role === "ADMIN" ? "Admin" : "Membro"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Stat
                    label="Membros"
                    value={ministry.ministryStats?.memberCount ?? 0}
                  />
                  <Stat
                    label="Escalas"
                    value={ministry.ministryStats?.upcomingScalesCount ?? 0}
                  />
                  <Stat
                    label="Repertório"
                    value={ministry.ministryStats?.repertoryCount ?? 0}
                  />
                </div>
              </div>
            </div>
          </aside>

          <main className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="px-4 sm:px-5 py-3 border-b border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Feed</h2>
                  <p className="text-xs text-slate-500">
                    Aqui vão aparecer as escalas do ministério.
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
                >
                  Criar nova escala
                </button>
              </div>

              <div className="p-4 sm:p-6">
                <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 text-center text-xs text-slate-500">
                  Nenhuma escala cadastrada ainda. Quando você criar escalas,
                  elas aparecerão aqui no formato de feed.
                </div>
              </div>
            </div>
          </main>

          <aside className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="px-4 sm:px-5 py-3 border-b border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Membros
                  </h2>
                  <p className="text-xs text-slate-500">
                    {ministry.ministryStats?.memberCount ?? 0} participante(s)
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Convidar
                </button>
              </div>

              <div className="p-4 sm:p-5">
                {ministry.members && ministry.members.length > 0 ? (
                  <ul className="space-y-3">
                    {ministry.members.map((member) => (
                      <li key={member.id} className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                          {member.avatarUrl ? (
                            <img
                              src={member.avatarUrl}
                              alt={`Foto de ${member.name}`}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {member.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {member.role === "ADMIN"
                              ? "Admin"
                              : member.role || "Membro"}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 text-center text-xs text-slate-500">
                    Nenhum membro listado ainda. Quando o backend devolver a
                    lista de membros, ela aparece aqui.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="px-4 sm:px-5 py-3 border-b border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Repertório
                  </h2>
                  <p className="text-xs text-slate-500">
                    {ministry.ministryStats?.repertoryCount ?? 0} música(s)
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Adicionar música
                </button>
              </div>

              <div className="p-4 sm:p-5">
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/80 p-4 text-center text-xs text-slate-500">
                  Nenhuma música cadastrada no repertório ainda. Quando o
                  backend devolver as músicas, elas aparecem aqui.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-center">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
