import { toast } from 'react-toastify'
import { ApiError } from '@/shared/api/ApiError'

interface UseApiErrorOptions {
  // permite sobrescrever a mensagem por código de erro
  messages?: Partial<Record<ApiError['code'], string>>
  // silencia o toast global para tratar manualmente
  silent?: boolean
}

export function useApiError(options: UseApiErrorOptions = {}) {
  function handle(error: unknown) {
    if (!(error instanceof ApiError)) {
      toast.error('Ocorreu um erro inesperado.')
      return
    }

    if (options.silent) return

    const customMessage = options.messages?.[error.code]
    toast.error(customMessage ?? error.message)
  }

  return { handle }
}