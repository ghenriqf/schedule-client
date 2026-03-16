import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Bounce, toast } from 'react-toastify'
import { authApi } from '@/features/auth'
import type { LoginRequest } from '@/features/auth'
import type { AxiosError } from 'axios'

const TOAST_OPTS = {
  position: 'top-center' as const,
  autoClose: 5000,
  theme: 'light' as const,
  transition: Bounce,
}

export function useLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { mutate, isPending } = useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: () => {
      toast.success('Login realizado com sucesso!', TOAST_OPTS)
      navigate('/ministries', { replace: true })
    },
    onError: (error: AxiosError<Record<string, string>>) => {
      if (!error.response) {
        toast.error('Servidor offline', TOAST_OPTS)
        return
      }
      const firstError = Object.values(error.response.data)[0]
      toast.error(firstError || 'Erro ao fazer login', TOAST_OPTS)
    },
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