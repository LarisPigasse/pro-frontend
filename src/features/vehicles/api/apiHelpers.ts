// =============================================================================
// VEHICLES MODULE — API HELPERS condivisi
// features/vehicles/api/apiHelpers.ts
// =============================================================================
//
// Utility HTTP condivise da vehicles.api.ts e lookups.api.ts. Estratte qui per
// evitare una dipendenza circolare tra i due file (la factory CRUD serve anche
// a driver-compliance-types, che vive in vehicles.api.ts).
//

import { apiFetch, getAuthHeaders } from '@/core/services/apiFetch';

import type { ApiResponse, PaginatedApiResponse } from '../types/vehicles.types';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const VEHICLES_BASE = `${API_BASE_URL}/api/vehicles`;

/** Costruisce una query string, scartando valori undefined/null/''  */
export const buildQuery = (params: Record<string, string | number | boolean | undefined>): string => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.append(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
};

/**
 * Factory generica per le 6 operazioni CRUD standard di una lookup table
 * (list, getById, create, update, toggle, remove). Ogni entità concreta la
 * invoca una volta sola con i propri tipi — zero duplicazione della logica HTTP,
 * un solo posto da correggere se il contratto REST dovesse mai cambiare.
 */
// ✅ corretto
export function createLookupCrud<T, TFilters extends object, TCreate, TUpdate>(basePath: string) {
  return {
    fetchList: (filters: TFilters = {} as TFilters): Promise<PaginatedApiResponse<T>> =>
      apiFetch<PaginatedApiResponse<T>>(
        `${VEHICLES_BASE}${basePath}${buildQuery(filters as Record<string, string | number | boolean | undefined>)}`,
        { headers: getAuthHeaders() }
      ),

    fetchById: (id: number): Promise<ApiResponse<T>> =>
      apiFetch<ApiResponse<T>>(`${VEHICLES_BASE}${basePath}/${id}`, { headers: getAuthHeaders() }),

    create: (data: TCreate): Promise<ApiResponse<T>> =>
      apiFetch<ApiResponse<T>>(`${VEHICLES_BASE}${basePath}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),

    update: (id: number, data: TUpdate): Promise<ApiResponse<T>> =>
      apiFetch<ApiResponse<T>>(`${VEHICLES_BASE}${basePath}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),

    toggle: (id: number): Promise<ApiResponse<T>> =>
      apiFetch<ApiResponse<T>>(`${VEHICLES_BASE}${basePath}/${id}/toggle`, { method: 'PATCH', headers: getAuthHeaders() }),

    remove: (id: number): Promise<ApiResponse<T>> =>
      apiFetch<ApiResponse<T>>(`${VEHICLES_BASE}${basePath}/${id}`, { method: 'DELETE', headers: getAuthHeaders() }),
  };
}
