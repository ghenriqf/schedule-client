export type MinistryRole = "ADMIN" | "MEMBER";

export interface MinistryRequest {
  name: string;
  description: string;
}

export interface MinistryResponse {
  id: number;
  name: string;
  description: string;
  avatarUrl?: string | null;
}

export interface MinistryStats {
  memberCount: number;
  upcomingScalesCount: number;
  repertoryCount: number;
}

export interface MinistryDetailResponse extends MinistryResponse {
  ministryStats: MinistryStats;
  role: MinistryRole;
  inviteCode?: string | null;
  members?: MinistryMember[];
}

export interface MinistryMember {
  id: number;
  name: string;
  role?: MinistryRole | string;
  avatarUrl?: string | null;
}
