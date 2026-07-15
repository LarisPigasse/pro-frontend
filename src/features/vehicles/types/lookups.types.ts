// =============================================================================
// VEHICLES MODULE — TYPE DEFINITIONS: Lookup Tables (Configurazione)
// features/vehicles/types/lookups.types.ts
// =============================================================================
//
// Le 6 lookup table gestibili da "Configurazione". Non tutte condividono la
// stessa forma: solo LookupBase (id, isActive, timestamp) è davvero comune a
// tutte e 6. Il resto è specifico per entità — vedi note nel modello backend.
//

import type { ApiResponse, PaginatedApiResponse } from './vehicles.types';
import type { DriverComplianceType, DriverComplianceCategory } from './vehicles.types';

export interface LookupBase {
  id: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Filtri di lista condivisi dalla maggior parte delle lookup */
export interface LookupListFilters {
  search?: string;
  active?: boolean;
  page?: number;
  limit?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Vehicle Category — usata da Dotazione
// ─────────────────────────────────────────────────────────────────────────────

export type RegulationType = 'highway_code' | 'dlgs_81_08' | 'both';

export interface VehicleCategory extends LookupBase {
  name: string;
  label: string;
  description: string | null;
  requiresPlate: boolean;
  requiresTachograph: boolean;
  regulationType: RegulationType;
  sortOrder: number;
}

export interface CreateVehicleCategoryData {
  name: string;
  label: string;
  description?: string;
  requiresPlate?: boolean;
  requiresTachograph?: boolean;
  regulationType?: RegulationType;
  sortOrder?: number;
}
export type UpdateVehicleCategoryData = Partial<CreateVehicleCategoryData>;

// ─────────────────────────────────────────────────────────────────────────────
// 2. Telematics Provider — usata da Dotazione. ⚠️ apiKey/apiSecret: dati sensibili,
// da mascherare in UI (mai loggarli, mai mostrarli in chiaro in tabella)
// ─────────────────────────────────────────────────────────────────────────────

export type TelematicsDataFormat = 'json' | 'xml';

export interface TelematicsProvider extends LookupBase {
  name: string;
  apiEndpoint: string | null;
  apiKey: string | null;
  apiSecret: string | null;
  dataFormat: TelematicsDataFormat;
  pollingMinutes: number;
  notes: string | null;
}

export interface CreateTelematicsProviderData {
  name: string;
  apiEndpoint?: string;
  apiKey?: string;
  apiSecret?: string;
  dataFormat?: TelematicsDataFormat;
  pollingMinutes?: number;
  notes?: string;
}
export type UpdateTelematicsProviderData = Partial<CreateTelematicsProviderData>;

// ─────────────────────────────────────────────────────────────────────────────
// 3. Workshop — usata da Storico manutenzioni
// ─────────────────────────────────────────────────────────────────────────────

export interface Workshop extends LookupBase {
  name: string;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  phone: string | null;
  email: string | null;
  specialization: string | null;
  notes: string | null;
}

export interface CreateWorkshopData {
  name: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  specialization?: string;
  notes?: string;
}
export type UpdateWorkshopData = Partial<CreateWorkshopData>;

/** Workshop ha un filtro aggiuntivo (città) rispetto alle altre lookup */
export interface WorkshopFilters extends LookupListFilters {
  city?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Deadline Type — usata da Scadenze
// ─────────────────────────────────────────────────────────────────────────────

export interface DeadlineType extends LookupBase {
  name: string;
  label: string;
  description: string | null;
  /** ID delle VehicleCategory a cui si applica — null = tutte */
  appliesToCategories: number[] | null;
  alertDays1: number;
  alertDays2: number;
  alertDays3: number;
  isRecurring: boolean;
  recurrenceMonths: number | null;
  sortOrder: number;
}

export interface CreateDeadlineTypeData {
  name: string;
  label: string;
  description?: string;
  appliesToCategories?: number[];
  alertDays1?: number;
  alertDays2?: number;
  alertDays3?: number;
  isRecurring?: boolean;
  recurrenceMonths?: number;
  sortOrder?: number;
}
export type UpdateDeadlineTypeData = Partial<CreateDeadlineTypeData>;

// ─────────────────────────────────────────────────────────────────────────────
// 5. Maintenance Type — usata da Storico
// ─────────────────────────────────────────────────────────────────────────────

export interface MaintenanceType extends LookupBase {
  name: string;
  label: string;
  description: string | null;
  appliesToCategories: number[] | null;
  kmThreshold: number | null;
  daysThreshold: number | null;
  alertKmBefore: number | null;
  alertDaysBefore: number | null;
  sortOrder: number;
}

export interface CreateMaintenanceTypeData {
  name: string;
  label: string;
  description?: string;
  appliesToCategories?: number[];
  kmThreshold?: number;
  daysThreshold?: number;
  alertKmBefore?: number;
  alertDaysBefore?: number;
  sortOrder?: number;
}
export type UpdateMaintenanceTypeData = Partial<CreateMaintenanceTypeData>;

// ─────────────────────────────────────────────────────────────────────────────
// 6. Driver Compliance Type — il tipo esiste già in vehicles.types.ts (Blocco B),
// qui aggiungiamo solo i data-type per create/update che prima non servivano
// ─────────────────────────────────────────────────────────────────────────────

export type { DriverComplianceType, DriverComplianceCategory };

export interface CreateDriverComplianceTypeData {
  name: string;
  label: string;
  category: DriverComplianceCategory;
  description?: string;
  alertDays1?: number;
  alertDays2?: number;
  alertDays3?: number;
  isRenewable?: boolean;
  hasExpiry?: boolean;
  issuingBody?: string;
  sortOrder?: number;
}
export type UpdateDriverComplianceTypeData = Partial<CreateDriverComplianceTypeData>;

// ─────────────────────────────────────────────────────────────────────────────
// Response types — riuso i generici già definiti in vehicles.types.ts
// ─────────────────────────────────────────────────────────────────────────────

export type VehicleCategoryListResponse = PaginatedApiResponse<VehicleCategory>;
export type VehicleCategoryResponse = ApiResponse<VehicleCategory>;

export type TelematicsProviderListResponse = PaginatedApiResponse<TelematicsProvider>;
export type TelematicsProviderResponse = ApiResponse<TelematicsProvider>;

export type WorkshopListResponse = PaginatedApiResponse<Workshop>;
export type WorkshopResponse = ApiResponse<Workshop>;

export type DeadlineTypeListResponse = PaginatedApiResponse<DeadlineType>;
export type DeadlineTypeResponse = ApiResponse<DeadlineType>;

export type MaintenanceTypeListResponse = PaginatedApiResponse<MaintenanceType>;
export type MaintenanceTypeResponse = ApiResponse<MaintenanceType>;

export type DriverComplianceTypeResponse = ApiResponse<DriverComplianceType>;
