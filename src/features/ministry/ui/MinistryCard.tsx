import { Link } from "react-router-dom";
import type { MinistryDetailResponse, MinistryRole } from '@/entities/ministry/model/types'

interface MinistryCardProps {
  ministry: MinistryDetailResponse;
}

const ROLE_STYLE: Record<
  MinistryRole,
  { bg: string; text: string; border: string; label: string }
> = {
  ADMIN: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    label: "Admin",
  },
  MEMBER: {
    bg: "bg-slate-100",
    text: "text-slate-500",
    border: "border-slate-200",
    label: "Membro",
  },
};

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function MinistryCard({ ministry }: MinistryCardProps) {
  const { id, name, description, avatarUrl, role, ministryStats } = ministry;
  const roleStyle = ROLE_STYLE[role] ?? ROLE_STYLE.MEMBER;

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-violet-200 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Banner */}
      <div className="relative h-36 overflow-hidden bg-linear-to-br from-violet-100 via-indigo-50 to-blue-100 shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`Imagem do ministério ${name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl font-bold text-violet-200 select-none">
              {initials(name)}
            </span>
          </div>
        )}

        {/* Role badge */}
        <span
          className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}
        >
          {roleStyle.label}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex-1 space-y-1">
          <h3 className="text-sm font-bold text-slate-800 line-clamp-1">
            {name}
          </h3>
          {description ? (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {description}
            </p>
          ) : (
            <p className="text-xs text-slate-300 italic">Sem descrição</p>
          )}
        </div>

        {/* Stats */}
        {ministryStats && (
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                icon: "👥",
                value: ministryStats.memberCount,
                label: "membros",
              },
              {
                icon: "📅",
                value: ministryStats.upcomingScalesCount,
                label: "escalas",
              },
              {
                icon: "🎵",
                value: ministryStats.repertoryCount,
                label: "músicas",
              },
            ].map(({ icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center py-2 rounded-xl bg-slate-50 border border-slate-100"
              >
                <span className="text-sm">{icon}</span>
                <span className="text-sm font-bold text-slate-700 leading-none mt-0.5">
                  {value}
                </span>
                <span className="text-[9px] text-slate-400 uppercase tracking-wide mt-0.5">
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Action */}
        <Link
          to={`/ministries/${id}`}
          className="mt-1 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors"
        >
          Abrir ministério →
        </Link>
      </div>
    </div>
  );
}
