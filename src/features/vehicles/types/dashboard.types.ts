// =============================================================================
// VEHICLES MODULE — DASHBOARD TYPES (Blocco E)
// features/vehicles/types/dashboard.types.ts
// =============================================================================
//
// Tipi "vista aggregata": non rispecchiano un'entità del backend (non esiste
// un endpoint /dashboard) ma la sintesi che il frontend assembla combinando
// più risposte già esistenti. Per questo vivono separati da vehicles.types.ts,
// che resta dedicato alle entità reali.

import type { Notification, MaintenanceScheduleItem, VehicleDeadline } from './vehicles.types';

// ─────────────────────────────────────────────────────────────────────────────
// Conformità autisti — unico dominio rimasto in questo pannello. Niente più
// discriminante "source": prima serviva per unificare 3 fonti diverse
// (scadenze/manutenzioni/conformità), ora ce n'è una sola.
// ─────────────────────────────────────────────────────────────────────────────

export type ComplianceUrgency = 'expired' | 'expiring';

export interface ComplianceActionItem {
  id: string;
  urgency: ComplianceUrgency;
  label: string;
  subject: string;
  dueDate: string | null;
  daysOverdueOrLeft: number | null;
  dueLabel: string;
  linkTo: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Programmazione unificata — scadenze veicoli + manutenzioni insieme, in
// un'unica lista ordinata per prossimità. Union discriminata (non campi
// opzionali): il componente restringe su `source` e sa con certezza quale
// entità e quale azione ha davanti ("Rinnova" vs "Segna come svolta").
//
// `urgency` viene SEMPRE dallo status calcolato dal backend (ora corretto per
// entrambi i domini, cron incluso) — mai ricalcolato qui. Data/km restano usati
// solo per il testo descrittivo e per l'ordinamento di dettaglio, mai per
// decidere colore o urgenza.
// ─────────────────────────────────────────────────────────────────────────────

export type ActivityUrgency = 'overdue' | 'upcoming' | 'ok';

export type ScheduledActivityItem =
  | {
      source: 'vehicle_deadline';
      id: string;
      urgency: ActivityUrgency;
      /** Dal DeadlineType collegato — determina il livello di evidenza visiva quando urgency === 'overdue' */
      isPostponable: boolean;
      label: string;
      subject: string;
      dueDate: string; // VehicleDeadline.expiryDate è sempre valorizzata, mai null
      daysOverdueOrLeft: number;
      dueLabel: string;
      /** Riferimento completo — serve all'azione "Rinnova" */
      deadline: VehicleDeadline;
    }
  | {
      source: 'maintenance_schedule';
      id: string;
      urgency: ActivityUrgency;
      label: string;
      subject: string;
      dueDate: string | null; // null per manutenzioni tracciate solo a km
      daysOverdueOrLeft: number | null;
      dueLabel: string;
      /** Riferimento completo — serve all'azione "Segna come svolta" */
      schedule: MaintenanceScheduleItem;
    };

// ─────────────────────────────────────────────────────────────────────────────
// KPI numerici — una entry per ciascuna StatCard della vista d'insieme
// ─────────────────────────────────────────────────────────────────────────────

export interface VehicleStatusBreakdown {
  active: number;
  maintenance: number;
  inactive: number;
  decommissioned: number;
}

export interface DashboardKPI {
  vehiclesTotal: number;
  vehiclesActive: number;
  driversTotal: number;
  driversActive: number;
  /** Scadenze + manutenzioni scadute, sommate — non più separate per dominio (card "Attività") */
  activitiesOverdue: number;
  /** Scadenze + manutenzioni in scadenza, sommate */
  activitiesUpcoming: number;
  complianceExpiring: number;
  complianceExpired: number;
  unreadNotifications: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Vista aggregata completa — quello che restituisce useDashboardSummary
// ─────────────────────────────────────────────────────────────────────────────

export interface DashboardSummary {
  kpi: DashboardKPI;
  vehicleStatusBreakdown: VehicleStatusBreakdown;
  /** Era actionItems — ora dedicato solo alla Conformità autisti */
  complianceItems: ComplianceActionItem[];
  /** Era scheduledMaintenance — ora unifica scadenze veicoli + manutenzioni */
  scheduledActivities: ScheduledActivityItem[];
  recentNotifications: Notification[];
}
