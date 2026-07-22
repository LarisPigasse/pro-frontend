// =============================================================================
// ASSET AZIENDALI — HOOK: useDashboardSummary
// features/vehicles/hooks/useDashboardSummary.ts
// =============================================================================
//
// Aggrega lo stato dell'intero modulo in un'unica vista, combinando le
// chiamate esistenti in parallelo con Promise.allSettled — se una fonte
// fallisce, le altre restano valide. Nessun endpoint /dashboard esiste sul
// backend: l'aggregazione è client-side.
//
// Auto-refresh silenzioso ogni 60s: aggiorna i dati in background senza
// mostrare lo skeleton di caricamento, che compare solo al primo mount e
// sui refresh espliciti (bottone in PageHeader).

import { useState, useEffect, useCallback } from 'react';
import {
  fetchVehicles,
  fetchDrivers,
  fetchVehicleDeadlines,
  fetchMaintenanceSchedules,
  fetchDriverCompliances,
  fetchNotifications,
  fetchUnreadNotificationsCount,
  markNotificationRead,
  markAllNotificationsRead,
} from '../api/vehicles.api';
import type { PaginatedApiResponse } from '../types/vehicles.types';
import type { DashboardSummary, DashboardKPI, VehicleStatusBreakdown } from '../types/dashboard.types';
import { mapComplianceToActionItem, sortComplianceItems, MAX_COMPLIANCE_ITEMS } from '../utils/complianceItems';
import { mapDeadlineToActivity, mapScheduleToActivity, sortScheduledActivities } from '../utils/scheduledActivities';

const AUTO_REFRESH_MS = 60_000;

const EMPTY_SUMMARY: DashboardSummary = {
  kpi: {
    vehiclesTotal: 0,
    vehiclesActive: 0,
    driversTotal: 0,
    driversActive: 0,
    activitiesOverdue: 0,
    activitiesUpcoming: 0,
    complianceExpiring: 0,
    complianceExpired: 0,
    unreadNotifications: 0,
  },
  vehicleStatusBreakdown: { active: 0, maintenance: 0, inactive: 0, decommissioned: 0 },
  complianceItems: [],
  scheduledActivities: [],
  recentNotifications: [],
};

// ─── estrazione resiliente da Promise.allSettled ───────────────────────────

const total = <T>(r: PromiseSettledResult<PaginatedApiResponse<T>>): number =>
  r.status === 'fulfilled' ? r.value.meta.total : 0;
const rows = <T>(r: PromiseSettledResult<PaginatedApiResponse<T>>): T[] => (r.status === 'fulfilled' ? r.value.data : []);

// ─────────────────────────────────────────────────────────────────────────────

interface UseDashboardSummaryReturn {
  summary: DashboardSummary;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useDashboardSummary = (): UseDashboardSummaryReturn => {
  const [summary, setSummary] = useState<DashboardSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

    const results = await Promise.allSettled([
      fetchVehicles({ status: 'active', limit: 1 }),
      fetchVehicles({ status: 'maintenance', limit: 1 }),
      fetchVehicles({ status: 'inactive', limit: 1 }),
      fetchVehicles({ status: 'decommissioned', limit: 1 }),
      fetchDrivers({ active: true, limit: 1 }),
      fetchDrivers({ active: false, limit: 1 }),
      fetchVehicleDeadlines({ status: 'expired', limit: 1 }),
      fetchVehicleDeadlines({ status: 'expiring', limit: 1 }),
      fetchVehicleDeadlines({ status: 'all', limit: 30 }),
      fetchMaintenanceSchedules({ status: 'overdue', limit: 1 }),
      fetchMaintenanceSchedules({ status: 'warning', limit: 1 }),
      fetchMaintenanceSchedules({ status: 'all', limit: 30 }),
      fetchDriverCompliances({ status: 'expired', limit: 10 }),
      fetchDriverCompliances({ status: 'expiring', limit: 10 }),
      fetchUnreadNotificationsCount(),
      fetchNotifications({ isArchived: false, limit: 8 }),
    ]);

    const [
      vehiclesActive,
      vehiclesMaintenance,
      vehiclesInactive,
      vehiclesDecommissioned,
      driversActive,
      driversInactive,
      deadlinesExpiredCount,
      deadlinesExpiringCount,
      deadlinesAll,
      maintenanceOverdueCount,
      maintenanceWarningCount,
      maintenanceAll,
      complianceExpired,
      complianceExpiring,
      unreadCount,
      recentNotifications,
    ] = results;

    const vehicleStatusBreakdown: VehicleStatusBreakdown = {
      active: total(vehiclesActive),
      maintenance: total(vehiclesMaintenance),
      inactive: total(vehiclesInactive),
      decommissioned: total(vehiclesDecommissioned),
    };

    const kpi: DashboardKPI = {
      vehiclesTotal:
        vehicleStatusBreakdown.active +
        vehicleStatusBreakdown.maintenance +
        vehicleStatusBreakdown.inactive +
        vehicleStatusBreakdown.decommissioned,
      vehiclesActive: vehicleStatusBreakdown.active,
      driversTotal: total(driversActive) + total(driversInactive),
      driversActive: total(driversActive),
      activitiesOverdue: total(deadlinesExpiredCount) + total(maintenanceOverdueCount),
      activitiesUpcoming: total(deadlinesExpiringCount) + total(maintenanceWarningCount),
      complianceExpiring: total(complianceExpiring),
      complianceExpired: total(complianceExpired),
      unreadNotifications: unreadCount.status === 'fulfilled' ? unreadCount.value.data.count : 0,
    };

    const complianceItems = sortComplianceItems([
      ...rows(complianceExpired).map(mapComplianceToActionItem),
      ...rows(complianceExpiring).map(mapComplianceToActionItem),
    ]).slice(0, MAX_COMPLIANCE_ITEMS);

    const scheduledActivities = sortScheduledActivities([
      ...rows(deadlinesAll).map(mapDeadlineToActivity),
      ...rows(maintenanceAll)
        .filter(s => s.status !== 'suspended')
        .map(mapScheduleToActivity),
    ]);

    setSummary({
      kpi,
      vehicleStatusBreakdown,
      complianceItems,
      scheduledActivities,
      recentNotifications: rows(recentNotifications),
    });

    if (results.some(r => r.status === 'rejected')) {
      setError('Alcuni dati potrebbero non essere aggiornati — un paio di richieste non sono andate a buon fine.');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const interval = setInterval(() => load(true), AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [load]);

  const reload = useCallback(async () => {
    await load(false);
  }, [load]);

  const markAsRead = useCallback(
    async (id: number) => {
      await markNotificationRead(id);
      await load(true);
    },
    [load]
  );

  const markAllAsRead = useCallback(async () => {
    await markAllNotificationsRead();
    await load(true);
  }, [load]);

  return { summary, loading, error, reload, markAsRead, markAllAsRead };
};

export default useDashboardSummary;
