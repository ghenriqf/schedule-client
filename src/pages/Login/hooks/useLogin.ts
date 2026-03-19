import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authApi } from '@/features/auth'
import { useApiError } from '@/shared/lib/useApiError'
import type { LoginRequest } from '@/features/auth'

export function useLogin() {
  const navigate = useNavigate()
  const { handle } = useApiError({
    messages: {
      UNAUTHORIZED: 'Email ou senha incorretos.',
      NETWORK_ERROR: 'Servidor indisponível. Verifique sua conexão.',
    },
  })

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { mutate, isPending } = useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: () => {
      toast.success('Login realizado com sucesso!')
      navigate('/ministries', { replace: true })
    },
    onError: handle,
  })

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutate({ email, password })
  }

  return {
    email, setEmail,
    password, setPassword,
    isPending,
    onSubmit,
  }
}