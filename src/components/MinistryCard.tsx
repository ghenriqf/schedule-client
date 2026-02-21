export interface MinistryStats {
  memberCount: number;
  upcomingScalesCount: number;
  repertoryCount: number;
}

export type MinistryRole = "admin" | "member";

export interface MinistryDetailResponse {
  id: number;
  name: string;
  description: string;
  ministryStats: MinistryStats;
  role: MinistryRole;
}

interface MinistryCardProps {
  ministry: MinistryDetailResponse;
  selected?: boolean;
  onSelect?: () => void;
}

function Stat({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="flex items-center gap-2 text-slate-600">
      <span className="text-slate-400" aria-hidden>{icon}</span>
      <span className="text-sm font-medium">{value}</span>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
}

export function MinistryCard({ ministry, selected, onSelect }: MinistryCardProps) {
  const { name, description, ministryStats, role } = ministry;
  const { memberCount, upcomingScalesCount, repertoryCount } = ministryStats;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        w-full text-left rounded-xl border-2 p-4 transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
        ${selected
          ? "border-indigo-500 bg-indigo-50/80 shadow-md"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
        }
      `}
    >
      <div className="flex justify-between items-start gap-3">
        <h2 className="text-lg font-semibold text-slate-800 leading-tight">
          {name}
        </h2>
        {role && (
          <span
            className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
              role === "admin"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {role === "admin" ? "Admin" : "Membro"}
          </span>
        )}
      </div>

      {description && (
        <p className="text-sm text-slate-500 mt-2 line-clamp-2">
          {description}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-4">
        <Stat label="membros" value={memberCount} icon="👥" />
        <Stat label="escalas" value={upcomingScalesCount} icon="📅" />
        <Stat label="repertório" value={repertoryCount} icon="🎵" />
      </div>

      <span className="mt-3 inline-block text-xs font-medium text-indigo-600">
        Ver detalhes →
      </span>
    </button>
  );
}
