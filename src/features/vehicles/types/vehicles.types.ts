// =============================================================================
// VEHICLES MODULE — TYPE DEFINITIONS
// features/vehicles/types/vehicles.types.ts
// =============================================================================

// -----------------------------------------------------------------------------
// LOOKUP TYPES
// -----------------------------------------------------------------------------

import type { ApiResponse } from '@/core/services/';

export interface VehicleCategory {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleStatus {
  id: number;
  name: string;
  label: string;
  color: string; // hex color, es. "#22c55e"
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FuelType {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeadlineType {
  id: number;
  name: string;
  alertDays1: number;
  alertDays2: number;
  alertDays3: number;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceType {
  id: number;
  name: string;
  intervalKm: number | null;
  intervalDays: number | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DriverComplianceType {
  id: number;
  name: string;
  alertDays1: number;
  alertDays2: number;
  alertDays3: number;
  createdAt: string;
  updatedAt: string;
}

// Raccolta lookup per passaggio unico ai componenti
export interface VehicleLookups {
  categories: VehicleCategory[];
  statuses: VehicleStatus[];
  fuelTypes: FuelType[];
}

// -----------------------------------------------------------------------------
// DEADLINE STATUS (calcolato lato backend via statusChecker.ts)
// -----------------------------------------------------------------------------

export type DeadlineStatusValue = 'active' | 'expiring' | 'expired';

export interface VehicleDeadlineStatus {
  status: DeadlineStatusValue;
  expiryDate: string; // ISO date
  deadlineType?: DeadlineType;
}

// -----------------------------------------------------------------------------
// DRIVER (anagrafica — usato nelle assegnazioni)
// -----------------------------------------------------------------------------

export interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  fiscalCode: string;
  licenseNumber: string;
  licenseExpiry: string; // ISO date
  phone: string | null;
  email: string | null;
  isActive: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type DriverSummary = Pick<Driver, 'id' | 'firstName' | 'lastName' | 'phone' | 'email'>;

// -----------------------------------------------------------------------------
// VEHICLE ASSIGNMENT (assegnazione corrente)
// -----------------------------------------------------------------------------

export interface VehicleAssignment {
  id: number;
  vehicleId: number;
  driverId: number;
  startDate: string; // ISO date
  endDate: string | null;
  notes: string | null;
  driver?: DriverSummary;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// KM READING
// -----------------------------------------------------------------------------

export interface KmReading {
  id: number;
  vehicleId: number;
  km: number;
  readingDate: string; // ISO date
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// VEHICLE — ENTITÀ PRINCIPALE
// -----------------------------------------------------------------------------

export interface Vehicle {
  id: number;
  licensePlate: string;
  brand: string;
  model: string;
  year: number | null;
  vin: string | null;
  categoryId: number;
  statusId: number;
  fuelTypeId: number;
  currentKm: number;
  purchaseDate: string | null; // ISO date
  notes: string | null;
  createdAt: string;
  updatedAt: string;

  // Associazioni popolate dal backend
  category?: VehicleCategory;
  status?: VehicleStatus;
  fuelType?: FuelType;

  // Dati aggiuntivi richiesti per la tabella
  currentAssignment?: VehicleAssignment | null;
  worstDeadlineStatus?: DeadlineStatusValue | null; // status più critico tra le scadenze
  lastKmReading?: KmReading | null;
}

// -----------------------------------------------------------------------------
// VEHICLE DEADLINE
// -----------------------------------------------------------------------------

export interface VehicleDeadline {
  id: number;
  vehicleId: number;
  deadlineTypeId: number;
  expiryDate: string; // ISO date
  status: DeadlineStatusValue;
  notes: string | null;
  deadlineType?: DeadlineType;
  vehicle?: Pick<Vehicle, 'id' | 'licensePlate' | 'brand' | 'model'>;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// FORM DATA (create / edit)
// -----------------------------------------------------------------------------

export interface VehicleCreateData {
  licensePlate: string;
  brand: string;
  model: string;
  year?: number | null;
  vin?: string | null;
  categoryId: number;
  statusId: number;
  fuelTypeId: number;
  currentKm?: number;
  purchaseDate?: string | null;
  notes?: string | null;
}

export type VehicleEditData = Partial<VehicleCreateData>;

// -----------------------------------------------------------------------------
// FILTRI LISTA VEICOLI
// -----------------------------------------------------------------------------

export interface VehicleFilters {
  search?: string; // licensePlate, brand, model (ricerca libera)
  categoryId?: number;
  statusId?: number;
  fuelTypeId?: number;
  page?: number;
  limit?: number;
}

// Stato UI filtri (comprende anche paginazione)
export interface VehicleFiltersState extends VehicleFilters {
  page: number;
  limit: number;
}

export const DEFAULT_VEHICLE_FILTERS: VehicleFiltersState = {
  page: 1,
  limit: 20,
};

// -----------------------------------------------------------------------------
// API RESPONSE SHAPES
// -----------------------------------------------------------------------------

// Risposta paginata generica (pattern EDG)
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface VehicleNotification {
  id: number;
  entityType: string;
  entityId: number;
  message: string;
  severity: 'low' | 'medium' | 'high';
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// STATO UI MODALI
// -----------------------------------------------------------------------------

export type VehicleModalMode = 'create' | 'edit' | 'view';

export interface VehicleModalState {
  mode: VehicleModalMode | null;
  vehicle: Vehicle | null;
}

// =============================================================================
// AUTISTI
// =============================================================================

// -----------------------------------------------------------------------------
// DRIVER COMPLIANCE — documento singolo
// -----------------------------------------------------------------------------

export interface DriverCompliance {
  id: number;
  driverId: number;
  complianceType: DriverComplianceType; // già definito: 'license' | 'cqc' | 'medical' | 'tachograph'
  documentNumber: string | null;
  issueDate: string | null; // ISO date
  expiryDate: string | null; // ISO date
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// DRIVER COMPLIANCE STATUS — semaforo per riga tabella
// -----------------------------------------------------------------------------

export type DriverComplianceStatusValue = 'ok' | 'expiring' | 'expired' | 'none';

export interface DriverComplianceStatus {
  overall: DriverComplianceStatusValue; // status aggregato per il semaforo
  details: DriverCompliance[]; // lista documenti completa
}

// -----------------------------------------------------------------------------
// DRIVER CON COMPLIANCE — entità completa per ViewDriverModal
// -----------------------------------------------------------------------------

export interface DriverWithCompliance extends Driver {
  complianceStatus: DriverComplianceStatus;
}

// -----------------------------------------------------------------------------
// DRIVER FILTERS
// -----------------------------------------------------------------------------

export interface DriverFilters {
  search: string; // nome, cognome, email, telefono
  complianceStatus: DriverComplianceStatusValue | 'all';
  isActive: 'true' | 'false' | 'all';
  page: number;
  limit: number;
}

// Valori di default
export const DEFAULT_DRIVER_FILTERS: DriverFilters = {
  search: '',
  complianceStatus: 'all',
  isActive: 'all',
  page: 1,
  limit: 20,
};

// -----------------------------------------------------------------------------
// DRIVER FORM DATA
// -----------------------------------------------------------------------------

export interface DriverCreateData {
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  birthDate: string | null; // ISO date
  fiscalCode: string | null;
  notes: string | null;
}

export interface DriverEditData extends DriverCreateData {
  isActive: boolean;
}

// -----------------------------------------------------------------------------
// DRIVER MODAL STATE
// -----------------------------------------------------------------------------

export type DriverModalMode = 'idle' | 'view' | 'create' | 'edit';

export interface DriverModalState {
  mode: DriverModalMode;
  driver: DriverWithCompliance | null;
}
