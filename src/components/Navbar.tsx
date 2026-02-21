import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          to="/ministries"
          className="text-xl font-bold text-slate-800 hover:text-indigo-600 transition-colors"
        >
          Schedule
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/profile"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <span
              className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500"
              aria-hidden
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
            <span className="hidden sm:inline">Perfil</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
