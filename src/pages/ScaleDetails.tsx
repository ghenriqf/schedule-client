import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { scaleApi } from "@/features/scale/api/scaleApi";
import { ministryApi } from "@/features/ministry/api/ministryApi";
import { AddMusicModal } from "@/features/repertoire/ui/AddMusicModal";
import { AddMemberModal } from "@/features/ministry/ui/AddMemberModal";

import type { MusicResponse } from "@/entities/music/model/types";
import type { ScaleMemberResponse } from "@/entities/scale/model/types";

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ScaleDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans animate-pulse">
      <div className="h-14 bg-white border-b border-slate-100" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 space-y-5">
        <div className="h-24 bg-white rounded-2xl border border-slate-100" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="h-64 bg-white rounded-2xl border border-slate-100" />
          <div className="h-64 bg-white rounded-2xl border border-slate-100" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <span className="text-3xl opacity-25">{icon}</span>
      <p className="text-xs text-slate-400">{message}</p>
    </div>
  );
}

interface MemberRowProps {
  member: ScaleMemberResponse;
  isAdmin: boolean;
  isRemoving: boolean;
  onRemove: (id: number) => void;
}

function MemberRow({ member, isAdmin, isRemoving, onRemove }: MemberRowProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
      <div className="w-9 h-9 rounded-full bg-linear-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
        {initials(member.memberName)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800 truncate">
          {member.memberName}
        </p>
        <p className="text-[11px] text-slate-400 truncate">
          {member.functions?.join(", ") || "Sem funções atribuídas"}
        </p>
      </div>
      {isAdmin && (
        <button
          onClick={() => onRemove(member.memberId)}
          disabled={isRemoving}
          className="shrink-0 opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[11px] text-red-400 hover:text-red-600 disabled:opacity-40 transition-all"
        >
          <IconTrash /> Remover
        </button>
      )}
    </div>
  );
}

interface MusicRowProps {
  music: MusicResponse;
  isAdmin: boolean;
  isRemoving: boolean;
  onRemove: (id: number) => void;
}

