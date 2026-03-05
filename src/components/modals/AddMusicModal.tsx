import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { musicService } from "../../services/musics.service";
import { useState } from "react";
import type { MusicResponse } from "../../types/music";
import type { PaginatedResponse } from "../../types/page";

export function AddMusicModal({
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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selectedMusic, setSelectedMusic] = useState<number | null>(null);

  // BUSCA DE MÚSICAS
  const { data, isLoading, isError } = useQuery<
    PaginatedResponse<MusicResponse>,
    Error
  >({
    queryKey: ["musics", ministryId, page, search],
    queryFn: () =>
      musicService.listByMinistry(ministryId, { page, size: 10, search }),
    enabled: open,
  });

  // MUTAÇÃO PARA ADICIONAR
  const addMusicMutation = useMutation({
    mutationFn: () =>
      selectedMusic
        ? musicService.addToScale(ministryId, scaleId, selectedMusic)
        : Promise.reject(new Error("Selecione uma música")),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scale-details", scaleId] });
      setSelectedMusic(null);
      onClose();
    },
  });

  if (!open) return null;

  // Atalhos para evitar erro de 'undefined' no render
  const musicList = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b px-6 py-4 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Adicionar Música
            </h2>
            <p className="text-xs text-slate-500">
              Selecione uma música do repertório
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition text-slate-400"
          >
            ✕
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="px-6 py-4 border-b bg-white">
          <input
            type="text"
            placeholder="Pesquisar por título ou artista..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0); // Resetar página ao buscar
            }}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        {/* LISTA DE MÚSICAS */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2 bg-slate-50/50">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              Carregando músicas...
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-full text-red-500 text-sm">
              Erro ao carregar músicas.
            </div>
          ) : musicList.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              Nenhuma música encontrada.
            </div>
          ) : (
            musicList.map((music) => {
              const isSelected = selectedMusic === music.id;
              return (
                <button
                  key={music.id}
                  onClick={() => setSelectedMusic(music.id)}
                  className={`w-full flex justify-between items-center p-4 rounded-xl border transition-all
                    ${
                      isSelected
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md translate-x-1"
                        : "bg-white border-slate-200 hover:border-indigo-300 text-slate-700 hover:shadow-sm"
                    }`}
                >
                  <div className="text-left">
                    <p
                      className={`font-semibold text-sm ${isSelected ? "text-white" : "text-slate-800"}`}
                    >
                      {music.title}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${isSelected ? "text-indigo-100" : "text-slate-500"}`}
                    >
                      {music.artist} • Tom: {music.tone}
                    </p>
                  </div>
                  {isSelected && (
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Selecionada
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* PAGINAÇÃO */}
        <div className="px-6 py-3 border-t bg-white flex justify-between items-center">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0 || isLoading}
            className="px-4 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition"
          >
            Anterior
          </button>

          <span className="text-xs font-medium text-slate-500 uppercase tracking-tighter">
            Página {page + 1} de {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page + 1 >= totalPages || isLoading}
            className="px-4 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition"
          >
            Próxima
          </button>
        </div>

        {/* FOOTER */}
        <div className="border-t px-6 py-4 flex justify-end gap-3 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition"
          >
            Cancelar
          </button>
          <button
            disabled={!selectedMusic || addMusicMutation.isPending}
            onClick={() => addMusicMutation.mutate()}
            className="px-6 py-2 text-sm font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            {addMusicMutation.isPending
              ? "Adicionando..."
              : "Confirmar Seleção"}
          </button>
        </div>
      </div>
    </div>
  );
}
