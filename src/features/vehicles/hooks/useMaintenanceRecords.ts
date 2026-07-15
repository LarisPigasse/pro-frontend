// =============================================================================
// ASSET AZIENDALI — HOOK: useMaintenanceRecords
// features/vehicles/hooks/useMaintenanceRecords.ts
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import {
  fetchMaintenanceRecords,
  createMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
} from '../api/vehicles.api';
import type {
  MaintenanceRecord,
  MaintenanceRecordFilters,
  CreateMaintenanceRecordData,
  UpdateMaintenanceRecordData,
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

const DEFAULT_FILTERS: MaintenanceRecordFilters = {
  page: 1,
  limit: 20,
};

interface UseMaintenanceRecordsReturn {
  data: MaintenanceRecord[];
  pagination: PaginationMeta;
  loading: boolean;
  error: string | null;
  submitting: boolean;
  filters: MaintenanceRecordFilters;
  setFilters: (partial: Partial<MaintenanceRecordFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  reload: () => Promise<void>;
  createRecord: (data: CreateMaintenanceRecordData) => Promise<MaintenanceRecord>;
  updateRecord: (id: number, data: UpdateMaintenanceRecordData) => Promise<MaintenanceRecord>;
  deleteRecord: (id: number) => Promise<MaintenanceRecord>;
}

export const useMaintenanceRecords = (initialFilters: Partial<MaintenanceRecordFilters> = {}): UseMaintenanceRecordsReturn => {
  const [filters, setFiltersState] = useState<MaintenanceRecordFilters>({ ...DEFAULT_FILTERS, ...initialFilters });
  const [data, setData] = useState<MaintenanceRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMaintenanceRecords(filters);
      setData(res.data);
      setPagination(res.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento degli interventi');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const setFilters = useCallback((partial: Partial<MaintenanceRecordFilters>) => {
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

  const handleCreate = useCallback(
    async (data: CreateMaintenanceRecordData): Promise<MaintenanceRecord> => {
      setSubmitting(true);
      try {
        const res = await createMaintenanceRecord(data);
        await load();
        return res.data;
      } finally {
        setSubmitting(false);
      }
    },
    [load]
  );

  const handleUpdate = useCallback(
    async (id: number, data: UpdateMaintenanceRecordData): Promise<MaintenanceRecord> => {
      setSubmitting(true);
      try {
        const res = await updateMaintenanceRecord(id, data);
        await load();
        return res.data;
      } finally {
        setSubmitting(false);
      }
    },
    [load]
  );

  const handleDelete = useCallback(
    async (id: number): Promise<MaintenanceRecord> => {
      setSubmitting(true);
      try {
        const res = await deleteMaintenanceRecord(id);
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
    createRecord: handleCreate,
    updateRecord: handleUpdate,
    deleteRecord: handleDelete,
  };
};

export default useMaintenanceRecords;
