interface MemberCardProps {
  username: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  functions?: { id: number; name: string }[] | null;
}

export function MemberCard({
  username,
  email,
  role,
  functions,
}: MemberCardProps) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3">
        {/* Avatar com inicial */}
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700">
          {username.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 truncate">
            {username}
          </h3>

          <p className="text-[11px] text-slate-400 truncate">{email}</p>
        </div>

        <span
          className={`text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
            role === "ADMIN"
              ? "bg-indigo-50 text-indigo-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {role === "ADMIN" ? "Admin" : "Membro"}
        </span>
      </div>

      {/* Funções */}
      {functions && functions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {functions.map((func) => (
            <span
              key={func.id}
              className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full"
            >
              {func.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
