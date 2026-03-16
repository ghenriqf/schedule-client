import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ministryApi } from '@/features/ministry'

export function useJoinMinistry() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [inviteCode, setInviteCode] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: () => ministryApi.join(inviteCode.trim()),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ministries'] })
      setSubmitted(true)
    },
    onError: () => {
      toast.error('Código inválido ou expirado. Verifique e tente novamente.')
    },
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