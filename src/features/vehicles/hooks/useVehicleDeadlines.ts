// =============================================================================
// ASSET AZIENDALI — HOOK: useVehicleDeadlines
// features/vehicles/hooks/useVehicleDeadlines.ts
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import {
  fetchVehicleDeadlines,
  createVehicleDeadline,
  updateVehicleDeadline,
  renewVehicleDeadline,
  deleteVehicleDeadline,
} from '../api/vehicles.api';
import type {
  VehicleDeadline,
  VehicleDeadlineFilters,
  CreateVehicleDeadlineData,
  UpdateVehicleDeadlineData,
  RenewVehicleDeadlineData,
  PaginationMeta,
} from '../types/vehicles.types';

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

/** Default: tutte le scadenze, ordinate dal backend per data (le più urgenti prima) */
const DEFAULT_FILTERS: VehicleDeadlineFilters = {
  page: 1,
  limit: 20,
  status: 'all',
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

interface UseVehicleDeadlinesReturn {
  data: VehicleDeadline[];
  pagination: PaginationMeta;
  loading: boolean;
  error: string | null;
  submitting: boolean;
  filters: VehicleDeadlineFilters;
  setFilters: (partial: Partial<VehicleDeadlineFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  reload: () => Promise<void>;
  createDeadline: (data: CreateVehicleDeadlineData) => Promise<VehicleDeadline>;
  updateDeadline: (id: number, data: UpdateVehicleDeadlineData) => Promise<VehicleDeadline>;
  renewDeadline: (id: number, data: RenewVehicleDeadlineData) => Promise<VehicleDeadline>;
  deleteDeadline: (id: number) => Promise<VehicleDeadline>;
}

export const useVehicleDeadlines = (initialFilters: Partial<VehicleDeadlineFilters> = {}): UseVehicleDeadlinesReturn => {
  const [filters, setFiltersState] = useState<VehicleDeadlineFilters>({ ...DEFAULT_FILTERS, ...initialFilters });
  const [data, setData] = useState<VehicleDeadline[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ─── caricamento lista ──────────────────────────────────────────────────

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchVehicleDeadlines(filters);
      setData(res.data);
      setPagination(res.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento delle scadenze');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  // ─── filtri e paginazione ───────────────────────────────────────────────

  const setFilters = useCallback((partial: Partial<VehicleDeadlineFilters>) => {
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

  const handleCreate = useCallback(
    async (data: CreateVehicleDeadlineData): Promise<VehicleDeadline> => {
      setSubmitting(true);
      try {
        const res = await createVehicleDeadline(data);
        await load();
        return res.data;
      } finally {
        setSubmitting(false);
      }
    },
    [load]
  );

  const handleUpdate = useCallback(
    async (id: number, data: UpdateVehicleDeadlineData): Promise<VehicleDeadline> => {
      setSubmitting(true);
      try {
        const res = await updateVehicleDeadline(id, data);
        await load();
        return res.data;
      } finally {
        setSubmitting(false);
      }
    },
    [load]
  );

  const handleRenew = useCallback(
    async (id: number, data: RenewVehicleDeadlineData): Promise<VehicleDeadline> => {
      setSubmitting(true);
      try {
        const res = await renewVehicleDeadline(id, data);
        await load();
        return res.data;
      } finally {
        setSubmitting(false);
      }
    },
    [load]
  );

  const handleDelete = useCallback(
    async (id: number): Promise<VehicleDeadline> => {
      setSubmitting(true);
      try {
        const res = await deleteVehicleDeadline(id);
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
    createDeadline: handleCreate,
    updateDeadline: handleUpdate,
    renewDeadline: handleRenew,
    deleteDeadline: handleDelete,
  };
};

export default useVehicleDeadlines;
