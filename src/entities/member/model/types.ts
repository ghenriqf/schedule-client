import type { UserResponse } from '@/features/auth/model/types'

export interface FunctionResponse {
  id: number
  name: string
}

export interface MemberResponse {
  id: number
  userId: number
  ministryId: number
  functions: FunctionResponse[] | null
  role: 'ADMIN' | 'MEMBER'
  user: UserResponse
}