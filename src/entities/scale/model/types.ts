import type { MusicResponse } from "@/entities/music/model/types";

export interface ScaleRequest {
  name: string;
  description?: string;
  date: string;
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
  ministerId: number;
  name: string;
  description?: string;
  date: string;
  members: ScaleMemberResponse[];
  musics: MusicResponse[];
}
