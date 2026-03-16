import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { repertoireApi } from "@/features/repertoire/api/repertoireApi";
import { scaleApi } from "@/features/scale/api/scaleApi";
import { ModalShell, IconCheck, IconSpinner, IconSearch } from "@/shared/ui/ModalShell";
import type { MusicResponse } from "@/entities/music/model/types";

interface AddMusicModalProps {
  ministryId: number;
  scaleId: number;
  open: boolean;
  onClose: () => void;
}

export function AddMusicModal({
  ministryId,
  scaleId,
  open,
  onClose,
}: AddMusicModalProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedMusic, setSelectedMusic] = useState<number | null>(null);

  const {
    data: musicList = [],
    isLoading,
    isError,
  } = useQuery<MusicResponse[]>({
    queryKey: ["musics", ministryId, search],
    queryFn: () => repertoireApi.listByMinistry(ministryId, { search }),
    enabled: open,
  });

  const filteredList = search.trim()
    ? musicList.filter(
        (m) =>
          m.title.toLowerCase().includes(search.toLowerCase()) ||
          m.artist.toLowerCase().includes(search.toLowerCase()),
      )
    : musicList;

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      selectedMusic
        ? scaleApi.addMusic(scaleId, selectedMusic!)
        : Promise.reject(new Error("Selecione uma música")),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scale-details", scaleId] });
      setSelectedMusic(null);
      onClose();
    },
  });

  if (!open) return null;

  return (
    <ModalShell
      title="Adicionar música à escala"
      subtitle="Busque e selecione uma música do repertório do ministério."
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
            disabled={!selectedMusic || isPending}
            onClick={() => mutate()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? (
              <>
                <IconSpinner /> Adicionando…
              </>
            ) : (
              <>
                <IconCheck /> Confirmar seleção
              </>
            )}
          </button>
        </>
      }
    >
      <div className="flex flex-col">
        {/* Search */}
        <div className="px-5 py-3 border-b border-slate-100">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="Buscar por título ou artista…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:bg-white transition"
            />
          </div>
        </div>

        {/* List */}
        <div className="p-3 space-y-1.5 min-h-80">
          {isLoading ? (
            <div className="space-y-2 animate-pulse p-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-48 text-sm text-slate-400">
              Erro ao carregar músicas.
            </div>
          ) : filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 h-48 text-center">
              <span className="text-3xl opacity-25">🎵</span>
              <p className="text-sm text-slate-400">
                Nenhuma música encontrada.
              </p>
            </div>
          ) : (
            filteredList.map((music) => {
              const isSelected = selectedMusic === music.id;
              return (
                <button
                  key={music.id}
                  onClick={() => setSelectedMusic(isSelected ? null : music.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100"
                      : "border-slate-100 hover:border-violet-200 hover:bg-violet-50/40"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base transition-all ${
                      isSelected
                        ? "bg-violet-100 border border-violet-200"
                        : "bg-slate-50 border border-slate-100"
                    }`}
                  >
                    🎵
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-semibold truncate ${isSelected ? "text-violet-800" : "text-slate-800"}`}
                    >
                      {music.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {music.artist}
                      <span className="mx-1.5 text-slate-300">·</span>
                      Tom:{" "}
                      <span className="font-medium text-slate-500">
                        {music.tone}
                      </span>
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-bold px-2 py-1 rounded-lg transition-all ${
                      isSelected
                        ? "bg-violet-500 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {music.tone}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-white shrink-0">
                      <IconCheck />
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </ModalShell>
  );
}
