// =============================================================================
// VEHICLES MODULE — API SERVICE
// features/vehicles/api/vehicles.api.ts
// =============================================================================

import { apiFetch, getAuthHeaders } from '@/core/services/apiFetch';
import type {
  Driver,
  CreateDriverData,
  UpdateDriverData,
  DriverFilters,
  DriversListResponse,
  DriverResponse,
  DriverCompliance,
  DriverComplianceType,
  CreateDriverComplianceData,
  RenewDriverComplianceData,
  DriverComplianceFilters,
  DriverComplianceListResponse,
  DriverComplianceResponse,
  DriverComplianceTypesResponse,
  NotificationDeliveryLogFilters,
  NotificationDeliveryLogsListResponse,
} from '../types/vehicles.types';

import type { CreateDriverComplianceTypeData, UpdateDriverComplianceTypeData } from '../types/lookups.types';

import { VEHICLES_BASE as BASE, buildQuery, createLookupCrud } from './apiHelpers';

// ─────────────────────────────────────────────────────────────────────────────
// Drivers — CRUD
// ─────────────────────────────────────────────────────────────────────────────

export const fetchDrivers = async (filters: DriverFilters = {}): Promise<DriversListResponse> => {
  const query = buildQuery({
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
    active: filters.active,
    city: filters.city,
  });
  return apiFetch<DriversListResponse>(`${BASE}/drivers${query}`, {
    headers: getAuthHeaders(),
  });
};

export const fetchDriverById = async (id: number): Promise<DriverResponse> =>
  apiFetch<DriverResponse>(`${BASE}/drivers/${id}`, {
    headers: getAuthHeaders(),
  });

