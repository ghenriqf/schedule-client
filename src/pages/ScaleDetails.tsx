import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { scalesService } from "../services/scales.service";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { MusicResponse } from "../types/music";
import type { MemberResponse } from "../types/member";

export function ScaleDetails() {
  const { ministryId, scaleId } = useParams();

  const parsedMinistryId = useMemo(() => Number(ministryId), [ministryId]);
  const parsedScaleId = useMemo(() => Number(scaleId), [scaleId]);

  const {
    data: scale,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["scale-details", parsedScaleId],
    queryFn: () => scalesService.findById(parsedMinistryId, parsedScaleId),
    enabled: !!parsedScaleId,
  });

  if (isLoading) {
    return (
      <div className="p-8 text-sm text-slate-500">Carregando escala...</div>
    );
  }

  if (isError || !scale) {
    return (
      <div className="p-8 text-sm text-red-500">Erro ao carregar escala.</div>
    );
  }

  const formattedDate = format(
    new Date(scale.date),
    "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
    { locale: ptBR },
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {scale.name}
            </h1>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1.5 text-xl font-semibold bg-indigo-50 text-indigo-700 rounded-full">
                {formattedDate}
              </span>
            </div>
          </div>

          <Link
            to={`/ministries/${parsedMinistryId}`}
            className="self-start md:self-auto px-5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm"
          >
            Voltar
          </Link>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Descrição
              </p>
              <p className="text-slate-700 text-sm leading-relaxed">
                {scale.description || "Sem descrição disponível."}
              </p>
            </div>

            <div className="flex gap-10">
              <div className="text-center">
                <p className="text-3xl font-bold text-slate-900">
                  {scale.members.length}
                </p>
                <p className="text-xs text-slate-500 mt-1">Membros</p>
              </div>

              <div className="text-center">
                <p className="text-3xl font-bold text-slate-900">
                  {scale.musics.length}
                </p>
                <p className="text-xs text-slate-500 mt-1">Músicas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Membros e Músicas lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Membros */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-semibold text-slate-800">
                Membros escalados
              </h2>
              <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
                {scale.members.length}
              </span>
            </div>

            {scale.members.length === 0 ? (
              <p className="text-sm text-slate-400">Nenhum membro vinculado.</p>
            ) : (
              <div className="space-y-3">
                {scale.members.map((member: MemberResponse) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition"
                  >
                    <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                      {member.user.username.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {member.user.username}
                      </p>
                      <p className="text-xs text-slate-400">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Músicas */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-semibold text-slate-800">
                Repertório
              </h2>
              <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full">
                {scale.musics.length}
              </span>
            </div>

            {scale.musics.length === 0 ? (
              <p className="text-sm text-slate-400">
                Nenhuma música adicionada.
              </p>
            ) : (
              <div className="space-y-3">
                {scale.musics.map((music: MusicResponse) => (
                  <div
                    key={music.id}
                    className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
                  >
                    <p className="text-sm font-semibold text-slate-800">
                      {music.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {music.artist} • Tom: {music.tone}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
