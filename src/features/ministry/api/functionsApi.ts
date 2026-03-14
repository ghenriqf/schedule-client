import { client } from '@/shared/api/client'
import type { FunctionResponse } from '@/entities/function/model/types'

export const functionsApi = {
  list: async (): Promise<FunctionResponse[]> => {
    const { data } = await client.get<FunctionResponse[]>('functions')
    return data
  },
}