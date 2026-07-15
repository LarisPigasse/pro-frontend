// =============================================================================
// VEHICLES MODULE — TYPE DEFINITIONS
// features/vehicles/types/vehicles.types.ts
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// Response shapes generiche (condivise da tutti i blocchi del modulo)
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta; // ⚠️ campo "meta", NON "pagination"
}

// ─────────────────────────────────────────────────────────────────────────────
// Driver — entità principale
// ─────────────────────────────────────────────────────────────────────────────

export interface Driver {
  id: number;
  authUserId: number | null;
  firstName: string;
  lastName: string;
  fiscalCode: string | null;
  birthDate: string | null; // ISO date
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  hireDate: string | null; // ISO date
  terminationDate: string | null; // ISO date — valorizzato da DELETE
  isActive: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Payload per la creazione di un autista — firstName/lastName obbligatori */
export interface CreateDriverData {
  firstName: string;
  lastName: string;
  fiscalCode?: string;
  birthDate?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  hireDate?: string;
  authUserId?: number;
  isActive?: boolean;
  notes?: string;
}

/** Payload di aggiornamento — tutti i campi opzionali */
export type UpdateDriverData = Partial<CreateDriverData>;

/** Filtri di ricerca — allineati a driverSchemas.listQuery (unknown(false): nessun altro campo ammesso) */
export interface DriverFilters {
  search?: string;
  active?: boolean; // ⚠️ booleano, non stringa — nessuna opzione "all" lato backend
  city?: string;
  page?: number;
  limit?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Vehicle — entità principale (Blocco A — Dotazione)
// ─────────────────────────────────────────────────────────────────────────────

export type FuelType = 'diesel' | 'petrol' | 'electric' | 'hybrid' | 'lpg' | 'cng' | 'other';
export type VehicleStatus = 'active' | 'maintenance' | 'inactive' | 'decommissioned';
export type OwnershipType = 'owned' | 'leased' | 'rented';

/** Versione ridotta di VehicleCategory, così come la restituisce il backend annidata nel veicolo */
export interface VehicleCategorySummary {
  id: number;
  name: string;
  label: string;
}

/** Versione ridotta di TelematicsProvider — mai apiKey/apiSecret, il backend li omette già qui */
export interface TelematicsProviderSummary {
  id: number;
  name: string;
}

export interface Vehicle {
  id: number;
  categoryId: number;
  category: VehicleCategorySummary;
  telematicsProviderId: number | null;
  telematicsProvider: TelematicsProviderSummary | null;
  telematicsVehicleId: string | null;
  hasPlate: boolean;
  plate: string | null;
  vin: string | null;
  internalCode: string | null;
  brand: string;
  model: string;
  year: number | null;
  color: string | null;
  fuelType: FuelType;
  emissionClass: string | null;
  currentKm: number;
  telematicsEnabled: boolean;
  status: VehicleStatus;
  ownershipType: OwnershipType;
  acquisitionDate: string | null; // ISO date
  decommissionDate: string | null; // ISO date — valorizzato dalla dismissione
  photoPath: string | null; // gestione upload rimandata (fuori scope oggi)
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Payload di creazione — validazione incrociata hasPlate↔plate gestita lato backend, non ripetuta qui */
export interface CreateVehicleData {
  categoryId: number;
  brand: string;
  model: string;
  hasPlate?: boolean;
  plate?: string;
  vin?: string;
  internalCode?: string;
  year?: number;
  color?: string;
  fuelType?: FuelType;
  emissionClass?: string;
  currentKm?: number;
  telematicsEnabled?: boolean;
  telematicsProviderId?: number;
  telematicsVehicleId?: string;
  status?: VehicleStatus;
  ownershipType?: OwnershipType;
  acquisitionDate?: string;
  decommissionDate?: string;
  notes?: string;
}

export type UpdateVehicleData = Partial<CreateVehicleData>;

/** Payload dedicato per PATCH /:id/status — separato dall'update generico, come nel backend */
export interface UpdateVehicleStatusData {
  status: VehicleStatus;
  notes?: string;
}

/** Filtri lista — status supporta esplicitamente 'all' (diverso da Driver, dove non esisteva) */
export interface VehicleFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: VehicleStatus | 'all';
  categoryId?: number;
  fuelType?: FuelType;
  hasPlate?: boolean;
}

export type VehiclesListResponse = PaginatedApiResponse<Vehicle>;
export type VehicleResponse = ApiResponse<Vehicle>;

// ─────────────────────────────────────────────────────────────────────────────
// Costanti label — UI
// ─────────────────────────────────────────────────────────────────────────────

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  active: 'Attivo',
  maintenance: 'In manutenzione',
  inactive: 'Inattivo',
  decommissioned: 'Dismesso',
};

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  diesel: 'Diesel',
  petrol: 'Benzina',
  electric: 'Elettrico',
  hybrid: 'Ibrido',
  lpg: 'GPL',
  cng: 'Metano',
  other: 'Altro',
};

