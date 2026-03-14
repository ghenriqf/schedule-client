import { client } from '@/shared/api/client'
import { AUTH_TOKEN_KEY } from '@/features/auth/model/constants'
import type { LoginRequest, LoginResponse, UserRequest, UserResponse } from '@/features/auth/model/types'

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await client.post<LoginResponse>('/auth/login', data)

    if (response.data.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.token)
    }

    return response.data
  },

  signUp: async (data: UserRequest): Promise<UserResponse> => {
    const response = await client.post<UserResponse>('/auth/signup', data)
    return response.data
  },
}