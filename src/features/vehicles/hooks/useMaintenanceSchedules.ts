// =============================================================================
// ASSET AZIENDALI — HOOK: useMaintenanceSchedules
// features/vehicles/hooks/useMaintenanceSchedules.ts
// =============================================================================
//
// Più snello di useMaintenanceRecords: nessun create/remove, perché il backend
// non li espone — gli schedule nascono come effetto collaterale della
// creazione di un intervento (vedi useMaintenanceRecords).
//

import { useState, useEffect, useCallback } from 'react';
import {
  fetchMaintenanceSchedules,
  createMaintenanceSchedule,
  updateMaintenanceSchedule,
  deleteMaintenanceSchedule,
} from '../api/vehicles.api';
import type {
  MaintenanceScheduleItem,
  MaintenanceScheduleFilters,
  CreateMaintenanceScheduleData,
  UpdateMaintenanceScheduleData,
  PaginationMeta,
} from '../types/vehicles.types';

const DEFAULT_PAGINATION: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

const DEFAULT_FILTERS: MaintenanceScheduleFilters = {
  page: 1,
  limit: 20,
  status: 'all',
};

interface UseMaintenanceSchedulesReturn {
  data: MaintenanceScheduleItem[];
  pagination: PaginationMeta;
  loading: boolean;
  error: string | null;
  submitting: boolean;
  filters: MaintenanceScheduleFilters;
  setFilters: (partial: Partial<MaintenanceScheduleFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  reload: () => Promise<void>;
  updateSchedule: (id: number, data: UpdateMaintenanceScheduleData) => Promise<MaintenanceScheduleItem>;
  createSchedule: (data: CreateMaintenanceScheduleData) => Promise<MaintenanceScheduleItem>;
  deleteSchedule: (id: number) => Promise<MaintenanceScheduleItem>;
}

export const useMaintenanceSchedules = (
  initialFilters: Partial<MaintenanceScheduleFilters> = {}
): UseMaintenanceSchedulesReturn => {
  const [filters, setFiltersState] = useState<MaintenanceScheduleFilters>({ ...DEFAULT_FILTERS, ...initialFilters });
  const [data, setData] = useState<MaintenanceScheduleItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMaintenanceSchedules(filters);
      setData(res.data);
      setPagination(res.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento della programmazione');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const setFilters = useCallback((partial: Partial<MaintenanceScheduleFilters>) => {
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

  const handleUpdate = useCallback(
    async (id: number, data: UpdateMaintenanceScheduleData): Promise<MaintenanceScheduleItem> => {
      setSubmitting(true);
      try {
        const res = await updateMaintenanceSchedule(id, data);
        await load();
        return res.data;
      } finally {
        setSubmitting(false);
      }
    },
    [load]
  );

  const handleCreate = useCallback(
    async (data: CreateMaintenanceScheduleData): Promise<MaintenanceScheduleItem> => {
      setSubmitting(true);
      try {
        const res = await createMaintenanceSchedule(data);
        await load();
        return res.data;
      } finally {
        setSubmitting(false);
      }
    },
    [load]
  );

  const handleDelete = useCallback(
    async (id: number): Promise<MaintenanceScheduleItem> => {
      setSubmitting(true);
      try {
        const res = await deleteMaintenanceSchedule(id);
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
    updateSchedule: handleUpdate,
    createSchedule: handleCreate,
    deleteSchedule: handleDelete,
  };
};

export default useMaintenanceSchedules;
