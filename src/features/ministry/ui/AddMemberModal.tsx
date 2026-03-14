import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Mic, Guitar, Music, Piano, Drum } from "lucide-react";
import { membersApi } from "@/features/ministry/api/membersApi";
import { functionsApi } from "@/features/ministry/api/functionsApi";
import { scaleApi } from "@/features/scale/api/scaleApi";
import { ModalShell, IconCheck, IconSpinner, initials } from "@/shared/ui/ModalShell";

function getFunctionIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("vocal")) return <Mic size={14} />;
  if (n.includes("guitarra")) return <Guitar size={14} />;
  if (n.includes("teclado")) return <Piano size={14} />;
  if (n.includes("bateria")) return <Drum size={14} />;
  return <Music size={14} />;
}

interface AddMemberModalProps {
  ministryId: number;
  scaleId: number;
  open: boolean;
  onClose: () => void;
}

export function AddMemberModal({
  ministryId,
  scaleId,
  open,
  onClose,
}: AddMemberModalProps) {
  const queryClient = useQueryClient();
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [selectedFunctions, setSelectedFunctions] = useState<number[]>([]);

  const { data: members } = useQuery({
    queryKey: ["members", ministryId],
    queryFn: () => membersApi.listByMinistry(ministryId),
    enabled: open,
  });

  const { data: functions } = useQuery({
    queryKey: ["functions"],
    queryFn: () => functionsApi.list(),
    enabled: open,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      scaleApi.addMember(scaleId, selectedMember!, {
        functionIds: selectedFunctions,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scale-details", scaleId] });
      setSelectedMember(null);
      setSelectedFunctions([]);
      onClose();
    },
  });

  function toggleFunction(id: number) {
    setSelectedFunctions((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  }

  if (!open) return null;

  return (
    <ModalShell
      title="Adicionar membro à escala"
      subtitle="Selecione um membro e atribua as funções que ele exercerá."
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled={!selectedMember || isPending}
            onClick={() => mutate()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? (
              <>
                <IconSpinner /> Adicionando…
              </>
            ) : (
              <>
                <IconCheck /> Adicionar à escala
              </>
            )}
          </button>
        </>
      }
    >
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {/* Membros */}
        <div className="p-5 space-y-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Membros disponíveis
          </p>
          <div className="space-y-2">
            {members?.map((member) => {
              const selected = selectedMember === member.id;
              return (
                <button
                  key={member.id}
                  onClick={() => setSelectedMember(member.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    selected
                      ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100"
                      : "border-slate-200 hover:border-violet-200 hover:bg-violet-50/40"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                      selected
                        ? "bg-gradient-to-br from-violet-500 to-indigo-500 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {initials(member.user.username)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-semibold truncate ${selected ? "text-violet-800" : "text-slate-800"}`}
                    >
                      {member.user.username}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {member.functions?.map((f) => f.name).join(", ") ||
                        "Sem funções atribuídas"}
                    </p>
                  </div>
                  {selected && (
                    <span className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-white shrink-0">
                      <IconCheck />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Funções */}
        <div className="p-5 space-y-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Funções na escala
          </p>
          <div className="flex flex-wrap gap-2">
            {functions?.map((f) => {
              const selected = selectedFunctions.includes(f.id);
              return (
                <button
                  key={f.id}
                  onClick={() => toggleFunction(f.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                    selected
                      ? "bg-violet-600 text-white border-violet-600"
                      : "border-slate-200 text-slate-600 hover:border-violet-300 hover:bg-violet-50"
                  }`}
                >
                  {getFunctionIcon(f.name)}
                  {f.name}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-400">
            Você pode selecionar múltiplas funções para o mesmo membro.
          </p>

          {selectedFunctions.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Selecionadas
              </p>
              <div className="flex flex-wrap gap-1.5">
                {functions
                  ?.filter((f) => selectedFunctions.includes(f.id))
                  .map((f) => (
                    <span
                      key={f.id}
                      className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg bg-violet-100 text-violet-700"
                    >
                      {getFunctionIcon(f.name)} {f.name}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalShell>
  );
}
