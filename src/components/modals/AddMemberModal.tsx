import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membersService } from "../../services/members.service";
import { functionsService } from "../../services/funtions.service";
import { scalesService } from "../../services/scales.service";
import { useState } from "react";
import { Mic, Guitar, Music, Piano, Drum } from "lucide-react";

export function AddMemberModal({
  ministryId,
  scaleId,
  open,
  onClose,
}: {
  ministryId: number;
  scaleId: number;
  open: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [selectedFunctions, setSelectedFunctions] = useState<number[]>([]);

  const { data: members } = useQuery({
    queryKey: ["members", ministryId],
    queryFn: () => membersService.listByMinistry(ministryId),
    enabled: open,
  });

  const { data: functions } = useQuery({
    queryKey: ["functions"],
    queryFn: () => functionsService.list(),
    enabled: open,
  });

  const addMemberMutation = useMutation({
    mutationFn: () =>
      scalesService.addMember(ministryId, scaleId, selectedMember!, {
        functionIds: selectedFunctions,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scale-details", scaleId] });
      onClose();
    },
  });

  if (!open) return null;

  function toggleFunction(id: number) {
    setSelectedFunctions((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  }

  function getFunctionIcon(name: string) {
    const n = name.toLowerCase();
    if (n.includes("vocal")) return <Mic size={16} />;
    if (n.includes("guitarra")) return <Guitar size={16} />;
    if (n.includes("teclado")) return <Piano size={16} />;
    if (n.includes("bateria")) return <Drum size={16} />;
    return <Music size={16} />;
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-start border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Adicionar membro à escala
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Selecione um membro do ministério e suas funções. Você pode rolar
              para ver todos os membros.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-4 grid md:grid-cols-2 gap-6">
          {/* MEMBROS */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-3 uppercase">
              Membros disponíveis
            </p>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
              {members?.map((member) => {
                const selected = selectedMember === member.id;
                return (
                  <button
                    key={member.id}
                    onClick={() => setSelectedMember(member.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition
                      ${
                        selected
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                  >
                    <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xs">
                      {member.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-800">
                        {member.user.username}
                      </p>
                      <p className="text-xs text-slate-400">
                        Membro do ministério
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FUNÇÕES */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-3 uppercase">
              Funções na escala
            </p>

            <div className="flex flex-wrap gap-2 max-h-[50vh] overflow-y-auto">
              {functions?.map((f) => {
                const selected = selectedFunctions.includes(f.id);
                return (
                  <button
                    key={f.id}
                    onClick={() => toggleFunction(f.id)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded-xl border transition
                      ${
                        selected
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-slate-200 hover:bg-slate-100"
                      }`}
                  >
                    {getFunctionIcon(f.name)}
                    {f.name}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-slate-400 mt-3">
              Você pode selecionar múltiplas funções para o mesmo membro.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            disabled={!selectedMember}
            onClick={() => addMemberMutation.mutate()}
            className="px-5 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Adicionar à escala
          </button>
        </div>
      </div>
    </div>
  );
}
