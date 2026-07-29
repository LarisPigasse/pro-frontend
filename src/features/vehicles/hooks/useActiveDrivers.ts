// =============================================================================
// VEHICLES MODULE — HOOK: useActiveDrivers
// features/vehicles/hooks/useActiveDrivers.ts
// =============================================================================
//
// Carica un elenco leggero di autisti attivi, pronto come opzioni per un Select.
// Gemello di useActiveVehicles.ts, per lo stesso motivo: NotificationFilters
// non ha bisogno del CRUD completo di useDrivers.ts, solo delle opzioni.

import { useState, useEffect, useCallback } from 'react';
import { fetchDrivers } from '../api/vehicles.api';

interface SelectOption {
  value: string;
  label: string;
}

export const useActiveDrivers = () => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDrivers({ active: true, page: 1, limit: 100 });
      setOptions(res.data.map(d => ({ value: String(d.id), label: `${d.firstName} ${d.lastName}` })));
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

export default useActiveDrivers;
