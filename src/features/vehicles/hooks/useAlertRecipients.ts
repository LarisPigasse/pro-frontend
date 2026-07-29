// =============================================================================
// ASSET AZIENDALI — HOOK: useAlertRecipients
// features/vehicles/hooks/useAlertRecipients.ts
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import {
  fetchAlertRecipients,
  createAlertRecipient,
  updateAlertRecipient,
  deleteAlertRecipient,
} from '../api/alertRecipients.api';
import type {
  AlertRecipient,
  AlertRecipientFilters,
  CreateAlertRecipientData,
  UpdateAlertRecipientData,
} from '../types/alertRecipients.types';
import type { PaginationMeta } from '../types/vehicles.types';

const DEFAULT_FILTERS: AlertRecipientFilters = { page: 1, limit: 100 };

interface UseAlertRecipientsReturn {
  data: AlertRecipient[];
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  submitting: boolean;
  filters: AlertRecipientFilters;
  setFilters: (filters: Partial<AlertRecipientFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  reload: () => Promise<void>;
  createRecipient: (data: CreateAlertRecipientData) => Promise<AlertRecipient>;
  updateRecipient: (id: number, data: UpdateAlertRecipientData) => Promise<AlertRecipient>;
  removeRecipient: (id: number) => Promise<void>;
}

export const useAlertRecipients = (initialFilters: Partial<AlertRecipientFilters> = {}): UseAlertRecipientsReturn => {
  const [data, setData] = useState<AlertRecipient[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFiltersState] = useState<AlertRecipientFilters>({ ...DEFAULT_FILTERS, ...initialFilters });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAlertRecipients(filters);
      setData(response.data);
      setPagination(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento dei destinatari');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const setFilters = useCallback((partial: Partial<AlertRecipientFilters>) => {
    setFiltersState(prev => ({ ...prev, ...partial, page: partial.page ?? 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const setPage = useCallback((page: number) => {
    setFiltersState(prev => ({ ...prev, page }));
  }, []);

  const createRecipient = useCallback(
    async (data: CreateAlertRecipientData) => {
      setSubmitting(true);
      try {
        const response = await createAlertRecipient(data);
        await load();
        return response.data;
      } finally {
        setSubmitting(false);
      }
    },
    [load]
  );

  const updateRecipient = useCallback(
    async (id: number, data: UpdateAlertRecipientData) => {
      setSubmitting(true);
      try {
        const response = await updateAlertRecipient(id, data);
        await load();
        return response.data;
      } finally {
        setSubmitting(false);
      }
    },
    [load]
  );

  const removeRecipient = useCallback(
    async (id: number) => {
      setSubmitting(true);
      try {
        await deleteAlertRecipient(id);
        await load();
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
    reload: load,
    createRecipient,
    updateRecipient,
    removeRecipient,
  };
};

export default useAlertRecipients;