export const OWNERSHIP_TYPE_LABELS: Record<OwnershipType, string> = {
  owned: 'Di proprietà',
  leased: 'Leasing',
  rented: 'Noleggio',
};

// ─────────────────────────────────────────────────────────────────────────────
// Vehicle Deadline — Blocco C — Scadenze
// ─────────────────────────────────────────────────────────────────────────────

export type DeadlineStatus = 'valid' | 'expiring' | 'expired';

/** Come il backend annida il veicolo dentro la scadenza */
export interface VehicleSummary {
  id: number;
  brand: string;
  model: string;
  plate: string | null;
}

/** Come il backend annida il tipo scadenza — include le soglie di alert, utili in UI */
export interface DeadlineTypeSummary {
  id: number;
  name: string;
  label: string;
  alertDays1: number;
  alertDays2: number;
  alertDays3: number;
}

export interface VehicleDeadline {
  id: number;
  vehicleId: number;
  vehicle: VehicleSummary;
  deadlineTypeId: number;
  deadlineType: DeadlineTypeSummary;
  expiryDate: string; // ISO date — sempre valorizzata, mai null
  lastRenewalDate: string | null;
  status: DeadlineStatus; // calcolato dal backend — mai ricalcolarlo lato frontend
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleDeadlineData {
  vehicleId: number;
  deadlineTypeId: number;
  expiryDate: string;
  lastRenewalDate?: string;
  notes?: string;
}

/**
 * Update "sicuro" — SOLO campi che non richiedono ricalcolo dello stato.
 * expiryDate NON è qui apposta: il backend non ricalcolerebbe lo stato,
 * lasciandolo incoerente con la nuova data. Per cambiare la scadenza,
 * usare sempre RenewVehicleDeadlineData via l'endpoint dedicato.
 */
export interface UpdateVehicleDeadlineData {
  lastRenewalDate?: string;
  notes?: string;
}

export interface RenewVehicleDeadlineData {
  expiryDate: string; // obbligatoria — è l'intero scopo del rinnovo
  lastRenewalDate?: string; // default: oggi, se omessa
  notes?: string;
}

export interface VehicleDeadlineFilters {
  page?: number;
  limit?: number;
  vehicleId?: number;
  status?: DeadlineStatus | 'all';
}

export type VehicleDeadlinesListResponse = PaginatedApiResponse<VehicleDeadline>;
export type VehicleDeadlineResponse = ApiResponse<VehicleDeadline>;

// ─────────────────────────────────────────────────────────────────────────────
// Maintenance — Blocco D — Storico (MaintenanceRecord + MaintenanceSchedule)
// ─────────────────────────────────────────────────────────────────────────────

/** Stato di MaintenanceSchedule — valori REALI applicati dal modello Sequelize.
 *  Nota: lo schema Joi di update usa erroneamente 'due_soon' al posto di 'warning' —
 *  usiamo i valori del modello, che sono quelli davvero salvati e restituiti. */
export type ScheduleStatus = 'ok' | 'warning' | 'overdue' | 'suspended';

export interface WorkshopSummary {
  id: number;
  name: string;
  city: string | null;
}

/** Tipo manutenzione annidato in MaintenanceSchedule — include le soglie, utili per calcolare quanto manca */
export interface MaintenanceTypeScheduleSummary {
  id: number;
  name: string;
  label: string;
  kmThreshold: number | null;
  daysThreshold: number | null;
  alertKmBefore: number | null;
  alertDaysBefore: number | null;
}

/** Versione ridotta usata dentro MaintenanceRecord — niente soglie, non servono lì */
export interface MaintenanceTypeSummary {
  id: number;
  name: string;
  label: string;
}

// ── MaintenanceRecord — l'intervento storico, entità principale ────────────

export interface MaintenanceRecord {
  id: number;
  vehicleId: number;
  vehicle: VehicleSummary;
  maintenanceTypeId: number;
  maintenanceType: MaintenanceTypeSummary;
  scheduleId: number | null; // valorizzato automaticamente dal backend alla creazione
  workshopId: number | null;
  workshop: WorkshopSummary | null;
  performedAt: string; // ISO date
  kmAtService: number | null;
  cost: number | null;
  description: string | null;
  nextKm: number | null;
  nextDate: string | null;
  notes: string | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaintenanceRecordData {
  vehicleId: number;
  maintenanceTypeId: number;
  workshopId?: number;
  performedAt: string;
  kmAtService?: number;
  cost?: number;
  description?: string;
  nextKm?: number;
  nextDate?: string;
  notes?: string;
}

/** vehicleId/maintenanceTypeId/scheduleId non sono qui: non modificabili dopo la creazione (coerente col backend) */
export interface UpdateMaintenanceRecordData {
  workshopId?: number;
  performedAt?: string;
  kmAtService?: number;
  cost?: number;
  description?: string;
  nextKm?: number;
  nextDate?: string;
  notes?: string;
}

export interface MaintenanceRecordFilters {
  page?: number;
  limit?: number;
  vehicleId?: number;
  maintenanceTypeId?: number;
  workshopId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export type MaintenanceRecordsListResponse = PaginatedApiResponse<MaintenanceRecord>;
export type MaintenanceRecordResponse = ApiResponse<MaintenanceRecord>;

// ── MaintenanceSchedule — sola lettura + override, generata automaticamente ─

export interface MaintenanceScheduleItem {
  id: number;
  vehicleId: number;
  vehicle: VehicleSummary;
  maintenanceTypeId: number;
  maintenanceType: MaintenanceTypeScheduleSummary;
  lastKm: number | null;
  lastDate: string | null;
  nextKm: number | null;
  nextDate: string | null;
  status: ScheduleStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Nessun CreateMaintenanceScheduleData — niente creazione manuale, il backend non la espone */

export interface CreateMaintenanceScheduleData {
  vehicleId: number;
  maintenanceTypeId: number;
  nextKm?: number;
  nextDate?: string;
  notes?: string;
}
export interface UpdateMaintenanceScheduleData {
  lastKm?: number;
  lastDate?: string;
  nextKm?: number;
  nextDate?: string;
  status?: ScheduleStatus;
  notes?: string;
}

export interface MaintenanceScheduleFilters {
  page?: number;
  limit?: number;
  vehicleId?: number;
  status?: ScheduleStatus | 'all';
}

export type MaintenanceSchedulesListResponse = PaginatedApiResponse<MaintenanceScheduleItem>;
export type MaintenanceScheduleResponse = ApiResponse<MaintenanceScheduleItem>;

// ─────────────────────────────────────────────────────────────────────────────
// Costanti label — UI
// ─────────────────────────────────────────────────────────────────────────────

export const SCHEDULE_STATUS_LABELS: Record<ScheduleStatus, string> = {
  ok: 'In regola',
  warning: 'In avvicinamento',
  overdue: 'Scaduta',
  suspended: 'Sospesa',
};

export const DEADLINE_STATUS_LABELS: Record<DeadlineStatus, string> = {
  valid: 'Valida',
  expiring: 'In scadenza',
  expired: 'Scaduta',
};

// ─────────────────────────────────────────────────────────────────────────────
// Driver Compliance — documenti/conformità (risorsa autonoma, non annidata)
// ─────────────────────────────────────────────────────────────────────────────

export type DriverComplianceStatusValue = 'valid' | 'expiring' | 'expired' | 'not_applicable';

/** 'none' è un valore solo-frontend: nessun documento registrato per quel tipo/autista */
export type DriverOverallComplianceStatus = DriverComplianceStatusValue | 'none';

export type DriverComplianceCategory = 'license' | 'medical' | 'training' | 'other';

export interface DriverComplianceType {
  id: number;
  name: string;
  label: string;
  category: DriverComplianceCategory;
  description: string | null;
  alertDays1: number | null;
  alertDays2: number | null;
  alertDays3: number | null;
  isRenewable: boolean;
  hasExpiry: boolean;
  issuingBody: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface DriverCompliance {
  id: number;
  driverId: number;
  typeId: number;
  complianceType?: DriverComplianceType; // alias Sequelize esatto: "complianceType"
  issuedAt: string | null;
  expiresAt: string | null;
  issuingBody: string | null;
  status: DriverComplianceStatusValue; // calcolato dal backend — NON ricalcolare lato frontend
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDriverComplianceData {
  driverId: number;
  typeId: number;
  issuedAt?: string;
  expiresAt?: string;
  issuingBody?: string;
  notes?: string;
}

export interface RenewDriverComplianceData {
  issuedAt?: string; // default: oggi
  expiresAt: string; // required
  issuingBody?: string;
  notes?: string;
}

export interface DriverComplianceFilters {
  driverId?: number;
  status?: DriverComplianceStatusValue | 'all';
  page?: number;
  limit?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Response types specifici
// ─────────────────────────────────────────────────────────────────────────────

export type DriversListResponse = PaginatedApiResponse<Driver>;
export type DriverResponse = ApiResponse<Driver>;
export type DriverComplianceListResponse = PaginatedApiResponse<DriverCompliance>;
export type DriverComplianceResponse = ApiResponse<DriverCompliance>;
export type DriverComplianceTypesResponse = PaginatedApiResponse<DriverComplianceType>;

// ─────────────────────────────────────────────────────────────────────────────
// Costanti label — UI
// ─────────────────────────────────────────────────────────────────────────────

export const DRIVER_COMPLIANCE_STATUS_LABELS: Record<DriverOverallComplianceStatus, string> = {
  valid: 'Valido',
  expiring: 'In scadenza',
  expired: 'Scaduto',
  not_applicable: 'Non applicabile',
  none: 'Nessun documento',
};

export const DRIVER_COMPLIANCE_CATEGORY_LABELS: Record<DriverComplianceCategory, string> = {
  license: 'Patente/Abilitazione',
  medical: 'Idoneità medica',
  training: 'Formazione',
  other: 'Altro',
};