export const createDriver = async (data: CreateDriverData): Promise<DriverResponse> =>
  apiFetch<DriverResponse>(`${BASE}/drivers`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const updateDriver = async (id: number, data: UpdateDriverData): Promise<DriverResponse> =>
  apiFetch<DriverResponse>(`${BASE}/drivers/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

/** Toggle isActive — sospensione/riattivazione reversibile (es. malattia, aspettativa) */
export const toggleDriver = async (id: number): Promise<DriverResponse> =>
  apiFetch<DriverResponse>(`${BASE}/drivers/${id}/toggle`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });

/** Soft-delete — cessazione rapporto: isActive=false + terminationDate=oggi */
export const deleteDriver = async (id: number): Promise<DriverResponse> =>
  apiFetch<DriverResponse>(`${BASE}/drivers/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

// ─────────────────────────────────────────────────────────────────────────────
// Vehicles — CRUD (Blocco A — Dotazione)
// ─────────────────────────────────────────────────────────────────────────────

import type {
  Vehicle,
  CreateVehicleData,
  UpdateVehicleData,
  UpdateVehicleStatusData,
  VehicleFilters,
  VehiclesListResponse,
  VehicleResponse,
} from '../types/vehicles.types';

export const fetchVehicles = async (filters: VehicleFilters = {}): Promise<VehiclesListResponse> => {
  const query = buildQuery({
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
    status: filters.status,
    categoryId: filters.categoryId,
    fuelType: filters.fuelType,
    hasPlate: filters.hasPlate,
  });
  return apiFetch<VehiclesListResponse>(`${BASE}/vehicles${query}`, {
    headers: getAuthHeaders(),
  });
};

export const fetchVehicleById = async (id: number): Promise<VehicleResponse> =>
  apiFetch<VehicleResponse>(`${BASE}/vehicles/${id}`, {
    headers: getAuthHeaders(),
  });

export const createVehicle = async (data: CreateVehicleData): Promise<VehicleResponse> =>
  apiFetch<VehicleResponse>(`${BASE}/vehicles`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const updateVehicle = async (id: number, data: UpdateVehicleData): Promise<VehicleResponse> =>
  apiFetch<VehicleResponse>(`${BASE}/vehicles/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

/** Endpoint dedicato — separato da updateVehicle, rispecchia la stessa separazione del backend */
export const updateVehicleStatus = async (id: number, data: UpdateVehicleStatusData): Promise<VehicleResponse> =>
  apiFetch<VehicleResponse>(`${BASE}/vehicles/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

/** Non cancella — dismette (status: decommissioned + decommissionDate). Nome "decommission", non "delete", per onestà semantica */
export const decommissionVehicle = async (id: number): Promise<VehicleResponse> =>
  apiFetch<VehicleResponse>(`${BASE}/vehicles/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

// ─────────────────────────────────────────────────────────────────────────────
// Driver Compliances — risorsa autonoma, filtrata per driverId
// ─────────────────────────────────────────────────────────────────────────────

export const fetchDriverCompliances = async (filters: DriverComplianceFilters = {}): Promise<DriverComplianceListResponse> => {
  const query = buildQuery({
    driverId: filters.driverId,
    status: filters.status,
    page: filters.page,
    limit: filters.limit,
  });
  return apiFetch<DriverComplianceListResponse>(`${BASE}/driver-compliances${query}`, {
    headers: getAuthHeaders(),
  });
};

export const createDriverCompliance = async (data: CreateDriverComplianceData): Promise<DriverComplianceResponse> =>
  apiFetch<DriverComplianceResponse>(`${BASE}/driver-compliances`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const renewDriverCompliance = async (id: number, data: RenewDriverComplianceData): Promise<DriverComplianceResponse> =>
  apiFetch<DriverComplianceResponse>(`${BASE}/driver-compliances/${id}/renew`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const deleteDriverCompliance = async (id: number): Promise<DriverComplianceResponse> =>
  apiFetch<DriverComplianceResponse>(`${BASE}/driver-compliances/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

// ─────────────────────────────────────────────────────────────────────────────
// Vehicle Deadlines — Blocco C — Scadenze
// ─────────────────────────────────────────────────────────────────────────────

import type {
  VehicleDeadline,
  CreateVehicleDeadlineData,
  UpdateVehicleDeadlineData,
  RenewVehicleDeadlineData,
  VehicleDeadlineFilters,
  VehicleDeadlinesListResponse,
  VehicleDeadlineResponse,
} from '../types/vehicles.types';

export const fetchVehicleDeadlines = async (filters: VehicleDeadlineFilters = {}): Promise<VehicleDeadlinesListResponse> => {
  const query = buildQuery({
    page: filters.page,
    limit: filters.limit,
    vehicleId: filters.vehicleId,
    status: filters.status,
  });
  return apiFetch<VehicleDeadlinesListResponse>(`${BASE}/deadlines${query}`, {
    headers: getAuthHeaders(),
  });
};

export const fetchVehicleDeadlineById = async (id: number): Promise<VehicleDeadlineResponse> =>
  apiFetch<VehicleDeadlineResponse>(`${BASE}/deadlines/${id}`, {
    headers: getAuthHeaders(),
  });

export const createVehicleDeadline = async (data: CreateVehicleDeadlineData): Promise<VehicleDeadlineResponse> =>
  apiFetch<VehicleDeadlineResponse>(`${BASE}/deadlines`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

/** Update "sicuro" — solo notes/lastRenewalDate, vedi nota sul tipo UpdateVehicleDeadlineData */
export const updateVehicleDeadline = async (id: number, data: UpdateVehicleDeadlineData): Promise<VehicleDeadlineResponse> =>
  apiFetch<VehicleDeadlineResponse>(`${BASE}/deadlines/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

/** Unica via per cambiare expiryDate — ricalcola sempre lo stato lato backend */
export const renewVehicleDeadline = async (id: number, data: RenewVehicleDeadlineData): Promise<VehicleDeadlineResponse> =>
  apiFetch<VehicleDeadlineResponse>(`${BASE}/deadlines/${id}/renew`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

/** Qui è una cancellazione fisica reale — a differenza della dismissione dei veicoli */
export const deleteVehicleDeadline = async (id: number): Promise<VehicleDeadlineResponse> =>
  apiFetch<VehicleDeadlineResponse>(`${BASE}/deadlines/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

// ─────────────────────────────────────────────────────────────────────────────
// Maintenance Records — Blocco D — Storico (entità principale)
// ─────────────────────────────────────────────────────────────────────────────

import type {
  MaintenanceRecord,
  CreateMaintenanceRecordData,
  UpdateMaintenanceRecordData,
  MaintenanceRecordFilters,
  MaintenanceRecordsListResponse,
  MaintenanceRecordResponse,
  MaintenanceScheduleItem,
  CreateMaintenanceScheduleData,
  UpdateMaintenanceScheduleData,
  MaintenanceScheduleFilters,
  MaintenanceSchedulesListResponse,
  MaintenanceScheduleResponse,
} from '../types/vehicles.types';

export const fetchMaintenanceRecords = async (
  filters: MaintenanceRecordFilters = {}
): Promise<MaintenanceRecordsListResponse> => {
  const query = buildQuery({
    page: filters.page,
    limit: filters.limit,
    vehicleId: filters.vehicleId,
    maintenanceTypeId: filters.maintenanceTypeId,
    workshopId: filters.workshopId,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  });
  return apiFetch<MaintenanceRecordsListResponse>(`${BASE}/maintenance-records${query}`, {
    headers: getAuthHeaders(),
  });
};

export const fetchMaintenanceRecordById = async (id: number): Promise<MaintenanceRecordResponse> =>
  apiFetch<MaintenanceRecordResponse>(`${BASE}/maintenance-records/${id}`, {
    headers: getAuthHeaders(),
  });

/** Crea l'intervento — il backend genera/aggiorna automaticamente il MaintenanceSchedule collegato */
export const createMaintenanceRecord = async (data: CreateMaintenanceRecordData): Promise<MaintenanceRecordResponse> =>
  apiFetch<MaintenanceRecordResponse>(`${BASE}/maintenance-records`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const updateMaintenanceRecord = async (
  id: number,
  data: UpdateMaintenanceRecordData
): Promise<MaintenanceRecordResponse> =>
  apiFetch<MaintenanceRecordResponse>(`${BASE}/maintenance-records/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const deleteMaintenanceRecord = async (id: number): Promise<MaintenanceRecordResponse> =>
  apiFetch<MaintenanceRecordResponse>(`${BASE}/maintenance-records/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

// ─────────────────────────────────────────────────────────────────────────────
// Maintenance Schedules — sola lettura + override manuale (no create/delete)
// ─────────────────────────────────────────────────────────────────────────────

export const fetchMaintenanceSchedules = async (
  filters: MaintenanceScheduleFilters = {}
): Promise<MaintenanceSchedulesListResponse> => {
  const query = buildQuery({
    page: filters.page,
    limit: filters.limit,
    vehicleId: filters.vehicleId,
    status: filters.status,
  });
  return apiFetch<MaintenanceSchedulesListResponse>(`${BASE}/maintenance-schedules${query}`, {
    headers: getAuthHeaders(),
  });
};

export const fetchMaintenanceScheduleById = async (id: number): Promise<MaintenanceScheduleResponse> =>
  apiFetch<MaintenanceScheduleResponse>(`${BASE}/maintenance-schedules/${id}`, {
    headers: getAuthHeaders(),
  });

/** Unica scrittura possibile — override manuale, per casi eccezionali senza passare da un intervento */
export const updateMaintenanceSchedule = async (
  id: number,
  data: UpdateMaintenanceScheduleData
): Promise<MaintenanceScheduleResponse> =>
  apiFetch<MaintenanceScheduleResponse>(`${BASE}/maintenance-schedules/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const createMaintenanceSchedule = async (data: CreateMaintenanceScheduleData): Promise<MaintenanceScheduleResponse> =>
  apiFetch<MaintenanceScheduleResponse>(`${BASE}/maintenance-schedules`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const deleteMaintenanceSchedule = async (id: number): Promise<MaintenanceScheduleResponse> =>
  apiFetch<MaintenanceScheduleResponse>(`${BASE}/maintenance-schedules/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
// ─────────────────────────────────────────────────────────────────────────────
// Driver Compliance Types — lookup di sistema, sola lettura da questo modulo
// (la gestione del catalogo sarà nel futuro Blocco I — Config)
// ─────────────────────────────────────────────────────────────────────────────

export const fetchDriverComplianceTypes = async (): Promise<DriverComplianceTypesResponse> =>
  apiFetch<DriverComplianceTypesResponse>(`${BASE}/driver-compliance-types?limit=100`, {
    headers: getAuthHeaders(),
  });

export const driverComplianceTypesApi = createLookupCrud<
  DriverComplianceType,
  { search?: string; active?: boolean; page?: number; limit?: number },
  CreateDriverComplianceTypeData,
  UpdateDriverComplianceTypeData
>('/driver-compliance-types');

// ─────────────────────────────────────────────────────────────────────────────
// Notifications — Blocco E — Dashboard (sola lettura + mark-read, entità trasversale)
// ─────────────────────────────────────────────────────────────────────────────

import type {
  Notification,
  NotificationFilters,
  NotificationsListResponse,
  NotificationResponse,
  UnreadCountResponse,
  MarkAllNotificationsReadResponse,
} from '../types/vehicles.types';

export const fetchNotifications = async (filters: NotificationFilters = {}): Promise<NotificationsListResponse> => {
  const query = buildQuery({
    page: filters.page,
    limit: filters.limit,
    vehicleId: filters.vehicleId,
    driverId: filters.driverId,
    type: filters.type,
    severity: filters.severity,
    isRead: filters.isRead,
    isArchived: filters.isArchived,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  });
  return apiFetch<NotificationsListResponse>(`${BASE}/notifications${query}`, {
    headers: getAuthHeaders(),
  });
};

export const fetchUnreadNotificationsCount = async (): Promise<UnreadCountResponse> =>
  apiFetch<UnreadCountResponse>(`${BASE}/notifications/unread-count`, {
    headers: getAuthHeaders(),
  });

/** Segna singola notifica come letta — usata dal click su una riga nel pannello Dashboard */
export const markNotificationRead = async (id: number): Promise<NotificationResponse> =>
  apiFetch<NotificationResponse>(`${BASE}/notifications/${id}/read`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });

/** Segna tutte come lette — bottone "Segna tutte" nel pannello Dashboard */
export const markAllNotificationsRead = async (): Promise<MarkAllNotificationsReadResponse> =>
  apiFetch<MarkAllNotificationsReadResponse>(`${BASE}/notifications/read-all`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });

export const fetchNotificationDeliveryLogs = async (
  filters: NotificationDeliveryLogFilters = {}
): Promise<NotificationDeliveryLogsListResponse> => {
  const query = buildQuery({
    page: filters.page,
    limit: filters.limit,
    notificationId: filters.notificationId,
    status: filters.status,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  });
  return apiFetch<NotificationDeliveryLogsListResponse>(`${BASE}/notification-delivery-logs${query}`, {
    headers: getAuthHeaders(),
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Re-export tipi comodi per chi importa solo da qui
// ─────────────────────────────────────────────────────────────────────────────

export type {
  Driver,
  DriverCompliance,
  DriverComplianceType,
  Vehicle,
  VehicleDeadline,
  MaintenanceRecord,
  MaintenanceScheduleItem,
  Notification,
};
