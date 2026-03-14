import { client } from '@/shared/api/client'
import type { MemberResponse } from '@/entities/member/model/types'

export const membersApi = {
  listByMinistry: async (ministryId: number): Promise<MemberResponse[]> => {
    const { data } = await client.get<MemberResponse[]>(`ministries/${ministryId}/members`)
    return data
  },
}