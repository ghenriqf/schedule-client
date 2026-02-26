import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { membersService } from "../services/members.service";

export function JoinMinistry() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [inviteCode, setInviteCode] = useState("");

  const joinMutation = useMutation({
    mutationFn: () => membersService.join(inviteCode.trim()),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ministries"] });

      toast.success("Você entrou no ministério com sucesso!");
      navigate("/ministries");
    },
    onError: () => {
      toast.error("Código inválido ou expirado.");
    },
  });

  const canSubmit = inviteCode.trim().length > 0 && !joinMutation.isPending;

  return (
    <div className="min-h-full pt-16 bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Entrar em um ministério
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Informe o código de convite para participar.
        </p>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmit) return;
            joinMutation.mutate();
          }}
        >
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Código de convite
            </label>
            <input
              type="text"
              placeholder="Ex: c957e11e-..."
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
          >
            {joinMutation.isPending ? "Entrando..." : "Entrar no ministério"}
          </button>
        </form>
      </div>
    </div>
  );
}
