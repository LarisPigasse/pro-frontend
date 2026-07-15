// =============================================================================
// VEHICLES MODULE — HOOK: useActiveVehicles
// features/vehicles/hooks/useActiveVehicles.ts
// =============================================================================
//
// Carica un elenco leggero di veicoli attivi, pronto come opzioni per un Select.
// Condiviso da DeadlineFilters, VehicleDeadlineFormModal, e in futuro da
// Storico/Manutenzioni per gli stessi motivi.
//

import { useState, useEffect, useCallback } from 'react';
import { fetchVehicles } from '../api/vehicles.api';

interface SelectOption {
  value: string;
  label: string;
}

export const useActiveVehicles = () => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchVehicles({ status: 'all', page: 1, limit: 100 });
      setOptions(
        res.data.map(v => ({
          value: String(v.id),
          label: `${v.brand} ${v.model}${v.plate ? ` — ${v.plate}` : ''}`,
        }))
      );
    } catch {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { options, loading };
};

export default useActiveVehicles;
