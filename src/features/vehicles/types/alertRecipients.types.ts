// =============================================================================
// VEHICLES MODULE — TYPES: AlertRecipient (Fase 2 — Destinatari avvisi)
// features/vehicles/types/alertRecipients.types.ts
// =============================================================================
//
// File dedicato, separato da vehicles.types.ts/lookups.types.ts: AlertRecipient
// non è una lookup semplice (createLookupCrud) né un'entità del dominio
// veicoli/autisti — ha una relazione 1 a N con le proprie preferenze, gestita
// con transazioni custom lato backend.

import type { ApiResponse, PaginatedApiResponse } from './vehicles.types';

// ─────────────────────────────────────────────────────────────────────────────
// Riepilogo minimo dei 3 tipi referenziabili — solo id/name/label, sufficiente
// per mostrare un'etichetta leggibile nella UI
// ─────────────────────────────────────────────────────────────────────────────

interface AlertTypeSummary {
  id: number;
  name: string;
  label: string;
}

export interface AlertRecipientPreference {
  id: number;
  deadlineTypeId: number | null;
  maintenanceTypeId: number | null;
  complianceTypeId: number | null;
  deadlineType?: AlertTypeSummary | null;
  maintenanceType?: AlertTypeSummary | null;
  complianceType?: AlertTypeSummary | null;
}

export interface AlertRecipient {
  id: number;
  email: string;
  name: string | null;
  receivesAll: boolean;
  isActive: boolean;
  preferences: AlertRecipientPreference[];
  createdAt: string;
  updatedAt: string;
}

/** Una singola preferenza in scrittura — esattamente uno dei tre id valorizzato, verificato lato backend */
export interface AlertPreferenceInput {
  deadlineTypeId?: number | null;
  maintenanceTypeId?: number | null;
  complianceTypeId?: number | null;
}

export interface CreateAlertRecipientData {
  email: string;
  name?: string | null;
  receivesAll?: boolean;
  isActive?: boolean;
  preferences?: AlertPreferenceInput[];
}

/** update sostituisce SEMPRE l'intero set di preferenze se il campo è presente — non è un merge */
export interface UpdateAlertRecipientData {
  email?: string;
  name?: string | null;
  receivesAll?: boolean;
  isActive?: boolean;
  preferences?: AlertPreferenceInput[];
}

export interface AlertRecipientFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export type AlertRecipientsListResponse = PaginatedApiResponse<AlertRecipient>;
export type AlertRecipientResponse = ApiResponse<AlertRecipient>;
