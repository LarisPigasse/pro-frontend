// =============================================================================
// VEHICLES MODULE — API: AlertRecipient
// features/vehicles/api/alertRecipients.api.ts
// =============================================================================

import { apiFetch, getAuthHeaders } from '@/core/services/apiFetch';
import { VEHICLES_BASE as BASE, buildQuery } from './apiHelpers';
import type { ApiResponse } from '../types/vehicles.types';
import type {
  AlertRecipient,
  AlertRecipientFilters,
  AlertRecipientsListResponse,
  AlertRecipientResponse,
  CreateAlertRecipientData,
  UpdateAlertRecipientData,
} from '../types/alertRecipients.types';

export const fetchAlertRecipients = async (filters: AlertRecipientFilters = {}): Promise<AlertRecipientsListResponse> => {
  const query = buildQuery({ page: filters.page, limit: filters.limit, isActive: filters.isActive });
  return apiFetch<AlertRecipientsListResponse>(`${BASE}/alert-recipients${query}`, {
    headers: getAuthHeaders(),
  });
};

export const fetchAlertRecipientById = async (id: number): Promise<AlertRecipientResponse> =>
  apiFetch<AlertRecipientResponse>(`${BASE}/alert-recipients/${id}`, {
    headers: getAuthHeaders(),
  });

export const createAlertRecipient = async (data: CreateAlertRecipientData): Promise<AlertRecipientResponse> =>
  apiFetch<AlertRecipientResponse>(`${BASE}/alert-recipients`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

/** Attenzione: se `preferences` è presente nel payload, sostituisce l'intero set esistente lato backend — non un merge */
export const updateAlertRecipient = async (id: number, data: UpdateAlertRecipientData): Promise<AlertRecipientResponse> =>
  apiFetch<AlertRecipientResponse>(`${BASE}/alert-recipients/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const deleteAlertRecipient = async (id: number): Promise<ApiResponse<null>> =>
  apiFetch<ApiResponse<null>>(`${BASE}/alert-recipients/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

export type { AlertRecipient };
