// =============================================================================
// VEHICLES MODULE — HOOK: useLookups
// features/vehicles/hooks/useLookups.ts
// =============================================================================
//
// Punto unico di caricamento dei dati di riferimento (lookup) del modulo.
// Oggi carica solo i tipi di conformità autisti; la struttura con
// Promise.allSettled è già pronta ad accogliere i lookup dei blocchi futuri
// (categorie veicoli, provider telematici, officine, ...) senza modifiche
// alla logica di gestione errori.
//

import { useState, useEffect, useCallback } from 'react';
import { fetchDriverComplianceTypes } from '../api/vehicles.api';
import type { DriverComplianceType } from '../types/vehicles.types';

interface UseLookupsReturn {
  driverComplianceTypes: DriverComplianceType[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export const useLookups = (): UseLookupsReturn => {
  const [driverComplianceTypes, setDriverComplianceTypes] = useState<DriverComplianceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [complianceTypesResult] = await Promise.allSettled([fetchDriverComplianceTypes()]);

    if (complianceTypesResult.status === 'fulfilled') {
      // Solo i tipi attivi hanno senso da proporre nella UI di assegnazione
      setDriverComplianceTypes(complianceTypesResult.value.data.filter(t => t.isActive));
    } else {
      setError('Errore nel caricamento dei tipi di conformità');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const reload = useCallback(async () => {
    await load();
  }, [load]);

  return { driverComplianceTypes, loading, error, reload };
};

export default useLookups;
