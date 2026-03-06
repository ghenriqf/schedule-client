import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { musicService } from "../services/musics.service";
import { ministriesService } from "../services/ministries.service";
import type { MusicResponse, MusicRequest } from "../types/music";

const IconArrowLeft = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const IconNote = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

const IconSearch = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const IconPlus = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const IconEdit = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconTrash = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4h6v2" />
  </svg>
);

const IconLink = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const IconX = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const IconSpinner = () => (
  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    />
  </svg>
);

const IconCheck = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const TONES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
  "Cm",
  "C#m",
  "Dm",
  "D#m",
  "Em",
  "Fm",
  "F#m",
  "Gm",
  "G#m",
  "Am",
  "A#m",
  "Bm",
];

const EMPTY_FORM: MusicRequest = {
  title: "",
  artist: "",
  tone: "",
  videoLink: "",
  chordSheetLink: "",
};

// ─── MusicFormModal ───────────────────────────────────────────────────────────

interface MusicFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MusicRequest) => void;
  isPending: boolean;
  initial?: MusicResponse | null;
}

function MusicFormModal({
  open,
  onClose,
  onSubmit,
  isPending,
  initial,
}: MusicFormModalProps) {
  const [form, setForm] = useState<MusicRequest>(
    initial
      ? {
          title: initial.title,
          artist: initial.artist,
          tone: initial.tone,
          videoLink: initial.videoLink ?? "",
          chordSheetLink: initial.chordSheetLink ?? "",
        }
      : EMPTY_FORM,
  );

  if (!open) return null;

  const canSubmit =
    form.title.trim().length > 0 &&
    form.artist.trim().length > 0 &&
    form.tone.length > 0 &&
    !isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      ...form,
      title: form.title.trim(),
      artist: form.artist.trim(),
      videoLink: form.videoLink?.trim() || undefined,
      chordSheetLink: form.chordSheetLink?.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              {initial ? "Editar música" : "Nova música"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {initial
                ? "Atualize as informações da música."
                : "Adicione uma nova música ao repertório."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <IconX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Título *
              </label>
              <input
                type="text"
                placeholder="Nome da música"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                maxLength={100}
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Artista *
              </label>
              <input
                type="text"
                placeholder="Nome do artista"
                value={form.artist}
                onChange={(e) =>
                  setForm((f) => ({ ...f, artist: e.target.value }))
                }
                maxLength={100}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Tom *
            </label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, tone: t }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    form.tone === t
                      ? "bg-violet-600 border-violet-600 text-white"
                      : "border-slate-200 text-slate-600 hover:border-violet-300 hover:bg-violet-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Link do vídeo
            </label>
            <input
              type="url"
              placeholder="https://youtube.com/..."
              value={form.videoLink ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, videoLink: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Link da cifra
            </label>
            <input
              type="url"
              placeholder="https://cifraclub.com/..."
              value={form.chordSheetLink ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, chordSheetLink: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? (
                <>
                  <IconSpinner /> Salvando…
                </>
              ) : (
                <>
                  <IconCheck />{" "}
                  {initial ? "Salvar alterações" : "Adicionar música"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── DeleteConfirmModal ───────────────────────────────────────────────────────

interface DeleteConfirmProps {
  music: MusicResponse | null;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

function DeleteConfirmModal({
  music,
  onConfirm,
  onCancel,
  isPending,
}: DeleteConfirmProps) {
  if (!music) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-500 text-xl">
          <IconTrash />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-sm font-bold text-slate-800">Remover música</h2>
          <p className="text-xs text-slate-400">
            Tem certeza que deseja remover{" "}
            <span className="font-semibold text-slate-600">
              "{music.title}"
            </span>{" "}
            do repertório? Esta ação não pode ser desfeita.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {isPending ? <IconSpinner /> : "Remover"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MusicRow ─────────────────────────────────────────────────────────────────

interface MusicRowProps {
  music: MusicResponse;
  isAdmin: boolean;
  onEdit: (m: MusicResponse) => void;
  onDelete: (m: MusicResponse) => void;
}

function MusicRow({ music, isAdmin, onEdit, onDelete }: MusicRowProps) {
  return (
    <div className="group flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
      <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-400 shrink-0">
        🎵
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800 truncate">
          {music.title}
        </p>
        <p className="text-xs text-slate-400 truncate mt-0.5">{music.artist}</p>
      </div>
      <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
        {music.tone}
      </span>
      <div className="flex items-center gap-2 shrink-0">
        {music.videoLink && (
          <a
            href={music.videoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-violet-500 hover:text-violet-700 transition-colors"
          >
            <IconLink /> Vídeo
          </a>
        )}
        {music.chordSheetLink && (
          <a
            href={music.chordSheetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
          >
            <IconLink /> Cifra
          </a>
        )}
      </div>
      {isAdmin && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
          <button
            onClick={() => onEdit(music)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
          >
            <IconEdit />
          </button>
          <button
            onClick={() => onDelete(music)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <IconTrash />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function RepertorioSkeleton() {
  return (
    <div className="space-y-2 animate-pulse p-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-14 rounded-xl bg-slate-100" />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function Repertorio() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const ministryId = Number(id);

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MusicResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MusicResponse | null>(null);

  const { data: ministry } = useQuery({
    queryKey: ["ministry", ministryId],
    queryFn: () => ministriesService.findDetails(ministryId),
    enabled: !!ministryId,
  });

  const isAdmin = ministry?.role === "ADMIN";

  const {
    data: musicList = [],
    isLoading,
    isError,
  } = useQuery<MusicResponse[]>({
    queryKey: ["musics", ministryId, search],
    queryFn: () => musicService.listByMinistry(ministryId, { search }),
    enabled: !!ministryId,
  });

  const filteredList = search.trim()
    ? musicList.filter(
        (m) =>
          m.title.toLowerCase().includes(search.toLowerCase()) ||
          m.artist.toLowerCase().includes(search.toLowerCase()),
      )
    : musicList;

  const createMutation = useMutation({
    mutationFn: (req: MusicRequest) => musicService.create(ministryId, req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["musics", ministryId] });
      queryClient.invalidateQueries({ queryKey: ["ministry", ministryId] });
      toast.success("Música adicionada ao repertório.");
      setFormOpen(false);
    },
    onError: () => toast.error("Não foi possível adicionar a música."),
  });

  const updateMutation = useMutation({
    mutationFn: (req: MusicRequest) =>
      musicService.update(ministryId, editTarget!.id, req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["musics", ministryId] });
      toast.success("Música atualizada.");
      setEditTarget(null);
      setFormOpen(false);
    },
    onError: () => toast.error("Não foi possível atualizar a música."),
  });

  const deleteMutation = useMutation({
    mutationFn: () => musicService.delete(ministryId, deleteTarget!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["musics", ministryId] });
      queryClient.invalidateQueries({ queryKey: ["ministry", ministryId] });
      toast.success("Música removida do repertório.");
      setDeleteTarget(null);
    },
    onError: () => toast.error("Não foi possível remover a música."),
  });

  function openCreate() {
    setEditTarget(null);
    setFormOpen(true);
  }
  function openEdit(m: MusicResponse) {
    setEditTarget(m);
    setFormOpen(true);
  }
  function closeForm() {
    setFormOpen(false);
    setEditTarget(null);
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 font-sans">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-slate-100 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white shrink-0">
                  <IconNote />
                </div>
                <span className="text-sm font-bold text-slate-800 hidden sm:inline tracking-tight">
                  Schedule
                </span>
              </div>
              <span className="text-slate-200 hidden sm:inline">|</span>
              <button
                onClick={() => navigate(`/ministries/${ministryId}`)}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
              >
                <IconArrowLeft />
                <span className="hidden sm:inline truncate max-w-[120px]">
                  {ministry?.name ?? "Ministério"}
                </span>
              </button>
            </div>

            <p className="text-sm font-semibold text-slate-700">Repertório</p>

            <div className="shrink-0">
              {isAdmin && (
                <button
                  onClick={openCreate}
                  className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white text-xs font-semibold rounded-xl hover:bg-violet-700 transition-colors"
                >
                  <IconPlus /> Nova música
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <IconSearch />
              </span>
              <input
                type="text"
                placeholder="Buscar por título ou artista…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition"
              />
            </div>
            <p className="text-xs text-slate-400 shrink-0">
              {filteredList.length} música{filteredList.length !== 1 ? "s" : ""}{" "}
              no repertório
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {isLoading ? (
              <RepertorioSkeleton />
            ) : isError ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <span className="text-3xl">⚠️</span>
                <p className="text-sm text-slate-500">
                  Erro ao carregar repertório.
                </p>
              </div>
            ) : filteredList.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <span className="text-4xl opacity-25">🎵</span>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {search
                      ? `Nenhuma música encontrada para "${search}"`
                      : "Repertório vazio"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {search ? (
                      <button
                        onClick={() => setSearch("")}
                        className="text-violet-600 hover:underline"
                      >
                        Limpar busca
                      </button>
                    ) : isAdmin ? (
                      "Adicione a primeira música ao repertório."
                    ) : (
                      "Nenhuma música cadastrada ainda."
                    )}
                  </p>
                </div>
                {!search && isAdmin && (
                  <button
                    onClick={openCreate}
                    className="flex items-center gap-1.5 mt-1 px-4 py-2 bg-violet-600 text-white text-xs font-semibold rounded-xl hover:bg-violet-700 transition-colors"
                  >
                    <IconPlus /> Adicionar música
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-50 p-2">
                {filteredList.map((music) => (
                  <MusicRow
                    key={music.id}
                    music={music}
                    isAdmin={isAdmin}
                    onEdit={openEdit}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <MusicFormModal
        open={formOpen}
        onClose={closeForm}
        onSubmit={(data) =>
          editTarget ? updateMutation.mutate(data) : createMutation.mutate(data)
        }
        isPending={createMutation.isPending || updateMutation.isPending}
        initial={editTarget}
      />

      <DeleteConfirmModal
        music={deleteTarget}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setDeleteTarget(null)}
        isPending={deleteMutation.isPending}
      />
    </>
  );
}
