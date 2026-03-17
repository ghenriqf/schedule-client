import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import { AddMusicModal } from '@/features/repertoire/ui/AddMusicModal'
import { AddMemberModal } from '@/features/ministry/ui/AddMemberModal'
import { useScaleDetails } from './hooks/useScaleDetails'
import { MemberRow } from './components/MemberRow'
import { MusicRow } from './components/MusicRow'
import type { ScaleMemberResponse } from '@/entities/scale/model/types'
import type { MusicResponse } from '@/entities/music/model/types'

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

const IconEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

function Stat({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-xl bg-slate-50 border border-slate-100">
      <span className="text-lg">{icon}</span>
      <span className="text-lg font-bold text-slate-800 leading-none">{value}</span>
      <span className="text-[10px] text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  )
}

function ScaleDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans animate-pulse">
      <div className="h-14 bg-white border-b border-slate-100" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 space-y-5">
        <div className="h-24 bg-white rounded-2xl border border-slate-100" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="h-64 bg-white rounded-2xl border border-slate-100" />
          <div className="h-64 bg-white rounded-2xl border border-slate-100" />
        </div>
      </div>
    </div>
  )
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <span className="text-3xl opacity-25">{icon}</span>
      <p className="text-xs text-slate-400">{message}</p>
    </div>
  )
}

export function ScaleDetails() {
  const scale = useScaleDetails()
  const navigate = useNavigate()

  if (scale.isLoading) return <ScaleDetailsSkeleton />

  const formattedDate = scale.scale
    ? format(new Date(scale.scale.date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
    : ''

  return (
    <>
      <div className="min-h-screen bg-slate-50 font-sans">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-slate-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-7 h-7 rounded-lg bg-linear-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white shrink-0">
                  <IconNote />
                </div>
                <span className="text-sm font-bold text-slate-800 hidden sm:inline tracking-tight">Schedule</span>
              </div>
              <span className="text-slate-200 hidden sm:inline">|</span>
              <button onClick={scale.navigateToMinistry} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
                <IconArrowLeft />
                <span className="hidden sm:inline truncate max-w-30">{scale.ministry?.name ?? 'Ministério'}</span>
              </button>
            </div>

            {scale.scale && (
              <p className="text-sm font-semibold text-slate-700 truncate max-w-45 sm:max-w-xs">{scale.scale.name}</p>
            )}

            <div className="flex items-center gap-2 shrink-0">
              {scale.isAdmin && !scale.isError && scale.scale && (
                <>
                  <button
                    onClick={() => navigate(`/ministries/${scale.parsedMinistryId}/scales/${scale.parsedScaleId}/edit`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                    <IconEdit /> Editar
                  </button>
                  <button onClick={() => scale.setMemberModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                    + Membro
                  </button>
                  <button onClick={() => scale.setMusicModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white text-xs font-semibold rounded-xl hover:bg-violet-700 transition-colors">
                    + Música
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 space-y-5">
          {scale.isError || !scale.scale ? (
            <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
              <span className="text-4xl">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-slate-700">Erro ao carregar escala</p>
                <p className="text-xs text-slate-400 mt-1">Verifique sua conexão e tente novamente.</p>
              </div>
              <button onClick={scale.navigateToMinistry}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                <IconArrowLeft /> Voltar ao ministério
              </button>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
                  <div className="space-y-2 flex-1 min-w-0">
                    <h1 className="text-xl font-bold text-slate-800 truncate">{scale.scale.name}</h1>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-600">
                      📅 {formattedDate}
                    </span>
                    {scale.scale.description && (
                      <p className="text-sm text-slate-500 leading-relaxed pt-1">{scale.scale.description}</p>
                    )}
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <Stat icon="👥" label="Membros" value={scale.scale.members.length} />
                    <Stat icon="🎵" label="Músicas" value={scale.scale.musics.length} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-800">Membros escalados</h2>
                      <p className="text-[11px] text-slate-400 mt-0.5">{scale.scale.members.length} participantes</p>
                    </div>
                    {scale.isAdmin && (
                      <button onClick={() => scale.setMemberModalOpen(true)} className="text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors">
                        + Adicionar
                      </button>
                    )}
                  </div>
                  <div className="p-3">
                    {scale.scale.members.length === 0
                      ? <EmptyState icon="👥" message="Nenhum membro escalado." />
                      : scale.scale.members.map((member: ScaleMemberResponse) => (
                          <MemberRow key={member.id} member={member} isAdmin={scale.isAdmin}
                            isRemoving={scale.isRemovingMember} onRemove={scale.removeMember} />
                        ))
                    }
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-800">Repertório</h2>
                      <p className="text-[11px] text-slate-400 mt-0.5">{scale.scale.musics.length} músicas</p>
                    </div>
                    {scale.isAdmin && (
                      <button onClick={() => scale.setMusicModalOpen(true)} className="text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors">
                        + Adicionar
                      </button>
                    )}
                  </div>
                  <div className="p-3">
                    {scale.scale.musics.length === 0
                      ? <EmptyState icon="🎵" message="Nenhuma música adicionada à escala." />
                      : <div className="space-y-1">
                          {scale.scale.musics.map((music: MusicResponse) => (
                            <MusicRow key={music.id} music={music} isAdmin={scale.isAdmin}
                              isRemoving={scale.isRemovingMusic} onRemove={scale.removeMusic} />
                          ))}
                        </div>
                    }
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <AddMusicModal ministryId={scale.parsedMinistryId} scaleId={scale.parsedScaleId}
        open={scale.musicModalOpen} onClose={() => scale.setMusicModalOpen(false)} />

      <AddMemberModal ministryId={scale.parsedMinistryId} scaleId={scale.parsedScaleId}
        open={scale.memberModalOpen} onClose={() => scale.setMemberModalOpen(false)} />
    </>
  )
}