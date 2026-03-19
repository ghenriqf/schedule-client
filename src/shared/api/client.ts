import axios from 'axios'
import { AUTH_TOKEN_KEY } from '@/features/auth'
import { ApiError } from './ApiError'
import { emitUnauthorized } from '@/shared/lib/authEvents'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    // sem resposta = servidor offline ou rede caiu
    if (!error.response) {
      return Promise.reject(ApiError.network())
    }

    const { status, data } = error.response
    const apiError = ApiError.fromStatus(status, data)

    if (status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      emitUnauthorized()
    }

    return Promise.reject(apiError)
  }
)

export { client }