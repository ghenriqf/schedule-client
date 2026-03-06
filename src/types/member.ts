import type { UserResponse } from "./auth";

export interface MemberResponse {
  id: number;
  userId: number;
  ministryId: number;
  functions:
    | {
        id: number;
        name: string;
      }[]
    | null;
  role: "ADMIN" | "MEMBER";
  user: UserResponse;
}
