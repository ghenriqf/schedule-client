import { Link } from "react-router-dom";
import { MinistryCard } from "@/features/ministry";
import { useMinistries } from "./hooks/useMinistries";
import { MinistryCardSkeleton } from "./components/MinistryCardSkeleton";

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

export function Ministries() {
  const ministries = useMinistries();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                Meus Ministérios
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {ministries.isLoading
                  ? "Carregando…"
                  : ministries.ministries
                    ? `${ministries.ministries.length} ministério${ministries.ministries.length !== 1 ? "s" : ""} encontrado${ministries.ministries.length !== 1 ? "s" : ""}`
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

          {!ministries.isLoading &&
            !ministries.isError &&
            (ministries.ministries?.length ?? 0) > 0 && (
              <div className="mt-4 max-w-sm">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <IconSearch />
                  </span>
                  <input
                    type="text"
                    placeholder="Buscar ministério…"
                    value={ministries.search}
                    onChange={(e) => ministries.setSearch(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:bg-white transition"
                  />
                </div>
              </div>
            )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-7">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {ministries.isLoading &&
            [0, 1, 2].map((i) => <MinistryCardSkeleton key={i} />)}

          {ministries.isError && <ErrorState onRetry={ministries.refetch} />}

          {!ministries.isLoading &&
            !ministries.isError &&
            ministries.filtered.length === 0 &&
            (ministries.search ? (
              <div className="col-span-full flex flex-col items-center gap-2 py-16 text-center">
                <span className="text-3xl opacity-30">🔍</span>
                <p className="text-sm text-slate-500">
                  Nenhum resultado para "<strong>{ministries.search}</strong>"
                </p>
                <button
                  onClick={() => ministries.setSearch("")}
                  className="text-xs text-violet-600 hover:underline mt-1"
                >
                  Limpar busca
                </button>
              </div>
            ) : (
              <EmptyState />
            ))}

          {!ministries.isLoading &&
            !ministries.isError &&
            ministries.filtered.map((ministry) => (
              <MinistryCard key={ministry.id} ministry={ministry} />
            ))}
        </div>
      </main>
    </div>
  );
}
