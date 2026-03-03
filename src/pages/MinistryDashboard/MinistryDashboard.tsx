import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ministriesService } from "../../services/ministries.service";
import { scalesService } from "../../services/scales.service";
import { membersService } from "../../services/members.service";
import { ScaleCard } from "../../components/ScaleCard";
import { MemberCard } from "../../components/MemberCard";
import { Stat } from "./Stat";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { InviteCodeSection } from "./InviteCodeSection";

export function MinistryDashboard() {
  const { id } = useParams();

  const ministryId = useMemo(() => {
    const parsed = Number(id);
    return Number.isNaN(parsed) ? null : parsed;
  }, [id]);

  const {
    data: ministry,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["ministry", ministryId],
    queryFn: () => ministriesService.findDetails(ministryId!),
    enabled: ministryId !== null,
  });

  const { data: scales, isLoading: scalesLoading } = useQuery({
    queryKey: ["scales", ministryId],
    queryFn: () => scalesService.listByMinistry(ministryId!),
    enabled: ministryId !== null,
  });

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["members", ministryId],
    queryFn: () => membersService.listByMinistry(ministryId!),
    enabled: ministryId !== null,
  });

  if (!ministryId) {
    return (
      <CenteredMessage
        title="Ministério inválido"
        description="Verifique o link e tente novamente."
      />
    );
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !ministry) {
    return (
      <CenteredMessage
        title="Erro ao carregar dados"
        description="Ocorreu um problema ao buscar informações."
        action={
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
          >
            Tentar novamente
          </button>
        }
      />
    );
  }

  return (
    <div className="min-h-full bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-slate-800">{ministry.name}</h1>

          <Link
            to="/ministries"
            className="self-start sm:self-auto rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
          >
            Voltar
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6 items-start">
          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {ministry.avatarUrl ? (
                <img
                  src={ministry.avatarUrl}
                  alt={`Imagem do ministério ${ministry.name}`}
                  className="w-full aspect-video object-cover"
                />
              ) : (
                <div className="w-full aspect-video bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
                  Sem imagem
                </div>
              )}

              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">
                    {ministry.name}
                  </p>

                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full border ${
                      ministry.role === "ADMIN"
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                        : "bg-slate-100 border-slate-200 text-slate-600"
                    }`}
                  >
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

                {ministry.role === "ADMIN" && (
                  <InviteCodeSection
                    ministryId={ministryId}
                    initialCode={ministry.inviteCode}
                  />
                )}
              </div>
            </div>
          </aside>

          {/* Feed */}
          <main className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  Feed de Escalas
                </h2>
                <p className="text-xs text-slate-500">Próximos eventos</p>
              </div>

              {ministry.role === "ADMIN" && (
                <Link
                  to={`/ministries/${ministryId}/scales/create`}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-indigo-700 transition"
                >
                  Criar escala
                </Link>
              )}
            </div>

            {scalesLoading ? (
              <div className="p-6 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 rounded-lg bg-slate-100 animate-pulse"
                  />
                ))}
              </div>
            ) : !scales || scales.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                Nenhuma escala cadastrada.
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {scales.map((scale) => (
                  <ScaleCard
                    key={scale.id}
                    name={scale.name}
                    description={scale.description || "Escala sem descrição"}
                    date={scale.date}
                  />
                ))}
              </div>
            )}
          </main>

          <aside className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-800">Membros</h2>
            </div>

            <div className="p-4 space-y-4 max-h-125 overflow-y-auto">
              {membersLoading ? (
                [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-lg bg-slate-100 animate-pulse"
                  />
                ))
              ) : !members || members.length === 0 ? (
                <p className="text-xs text-slate-500 text-center">
                  Nenhum membro encontrado.
                </p>
              ) : (
                members.map((member) => (
                  <MemberCard
                    key={member.id}
                    username={member.user.username}
                    email={member.user.email}
                    role={member.role}
                    functions={member.functions}
                  />
                ))
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function CenteredMessage({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      <p className="text-sm text-slate-500 mt-2">{description}</p>
      {action}
    </div>
  );
}
