// Session Device Info
export interface SessionDevice {
  ip: string;
  device: string | null;
  os: string | null;
  browser: string | null;
}

// Session Geo Info
export interface SessionGeo {
  country: string | null;
  region: string | null;
  city: string | null;
  timezone: string | null;
}

// Session User Info
export interface SessionUser {
  id: number;
  email: string;
  role: string;
}

// Session completa
export interface Session {
  id: number;
  user: SessionUser;
  device: SessionDevice;
  geo: SessionGeo;
  createdAt: string; // ISO datetime
  lastActivityAt: string | null; // ISO datetime
  expiresAt: string; // ISO datetime
}

// Response API /auth/sessions
export interface SessionsResponse {
  success: boolean;
  data: Session[];
  total: number;
}

// Block user duration
export type BlockDuration = '1h' | '24h' | '7d' | 'permanent';

// Block user request
export interface BlockUserRequest {
  duration: BlockDuration;
  reason: string;
}

// Block user response
export interface BlockUserResponse {
  success: boolean;
  message?: string;
}

// Revoke session response
export interface RevokeSessionResponse {
  success: boolean;
  message?: string;
}

// Unblock user response
export interface UnblockUserResponse {
  success: boolean;
  message?: string;
}

// Helper type per durate leggibili
export const BLOCK_DURATION_LABELS: Record<BlockDuration, string> = {
  '1h': '1 ora',
  '24h': '24 ore',
  '7d': '7 giorni',
  'permanent': 'Permanente',
};

// Blocked User
export interface BlockedUser {
  id: number;
  email: string;
  role: string;
  blockedUntil: string | null; // ISO datetime o null se permanente
  blockReason: string | null;
  blockedAt: string; // ISO datetime
}

// Response API /auth/blocked-users
export interface BlockedUsersResponse {
  success: boolean;
  data: BlockedUser[];
  total: number;
}
