import { useState } from 'react'
import type { MusicResponse, MusicRequest } from '@/entities/music/model/types'

const TONES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B','Cm','C#m','Dm','D#m','Em','Fm','F#m','Gm','G#m','Am','A#m','Bm']
const EMPTY_FORM: MusicRequest = { title: '', artist: '', tone: '', videoLink: '', chordSheetLink: '' }

const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

const IconSpinner = () => (
  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
)

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (data: MusicRequest) => void
  isPending: boolean
  initial?: MusicResponse | null
}

export function MusicFormModal({ open, onClose, onSubmit, isPending, initial }: Props) {
  const [form, setForm] = useState<MusicRequest>(
    initial
      ? { title: initial.title, artist: initial.artist, tone: initial.tone, videoLink: initial.videoLink ?? '', chordSheetLink: initial.chordSheetLink ?? '' }
      : EMPTY_FORM
  )

  if (!open) return null

  const canSubmit = form.title.trim().length > 0 && form.artist.trim().length > 0 && form.tone.length > 0 && !isPending

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({ ...form, title: form.title.trim(), artist: form.artist.trim(), videoLink: form.videoLink?.trim() || undefined, chordSheetLink: form.chordSheetLink?.trim() || undefined })
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-800">{initial ? 'Editar música' : 'Nova música'}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{initial ? 'Atualize as informações da música.' : 'Adicione uma nova música ao repertório.'}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <IconX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Título *</label>
              <input type="text" placeholder="Nome da música" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} maxLength={100} autoFocus
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Artista *</label>
              <input type="text" placeholder="Nome do artista" value={form.artist} onChange={(e) => setForm((f) => ({ ...f, artist: e.target.value }))} maxLength={100}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Tom *</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button key={t} type="button" onClick={() => setForm((f) => ({ ...f, tone: t }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${form.tone === t ? 'bg-violet-600 border-violet-600 text-white' : 'border-slate-200 text-slate-600 hover:border-violet-300 hover:bg-violet-50'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Link do vídeo</label>
            <input type="url" placeholder="https://youtube.com/..." value={form.videoLink ?? ''} onChange={(e) => setForm((f) => ({ ...f, videoLink: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition" />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Link da cifra</label>
            <input type="url" placeholder="https://cifraclub.com/..." value={form.chordSheetLink ?? ''} onChange={(e) => setForm((f) => ({ ...f, chordSheetLink: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition" />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={!canSubmit}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              {isPending ? <><IconSpinner /> Salvando…</> : <><IconCheck /> {initial ? 'Salvar alterações' : 'Adicionar música'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}