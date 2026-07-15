// =============================================================================
// VEHICLES MODULE — HOOK: useActiveTelematicsProviders
// features/vehicles/hooks/useActiveTelematicsProviders.ts
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { telematicsProvidersApi } from '../api/lookups.api';

interface SelectOption {
  value: string;
  label: string;
}

export const useActiveTelematicsProviders = () => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await telematicsProvidersApi.fetchList({ active: true, page: 1, limit: 100 });
      setOptions(res.data.map(p => ({ value: String(p.id), label: p.name })));
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

export default useActiveTelematicsProviders;
