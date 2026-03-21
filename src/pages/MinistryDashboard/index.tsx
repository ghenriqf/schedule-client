import { useMinistryDashboard } from "./hooks/useMinistryDashboard";
import { Stat } from "@/features/ministry/ui/Stat";
import { InviteCodeSection } from "@/features/ministry/ui/InviteCodeSection";
import { ScaleCard } from "@/features/ministry/ui/ScaleCard";
import { MemberCard } from "@/features/ministry/ui/MemberCard";
import { EmptyState } from "@/features/ministry/ui/EmptyState";
import { DashboardSkeleton } from "@/features/ministry/ui/DashboardSkeleton";

const IconArrowLeft = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const IconNote = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

const IconMusic = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const IconChevronRight = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
      <span className="text-4xl">⚠️</span>
      <div>
        <p className="text-sm font-semibold text-slate-700">
          Erro ao carregar ministério
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Verifique sua conexão e tente novamente.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  );
}

function InvalidState() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 max-w-sm w-full text-center space-y-3">
        <span className="text-4xl">⚠️</span>
        <h2 className="text-base font-bold text-slate-800">
          Ministério inválido
        </h2>
        <p className="text-sm text-slate-400">
          Verifique o link e tente novamente.
        </p>
      </div>
    </div>
  );
}

export function MinistryDashboard() {
  const dashboard = useMinistryDashboard();

  if (dashboard.ministryId === null) return <InvalidState />;
  if (dashboard.isLoading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-liear-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white shrink-0">
                <IconNote />
              </div>
              <span className="text-sm font-bold text-slate-800 hidden sm:inline tracking-tight">
                Schedule
              </span>
            </div>
            <span className="text-slate-200 hidden sm:inline">|</span>
            <button
              onClick={dashboard.navigateToMinistries}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              <IconArrowLeft />
              <span className="hidden sm:inline">Ministérios</span>
            </button>
          </div>

          {dashboard.ministry && (
            <p className="text-sm font-semibold text-slate-700 truncate max-w-50 sm:max-w-xs">
              {dashboard.ministry.name}
            </p>
          )}

          {dashboard.ministry && (
            <span
              className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${dashboard.ministry.role === "ADMIN" ? "bg-violet-50 border-violet-200 text-violet-700" : "bg-slate-100 border-slate-200 text-slate-500"}`}
            >
              {dashboard.ministry.role === "ADMIN" ? "Admin" : "Membro"}
            </span>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
        {dashboard.isError || !dashboard.ministry ? (
          <ErrorState onRetry={dashboard.refetch} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_300px] gap-5 items-start">
            {/* Sidebar */}
            <aside className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {dashboard.ministry.avatarUrl ? (
                  <img
                    src={dashboard.ministry.avatarUrl}
                    alt={dashboard.ministry.name}
                    className="w-full aspect-video object-cover"
                  />
                ) : (
                  <div className="w-full aspect-video bg-linear-to-br from-violet-100 via-indigo-50 to-blue-100 flex items-center justify-center text-5xl opacity-30">
                    🎸
                  </div>
                )}
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <Stat
                      label="Membros"
                      value={dashboard.ministry.ministryStats.memberCount}
                      icon="👥"
                    />
                    <Stat
                      label="Escalas"
                      value={
                        dashboard.ministry.ministryStats.upcomingScalesCount
                      }
                      icon="📅"
                    />
                    <Stat
                      label="Músicas"
                      value={dashboard.ministry.ministryStats.repertoryCount}
                      icon="🎵"
                    />
                  </div>
                  {dashboard.ministry.role === "ADMIN" && (
                    <InviteCodeSection
                      ministryId={dashboard.ministry.id}
                      initialCode={dashboard.ministry.inviteCode}
                    />
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <button
                  onClick={dashboard.navigateToRepertoire}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-violet-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-400 group-hover:bg-violet-100 transition-colors">
                      <IconMusic />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-slate-700 group-hover:text-violet-700 transition-colors">
                        Repertório
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {dashboard.ministry.ministryStats.repertoryCount}{" "}
                        músicas cadastradas
                      </p>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-violet-400 transition-colors">
                    <IconChevronRight />
                  </span>
                </button>
              </div>
            </aside>

            {/* Escalas */}
            <main className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">
                    Escalas
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Próximos eventos agendados
                  </p>
                </div>
                {dashboard.ministry.role === "ADMIN" && (
                  <button
                    onClick={dashboard.navigateToCreateScale}
                    className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                  >
                    + Criar escala
                  </button>
                )}
              </div>
              <div className="p-4">
                {dashboard.scales.length === 0 ? (
                  <EmptyState icon="📅" message="Nenhuma escala cadastrada" />
                ) : (
                  <div className="space-y-2">
                    {dashboard.scales.map((scale) => (
                      <ScaleCard
                        key={scale.id}
                        {...scale}
                        ministryId={dashboard.ministryId ?? undefined}
                      />
                    ))}
                  </div>
                )}
              </div>
            </main>

            {/* Membros */}
            <aside className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-800">
                  Membros
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {dashboard.members.length} participantes
                </p>
              </div>
              <div className="p-4 space-y-3 max-h-105 overflow-y-auto">
                {dashboard.members.length === 0 ? (
                  <EmptyState icon="👥" message="Nenhum membro encontrado" />
                ) : (
                  dashboard.members.map((member) => (
                    <MemberCard
                      key={member.id}
                      username={member.user.username}
                      email={member.user.email}
                      role={member.role}
                      functions={member.functions?.map((f) => f.name)}
                    />
                  ))
                )}
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
