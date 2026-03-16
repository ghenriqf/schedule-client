import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Bounce, toast } from 'react-toastify'
import { authApi } from '@/features/auth'
import type { UserRequest } from '@/features/auth'
import type { AxiosError } from 'axios'

const TOAST_OPTS = {
  position: 'top-center' as const,
  autoClose: 5000,
  theme: 'light' as const,
  transition: Bounce,
}

export function useSignup() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [birth, setBirth] = useState('')
  const [password, setPassword] = useState('')

  const { mutate, isPending } = useMutation({
    mutationFn: (credentials: UserRequest) => authApi.signUp(credentials),
    onSuccess: () => {
      toast.success('Conta criada com sucesso! Faça login para continuar.', TOAST_OPTS)
      navigate('/login', { replace: true })
    },
    onError: (error: AxiosError<Record<string, string>>) => {
      if (!error.response) {
        toast.error('Servidor offline', TOAST_OPTS)
        return
      }
      const firstError = Object.values(error.response.data)[0]
      toast.error(firstError || 'Erro ao criar conta', TOAST_OPTS)
    },
  })

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    mutate({ username, name, email, password, birth })
  }

  return {
    username, setUsername,
    name, setName,
    email, setEmail,
    birth, setBirth,
    password, setPassword,
    isPending,
    onSubmit,
  }
}