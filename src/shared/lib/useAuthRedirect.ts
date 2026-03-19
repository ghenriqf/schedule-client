import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authEvents, AUTH_EVENTS } from './authEvents'

export function useAuthRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    function handleUnauthorized() {
      toast.info('Sua sessão expirou. Faça login novamente.')
      navigate('/login', { replace: true })
    }

    authEvents.addEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized)
    return () => {
      authEvents.removeEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized)
    }
  }, [navigate])
}