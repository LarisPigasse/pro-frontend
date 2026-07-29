// =============================================================================
// VEHICLES MODULE — HOOK: useAccountsLookup
// features/vehicles/hooks/useAccountsLookup.ts
// =============================================================================
//
// Mappa id→email degli account, per risolvere MaintenanceRecord.createdBy
// nel log interventi. Cross-feature (accounts), caricata una volta sola.

import { useState, useEffect, useCallback } from 'react';
import { fetchAccounts } from '@/features/accounts/api/accountsApi';

export const useAccountsLookup = () => {
  const [map, setMap] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAccounts(0, 200);
      setMap(new Map(res.data.accounts.map(a => [a.id, a.email])));
    } catch {
      setMap(new Map());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { map, loading };
};

export default useAccountsLookup;
