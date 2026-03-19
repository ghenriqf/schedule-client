import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ministryApi } from '@/features/ministry'
import { useApiError } from '@/shared/lib/useApiError'

export function useJoinMinistry() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { handle } = useApiError({
    messages: {
      NOT_FOUND: 'Código inválido ou expirado. Verifique e tente novamente.',
      CONFLICT: 'Você já é membro deste ministério.',
    },
  })

  const [inviteCode, setInviteCode] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: () => ministryApi.join(inviteCode.trim()),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ministries'] })
      setSubmitted(true)
    },
    onError: handle,
  })

  return {
    inviteCode,
    setInviteCode,
    submitted,
    isPending,
    canSubmit: inviteCode.trim().length > 0 && !isPending,
    mutate,
    navigateToMinistries: () => navigate('/ministries'),
    navigateToCreate: () => navigate('/ministries/create'),
  }
}