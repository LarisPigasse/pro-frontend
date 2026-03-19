// =============================================================================
// VEHICLES MODULE — HOOK: useVehicles
// features/vehicles/hooks/useVehicles.ts
// =============================================================================
//
// Gestisce:
//   - Lista veicoli con filtri e paginazione
//   - Operazioni CRUD (create, update, delete)
//   - Stato UI modali (view/create/edit)
//
// Utilizzo:
//   const {
//     vehicles, pagination, loading, error,
//     filters, setFilters, resetFilters,
//     modalState, openCreate, openEdit, openView, closeModal,
//     createVehicle, updateVehicle, deleteVehicle,
//   } = useVehicles();
// =============================================================================

import { useState, useEffect, useCallback } from 'react';

import { vehiclesApi } from '../api/vehicles.api';
import type {
  Vehicle,
  VehicleCreateData,
  VehicleEditData,
  VehicleFiltersState,
  VehicleModalState,
} from '../types/vehicles.types';

// re-export della costante per evitare import circolari nei componenti
import { DEFAULT_VEHICLE_FILTERS as _DEFAULT_FILTERS } from '../types/vehicles.types';

// -----------------------------------------------------------------------------
// TIPI INTERNI
// -----------------------------------------------------------------------------

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UseVehiclesState {
  vehicles: Vehicle[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  submitting: boolean; // true durante create/update/delete
}

const EMPTY_PAGINATION: Pagination = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
};

// -----------------------------------------------------------------------------
// HOOK
// -----------------------------------------------------------------------------

export const useVehicles = () => {
  // --- Dati lista ---
  const [state, setState] = useState<UseVehiclesState>({
    vehicles: [],
    pagination: EMPTY_PAGINATION,
    loading: true,
    error: null,
    submitting: false,
  });

  // --- Filtri e paginazione ---
  const [filters, setFiltersState] = useState<VehicleFiltersState>(_DEFAULT_FILTERS);

  // --- Stato modali ---
  const [modalState, setModalState] = useState<VehicleModalState>({
    mode: null,
    vehicle: null,
  });

  // ---------------------------------------------------------------------------
  // FETCH LISTA
  // ---------------------------------------------------------------------------

  const fetchVehicles = useCallback(async (currentFilters: VehicleFiltersState) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const res = await vehiclesApi.getAll(currentFilters);

      setState(prev => ({
        ...prev,
        vehicles: res.data ?? [],
        pagination: res.pagination ?? EMPTY_PAGINATION,
        loading: false,
        error: null,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore nel caricamento dei veicoli';

      setState(prev => ({
        ...prev,
        vehicles: [],
        pagination: EMPTY_PAGINATION,
        loading: false,
        error: message,
      }));
    }
  }, []);

  // Ri-fetch ogni volta che cambiano i filtri
  useEffect(() => {
    fetchVehicles(filters);
  }, [filters, fetchVehicles]);

  // ---------------------------------------------------------------------------
  // GESTIONE FILTRI
  // ---------------------------------------------------------------------------

  /**
   * Aggiorna uno o più filtri e resetta la pagina a 1.
   * La pagina non viene resettata se si sta cambiando esplicitamente `page`.
   */
  const setFilters = useCallback((updates: Partial<VehicleFiltersState>) => {
    setFiltersState(prev => ({
      ...prev,
      ...updates,
      page: updates.page ?? 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(_DEFAULT_FILTERS);
  }, []);

  const setPage = useCallback((page: number) => {
    setFiltersState(prev => ({ ...prev, page }));
  }, []);

  // ---------------------------------------------------------------------------
  // GESTIONE MODALI
  // ---------------------------------------------------------------------------

  const openCreate = useCallback(() => {
    setModalState({ mode: 'create', vehicle: null });
  }, []);

  const openEdit = useCallback((vehicle: Vehicle) => {
    setModalState({ mode: 'edit', vehicle });
  }, []);

  const openView = useCallback((vehicle: Vehicle) => {
    setModalState({ mode: 'view', vehicle });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ mode: null, vehicle: null });
  }, []);

  // ---------------------------------------------------------------------------
  // OPERAZIONI CRUD
  // ---------------------------------------------------------------------------

  const createVehicle = useCallback(
    async (data: VehicleCreateData): Promise<boolean> => {
      setState(prev => ({ ...prev, submitting: true }));

      try {
        await vehiclesApi.create(data);
        // Ricarica la lista dalla pagina 1 dopo la creazione
        setFiltersState(prev => ({ ...prev, page: 1 }));
        closeModal();
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Errore nella creazione del veicolo';
        setState(prev => ({ ...prev, submitting: false, error: message }));
        return false;
      } finally {
        setState(prev => ({ ...prev, submitting: false }));
      }
    },
    [closeModal]
  );

  const updateVehicle = useCallback(
    async (id: number, data: VehicleEditData): Promise<boolean> => {
      setState(prev => ({ ...prev, submitting: true }));

      try {
        const res = await vehiclesApi.update(id, data);

        // Aggiornamento ottimistico: sostituisce il veicolo nella lista
        setState(prev => ({
          ...prev,
          submitting: false,
          vehicles: prev.vehicles.map(v => (v.id === id ? { ...v, ...res.data } : v)),
        }));

        closeModal();
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Errore nella modifica del veicolo';
        setState(prev => ({ ...prev, submitting: false, error: message }));
        return false;
      }
    },
    [closeModal]
  );

  const deleteVehicle = useCallback(async (id: number): Promise<boolean> => {
    setState(prev => ({ ...prev, submitting: true }));

    try {
      await vehiclesApi.delete(id);

      // Rimozione ottimistica dalla lista
      setState(prev => ({
        ...prev,
        submitting: false,
        vehicles: prev.vehicles.filter(v => v.id !== id),
        pagination: {
          ...prev.pagination,
          total: Math.max(0, prev.pagination.total - 1),
        },
      }));

      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore nella eliminazione del veicolo';
      setState(prev => ({ ...prev, submitting: false, error: message }));
      return false;
    }
  }, []);

  /** Forza il ricaricamento della lista con i filtri correnti */
  const reload = useCallback(() => {
    fetchVehicles(filters);
  }, [fetchVehicles, filters]);

  // ---------------------------------------------------------------------------
  // RETURN
  // ---------------------------------------------------------------------------

  return {
    // Dati lista
    vehicles: state.vehicles,
    pagination: state.pagination,
    loading: state.loading,
    error: state.error,
    submitting: state.submitting,

    // Filtri
    filters,
    setFilters,
    resetFilters,
    setPage,

    // Modali
    modalState,
    openCreate,
    openEdit,
    openView,
    closeModal,

    // CRUD
    createVehicle,
    updateVehicle,
    deleteVehicle,
    reload,
  };
};
