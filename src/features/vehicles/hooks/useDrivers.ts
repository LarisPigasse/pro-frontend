// =============================================================================
// ASSET AZIENDALI — HOOK: useDrivers
// features/vehicles/hooks/useDrivers.ts
// =============================================================================
//
// Gestisce:
//   - Lista autisti con filtri, paginazione e stato loading/error
//   - Compliance status per ogni riga (semaforo) caricato in batch post-lista
//   - Stato modale (view / create / edit)
//   - CRUD: createDriver, updateDriver, deactivateDriver
// =============================================================================

import { useState, useEffect, useCallback, useRef } from 'react';

import { driversApi } from '../api/vehicles.api';
import type {
  Driver,
  DriverWithCompliance,
  DriverCompliance,
  DriverComplianceStatusValue,
  DriverComplianceStatus,
  DriverFilters,
  DriverModalState,
  DriverCreateData,
  DriverEditData,
} from '../types/vehicles.types';
import { DEFAULT_DRIVER_FILTERS } from '../types/vehicles.types';

// -----------------------------------------------------------------------------
// TIPI INTERNI
// -----------------------------------------------------------------------------

interface PaginationState {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UseDriversReturn {
  // Dati
  drivers: DriverWithCompliance[];
  pagination: PaginationState;
  // Loading / error
  loading: boolean;
  complianceLoading: boolean;
  error: string | null;
  submitting: boolean;
  // Filtri
  filters: DriverFilters;
  setFilters: (filters: Partial<DriverFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  // Modale
  modalState: DriverModalState;
  openCreate: () => void;
  openEdit: (driver: DriverWithCompliance) => void;
  openView: (driver: DriverWithCompliance) => void;
  closeModal: () => void;
  // CRUD
  createDriver: (data: DriverCreateData) => Promise<boolean>;
  updateDriver: (id: number, data: DriverEditData) => Promise<boolean>;
  deactivateDriver: (id: number) => Promise<boolean>;
}

// -----------------------------------------------------------------------------
// HELPER: calcolo compliance status lato frontend
// Stessa soglia usata dal backend statusChecker: 30 giorni
// -----------------------------------------------------------------------------

const EXPIRING_THRESHOLD_DAYS = 30;

function computeOverallStatus(compliances: DriverCompliance[]): DriverComplianceStatusValue {
  if (compliances.length === 0) return 'none';

  const now = new Date();
  const limit = new Date();
  limit.setDate(limit.getDate() + EXPIRING_THRESHOLD_DAYS);

  let hasExpiring = false;

  for (const c of compliances) {
    if (!c.expiryDate) continue;
    const expiry = new Date(c.expiryDate);
    if (expiry < now) return 'expired'; // cortocircuita: basta uno scaduto
    if (expiry < limit) hasExpiring = true;
  }

  return hasExpiring ? 'expiring' : 'ok';
}

function buildDriverWithCompliance(driver: Driver, compliances: DriverCompliance[]): DriverWithCompliance {
  return {
    ...driver,
    complianceStatus: {
      overall: computeOverallStatus(compliances),
      details: compliances,
    } satisfies DriverComplianceStatus,
  };
}

// -----------------------------------------------------------------------------
// HOOK
// -----------------------------------------------------------------------------

export function useDrivers(): UseDriversReturn {
  // ── Stato principale ──────────────────────────────────────────────────────
  const [drivers, setDrivers] = useState<DriverWithCompliance[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [complianceLoading, setComplianceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [filters, setFiltersState] = useState<DriverFilters>(DEFAULT_DRIVER_FILTERS);
  const [modalState, setModalState] = useState<DriverModalState>({ mode: 'idle', driver: null });

  // Ref per annullare batch compliance se arriva una nuova fetch prima della fine
  const complianceAbortRef = useRef<AbortController | null>(null);

  // ── Fetch lista ───────────────────────────────────────────────────────────
  const fetchDrivers = useCallback(async (currentFilters: DriverFilters) => {
    setLoading(true);
    setError(null);

    try {
      const params: Record<string, string> = {
        page: String(currentFilters.page),
        limit: String(currentFilters.limit),
      };
      if (currentFilters.search) params.search = currentFilters.search;
      if (currentFilters.isActive !== 'all') params.isActive = currentFilters.isActive;

      const res = await driversApi.getAll(params);

      // Costruisce placeholder DriverWithCompliance con status 'none'
      // I compliance reali vengono caricati subito dopo in batch
      const placeholders: DriverWithCompliance[] = res.data.map(d => buildDriverWithCompliance(d, []));

      setDrivers(placeholders);
      setPagination({
        total: res.pagination.total,
        page: res.pagination.page,
        limit: res.pagination.limit,
        totalPages: res.pagination.totalPages,
      });
      setLoading(false);

      // Batch compliance — annulla eventuale batch precedente
      if (complianceAbortRef.current) complianceAbortRef.current.abort();
      const controller = new AbortController();
      complianceAbortRef.current = controller;

      fetchComplianceBatch(res.data, controller.signal);
    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Errore nel caricamento autisti');
      setLoading(false);
    }
  }, []);

  // ── Batch compliance ──────────────────────────────────────────────────────
  const fetchComplianceBatch = useCallback(async (driverList: Driver[], signal: AbortSignal) => {
    if (driverList.length === 0) return;

    setComplianceLoading(true);

    const results = await Promise.allSettled(driverList.map(d => driversApi.getCompliance(d.id)));

    if (signal.aborted) return;

    setDrivers(prev =>
      prev.map((d, i) => {
        const result = results[i];
        if (result.status === 'fulfilled') {
          return buildDriverWithCompliance(d, result.value.data);
        }
        return d; // mantiene status 'none' in caso di errore singolo
      })
    );

    setComplianceLoading(false);
  }, []);

  // ── Filtri ────────────────────────────────────────────────────────────────
  const setFilters = useCallback((partial: Partial<DriverFilters>) => {
    setFiltersState(prev => {
      const next = { ...prev, ...partial, page: 1 };
      return next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_DRIVER_FILTERS);
  }, []);

  const setPage = useCallback((page: number) => {
    setFiltersState(prev => ({ ...prev, page }));
  }, []);

  // ── Effetto principale ────────────────────────────────────────────────────
  useEffect(() => {
    fetchDrivers(filters);
  }, [filters, fetchDrivers]);

  // ── Helpers modale ────────────────────────────────────────────────────────
  const openCreate = useCallback(() => {
    setModalState({ mode: 'create', driver: null });
  }, []);

  const openEdit = useCallback((driver: DriverWithCompliance) => {
    setModalState({ mode: 'edit', driver });
  }, []);

  const openView = useCallback((driver: DriverWithCompliance) => {
    setModalState({ mode: 'view', driver });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ mode: 'idle', driver: null });
  }, []);

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const createDriver = useCallback(
    async (data: DriverCreateData): Promise<boolean> => {
      setSubmitting(true);
      try {
        await driversApi.create(data);
        closeModal();
        fetchDrivers(filters);
        return true;
      } catch (err: unknown) {
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [filters, fetchDrivers, closeModal]
  );

  const updateDriver = useCallback(
    async (id: number, data: DriverEditData): Promise<boolean> => {
      setSubmitting(true);
      try {
        await driversApi.update(id, data);
        closeModal();
        fetchDrivers(filters);
        return true;
      } catch (err: unknown) {
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [filters, fetchDrivers, closeModal]
  );

  const deactivateDriver = useCallback(
    async (id: number): Promise<boolean> => {
      setSubmitting(true);
      try {
        await driversApi.deactivate(id);
        fetchDrivers(filters);
        return true;
      } catch (err: unknown) {
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [filters, fetchDrivers]
  );

  return {
    drivers,
    pagination,
    loading,
    complianceLoading,
    error,
    submitting,
    filters,
    setFilters,
    resetFilters,
    setPage,
    modalState,
    openCreate,
    openEdit,
    openView,
    closeModal,
    createDriver,
    updateDriver,
    deactivateDriver,
  };
}
