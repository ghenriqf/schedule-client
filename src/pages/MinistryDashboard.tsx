import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ministriesService } from "../services/ministries.service";

export function MinistryDashboard() {
  const { id } = useParams();
  const ministryId = useMemo(() => Number(id) || null, [id]);

  const {
    data: ministry,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ministry", ministryId],
    queryFn: () => ministriesService.findDetails(ministryId!),
    enabled: !!ministryId,
  });

  if (!ministryId)
    return (
      <div className="p-8 text-center text-red-500">Ministério inválido.</div>
    );
  if (isLoading)
    return <div className="p-8 text-center text-slate-500">Carregando...</div>;
  if (isError || !ministry)
    return (
      <div className="p-8 text-center text-red-500">
        Erro ao carregar dados.
      </div>
    );

  return (
    <div className="min-h-full bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-slate-800">{ministry.name}</h1>
          <Link
            to="/ministries"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Voltar
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6 items-start">
          <aside className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <img
                src={ministry.avatarUrl || ""}
                alt="Ministério"
                className="w-full aspect-video object-cover bg-slate-100"
              />
              <div className="p-4 space-y-4">
                <div>
                  <p className="font-semibold text-slate-900 pb-1 flex items-center gap-6">
                    {ministry.name}
                    <span className="shrink-0 inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
                      {ministry.role === "ADMIN" ? "Admin" : "Membro"}
                    </span>
                  </p>
                  <p className="text-xs text-slate-500">
                    {ministry.description || "Sem descrição."}
                  </p>
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

                {ministry.role === "ADMIN" && (
                  <InviteCodeSection
                    ministryId={ministryId}
                    initialCode={ministry.inviteCode}
                  />
                )}
              </div>
            </div>
          </aside>

          <main className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-3 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-semibold">Feed</h2>
                <p className="text-xs text-slate-500">Escalas do ministério.</p>
              </div>
              {ministry.role === "ADMIN" && (
                <Link
                  to={`/ministries/${ministryId}/scales/create`}
                  className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-xs hover:bg-indigo-700"
                >
                  Criar escala
                </Link>
              )}
            </div>
            <div className="p-6 text-center text-xs text-slate-500">
              Nenhuma escala cadastrada.
            </div>
          </main>

          <aside className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-3 border-b border-slate-200">
              <h2 className="text-sm font-semibold">Membros</h2>
            </div>
            <div className="p-4 space-y-3">
              {ministry.members?.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      {m.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2 text-center">
      <p className="text-[10px] text-slate-500 uppercase">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function InviteCodeSection({
  ministryId,
  initialCode,
}: {
  ministryId: number;
  initialCode?: string | null;
}) {
  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const newCode = await ministriesService.generateInviteCode(ministryId);
      setCode(newCode);
    } catch {
      alert("Erro ao gerar código.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-4 border-t border-slate-100 space-y-2">
      <p className="text-[10px] font-bold text-indigo-700 uppercase text-center">
        Código de Convite
      </p>
      {code ? (
        <div className="space-y-1">
          <code className="block text-sm font-mono text-slate-800 bg-white border border-indigo-100 rounded-md p-2  select-all text-center shadow-sm">
            {code}
          </code>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full text-[10px] text-indigo-600 hover:underline"
          >
            {loading ? "Gerando..." : "Gerar novo"}
          </button>
        </div>
      ) : (
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-2 rounded-lg text-xs font-semibold hover:bg-indigo-700"
        >
          {loading ? "Gerando..." : "Gerar código"}
        </button>
      )}
    </div>
  );
}
