import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { scaleApi } from '@/features/scale'
import { membersApi } from '@/features/ministry'
import { useApiError } from '@/shared/lib/useApiError'
import type { ScaleRequest } from '@/entities/scale/model/types'

function formatDateForInput(dateString: string): string {
  return dateString.replace(' ', 'T').slice(0, 16)
}

function formatDateForApi(dateString: string): string {
  return dateString + ':00'
}

interface FormState {
  name: string
  description: string
  date: string
  ministerId: number | ''
}

export function useEditScale() {
  const { ministryId, scaleId } = useParams<{ ministryId: string; scaleId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { handle } = useApiError({
    messages: {
      NOT_FOUND: 'Escala não encontrada.',
      FORBIDDEN: 'Você não tem permissão para editar esta escala.',
      CONFLICT: 'Já existe uma escala para essa data.',
    },
  })

  const parsedMinistryId = Number(ministryId)
  const parsedScaleId = Number(scaleId)

  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<FormState | null>(null)

  const { data: scale, isLoading: scaleLoading } = useQuery({
    queryKey: ['scale-details', parsedScaleId],
    queryFn: () => scaleApi.findById(parsedMinistryId, parsedScaleId),
    enabled: !!parsedScaleId,
  })

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ['members', parsedMinistryId],
    queryFn: () => membersApi.listByMinistry(parsedMinistryId),
    enabled: !!parsedMinistryId,
  })

  const resolvedForm: FormState = form ?? (scale ? {
    name: scale.name,
    description: scale.description ?? '',
    date: formatDateForInput(scale.date),
    ministerId: scale.members[0]?.memberId ?? '',
  } : { name: '', description: '', date: '', ministerId: '' })

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const payload: ScaleRequest = {
        name: resolvedForm.name.trim(),
        description: resolvedForm.description.trim() || undefined,
        date: formatDateForApi(resolvedForm.date),
        ministerId: Number(resolvedForm.ministerId),
      }
      return scaleApi.update(parsedMinistryId, parsedScaleId, payload)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['scale-details', parsedScaleId] })
      await queryClient.invalidateQueries({ queryKey: ['scales', parsedMinistryId] })
      setSubmitted(true)
    },
    onError: handle,
  })

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm({ ...resolvedForm, [key]: value })
  }

  return {
    parsedMinistryId,
    parsedScaleId,
    form: resolvedForm,
    setField,
    submitted,
    isPending,
    isLoading: scaleLoading,
    members,
    membersLoading,
    hasMembers: (members?.length ?? 0) > 0,
    canSubmit: resolvedForm.name.trim().length > 0 && resolvedForm.date.length > 0 && resolvedForm.ministerId !== '' && !isPending,
    mutate,
    navigateBack: () => navigate(`/ministries/${parsedMinistryId}/scales/${parsedScaleId}`),
  }
}