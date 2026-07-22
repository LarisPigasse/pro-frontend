// =============================================================================
// ASSET AZIENDALI — UTILS: mapping verso ScheduledMaintenanceItem
// features/vehicles/utils/scheduledMaintenance.ts
// =============================================================================
//
// Vista "calendario" completa della programmazione manutenzioni — a differenza
// di dashboardActionItems.ts (che unifica 3 domini diversi e mostra solo le
// urgenti), qui il dominio è uno solo (MaintenanceSchedule) ma la vista è più
// ampia: include anche le voci ancora "in regola", non solo quelle critiche.

import { daysUntil, dayLabel } from './complianceItems';
import type { MaintenanceScheduleItem } from '../types/vehicles.types';
import type { ScheduledMaintenanceItem } from '../types/dashboard.types';

export const mapToScheduledMaintenanceItem = (schedule: MaintenanceScheduleItem): ScheduledMaintenanceItem => {
  const hasDate = schedule.nextDate !== null;
  const days = hasDate ? daysUntil(schedule.nextDate as string) : null;
  const dueLabel = hasDate
    ? dayLabel(days as number)
    : schedule.nextKm !== null
      ? `A ${schedule.nextKm.toLocaleString('it-IT')} km`
      : 'Da programmare';

  return {
    schedule,
    // nextDate < oggi calcolato qui, non dallo status salvato — vedi nota architetturale già discussa
    isOverdue: days !== null && days < 0,
    daysOverdueOrLeft: days,
    dueLabel,
  };
};

/** Scadute (per data) sempre in cima; poi le altre in ordine di prossimità; senza data certa in coda al gruppo */
export const sortScheduledMaintenance = (items: ScheduledMaintenanceItem[]): ScheduledMaintenanceItem[] =>
  [...items].sort((a, b) => {
    if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1;
    if (a.daysOverdueOrLeft === null) return b.daysOverdueOrLeft === null ? 0 : 1;
    if (b.daysOverdueOrLeft === null) return -1;
    return a.daysOverdueOrLeft - b.daysOverdueOrLeft;
  });
