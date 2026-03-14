import { client } from '@/shared/api/client'
import type { MinistryDetailResponse, MinistryRequest, MinistryResponse } from '@/entities/ministry/model/types'

const BASE = 'ministries'

export const ministryApi = {
  list: async (): Promise<MinistryDetailResponse[]> => {
    const { data } = await client.get<MinistryDetailResponse[]>(BASE)
    return data
  },

  findDetails: async (id: number): Promise<MinistryDetailResponse> => {
    const { data } = await client.get<MinistryDetailResponse>(`${BASE}/${id}`)
    return data
  },

  create: async (ministry: MinistryRequest, avatarImage?: File | null): Promise<MinistryResponse> => {
    const formData = new FormData()
    formData.append('request', new Blob([JSON.stringify(ministry)], { type: 'application/json' }))
    if (avatarImage) formData.append('avatarImage', avatarImage)
    const { data } = await client.post<MinistryResponse>(BASE, formData)
    return data
  },

  generateInviteCode: async (id: number): Promise<string> => {
    const { data } = await client.post<string>(`${BASE}/${id}/invite-code`)
    return data
  },

  join: async (inviteCode: string): Promise<void> => {
    await client.post(`${BASE}/join/${inviteCode}`)
  },
}