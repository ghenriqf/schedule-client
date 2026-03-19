import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { AUTH_TOKEN_KEY } from '@/features/auth'
import { useAuthRedirect } from '@/shared/lib/useAuthRedirect'

export function AppLayout() {
  useAuthRedirect()

  const location = useLocation()
  const token = localStorage.getItem(AUTH_TOKEN_KEY)

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}