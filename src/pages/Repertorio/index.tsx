import { useRepertorio } from './hooks/useRepertorio'
import { MusicFormModal } from './components/MusicFormModal'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
import { MusicRow } from './components/MusicRow'

const IconArrowLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
)

const IconNote = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
)

const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
)

const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
)

function RepertorioSkeleton() {
  return (
    <div className="space-y-2 animate-pulse p-4">
      {[...Array(6)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-slate-100" />)}
    </div>
  )
}

export function Repertorio() {
  const repertorio = useRepertorio()

  return (
    <>
      <div className="min-h-screen bg-slate-50 font-sans">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-slate-100 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-7 h-7 rounded-lg bg-linear-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white shrink-0">
                  <IconNote />
                </div>
                <span className="text-sm font-bold text-slate-800 hidden sm:inline tracking-tight">Schedule</span>
              </div>
              <span className="text-slate-200 hidden sm:inline">|</span>
              <button onClick={repertorio.navigateToMinistry} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
                <IconArrowLeft />
                <span className="hidden sm:inline truncate max-w-30">{repertorio.ministry?.name ?? 'Ministério'}</span>
              </button>
            </div>
            <p className="text-sm font-semibold text-slate-700">Repertório</p>
            <div className="shrink-0">
              {repertorio.isAdmin && (
                <button onClick={repertorio.openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white text-xs font-semibold rounded-xl hover:bg-violet-700 transition-colors">
                  <IconPlus /> Nova música
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><IconSearch /></span>
              <input type="text" placeholder="Buscar por título ou artista…" value={repertorio.search}
                onChange={(e) => repertorio.setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition" />
            </div>
            <p className="text-xs text-slate-400 shrink-0">
              {repertorio.filteredList.length} música{repertorio.filteredList.length !== 1 ? 's' : ''} no repertório
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {repertorio.isLoading ? (
              <RepertorioSkeleton />
            ) : repertorio.isError ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <span className="text-3xl">⚠️</span>
                <p className="text-sm text-slate-500">Erro ao carregar repertório.</p>
              </div>
            ) : repertorio.filteredList.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <span className="text-4xl opacity-25">🎵</span>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {repertorio.search ? `Nenhuma música encontrada para "${repertorio.search}"` : 'Repertório vazio'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {repertorio.search ? (
                      <button onClick={() => repertorio.setSearch('')} className="text-violet-600 hover:underline">Limpar busca</button>
                    ) : repertorio.isAdmin ? (
                      'Adicione a primeira música ao repertório.'
                    ) : (
                      'Nenhuma música cadastrada ainda.'
                    )}
                  </p>
                </div>
                {!repertorio.search && repertorio.isAdmin && (
                  <button onClick={repertorio.openCreate} className="flex items-center gap-1.5 mt-1 px-4 py-2 bg-violet-600 text-white text-xs font-semibold rounded-xl hover:bg-violet-700 transition-colors">
                    <IconPlus /> Adicionar música
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-50 p-2">
                {repertorio.filteredList.map((music) => (
                  <MusicRow key={music.id} music={music} isAdmin={repertorio.isAdmin}
                    onEdit={repertorio.openEdit} onDelete={repertorio.setDeleteTarget} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <MusicFormModal open={repertorio.formOpen} onClose={repertorio.closeForm}
        onSubmit={repertorio.submitForm} isPending={repertorio.isFormPending} initial={repertorio.editTarget} />

      <DeleteConfirmModal music={repertorio.deleteTarget} onConfirm={repertorio.confirmDelete}
        onCancel={() => repertorio.setDeleteTarget(null)} isPending={repertorio.isDeletePending} />
    </>
  )
}