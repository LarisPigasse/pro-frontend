// =============================================================================
// VEHICLES MODULE — HOOK: useActiveWorkshops
// features/vehicles/hooks/useActiveWorkshops.ts
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { workshopsApi } from '../api/lookups.api';

interface SelectOption {
  value: string;
  label: string;
}

export const useActiveWorkshops = () => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await workshopsApi.fetchList({ active: true, page: 1, limit: 100 });
      setOptions(res.data.map(w => ({ value: String(w.id), label: w.city ? `${w.name} — ${w.city}` : w.name })));
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

export default useActiveWorkshops;
