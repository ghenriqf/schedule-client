import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { scalesService } from "../services/scales.service";
import { membersService } from "../services/members.service";

export function CreateScale() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const ministryId = id ? Number(id) : null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [ministerId, setMinisterId] = useState<number | "">("");

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["members", ministryId],
    queryFn: () => membersService.listByMinistry(ministryId!),
    enabled: ministryId !== null,
  });

  const hasMembers = members && members.length > 0;

  const createScaleMutation = useMutation({
    mutationFn: async () => {
      if (!ministryId) throw new Error("MinistryId inválido");

      return scalesService.create(ministryId, {
        name: name.trim(),
        description,
        date: formatDate(date),
        ministerId: Number(ministerId),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["scales", ministryId],
      });

      toast.success("Escala criada com sucesso.");
      navigate(`/ministries/${ministryId}`);
    },
    onError: () => {
      toast.error("Não foi possível criar a escala.");
    },
  });

  const canSubmit =
    name.trim().length > 0 &&
    date.length > 0 &&
    ministerId !== "" &&
    hasMembers &&
    !createScaleMutation.isPending;

  function formatDate(dateString: string) {
    return dateString.replace("T", " ");
  }

  if (ministryId === null) {
    return (
      <div className="p-8 text-center text-red-500">Ministério inválido.</div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Criar nova escala
            </h1>
            <p className="mt-1 text-slate-500">
              Defina as informações da nova escala do ministério.
            </p>
          </div>

          <Link
            to={`/ministries/${ministryId}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors"
          >
            Voltar
          </Link>
        </header>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <form
            className="space-y-8"
            onSubmit={(event) => {
              event.preventDefault();
              if (!canSubmit) return;
              createScaleMutation.mutate();
            }}
          >
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Informações da escala
              </h2>

              {/* Nome */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Nome da escala
                </label>
                <input
                  type="text"
                  placeholder="Ex: Culto Domingo Noite"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Descrição */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalhes adicionais da escala..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Data */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Data e horário
                </label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Ministro Responsável */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Ministro responsável
                </label>

                <select
                  value={ministerId}
                  disabled={!hasMembers || membersLoading}
                  onChange={(e) =>
                    setMinisterId(e.target.value ? Number(e.target.value) : "")
                  }
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {membersLoading
                      ? "Carregando membros..."
                      : !hasMembers
                        ? "Este ministério ainda não possui membros"
                        : "Selecione um membro"}
                  </option>

                  {hasMembers &&
                    members!.map((member) => (
                      <option key={member.id} value={member.id}>
                        {/* CORREÇÃO AQUI: usamos .username conforme o seu JSON */}
                        {member.user?.username || `Membro #${member.id}`} (
                        {member.role})
                      </option>
                    ))}
                </select>
              </div>
            </section>

            <section className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Link
                to={`/ministries/${ministryId}`}
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
              >
                {createScaleMutation.isPending
                  ? "Salvando..."
                  : "Salvar escala"}
              </button>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}
