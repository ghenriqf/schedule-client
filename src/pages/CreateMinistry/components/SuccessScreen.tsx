const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

interface Props {
  name: string
  onNavigate: () => void
}

export function SuccessScreen({ name, onNavigate }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 max-w-sm w-full text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-500 text-2xl">
          <IconCheck />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Ministério criado!</h2>
        <p className="text-sm text-slate-400">
          <span className="font-semibold text-slate-700">"{name}"</span> foi criado com sucesso. Agora você pode adicionar membros e escalas.
        </p>
        <button
          onClick={onNavigate}
          className="mt-2 w-full py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
        >
          Ver ministérios
        </button>
      </div>
    </div>
  )
}