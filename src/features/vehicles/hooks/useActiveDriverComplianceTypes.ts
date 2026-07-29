// =============================================================================
// VEHICLES MODULE — HOOK: useActiveDriverComplianceTypes
// features/vehicles/hooks/useActiveDriverComplianceTypes.ts
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { driverComplianceTypesApi } from '../api/vehicles.api';

interface SelectOption {
  value: string;
  label: string;
}

export const useActiveDriverComplianceTypes = () => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await driverComplianceTypesApi.fetchList({ active: true, page: 1, limit: 100 });
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

export default useActiveDriverComplianceTypes;
