// =============================================================================
// VEHICLES MODULE — API SERVICE
// features/vehicles/api/vehicles.api.ts
// =============================================================================

import { apiService } from '@/core/services/';
import type { ApiResponse } from '@/core/services/';
import type {
  Vehicle,
  VehicleCreateData,
  VehicleEditData,
  VehicleFilters,
  VehicleCategory,
  VehicleStatus,
  FuelType,
  DeadlineType,
  MaintenanceType,
  DriverComplianceType,
  Driver,
  VehicleDeadline,
  VehicleAssignment,
  KmReading,
  PaginatedApiResponse,
  VehicleNotification,
  DriverCompliance,
  DriverCreateData,
  DriverEditData,
} from '../types/vehicles.types';

// Base path — corrisponde alla route montata nel gateway
const BASE = '/api/vehicles';

// Nota sui generics:
// - apiService.method<T>() restituisce Promise<ApiResponse<T>>
// - Per risposte paginate si usa il cast: apiService.get(...) as Promise<PaginatedApiResponse<T>>

// =============================================================================
// LOOKUP TABLES
// =============================================================================

export const vehicleLookupsApi = {
  getCategories: (): Promise<ApiResponse<VehicleCategory[]>> => apiService.get<VehicleCategory[]>(`${BASE}/vehicle-categories`),

  getStatuses: (): Promise<ApiResponse<VehicleStatus[]>> => apiService.get<VehicleStatus[]>(`${BASE}/vehicle-statuses`),

  getFuelTypes: (): Promise<ApiResponse<FuelType[]>> => apiService.get<FuelType[]>(`${BASE}/fuel-types`),

  getDeadlineTypes: (): Promise<ApiResponse<DeadlineType[]>> => apiService.get<DeadlineType[]>(`${BASE}/deadline-types`),

  getMaintenanceTypes: (): Promise<ApiResponse<MaintenanceType[]>> =>
    apiService.get<MaintenanceType[]>(`${BASE}/maintenance-types`),

  getDriverComplianceTypes: (): Promise<ApiResponse<DriverComplianceType[]>> =>
    apiService.get<DriverComplianceType[]>(`${BASE}/driver-compliance-types`),
};

// =============================================================================
// VEHICLES — CORE
// =============================================================================

export const vehiclesApi = {
  getAll: (filters: VehicleFilters = {}): Promise<PaginatedApiResponse<Vehicle>> => {
    const params = new URLSearchParams();

    if (filters.search) params.set('search', filters.search);
    if (filters.categoryId) params.set('categoryId', String(filters.categoryId));
    if (filters.statusId) params.set('statusId', String(filters.statusId));
    if (filters.fuelTypeId) params.set('fuelTypeId', String(filters.fuelTypeId));
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));

    const qs = params.toString();
    return apiService.get(`${BASE}/vehicles${qs ? `?${qs}` : ''}`) as Promise<PaginatedApiResponse<Vehicle>>;
  },

  getById: (id: number): Promise<ApiResponse<Vehicle>> => apiService.get<Vehicle>(`${BASE}/vehicles/${id}`),

  create: (data: VehicleCreateData): Promise<ApiResponse<Vehicle>> => apiService.post<Vehicle>(`${BASE}/vehicles`, data),

  update: (id: number, data: VehicleEditData): Promise<ApiResponse<Vehicle>> =>
    apiService.put<Vehicle>(`${BASE}/vehicles/${id}`, data),

  delete: (id: number): Promise<ApiResponse<null>> => apiService.delete<null>(`${BASE}/vehicles/${id}`),
};

// =============================================================================
// DRIVERS
// =============================================================================

export const driversApi = {
  getAll: (
    filters: { search?: string; isActive?: boolean; page?: number; limit?: number } = {}
  ): Promise<PaginatedApiResponse<Driver>> => {
    const params = new URLSearchParams();
    if (filters.search !== undefined) params.set('search', filters.search);
    if (filters.isActive !== undefined) params.set('isActive', String(filters.isActive));
    if (filters.page !== undefined) params.set('page', String(filters.page));
    if (filters.limit !== undefined) params.set('limit', String(filters.limit));

    const qs = params.toString();
    return apiService.get(`${BASE}/drivers${qs ? `?${qs}` : ''}`) as Promise<PaginatedApiResponse<Driver>>;
  },

  getById: (id: number): Promise<ApiResponse<Driver>> => apiService.get<Driver>(`${BASE}/drivers/${id}`),

  getCompliance: (driverId: number): Promise<ApiResponse<DriverCompliance[]>> =>
    apiService.get<DriverCompliance[]>(`${BASE}/drivers/${driverId}/compliance`),

  create: (data: DriverCreateData): Promise<ApiResponse<Driver>> => apiService.post<Driver>(`${BASE}/drivers`, data),

  update: (id: number, data: DriverEditData): Promise<ApiResponse<Driver>> =>
    apiService.put<Driver>(`${BASE}/drivers/${id}`, data),

  deactivate: (id: number): Promise<ApiResponse<null>> => apiService.patch<null>(`${BASE}/drivers/${id}/deactivate`, {}),
};

// =============================================================================
// VEHICLE DEADLINES
// =============================================================================

