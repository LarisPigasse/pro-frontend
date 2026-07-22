// =============================================================================
// ASSET AZIENDALI — UTILS: mapping verso ScheduledActivityItem
// features/vehicles/utils/scheduledActivities.ts
// =============================================================================
//
// Vista "calendario" unificata — scadenze veicoli + manutenzioni insieme.
// `urgency` viene SEMPRE dallo status del backend (ora corretto per entrambi
// i domini) — mai ricalcolato qui. Data/km servono solo per il testo e per
// l'ordinamento di dettaglio dentro ciascun gruppo di urgenza.

import { daysUntil, dayLabel } from './complianceItems';
import type { VehicleDeadline, MaintenanceScheduleItem } from '../types/vehicles.types';
import type { ScheduledActivityItem, ActivityUrgency } from '../types/dashboard.types';

const vehicleLabel = (v: { brand: string; model: string; plate: string | null }): string =>
  `${v.brand} ${v.model}${v.plate ? ` · ${v.plate}` : ''}`;

export const mapDeadlineToActivity = (deadline: VehicleDeadline): ScheduledActivityItem => {
  const days = daysUntil(deadline.expiryDate);
  const urgency: ActivityUrgency =
    deadline.status === 'expired' ? 'overdue' : deadline.status === 'expiring' ? 'upcoming' : 'ok';

  return {
    source: 'vehicle_deadline',
    id: `vehicle_deadline-${deadline.id}`,
    urgency,
    isPostponable: deadline.deadlineType.isPostponable,
    label: deadline.deadlineType.label,
    subject: vehicleLabel(deadline.vehicle),
    dueDate: deadline.expiryDate,
    daysOverdueOrLeft: days,
    dueLabel: dayLabel(days),
    deadline,
  };
};

export const mapScheduleToActivity = (schedule: MaintenanceScheduleItem): ScheduledActivityItem => {
  const hasDate = schedule.nextDate !== null;
  const days = hasDate ? daysUntil(schedule.nextDate as string) : null;
  const urgency: ActivityUrgency =
    schedule.status === 'overdue' ? 'overdue' : schedule.status === 'warning' ? 'upcoming' : 'ok';
  const dueLabel = hasDate
    ? dayLabel(days as number)
    : schedule.nextKm !== null
      ? `Prossimo intervento: ${schedule.nextKm.toLocaleString('it-IT')} km`
      : 'Da programmare';

  return {
    source: 'maintenance_schedule',
    id: `maintenance_schedule-${schedule.id}`,
    urgency,
    label: schedule.maintenanceType.label,
    subject: vehicleLabel(schedule.vehicle),
    dueDate: hasDate ? schedule.nextDate : null,
    daysOverdueOrLeft: days,
    dueLabel,
    schedule,
  };
};

/** Scadute in cima; poi in scadenza; poi in regola. Dentro ogni gruppo, per prossimità — senza data certa in coda */
export const sortScheduledActivities = (items: ScheduledActivityItem[]): ScheduledActivityItem[] => {
  const rank: Record<ActivityUrgency, number> = { overdue: 0, upcoming: 1, ok: 2 };
  return [...items].sort((a, b) => {
    if (a.urgency !== b.urgency) return rank[a.urgency] - rank[b.urgency];
    if (a.daysOverdueOrLeft === null) return b.daysOverdueOrLeft === null ? 0 : 1;
    if (b.daysOverdueOrLeft === null) return -1;
    return a.daysOverdueOrLeft - b.daysOverdueOrLeft;
  });
};
