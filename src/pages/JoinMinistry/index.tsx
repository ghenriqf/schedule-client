import { useJoinMinistry } from "./hooks/useJoinMinistry";

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

const IconCheck = () => (
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
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconSpinner = () => (
  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    />
  </svg>
);

export function JoinMinistry() {
  const ctx = useJoinMinistry();

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-linear-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white shrink-0">
                <IconNote />
              </div>
              <span className="text-sm font-bold text-slate-800 hidden sm:inline tracking-tight">
                Schedule
              </span>
            </div>
            <span className="text-slate-200 hidden sm:inline">|</span>
            <button
              onClick={ctx.navigateToMinistries}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              <IconArrowLeft />
              <span className="hidden sm:inline">Ministérios</span>
            </button>
          </div>
          <p className="text-sm font-semibold text-slate-700">
            Entrar com código
          </p>
          <div className="w-24 hidden sm:block" />
        </div>
      </header>

      {/* flex-1 garante que ocupa o resto da tela após o header */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {ctx.submitted ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 w-full max-w-md text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-500">
              <IconCheck />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-800">Você entrou!</h2>
              <p className="text-sm text-slate-400">
                Bem-vindo ao ministério. Você já pode ver as escalas e
                participar.
              </p>
            </div>
            <button
              onClick={ctx.navigateToMinistries}
              className="w-full py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
            >
              Ver ministérios
            </button>
          </div>
        ) : (
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold text-slate-800">
                Entrar em um ministério
              </h1>
              <p className="text-sm text-slate-400">
                Informe o código de convite compartilhado pelo administrador.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (ctx.canSubmit) ctx.mutate();
                }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Código de convite
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: e722efaa-3691-4ec7-84a8-f4..."
                    value={ctx.inviteCode}
                    onChange={(e) =>
                      ctx.setInviteCode(e.target.value)
                    }
                    autoFocus
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono text-slate-900 placeholder:text-slate-400 placeholder:font-sans tracking-wider focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:bg-white transition"
                  />
                  <p className="text-xs text-slate-400">
                    O código é fornecido pelo administrador do ministério.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={!ctx.canSubmit}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {ctx.isPending ? (
                    <>
                      <IconSpinner /> Entrando…
                    </>
                  ) : (
                    "Entrar no ministério"
                  )}
                </button>
              </form>
            </div>

            <p className="text-center text-xs text-slate-400">
              Quer criar seu próprio ministério?{" "}
              <button
                onClick={ctx.navigateToCreate}
                className="text-violet-600 font-semibold hover:underline"
              >
                Criar agora
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
