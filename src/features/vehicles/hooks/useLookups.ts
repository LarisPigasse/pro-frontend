// =============================================================================
// VEHICLES MODULE — HOOK: useLookups
// features/vehicles/hooks/useLookups.ts
// =============================================================================
//
// Carica in parallelo le lookup tables necessarie ai filtri e ai form:
//   - VehicleCategory
//   - VehicleStatus
//   - FuelType
//
// Utilizzo:
//   const { lookups, loading, error } = useLookups();
//
// I dati vengono caricati al mount e non cambiano durante la sessione
// (sono dati di configurazione, non operativi).
// =============================================================================

import { useState, useEffect, useCallback } from 'react';

import { vehicleLookupsApi } from '../api/vehicles.api';
import type { VehicleLookups } from '../types/vehicles.types';

// -----------------------------------------------------------------------------
// STATO HOOK
// -----------------------------------------------------------------------------

interface UseLookupsState {
  lookups: VehicleLookups;
  loading: boolean;
  error: string | null;
}

const EMPTY_LOOKUPS: VehicleLookups = {
  categories: [],
  statuses: [],
  fuelTypes: [],
};

// -----------------------------------------------------------------------------
// HOOK
// -----------------------------------------------------------------------------

export const useLookups = () => {
  const [state, setState] = useState<UseLookupsState>({
    lookups: EMPTY_LOOKUPS,
    loading: true,
    error: null,
  });

  const fetchLookups = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Caricamento parallelo — le tre chiamate partono contemporaneamente
      const [categoriesRes, statusesRes, fuelTypesRes] = await Promise.all([
        vehicleLookupsApi.getCategories(),
        vehicleLookupsApi.getStatuses(),
        vehicleLookupsApi.getFuelTypes(),
      ]);

      setState({
        lookups: {
          categories: categoriesRes.data ?? [],
          statuses: statusesRes.data ?? [],
          fuelTypes: fuelTypesRes.data ?? [],
        },
        loading: false,
        error: null,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore nel caricamento dei dati di configurazione';

      setState({
        lookups: EMPTY_LOOKUPS,
        loading: false,
        error: message,
      });
    }
  }, []);

  // Carica al mount
  useEffect(() => {
    fetchLookups();
  }, [fetchLookups]);

  return {
    ...state,
    /** Forza il ricaricamento delle lookup (es. dopo creazione nuova categoria) */
    reload: fetchLookups,
  };
};
