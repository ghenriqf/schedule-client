import { client } from '@/shared/api/client'
import type { ScaleDetailsResponse, ScaleRequest, ScaleResponse } from '@/entities/scale/model/types'

const BASE = 'ministries'

export const scaleApi = {
  create: async (ministryId: number, scale: ScaleRequest): Promise<ScaleResponse> => {
    const { data } = await client.post<ScaleResponse>(`${BASE}/${ministryId}/scales`, scale)
    return data
  },

  update: async (ministryId: number, scaleId: number, scale: ScaleRequest): Promise<ScaleResponse> => {
    const { data } = await client.patch<ScaleResponse>(`${BASE}/${ministryId}/scales/${scaleId}`, scale)
    return data
  },

  listByMinistry: async (ministryId: number): Promise<ScaleResponse[]> => {
    const { data } = await client.get<ScaleResponse[]>(`${BASE}/${ministryId}/scales`)
    return data
  },

  findById: async (ministryId: number, scaleId: number): Promise<ScaleDetailsResponse> => {
    const { data } = await client.get<ScaleDetailsResponse>(`${BASE}/${ministryId}/scales/${scaleId}`)
    return data
  },

  addMusic: async (scaleId: number, musicId: number): Promise<ScaleDetailsResponse> => {
    const { data } = await client.post<ScaleDetailsResponse>(`scales/${scaleId}/musics/${musicId}`)
    return data
  },

  removeMusic: async (scaleId: number, musicId: number): Promise<ScaleDetailsResponse> => {
    const { data } = await client.delete<ScaleDetailsResponse>(`scales/${scaleId}/musics/${musicId}`)
    return data
  },

  addMember: async (scaleId: number, memberId: number, request: { functionIds: number[] }): Promise<ScaleDetailsResponse> => {
    const { data } = await client.post<ScaleDetailsResponse>(`scales/${scaleId}/members/${memberId}`, request)
    return data
  },

  removeMember: async (scaleId: number, memberId: number): Promise<ScaleDetailsResponse> => {
    const { data } = await client.delete<ScaleDetailsResponse>(`scales/${scaleId}/members/${memberId}`)
    return data
  },
}