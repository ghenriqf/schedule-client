import type { MusicResponse } from '@/entities/music/model/types'

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
  isRemoving: boolean
  onRemove: (id: number) => void
}

export function MusicRow({ music, isAdmin, isRemoving, onRemove }: Props) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
      <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-400 text-base shrink-0">🎵</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800 truncate">{music.title}</p>
        <p className="text-[11px] text-slate-400 truncate">
          {music.artist}
          <span className="mx-1.5 text-slate-300">·</span>
          Tom: <span className="font-medium text-slate-500">{music.tone}</span>
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {music.videoLink && (
          <a href={music.videoLink} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-violet-500 hover:text-violet-700 transition-colors">
            <IconLink /> Vídeo
          </a>
        )}
        {music.chordSheetLink && (
          <a href={music.chordSheetLink} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 transition-colors">
            <IconLink /> Cifra
          </a>
        )}
        {isAdmin && (
          <button onClick={() => onRemove(music.id)} disabled={isRemoving}
            className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[11px] text-red-400 hover:text-red-600 disabled:opacity-40 transition-all">
            <IconTrash /> Remover
          </button>
        )}
      </div>
    </div>
  )
}