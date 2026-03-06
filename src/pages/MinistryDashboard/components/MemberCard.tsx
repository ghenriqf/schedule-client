interface MemberCardProps {
  username: string
  email: string
  role: "ADMIN" | "MEMBER"
  functions?: string[]
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function MemberCard({ username, email, role, functions }: MemberCardProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-violet-500 text-white flex items-center justify-center text-xs font-bold">
        {initials(username)}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{username}</p>

        <p className="text-[11px] text-slate-400 truncate">
          {functions?.join(", ") || email}
        </p>
      </div>

      <span className="text-[10px] px-2 py-0.5 rounded-full border">
        {role}
      </span>
    </div>
  );
}
