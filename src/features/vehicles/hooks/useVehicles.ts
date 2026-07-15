// =============================================================================
// ASSET AZIENDALI — HOOK: useVehicles
// features/vehicles/hooks/useVehicles.ts
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { fetchVehicles, createVehicle, updateVehicle, updateVehicleStatus, decommissionVehicle } from '../api/vehicles.api';
import type {
  Vehicle,
  VehicleFilters,
  CreateVehicleData,
  UpdateVehicleData,
  UpdateVehicleStatusData,
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

/** Default: solo veicoli attivi — coerente col default del backend (status='active') */
const DEFAULT_FILTERS: VehicleFilters = {
  page: 1,
  limit: 20,
  status: 'active',
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

interface UseVehiclesReturn {
  data: Vehicle[];
  pagination: PaginationMeta;
  loading: boolean;
  error: string | null;
  submitting: boolean;
  filters: VehicleFilters;
  setFilters: (partial: Partial<VehicleFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  reload: () => Promise<void>;
  createVehicle: (data: CreateVehicleData) => Promise<Vehicle>;
  updateVehicle: (id: number, data: UpdateVehicleData) => Promise<Vehicle>;
  updateVehicleStatus: (id: number, data: UpdateVehicleStatusData) => Promise<Vehicle>;
  decommissionVehicle: (id: number) => Promise<Vehicle>;
}

export const useVehicles = (initialFilters: Partial<VehicleFilters> = {}): UseVehiclesReturn => {
  const [filters, setFiltersState] = useState<VehicleFilters>({ ...DEFAULT_FILTERS, ...initialFilters });
  const [data, setData] = useState<Vehicle[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ─── caricamento lista ──────────────────────────────────────────────────

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchVehicles(filters);
      setData(res.data);
      setPagination(res.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento dei veicoli');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  // ─── filtri e paginazione ───────────────────────────────────────────────

  const setFilters = useCallback((partial: Partial<VehicleFilters>) => {
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

  const handleCreateVehicle = useCallback(
    async (data: CreateVehicleData): Promise<Vehicle> => {
      setSubmitting(true);
      try {
        const res = await createVehicle(data);
        await load();
        return res.data;
      } finally {
        setSubmitting(false);
      }
    },
    [load]
  );

  const handleUpdateVehicle = useCallback(
    async (id: number, data: UpdateVehicleData): Promise<Vehicle> => {
      setSubmitting(true);
      try {
        const res = await updateVehicle(id, data);
        await load();
        return res.data;
      } finally {
        setSubmitting(false);
      }
    },
    [load]
  );

  const handleUpdateVehicleStatus = useCallback(
    async (id: number, data: UpdateVehicleStatusData): Promise<Vehicle> => {
      setSubmitting(true);
      try {
        const res = await updateVehicleStatus(id, data);
        await load();
        return res.data;
      } finally {
        setSubmitting(false);
      }
    },
    [load]
  );

  const handleDecommissionVehicle = useCallback(
    async (id: number): Promise<Vehicle> => {
      setSubmitting(true);
      try {
        const res = await decommissionVehicle(id);
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
    createVehicle: handleCreateVehicle,
    updateVehicle: handleUpdateVehicle,
    updateVehicleStatus: handleUpdateVehicleStatus,
    decommissionVehicle: handleDecommissionVehicle,
  };
};

export default useVehicles;
