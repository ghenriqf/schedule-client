import type { MemberResponse } from '@/entities/member/model/types'

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

interface Props {
  members: MemberResponse[]
  selected: number | ''
  onSelect: (id: number | '') => void
}

export function MinisterSelector({ members, selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {members.map((member) => {
        const name = member.user?.username ?? `Membro #${member.id}`
        const email = member.user?.email ?? ''
        const isSelected = selected === member.id
        const isAdmin = member.role === 'ADMIN'

        return (
          <button
            key={member.id}
            type="button"
            onClick={() => onSelect(isSelected ? '' : member.id)}
            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
              isSelected
                ? 'border-violet-400 bg-violet-50 ring-2 ring-violet-200'
                : 'border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/40'
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isSelected ? 'bg-gradient-to-br from-violet-500 to-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {initials(name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-semibold truncate ${isSelected ? 'text-violet-800' : 'text-slate-800'}`}>{name}</p>
              <p className="text-[11px] text-slate-400 truncate">
                {member.functions?.map((f) => f.name).join(', ') || email}
              </p>
            </div>
            {isAdmin && (
              <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-600 border border-violet-200">Admin</span>
            )}
            {isSelected && (
              <span className="shrink-0 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-white">
                <IconCheck />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}