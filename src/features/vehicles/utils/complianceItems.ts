// =============================================================================
// ASSET AZIENDALI — UTILS: mapping verso ComplianceActionItem
// features/vehicles/utils/complianceItems.ts
// =============================================================================
//
// Funzioni pure per il pannello Conformità autisti — unico dominio rimasto
// qui dopo la ristrutturazione (prima ne univa 3). Rinominato da
// dashboardActionItems.ts.

import { ROUTES } from '@/config';
import type { DriverCompliance } from '../types/vehicles.types';
import type { ComplianceActionItem } from '../types/dashboard.types';

/** Giorni tra oggi e una data ISO — negativo se la data è nel passato */
export const daysUntil = (isoDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(isoDate);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const dayLabel = (days: number): string => {
  if (days < 0) {
    const n = Math.abs(days);
    return `Scaduta da ${n} ${n === 1 ? 'giorno' : 'giorni'}`;
  }
  if (days === 0) return 'Scade oggi';
  return `Tra ${days} ${days === 1 ? 'giorno' : 'giorni'}`;
};

export const mapComplianceToActionItem = (c: DriverCompliance): ComplianceActionItem => {
  const days = c.expiresAt ? daysUntil(c.expiresAt) : null;
  return {
    id: `driver_compliance-${c.id}`,
    urgency: c.status === 'expired' ? 'expired' : 'expiring',
    label: c.complianceType?.label ?? 'Conformità',
    subject: `${c.driver.firstName} ${c.driver.lastName}`,
    dueDate: c.expiresAt,
    daysOverdueOrLeft: days,
    dueLabel: days !== null ? dayLabel(days) : '—',
    linkTo: ROUTES.VEICOLI_AUTISTI,
  };
};

/** Scaduti prima di in-scadenza; a parità, il più urgente prima; senza data certa in coda */
export const sortComplianceItems = (items: ComplianceActionItem[]): ComplianceActionItem[] =>
  [...items].sort((a, b) => {
    if (a.urgency !== b.urgency) return a.urgency === 'expired' ? -1 : 1;
    if (a.daysOverdueOrLeft === null) return b.daysOverdueOrLeft === null ? 0 : 1;
    if (b.daysOverdueOrLeft === null) return -1;
    return a.daysOverdueOrLeft - b.daysOverdueOrLeft;
  });

export const MAX_COMPLIANCE_ITEMS = 15;
