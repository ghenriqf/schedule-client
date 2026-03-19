import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { scaleApi } from '@/features/scale'
import { membersApi } from '@/features/ministry'
import { useApiError } from '@/shared/lib/useApiError'
import type { ScaleRequest } from '@/entities/scale/model/types'

function formatDateForApi(dateString: string): string {
  return dateString + ':00'
}

export function useCreateScale() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { handle } = useApiError({
    messages: {
      NOT_FOUND: 'Ministério não encontrado.',
      FORBIDDEN: 'Você não tem permissão para criar escalas.',
      CONFLICT: 'Já existe uma escala para essa data.',
    },
  })

  const ministryId = id ? Number(id) : null

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [ministerId, setMinisterId] = useState<number | ''>('')
  const [submitted, setSubmitted] = useState(false)

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ['members', ministryId],
    queryFn: () => membersApi.listByMinistry(ministryId!),
    enabled: ministryId !== null,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      if (!ministryId) throw new Error('MinistryId inválido')
      const payload: ScaleRequest = {
        name: name.trim(),
        description: description.trim() || undefined,
        date: formatDateForApi(date),
        ministerId: Number(ministerId),
      }
      return scaleApi.create(ministryId, payload)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['scales', ministryId] })
      setSubmitted(true)
    },
    onError: handle,
  })

  return {
    ministryId,
    name, setName,
    description, setDescription,
    date, setDate,
    ministerId, setMinisterId,
    submitted,
    isPending,
    members,
    membersLoading,
    hasMembers: (members?.length ?? 0) > 0,
    canSubmit: name.trim().length > 0 && date.length > 0 && ministerId !== '' && (members?.length ?? 0) > 0 && !isPending,
    mutate,
    navigateBack: () => navigate(`/ministries/${ministryId}`),
  }
}