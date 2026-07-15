// =============================================================================
// ASSET AZIENDALI — HOOK: useDrivers
// features/vehicles/hooks/useDrivers.ts
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { fetchDrivers, createDriver, updateDriver, toggleDriver, deleteDriver } from '../api/vehicles.api';
import type { Driver, DriverFilters, CreateDriverData, UpdateDriverData, PaginationMeta } from '../types/vehicles.types';

// ─────────────────────────────────────────────────────────────────────────────
// Default
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_PAGINATION: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

/** Stato di default: solo autisti attivi (allineato al default del backend) */
const DEFAULT_FILTERS: DriverFilters = {
  page: 1,
  limit: 20,
  active: true,
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

interface UseDriversReturn {
  data: Driver[];
  pagination: PaginationMeta;
  loading: boolean;
  error: string | null;
  submitting: boolean;
  filters: DriverFilters;
  setFilters: (partial: Partial<DriverFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  reload: () => Promise<void>;
  createDriver: (data: CreateDriverData) => Promise<Driver>;
  updateDriver: (id: number, data: UpdateDriverData) => Promise<Driver>;
  toggleDriver: (id: number) => Promise<Driver>;
  deleteDriver: (id: number) => Promise<Driver>;
}

export const useDrivers = (initialFilters: Partial<DriverFilters> = {}): UseDriversReturn => {
  const [filters, setFiltersState] = useState<DriverFilters>({ ...DEFAULT_FILTERS, ...initialFilters });
  const [data, setData] = useState<Driver[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ─── caricamento lista ──────────────────────────────────────────────────

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDrivers(filters);
      setData(res.data);
      setPagination(res.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento degli autisti');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  // ─── filtri e paginazione ───────────────────────────────────────────────

  /** Applica filtri parziali; resetta sempre alla pagina 1 salvo indicazione esplicita */
  const setFilters = useCallback((partial: Partial<DriverFilters>) => {
    setFiltersState(prev => ({ ...prev, ...partial, page: partial.page ?? 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const setPage = useCallback((page: number) => {
    setFiltersState(prev => ({ ...prev, page }));
  }, []);

  const reload = useCallback(async () => {
    await load();
  }, [load]);

  // ─── CRUD — ogni mutazione ricarica la lista corrente ──────────────────

  const handleCreateDriver = useCallback(
    async (data: CreateDriverData): Promise<Driver> => {
      setSubmitting(true);
      try {
        const res = await createDriver(data);
        await load();
        return res.data;
      } finally {
        setSubmitting(false);
      }
    },
    [load]
  );

  const handleUpdateDriver = useCallback(
    async (id: number, data: UpdateDriverData): Promise<Driver> => {
      setSubmitting(true);
      try {
        const res = await updateDriver(id, data);
        await load();
        return res.data;
      } finally {
        setSubmitting(false);
      }
    },
    [load]
  );

  /** Sospensione/riattivazione reversibile */
  const handleToggleDriver = useCallback(
    async (id: number): Promise<Driver> => {
      setSubmitting(true);
      try {
        const res = await toggleDriver(id);
        await load();
        return res.data;
      } finally {
        setSubmitting(false);
      }
    },
    [load]
  );

  /** Cessazione rapporto (soft-delete) */
  const handleDeleteDriver = useCallback(
    async (id: number): Promise<Driver> => {
      setSubmitting(true);
      try {
        const res = await deleteDriver(id);
        await load();
        return res.data;
      } finally {
        setSubmitting(false);
      }
    },
    [load]
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
    createDriver: handleCreateDriver,
    updateDriver: handleUpdateDriver,
    toggleDriver: handleToggleDriver,
    deleteDriver: handleDeleteDriver,
  };
};

export default useDrivers;
