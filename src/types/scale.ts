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

export interface ScaleDetailsResponse {
  id: number;
  ministerId: number;
  name: string;
  description?: string;
  date: string;
  members: MemberResponse[];
  musics: MusicResponse[];
}
