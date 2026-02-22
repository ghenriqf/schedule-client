export type MinistryRole = "admin" | "member";

export interface MinistryResponse {
  id: number;
  name: string;
  description: string;
}

export interface MinistryStats {
  memberCount: number;
  upcomingScalesCount: number;
  repertoryCount: number;
}

export interface MinistryDetailResponse {
  id: number;
  name: string;
  description: string;
  ministryStats: MinistryStats;
  role: MinistryRole;
}
