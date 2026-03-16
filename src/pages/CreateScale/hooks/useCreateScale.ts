import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { scaleApi } from '@/features/scale'
import { membersApi } from '@/features/ministry'
import type { ScaleRequest } from '@/entities/scale/model/types'

function formatDateForApi(dateString: string): string {
  return dateString.replace('T', ' ')
}

export function useCreateScale() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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
    onError: () => {
      toast.error('Não foi possível criar a escala. Tente novamente.')
    },
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