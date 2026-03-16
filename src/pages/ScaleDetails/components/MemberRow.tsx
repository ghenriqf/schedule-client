import type { ScaleMemberResponse } from '@/entities/scale/model/types'

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4h6v2" />
  </svg>
)

interface Props {
  member: ScaleMemberResponse
  isAdmin: boolean
  isRemoving: boolean
  onRemove: (id: number) => void
}

export function MemberRow({ member, isAdmin, isRemoving, onRemove }: Props) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
        {initials(member.memberName)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800 truncate">{member.memberName}</p>
        <p className="text-[11px] text-slate-400 truncate">
          {member.functions?.join(', ') || 'Sem funções atribuídas'}
        </p>
      </div>
      {isAdmin && (
        <button onClick={() => onRemove(member.memberId)} disabled={isRemoving}
          className="shrink-0 opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[11px] text-red-400 hover:text-red-600 disabled:opacity-40 transition-all">
          <IconTrash /> Remover
        </button>
      )}
    </div>
  )
}