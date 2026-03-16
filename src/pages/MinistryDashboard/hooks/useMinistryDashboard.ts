import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ministryApi, membersApi } from '@/features/ministry'
import { scaleApi } from '@/features/scale'
import type { MinistryDetailResponse } from '@/entities/ministry/model/types'
import type { MemberResponse } from '@/entities/member/model/types'
import type { ScaleResponse } from '@/entities/scale/model/types'

export function useMinistryDashboard() {
  const { id } = useParams()
  const navigate = useNavigate()

  const ministryId = useMemo(() => {
    const parsed = Number(id)
    return Number.isNaN(parsed) ? null : parsed
  }, [id])

  const { data: ministry, isLoading, isError, refetch } = useQuery<MinistryDetailResponse>({
    queryKey: ['ministry', ministryId],
    queryFn: () => ministryApi.findDetails(ministryId!),
    enabled: ministryId !== null,
  })

  const { data: scales = [] } = useQuery<ScaleResponse[]>({
    queryKey: ['scales', ministryId],
    queryFn: () => scaleApi.listByMinistry(ministryId!),
    enabled: ministryId !== null,
  })

  const { data: members = [] } = useQuery<MemberResponse[]>({
    queryKey: ['members', ministryId],
    queryFn: () => membersApi.listByMinistry(ministryId!),
    enabled: ministryId !== null,
  })

  return {
    ministryId,
    ministry,
    scales,
    members,
    isLoading,
    isError,
    refetch,
    navigateToMinistries: () => navigate('/ministries'),
    navigateToRepertoire: () => navigate(`/ministries/${ministryId}/repertorio`),
    navigateToCreateScale: () => navigate(`/ministries/${ministryId}/scales/create`),
  }
}