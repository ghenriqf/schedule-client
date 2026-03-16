import type { MusicResponse } from '@/entities/music/model/types'

const IconEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4h6v2" />
  </svg>
)

const IconLink = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)

interface Props {
  music: MusicResponse
  isAdmin: boolean
  onEdit: (m: MusicResponse) => void
  onDelete: (m: MusicResponse) => void
}

export function MusicRow({ music, isAdmin, onEdit, onDelete }: Props) {
  return (
    <div className="group flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
      <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-400 shrink-0">🎵</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800 truncate">{music.title}</p>
        <p className="text-xs text-slate-400 truncate mt-0.5">{music.artist}</p>
      </div>
      <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">{music.tone}</span>
      <div className="flex items-center gap-2 shrink-0">
        {music.videoLink && (
          <a href={music.videoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] text-violet-500 hover:text-violet-700 transition-colors">
            <IconLink /> Vídeo
          </a>
        )}
        {music.chordSheetLink && (
          <a href={music.chordSheetLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 transition-colors">
            <IconLink /> Cifra
          </a>
        )}
      </div>
      {isAdmin && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
          <button onClick={() => onEdit(music)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors">
            <IconEdit />
          </button>
          <button onClick={() => onDelete(music)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
            <IconTrash />
          </button>
        </div>
      )}
    </div>
  )
}