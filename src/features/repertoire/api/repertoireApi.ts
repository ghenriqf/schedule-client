import { client } from '@/shared/api/client'
import type { MusicRequest, MusicResponse } from '@/entities/music/model/types'

interface MusicListParams {
  page?: number
  size?: number
  sort?: string
  search?: string
}

export const repertoireApi = {
  listByMinistry: async (ministryId: number, params: MusicListParams = {}): Promise<MusicResponse[]> => {
    const { data } = await client.get<MusicResponse[]>(`ministries/${ministryId}/musics`, { params })
    return data
  },

  create: async (ministryId: number, music: MusicRequest): Promise<MusicResponse> => {
    const { data } = await client.post<MusicResponse>(`ministries/${ministryId}/musics`, music)
    return data
  },

  update: async (ministryId: number, musicId: number, music: MusicRequest): Promise<MusicResponse> => {
    const { data } = await client.put<MusicResponse>(`ministries/${ministryId}/musics/${musicId}`, music)
    return data
  },

  delete: async (ministryId: number, musicId: number): Promise<void> => {
    await client.delete(`ministries/${ministryId}/musics/${musicId}`)
  },
}