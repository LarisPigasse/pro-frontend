// =============================================================================
// VEHICLES MODULE — HOOK: useActiveVehicleCategories
// features/vehicles/hooks/useActiveVehicleCategories.ts
// =============================================================================
//
// Carica le categorie veicolo attive, pronte come opzioni per un MultiSelect.
// Condiviso da DeadlineTypeFormModal e MaintenanceTypeFormModal — entrambi i
// form hanno un campo "si applica a queste categorie".
//

import { useState, useEffect, useCallback } from 'react';
import { vehicleCategoriesApi } from '../api/lookups.api';
import type { MultiSelectOption } from '@/core/components/form/multi-select/MultiSelect';

export const useActiveVehicleCategories = () => {
  const [options, setOptions] = useState<MultiSelectOption[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await vehicleCategoriesApi.fetchList({ active: true, page: 1, limit: 100 });
      setOptions(res.data.map(c => ({ value: String(c.id), label: c.label })));
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

export default useActiveVehicleCategories;
