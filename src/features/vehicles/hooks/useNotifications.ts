// =============================================================================
// ASSET AZIENDALI — HOOK: useNotifications
// features/vehicles/hooks/useNotifications.ts
// =============================================================================
//
// Lista paginata e filtrabile delle notifiche, per la pagina "Notifiche"
// completa. Diverso da useDashboardSummary: qui i filtri cambiano nel tempo
// (utente che digita/seleziona), lì era un fetch-and-forget delle ultime 8.

import { useState, useEffect, useCallback } from 'react';
import {
  fetchNotifications,
  fetchUnreadNotificationsCount,
  markNotificationRead,
  markAllNotificationsRead,
} from '../api/vehicles.api';
import type { Notification, NotificationFilters, PaginationMeta } from '../types/vehicles.types';

const DEFAULT_PAGINATION: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

const DEFAULT_FILTERS: NotificationFilters = {
  page: 1,
  limit: 20,
  isArchived: false,
};

interface UseNotificationsReturn {
  data: Notification[];
  pagination: PaginationMeta;
  unreadCount: number;
  loading: boolean;
  error: string | null;
  filters: NotificationFilters;
  setFilters: (partial: Partial<NotificationFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  reload: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotifications = (initialFilters: Partial<NotificationFilters> = {}): UseNotificationsReturn => {
  const [filters, setFiltersState] = useState<NotificationFilters>({ ...DEFAULT_FILTERS, ...initialFilters });
  const [data, setData] = useState<Notification[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [listRes, countRes] = await Promise.all([fetchNotifications(filters), fetchUnreadNotificationsCount()]);
      setData(listRes.data);
      setPagination(listRes.meta);
      setUnreadCount(countRes.data.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento delle notifiche');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const setFilters = useCallback((partial: Partial<NotificationFilters>) => {
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

  const handleMarkAsRead = useCallback(
    async (id: number) => {
      await markNotificationRead(id);
      await load();
    },
    [load]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    await markAllNotificationsRead();
    await load();
  }, [load]);

  return {
    data,
    pagination,
    unreadCount,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    setPage,
    reload,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
  };
};

export default useNotifications;
