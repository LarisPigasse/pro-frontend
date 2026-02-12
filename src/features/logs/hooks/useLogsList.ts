// src/features/logs/hooks/useLogsList.ts

/**
 * Hook per gestire la lista logs con filtri e paginazione
 */

import { useState, useEffect, useCallback } from 'react';
import { logsApi } from '../api/logsApi';
import type { LogEvent, LogFilters } from '../types';

interface UseLogsListResult {
  logs: LogEvent[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  refetch: () => Promise<void>;
  nextPage: () => void;
  prevPage: () => void;
  setFilters: (filters: LogFilters) => void;
}

export const useLogsList = (initialFilters: LogFilters = {}): UseLogsListResult => {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<LogFilters>(initialFilters);
  const [hasMore, setHasMore] = useState(false);

  const limit = filters.limit || 50;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const skip = (page - 1) * limit;
      const response = await logsApi.getAll({
        ...filters,
        limit,
        skip,
      });

      setLogs(response.logs);
      setTotal(response.total);
      setHasMore(response.hasMore);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore nel caricamento logs';
      setError(message);
      console.error('[useLogsList] Error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const refetch = useCallback(async () => {
    await fetchLogs();
  }, [fetchLogs]);

  const updateFilters = useCallback((newFilters: LogFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  }, []);

  return {
    logs,
    loading,
    error,
    total,
    page,
    limit,
    hasMore,
    refetch,
    nextPage,
    prevPage,
    setFilters: updateFilters,
  };
};
