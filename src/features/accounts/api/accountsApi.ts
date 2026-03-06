// src/features/accounts/api/accountsApi.ts

import type {
  AccountFilters,
  AccountsListResponse,
  AccountResponse,
  AccountStatsResponse,
  CreateAccountRequest,
  UpdateAccountRequest,
  ActionResponse,
} from '../types';

const API_BASE_URL = 'http://localhost:8080';

const getAuthToken = (): string | null => {
  let token = localStorage.getItem('edg_access_token');
  if (!token) token = sessionStorage.getItem('edg_access_token');
  if (!token) token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  return token;
};

const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    cache: 'no-store',
    ...options,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: `HTTP error ${response.status}`,
    }));
    throw new Error(errorData.error || errorData.message || `HTTP error ${response.status}`);
  }
  // 204 No Content — nessun body da parsare
  if (response.status === 204) {
    return null as unknown as T;
  }
  return response.json();
}

export const fetchAccountStats = async (): Promise<AccountStatsResponse> => {
  return apiFetch<AccountStatsResponse>(`${API_BASE_URL}/auth/accounts/stats`, {
    headers: getAuthHeaders(),
  });
};

export const fetchAccounts = async (
  page: number = 0,
  limit: number = 50,
  filters: AccountFilters = {}
): Promise<AccountsListResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (filters.search) params.append('search', filters.search);
  if (filters.roleId) params.append('roleId', filters.roleId.toString());
  if (filters.accountType && filters.accountType !== 'all') params.append('accountType', filters.accountType);
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  return apiFetch<AccountsListResponse>(`${API_BASE_URL}/auth/accounts?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
};

export const fetchAccountById = async (accountId: number): Promise<AccountResponse> => {
  return apiFetch<AccountResponse>(`${API_BASE_URL}/auth/accounts/${accountId}`, {
    headers: getAuthHeaders(),
  });
};

export const createAccount = async (data: CreateAccountRequest): Promise<AccountResponse> => {
  return apiFetch<AccountResponse>(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
};

export const updateAccount = async (accountId: number, data: UpdateAccountRequest): Promise<AccountResponse> => {
  return apiFetch<AccountResponse>(`${API_BASE_URL}/auth/accounts/${accountId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
};

export const deleteAccount = async (accountId: number): Promise<ActionResponse> => {
  return apiFetch<ActionResponse>(`${API_BASE_URL}/auth/accounts/${accountId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
};

export const activateAccount = async (accountId: number): Promise<ActionResponse> => {
  return apiFetch<ActionResponse>(`${API_BASE_URL}/auth/accounts/${accountId}/activate`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
};
