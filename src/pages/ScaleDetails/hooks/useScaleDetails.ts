import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scaleApi } from "@/features/scale";
import { ministryApi, membersApi } from "@/features/ministry";
import { useApiError } from "@/shared/lib/useApiError";
import { getCurrentUserId } from "@/shared/lib/jwtUtils";

export function useScaleDetails() {
  const { ministryId, scaleId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { handle: handleRemoveMusic } = useApiError({
    messages: {
      NOT_FOUND: "Música não encontrada na escala.",
      FORBIDDEN: "Você não tem permissão para remover músicas.",
    },
  });

  const { handle: handleRemoveMember } = useApiError({
    messages: {
      NOT_FOUND: "Membro não encontrado na escala.",
      FORBIDDEN: "Você não tem permissão para remover membros.",
    },
  });

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

  const { data: members } = useQuery({
    queryKey: ["members", parsedMinistryId],
    queryFn: () => membersApi.listByMinistry(parsedMinistryId),
    enabled: !!parsedMinistryId,
  });

  const currentUserId = getCurrentUserId();

  const currentMember = members?.find((m) => m.userId === currentUserId);

  const isMinister = !!currentMember && currentMember.id === scale?.ministerId;

  const removeMusicMutation = useMutation({
    mutationFn: (musicId: number) =>
      scaleApi.removeMusic(parsedScaleId, musicId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["scale-details", parsedScaleId],
      }),
    onError: handleRemoveMusic,
  });

  const removeMemberMutation = useMutation({
    mutationFn: (memberId: number) =>
      scaleApi.removeMember(parsedScaleId, memberId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["scale-details", parsedScaleId],
      }),
    onError: handleRemoveMember,
  });

  return {
    parsedMinistryId,
    parsedScaleId,
    scale,
    ministry,
    isLoading,
    isError,
    isAdmin: ministry?.role === "ADMIN",
    isMinister, // novo
    musicModalOpen,
    setMusicModalOpen,
    memberModalOpen,
    setMemberModalOpen,
    removeMusic: (id: number) => removeMusicMutation.mutate(id),
    removeMember: (id: number) => removeMemberMutation.mutate(id),
    isRemovingMusic: removeMusicMutation.isPending,
    isRemovingMember: removeMemberMutation.isPending,
    navigateToMinistry: () => navigate(`/ministries/${parsedMinistryId}`),
  };
}
