// =============================================================================
// VEHICLES MODULE — HOOK: useActiveMaintenanceTypes
// features/vehicles/hooks/useActiveMaintenanceTypes.ts
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { maintenanceTypesApi } from '../api/lookups.api';

interface SelectOption {
  value: string;
  label: string;
}

export const useActiveMaintenanceTypes = () => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await maintenanceTypesApi.fetchList({ active: true, page: 1, limit: 100 });
      setOptions(res.data.map(t => ({ value: String(t.id), label: t.label })));
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

export default useActiveMaintenanceTypes;