export const vehicleDeadlinesApi = {
  getAll: (filters: { vehicleId?: number; status?: string } = {}): Promise<PaginatedApiResponse<VehicleDeadline>> => {
    const params = new URLSearchParams();
    if (filters.vehicleId) params.set('vehicleId', String(filters.vehicleId));
    if (filters.status) params.set('status', filters.status);

    const qs = params.toString();
    return apiService.get(`${BASE}/deadlines${qs ? `?${qs}` : ''}`) as Promise<PaginatedApiResponse<VehicleDeadline>>;
  },

  getById: (id: number): Promise<ApiResponse<VehicleDeadline>> => apiService.get<VehicleDeadline>(`${BASE}/deadlines/${id}`),

  create: (data: {
    vehicleId: number;
    deadlineTypeId: number;
    expiryDate: string;
    notes?: string;
  }): Promise<ApiResponse<VehicleDeadline>> => apiService.post<VehicleDeadline>(`${BASE}/deadlines`, data),

  update: (id: number, data: { expiryDate?: string; notes?: string }): Promise<ApiResponse<VehicleDeadline>> =>
    apiService.put<VehicleDeadline>(`${BASE}/deadlines/${id}`, data),

  renew: (id: number, data: { newExpiryDate: string; notes?: string }): Promise<ApiResponse<VehicleDeadline>> =>
    apiService.patch<VehicleDeadline>(`${BASE}/deadlines/${id}/renew`, data),

  delete: (id: number): Promise<ApiResponse<null>> => apiService.delete<null>(`${BASE}/deadlines/${id}`),
};

// =============================================================================
// VEHICLE ASSIGNMENTS
// =============================================================================

export const vehicleAssignmentsApi = {
  getAll: (
    filters: { vehicleId?: number; driverId?: number; active?: boolean } = {}
  ): Promise<PaginatedApiResponse<VehicleAssignment>> => {
    const params = new URLSearchParams();
    if (filters.vehicleId !== undefined) params.set('vehicleId', String(filters.vehicleId));
    if (filters.driverId !== undefined) params.set('driverId', String(filters.driverId));
    if (filters.active !== undefined) params.set('active', String(filters.active));

    const qs = params.toString();
    return apiService.get(`${BASE}/assignments${qs ? `?${qs}` : ''}`) as Promise<PaginatedApiResponse<VehicleAssignment>>;
  },

  getCurrentByVehicle: (vehicleId: number): Promise<ApiResponse<VehicleAssignment | null>> =>
    apiService.get<VehicleAssignment | null>(`${BASE}/assignments/vehicle/${vehicleId}/current`),

  create: (data: {
    vehicleId: number;
    driverId: number;
    startDate: string;
    notes?: string;
  }): Promise<ApiResponse<VehicleAssignment>> => apiService.post<VehicleAssignment>(`${BASE}/assignments`, data),

  end: (id: number, data: { endDate: string; notes?: string }): Promise<ApiResponse<VehicleAssignment>> =>
    apiService.patch<VehicleAssignment>(`${BASE}/assignments/${id}/end`, data),

  delete: (id: number): Promise<ApiResponse<null>> => apiService.delete<null>(`${BASE}/assignments/${id}`),
};

// =============================================================================
// KM READINGS
// =============================================================================

export const kmReadingsApi = {
  getAll: (filters: { vehicleId?: number; page?: number; limit?: number } = {}): Promise<PaginatedApiResponse<KmReading>> => {
    const params = new URLSearchParams();
    if (filters.vehicleId !== undefined) params.set('vehicleId', String(filters.vehicleId));
    if (filters.page !== undefined) params.set('page', String(filters.page));
    if (filters.limit !== undefined) params.set('limit', String(filters.limit));

    const qs = params.toString();
    return apiService.get(`${BASE}/km-readings${qs ? `?${qs}` : ''}`) as Promise<PaginatedApiResponse<KmReading>>;
  },

  create: (data: { vehicleId: number; km: number; readingDate: string; notes?: string }): Promise<ApiResponse<KmReading>> =>
    apiService.post<KmReading>(`${BASE}/km-readings`, data),

  delete: (id: number): Promise<ApiResponse<null>> => apiService.delete<null>(`${BASE}/km-readings/${id}`),
};

// =============================================================================
// NOTIFICATIONS
// =============================================================================

export const vehicleNotificationsApi = {
  getUnreadCount: (): Promise<ApiResponse<{ count: number }>> =>
    apiService.get<{ count: number }>(`${BASE}/notifications/unread-count`),

  getAll: (
    filters: { isArchived?: boolean; page?: number; limit?: number } = {}
  ): Promise<PaginatedApiResponse<VehicleNotification>> => {
    const params = new URLSearchParams();
    if (filters.isArchived !== undefined) params.set('isArchived', String(filters.isArchived));
    if (filters.page !== undefined) params.set('page', String(filters.page));
    if (filters.limit !== undefined) params.set('limit', String(filters.limit));

    const qs = params.toString();
    return apiService.get(`${BASE}/notifications${qs ? `?${qs}` : ''}`) as Promise<PaginatedApiResponse<VehicleNotification>>;
  },

  markRead: (id: number): Promise<ApiResponse<null>> => apiService.patch<null>(`${BASE}/notifications/${id}/read`, {}),

  markAllRead: (): Promise<ApiResponse<null>> => apiService.patch<null>(`${BASE}/notifications/read-all`, {}),

  archive: (id: number): Promise<ApiResponse<null>> => apiService.patch<null>(`${BASE}/notifications/${id}/archive`, {}),
};
