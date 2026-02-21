import { useState } from "react";
import { MinistryCard, type MinistryDetailResponse } from "../components/MinistryCard";

const MOCK_MINISTRIES: MinistryDetailResponse[] = [
  {
    id: 1,
    name: "Ministério de Louvor Central",
    description: "Responsável pelo louvor dos cultos principais.",
    ministryStats: {
      memberCount: 12,
      upcomingScalesCount: 8,
      repertoryCount: 45,
    },
    role: "member",
  },
  {
    id: 2,
    name: "Ministério de Intercessão",
    description: "Grupo de oração e intercessão pela igreja.",
    ministryStats: {
      memberCount: 6,
      upcomingScalesCount: 4,
      repertoryCount: 0,
    },
    role: "admin",
  },
  {
    id: 3,
    name: "Ministério Infantil",
    description: "Atendimento e ensino para crianças.",
    ministryStats: {
      memberCount: 15,
      upcomingScalesCount: 12,
      repertoryCount: 20,
    },
    role: "member",
  },
];

export function MinistriesPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = MOCK_MINISTRIES.find((m) => m.id === selectedId);

  return (
    <div className="min-h-full bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Meus Ministérios
            </h1>
            <p className="mt-1 text-slate-500">
              Selecione um ministério para ver detalhes
            </p>
          </div>
          <button
            type="button"
            onClick={() => {}}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Criar ministério
          </button>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Coluna esquerda: lista de ministérios */}
          <aside className="lg:w-[380px] shrink-0">
            <div className="space-y-3">
              {MOCK_MINISTRIES.map((ministry) => (
                <MinistryCard
                  key={ministry.id}
                  ministry={ministry}
                  selected={selectedId === ministry.id}
                  onSelect={() =>
                    setSelectedId((id) => (id === ministry.id ? null : ministry.id))
                  }
                />
              ))}
            </div>
          </aside>

          {/* Coluna direita: detalhe (placeholder ou conteúdo futuro) */}
          <main className="flex-1 min-w-0">
            {selected ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-xl font-semibold text-slate-800">
                  {selected.name}
                </h2>
                <p className="mt-2 text-slate-600">{selected.description}</p>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-lg bg-slate-50">
                    <div className="text-2xl font-bold text-indigo-600">
                      {selected.ministryStats.memberCount}
                    </div>
                    <div className="text-xs text-slate-500">Membros</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-slate-50">
                    <div className="text-2xl font-bold text-indigo-600">
                      {selected.ministryStats.upcomingScalesCount}
                    </div>
                    <div className="text-xs text-slate-500">Escalas</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-slate-50">
                    <div className="text-2xl font-bold text-indigo-600">
                      {selected.ministryStats.repertoryCount}
                    </div>
                    <div className="text-xs text-slate-500">Repertório</div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  Sua função:{" "}
                  <strong className="text-slate-700">
                    {selected.role === "admin" ? "Admin" : "Membro"}
                  </strong>
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 border-dashed p-12 text-center">
                <p className="text-slate-400">
                  Selecione um ministério na lista ao lado para ver os detalhes.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
