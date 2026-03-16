import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { scaleApi } from '@/features/scale'
import { ministryApi } from '@/features/ministry'

export function useScaleDetails() {
  const { ministryId, scaleId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [musicModalOpen, setMusicModalOpen] = useState(false)
  const [memberModalOpen, setMemberModalOpen] = useState(false)

  const parsedMinistryId = useMemo(() => Number(ministryId), [ministryId])
  const parsedScaleId = useMemo(() => Number(scaleId), [scaleId])

  const { data: scale, isLoading, isError } = useQuery({
    queryKey: ['scale-details', parsedScaleId],
    queryFn: () => scaleApi.findById(parsedMinistryId, parsedScaleId),
    enabled: !!parsedScaleId,
  })

  const { data: ministry } = useQuery({
    queryKey: ['ministry', parsedMinistryId],
    queryFn: () => ministryApi.findDetails(parsedMinistryId),
    enabled: !!parsedMinistryId,
  })

  const removeMusicMutation = useMutation({
    mutationFn: (musicId: number) => scaleApi.removeMusic(parsedScaleId, musicId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['scale-details', parsedScaleId] }),
  })

  const removeMemberMutation = useMutation({
    mutationFn: (memberId: number) => scaleApi.removeMember(parsedScaleId, memberId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['scale-details', parsedScaleId] }),
  })

  return {
    parsedMinistryId,
    parsedScaleId,
    scale,
    ministry,
    isLoading,
    isError,
    isAdmin: ministry?.role === 'ADMIN',
    musicModalOpen, setMusicModalOpen,
    memberModalOpen, setMemberModalOpen,
    removeMusic: (id: number) => removeMusicMutation.mutate(id),
    removeMember: (id: number) => removeMemberMutation.mutate(id),
    isRemovingMusic: removeMusicMutation.isPending,
    isRemovingMember: removeMemberMutation.isPending,
    navigateToMinistry: () => navigate(`/ministries/${parsedMinistryId}`),
  }
}