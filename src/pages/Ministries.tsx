import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ministryApi } from '@/features/ministry'
import { MinistryCard } from '@/features/ministry'
import type { MinistryDetailResponse } from "@/entities/ministry/model/types";

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconPlus = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const IconHash = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" />
  </svg>
);

const IconSearch = () => (
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
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const IconRefresh = () => (
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
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function MinistryCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-36 bg-slate-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 bg-slate-100 rounded-lg" />
        <div className="h-3 w-full bg-slate-100 rounded-lg" />
        <div className="h-3 w-2/3 bg-slate-100 rounded-lg" />
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-xl" />
          ))}
        </div>
        <div className="h-8 bg-slate-100 rounded-xl mt-1" />
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center text-3xl">
        🎸
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700">
          Nenhum ministério encontrado
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Crie um novo ou entre com um código de convite.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          to="/ministries/create"
          className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white text-xs font-semibold rounded-xl hover:bg-violet-700 transition-colors"
        >
          <IconPlus /> Criar ministério
        </Link>
        <Link
          to="/ministries/join"
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
        >
          <IconHash /> Entrar com código
        </Link>
      </div>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-3xl">
        ⚠️
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700">
          Erro ao carregar ministérios
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Verifique sua conexão e tente novamente.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
      >
        <IconRefresh /> Tentar novamente
      </button>
    </div>
  );
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────

type FilterTab = "all" | "ADMIN" | "MEMBER";

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
        active
          ? "bg-violet-600 text-white"
          : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function Ministries() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");

  const {
    data: ministries,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["ministries"],
    queryFn: () => ministryApi.list(),
  });

  const filtered: MinistryDetailResponse[] = (ministries ?? []).filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || m.role === filter;
    return matchesSearch && matchesFilter;
  });

  const adminCount = (ministries ?? []).filter(
    (m) => m.role === "ADMIN",
  ).length;
  const memberCount = (ministries ?? []).filter(
    (m) => m.role === "MEMBER",
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                Meus Ministérios
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {isLoading
                  ? "Carregando…"
                  : ministries
                    ? `${ministries.length} ministério${ministries.length !== 1 ? "s" : ""} encontrado${ministries.length !== 1 ? "s" : ""}`
                    : ""}
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                to="/ministries/join"
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                <IconHash /> Entrar com código
              </Link>
              <Link
                to="/ministries/create"
                className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white text-xs font-semibold rounded-xl hover:bg-violet-700 transition-colors"
              >
                <IconPlus /> Criar ministério
              </Link>
            </div>
          </div>

          {/* Search + filter bar */}
          {!isLoading && !isError && (ministries?.length ?? 0) > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <div className="relative flex-1 max-w-sm">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <IconSearch />
                </span>
                <input
                  type="text"
                  placeholder="Buscar ministério…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:bg-white transition"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <TabButton
                  active={filter === "all"}
                  onClick={() => setFilter("all")}
                >
                  Todos ({ministries?.length ?? 0})
                </TabButton>
                <TabButton
                  active={filter === "ADMIN"}
                  onClick={() => setFilter("ADMIN")}
                >
                  Admin ({adminCount})
                </TabButton>
                <TabButton
                  active={filter === "MEMBER"}
                  onClick={() => setFilter("MEMBER")}
                >
                  Membro ({memberCount})
                </TabButton>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-7">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {isLoading && (
            <>
              {[0, 1, 2].map((i) => (
                <MinistryCardSkeleton key={i} />
              ))}
            </>
          )}

          {isError && <ErrorState onRetry={refetch} />}

          {!isLoading &&
            !isError &&
            filtered.length === 0 &&
            (search || filter !== "all" ? (
              <div className="col-span-full flex flex-col items-center gap-2 py-16 text-center">
                <span className="text-3xl opacity-30">🔍</span>
                <p className="text-sm text-slate-500">
                  Nenhum resultado para "<strong>{search}</strong>"
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="text-xs text-violet-600 hover:underline mt-1"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <EmptyState />
            ))}

          {!isLoading &&
            !isError &&
            filtered.map((ministry) => (
              <MinistryCard key={ministry.id} ministry={ministry} />
            ))}
        </div>
      </main>
    </div>
  );
}
