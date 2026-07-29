// =============================================================================
// VEHICLES MODULE — HOOK: useNotificationDeliveryLogs
// features/vehicles/hooks/useNotificationDeliveryLogs.ts
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { fetchNotificationDeliveryLogs } from '../api/vehicles.api';
import type { NotificationDeliveryLog, NotificationDeliveryLogFilters, PaginationMeta } from '../types/vehicles.types';

const DEFAULT_PAGINATION: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

const DEFAULT_FILTERS: NotificationDeliveryLogFilters = {
  page: 1,
  limit: 20,
};

interface UseNotificationDeliveryLogsReturn {
  data: NotificationDeliveryLog[];
  pagination: PaginationMeta;
  loading: boolean;
  error: string | null;
  filters: NotificationDeliveryLogFilters;
  setFilters: (partial: Partial<NotificationDeliveryLogFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  reload: () => Promise<void>;
}

export const useNotificationDeliveryLogs = (
  initialFilters: Partial<NotificationDeliveryLogFilters> = {}
): UseNotificationDeliveryLogsReturn => {
  const [filters, setFiltersState] = useState<NotificationDeliveryLogFilters>({ ...DEFAULT_FILTERS, ...initialFilters });
  const [data, setData] = useState<NotificationDeliveryLog[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchNotificationDeliveryLogs(filters);
      setData(res.data);
      setPagination(res.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento del log invii email');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const setFilters = useCallback((partial: Partial<NotificationDeliveryLogFilters>) => {
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

  return { data, pagination, loading, error, filters, setFilters, resetFilters, setPage, reload };
};

export default useNotificationDeliveryLogs;
