import type { MusicResponse } from '@/entities/music/model/types'

const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4h6v2" />
  </svg>
)

const IconSpinner = () => (
  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
)

interface Props {
  music: MusicResponse | null
  onConfirm: () => void
  onCancel: () => void
  isPending: boolean
}

export function DeleteConfirmModal({ music, onConfirm, onCancel, isPending }: Props) {
  if (!music) return null
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-500 text-xl">
          <IconTrash />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-sm font-bold text-slate-800">Remover música</h2>
          <p className="text-xs text-slate-400">
            Tem certeza que deseja remover <span className="font-semibold text-slate-600">"{music.title}"</span> do repertório? Esta ação não pode ser desfeita.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition-colors">
            {isPending ? <IconSpinner /> : 'Remover'}
          </button>
        </div>
      </div>
    </div>
  )
}