function MusicRow({ music, isAdmin, isRemoving, onRemove }: MusicRowProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
      <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-400 text-base shrink-0">
        🎵
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800 truncate">
          {music.title}
        </p>
        <p className="text-[11px] text-slate-400 truncate">
          {music.artist}
          <span className="mx-1.5 text-slate-300">·</span>
          Tom: <span className="font-medium text-slate-500">{music.tone}</span>
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {music.videoLink && (
          <a
            href={music.videoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-violet-500 hover:text-violet-700 transition-colors"
            title="Ver vídeo"
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
            title="Ver cifra"
          >
            <IconLink /> Cifra
          </a>
        )}

        {isAdmin && (
          <button
            onClick={() => onRemove(music.id)}
            disabled={isRemoving}
            className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[11px] text-red-400 hover:text-red-600 disabled:opacity-40 transition-all"
          >
            <IconTrash /> Remover
          </button>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-xl bg-slate-50 border border-slate-100">
      <span className="text-lg">{icon}</span>
      <span className="text-lg font-bold text-slate-800 leading-none">
        {value}
      </span>
      <span className="text-[10px] text-slate-400 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

export function ScaleDetails() {
  const { ministryId, scaleId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [musicModalOpen, setMusicModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);

  const parsedMinistryId = useMemo(() => Number(ministryId), [ministryId]);
  const parsedScaleId = useMemo(() => Number(scaleId), [scaleId]);

  const {
    data: scale,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["scale-details", parsedScaleId],
    queryFn: () => scaleApi.findById(parsedMinistryId, parsedScaleId),
    enabled: !!parsedScaleId,
  });

  const { data: ministry } = useQuery({
    queryKey: ["ministry", parsedMinistryId],
    queryFn: () => ministryApi.findDetails(parsedMinistryId),
    enabled: !!parsedMinistryId,
  });

  const isAdmin = ministry?.role === "ADMIN";

 const removeMusicMutation = useMutation({
  mutationFn: (musicId: number) =>
    scaleApi.removeMusic(parsedScaleId, musicId),
  onSuccess: () =>
    queryClient.invalidateQueries({
      queryKey: ['scale-details', parsedScaleId],
    }),
})

const removeMemberMutation = useMutation({
  mutationFn: (memberId: number) =>
    scaleApi.removeMember(parsedScaleId, memberId),
  onSuccess: () =>
    queryClient.invalidateQueries({
      queryKey: ['scale-details', parsedScaleId],
    }),
})

  if (isLoading) return <ScaleDetailsSkeleton />;

  const formattedDate = scale
    ? format(new Date(scale.date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
        locale: ptBR,
      })
    : "";

  return (
    <>
      <div className="min-h-screen bg-slate-50 font-sans">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-slate-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            {/* Left: logo + back */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-7 h-7 rounded-lg bg-linear-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white shrink-0">
                  <IconNote />
                </div>
                <span className="text-sm font-bold text-slate-800 hidden sm:inline tracking-tight">
                  Schedule
                </span>
              </div>

              <span className="text-slate-200 hidden sm:inline">|</span>

              <button
                onClick={() => navigate(`/ministries/${parsedMinistryId}`)}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
              >
                <IconArrowLeft />
                <span className="hidden sm:inline truncate max-w-30">
                  {ministry?.name ?? "Ministério"}
                </span>
              </button>
            </div>

            {/* Center: scale name */}
            {scale && (
              <p className="text-sm font-semibold text-slate-700 truncate max-w-45 sm:max-w-xs">
                {scale.name}
              </p>
            )}

            {/* Right: admin actions */}
            <div className="flex items-center gap-2 shrink-0">
              {isAdmin && !isError && scale && (
                <>
                  <button
                    onClick={() => setMemberModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    + Membro
                  </button>
                  <button
                    onClick={() => setMusicModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white text-xs font-semibold rounded-xl hover:bg-violet-700 transition-colors"
                  >
                    + Música
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 space-y-5">
          {isError || !scale ? (
            <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
              <span className="text-4xl">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Erro ao carregar escala
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Verifique sua conexão e tente novamente.
                </p>
              </div>
              <button
                onClick={() => navigate(`/ministries/${parsedMinistryId}`)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                <IconArrowLeft /> Voltar ao ministério
              </button>
            </div>
          ) : (
            <>
              {/* ── Info card ── */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
                  <div className="space-y-2 flex-1 min-w-0">
                    <h1 className="text-xl font-bold text-slate-800 truncate">
                      {scale.name}
                    </h1>

                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-600">
                      📅 {formattedDate}
                    </span>

                    {scale.description && (
                      <p className="text-sm text-slate-500 leading-relaxed pt-1">
                        {scale.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 shrink-0">
                    <Stat
                      icon="👥"
                      label="Membros"
                      value={scale.members.length}
                    />
                    <Stat
                      icon="🎵"
                      label="Músicas"
                      value={scale.musics.length}
                    />
                  </div>
                </div>
              </div>

              {/* ── Members + Music grid ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Members */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-800">
                        Membros escalados
                      </h2>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {scale.members.length} participantes
                      </p>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => setMemberModalOpen(true)}
                        className="text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors"
                      >
                        + Adicionar
                      </button>
                    )}
                  </div>

                  <div className="p-3">
                    {scale.members.map((member: ScaleMemberResponse) => (
                      <MemberRow
                        key={member.id}
                        member={member}
                        isAdmin={isAdmin}
                        isRemoving={removeMemberMutation.isPending}
                        onRemove={(id) => removeMemberMutation.mutate(id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Music */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-800">
                        Repertório
                      </h2>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {scale.musics.length} músicas
                      </p>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => setMusicModalOpen(true)}
                        className="text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors"
                      >
                        + Adicionar
                      </button>
                    )}
                  </div>

                  <div className="p-3">
                    {scale.musics.length === 0 ? (
                      <EmptyState
                        icon="🎵"
                        message="Nenhuma música adicionada à escala."
                      />
                    ) : (
                      <div className="space-y-1">
                        {scale.musics.map((music: MusicResponse) => (
                          <MusicRow
                            key={music.id}
                            music={music}
                            isAdmin={isAdmin}
                            isRemoving={removeMusicMutation.isPending}
                            onRemove={(id) => removeMusicMutation.mutate(id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <AddMusicModal
        ministryId={parsedMinistryId}
        scaleId={parsedScaleId}
        open={musicModalOpen}
        onClose={() => setMusicModalOpen(false)}
      />

      <AddMemberModal
        ministryId={parsedMinistryId}
        scaleId={parsedScaleId}
        open={memberModalOpen}
        onClose={() => setMemberModalOpen(false)}
      />
    </>
  );
}
