import type { MemberResponse } from "./member";
import type { MusicResponse } from "./music";

export interface ScaleRequest {
  name: string;
  description?: string;
  date: string; // yyyy-MM-dd HH:mm
  ministerId: number;
}

export interface ScaleResponse {
  id: number;
  name: string;
  description?: string;
  date: string;
  ministerId: number;
}

export interface ScaleMemberResponse {
  id: number;
  memberId: number;
  memberName: string;
  functions: string[];
}

export interface ScaleDetailsResponse {
  id: number;
  ministryId: number;
  name: string;
  description?: string;
  date: string;
  members: ScaleMemberResponse[];
  musics: MusicResponse[];
}
