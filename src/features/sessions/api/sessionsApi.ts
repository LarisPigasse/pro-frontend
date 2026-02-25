import type {
  SessionsResponse,
  BlockUserRequest,
  BlockUserResponse,
  RevokeSessionResponse,
  UnblockUserResponse,
  BlockedUsersResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Ottieni il token JWT dal localStorage o sessionStorage
 * Usa le stesse chiavi dell'authSlice
 */
const getAuthToken = (): string | null => {
  // Prova prima localStorage con chiave corretta
  let token = localStorage.getItem('edg_access_token');
  
  // Se non c'è in localStorage, prova sessionStorage
  if (!token) {
    token = sessionStorage.getItem('edg_access_token');
  }
  
  // Fallback: prova chiave vecchia (per retrocompatibilità)
  if (!token) {
    token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  }
  
  return token;
};

/**
 * Headers comuni per richieste autenticate
 */
const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Helper fetch con gestione errori
 */
const apiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(endpoint, options);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return data as T;
};

/**
 * GET /auth/sessions - Lista tutte le sessioni attive
 */
export const fetchActiveSessions = async (): Promise<SessionsResponse> => {
  return apiFetch<SessionsResponse>(`${API_BASE_URL}/auth/sessions`, {
    headers: getAuthHeaders(),
  });
};

/**
 * DELETE /auth/sessions/:sessionId - Revoca una sessione specifica
 */
export const revokeSession = async (sessionId: number): Promise<RevokeSessionResponse> => {
  return apiFetch<RevokeSessionResponse>(`${API_BASE_URL}/auth/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
};

/**
 * POST /auth/users/:userId/block - Blocca un utente
 */
export const blockUser = async (
  userId: number,
  blockData: BlockUserRequest
): Promise<BlockUserResponse> => {
  return apiFetch<BlockUserResponse>(`${API_BASE_URL}/auth/users/${userId}/block`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(blockData),
  });
};

/**
 * DELETE /auth/users/:userId/unblock - Sblocca un utente
 */
export const unblockUser = async (userId: number): Promise<UnblockUserResponse> => {
  return apiFetch<UnblockUserResponse>(`${API_BASE_URL}/auth/users/${userId}/unblock`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
};

/**
 * GET /auth/blocked-users - Lista utenti bloccati
 */
export const fetchBlockedUsers = async (): Promise<BlockedUsersResponse> => {
  return apiFetch<BlockedUsersResponse>(`${API_BASE_URL}/auth/blocked-users`, {
    headers: getAuthHeaders(),
  });
};
