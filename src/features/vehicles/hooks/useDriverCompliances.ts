// =============================================================================
// ASSET AZIENDALI — HOOK: useDriverCompliances
// features/vehicles/hooks/useDriverCompliances.ts
// =============================================================================
//
// Calcola lo stato di conformità AGGREGATO per un insieme di autisti (es. la
// pagina corrente della tabella). Per ogni autista carica tutti i documenti
// di conformità e li riduce a un singolo badge (expired > expiring > valid >
// not_applicable > none), secondo la logica descritta in §8 dell'handover.
//
// Uso Promise.allSettled: se la chiamata per UN autista fallisce, gli altri
// risultati restano validi — resilienza richiesta esplicitamente in §7.8.
//
// reload() permette di ricalcolare i badge dopo una modifica ai documenti
// di conformità (aggiunta/rinnovo/eliminazione) fatta dal ViewDriverModal,
// senza dover ricaricare l'intera pagina.
//

import { useState, useEffect, useCallback } from 'react';
import { fetchDriverCompliances } from '../api/vehicles.api';
import type { DriverCompliance, DriverComplianceStatusValue, DriverOverallComplianceStatus } from '../types/vehicles.types';

// ─────────────────────────────────────────────────────────────────────────────
// Tipo derivato — solo frontend
// ─────────────────────────────────────────────────────────────────────────────

export interface DriverComplianceSummary {
  status: DriverOverallComplianceStatus;
  expiredCount: number;
  expiringCount: number;
  totalCount: number;
}

const EMPTY_SUMMARY: DriverComplianceSummary = {
  status: 'none',
  expiredCount: 0,
  expiringCount: 0,
  totalCount: 0,
};

/** Ordine di priorità per l'aggregazione — il primo status trovato tra i documenti vince */
const STATUS_PRIORITY: DriverComplianceStatusValue[] = ['expired', 'expiring', 'valid', 'not_applicable'];

const summarize = (records: DriverCompliance[]): DriverComplianceSummary => {
  if (records.length === 0) return EMPTY_SUMMARY;

  const overall = STATUS_PRIORITY.find(status => records.some(r => r.status === status)) ?? 'not_applicable';

  return {
    status: overall,
    expiredCount: records.filter(r => r.status === 'expired').length,
    expiringCount: records.filter(r => r.status === 'expiring').length,
    totalCount: records.length,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

interface UseDriverCompliancesReturn {
  /** Mappa driverId → riepilogo conformità */
  summaries: Record<number, DriverComplianceSummary>;
  loading: boolean;
  /** Ricalcola i riepiloghi per gli stessi driverIds — da chiamare dopo una modifica ai documenti */
  reload: () => Promise<void>;
}

export const useDriverCompliances = (driverIds: number[]): UseDriverCompliancesReturn => {
  const [summaries, setSummaries] = useState<Record<number, DriverComplianceSummary>>({});
  const [loading, setLoading] = useState(false);

  // Chiave stabile per evitare ricariche quando l'array ha lo stesso contenuto
  // ma riferimento diverso (es. re-render della pagina senza cambio dati)
  const idsKey = driverIds.join(',');

  const load = useCallback(async () => {
    if (driverIds.length === 0) {
      setSummaries({});
      return;
    }

    setLoading(true);

    const results = await Promise.allSettled(
      driverIds.map(driverId => fetchDriverCompliances({ driverId, status: 'all', limit: 100 }))
    );

    const next: Record<number, DriverComplianceSummary> = {};
    results.forEach((result, index) => {
      const driverId = driverIds[index];
      next[driverId] = result.status === 'fulfilled' ? summarize(result.value.data) : EMPTY_SUMMARY;
    });

    setSummaries(next);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  useEffect(() => {
    let cancelled = false;

    // Wrapper locale per rispettare la cancellazione anche dentro useEffect
    (async () => {
      if (cancelled) return;
      await load();
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  const reload = useCallback(async () => {
    await load();
  }, [load]);

  return { summaries, loading, reload };
};

export default useDriverCompliances;
