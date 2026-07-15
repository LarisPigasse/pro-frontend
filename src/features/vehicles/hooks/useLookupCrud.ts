// =============================================================================
// VEHICLES MODULE — HOOK GENERICO: useLookupCrud
// features/vehicles/hooks/useLookupCrud.ts
// =============================================================================
//
// Hook factory per la gestione CRUD di una lookup table (lista + paginazione +
// filtri + create/update/toggle/remove con refetch automatico). Stessa forma
// di useDrivers.ts, generica sull'entità — invocata una volta per ciascuna
// delle 6 lookup table di Configurazione.
//

import { useState, useEffect, useCallback } from 'react';
import type { PaginationMeta, ApiResponse, PaginatedApiResponse } from '../types/vehicles.types';

const DEFAULT_PAGINATION: PaginationMeta = { total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false };

interface LookupCrudApi<T, TFilters, TCreate, TUpdate> {
  fetchList: (filters: TFilters) => Promise<PaginatedApiResponse<T>>;
  fetchById: (id: number) => Promise<ApiResponse<T>>;
  create: (data: TCreate) => Promise<ApiResponse<T>>;
  update: (id: number, data: TUpdate) => Promise<ApiResponse<T>>;
  toggle: (id: number) => Promise<ApiResponse<T>>;
  remove: (id: number) => Promise<ApiResponse<T>>;
}

interface UseLookupCrudReturn<T, TFilters, TCreate, TUpdate> {
  data: T[];
  pagination: PaginationMeta;
  loading: boolean;
  error: string | null;
  submitting: boolean;
  filters: TFilters;
  setFilters: (partial: Partial<TFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  reload: () => Promise<void>;
  create: (data: TCreate) => Promise<T>;
  update: (id: number, data: TUpdate) => Promise<T>;
  toggle: (id: number) => Promise<T>;
  remove: (id: number) => Promise<T>;
}

export function useLookupCrud<T, TFilters extends { page?: number; limit?: number }, TCreate, TUpdate>(
  api: LookupCrudApi<T, TFilters, TCreate, TUpdate>,
  defaultFilters: TFilters
): UseLookupCrudReturn<T, TFilters, TCreate, TUpdate> {
  const [filters, setFiltersState] = useState<TFilters>(defaultFilters);
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.fetchList(filters);
      setData(res.data);
      setPagination(res.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento dei dati');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- api è un oggetto stabile creato una sola volta dal chiamante
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const setFilters = useCallback((partial: Partial<TFilters>) => {
    setFiltersState(prev => ({ ...prev, ...partial, page: partial.page ?? 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- defaultFilters è stabile, passato una sola volta all'invocazione dell'hook
  }, []);

  const setPage = useCallback((page: number) => {
    setFiltersState(prev => ({ ...prev, page }));
  }, []);

  const reload = useCallback(async () => {
    await load();
  }, [load]);

  const handleCreate = useCallback(
    async (createData: TCreate): Promise<T> => {
      setSubmitting(true);
      try {
        const res = await api.create(createData);
        await load();
        return res.data;
      } finally {
        setSubmitting(false);
      }
    },
    [load] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleUpdate = useCallback(
    async (id: number, updateData: TUpdate): Promise<T> => {
      setSubmitting(true);
      try {
        const res = await api.update(id, updateData);
        await load();
        return res.data;
      } finally {
        setSubmitting(false);
      }
    },
    [load] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleToggle = useCallback(
    async (id: number): Promise<T> => {
      setSubmitting(true);
      try {
        const res = await api.toggle(id);
        await load();
        return res.data;
      } finally {
        setSubmitting(false);
      }
    },
    [load] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleRemove = useCallback(
    async (id: number): Promise<T> => {
      setSubmitting(true);
      try {
        const res = await api.remove(id);
        await load();
        return res.data;
      } finally {
        setSubmitting(false);
      }
    },
    [load] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return {
    data,
    pagination,
    loading,
    error,
    submitting,
    filters,
    setFilters,
    resetFilters,
    setPage,
    reload,
    create: handleCreate,
    update: handleUpdate,
    toggle: handleToggle,
    remove: handleRemove,
  };
}

export default useLookupCrud;
