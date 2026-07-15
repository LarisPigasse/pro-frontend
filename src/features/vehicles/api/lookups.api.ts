// =============================================================================
// VEHICLES MODULE — API SERVICE: Lookup Tables (Configurazione)
// features/vehicles/api/lookups.api.ts
// =============================================================================

import { createLookupCrud } from './apiHelpers';
import type {
  LookupListFilters,
  VehicleCategory,
  CreateVehicleCategoryData,
  UpdateVehicleCategoryData,
  VehicleCategoryListResponse,
  VehicleCategoryResponse,
  TelematicsProvider,
  CreateTelematicsProviderData,
  UpdateTelematicsProviderData,
  TelematicsProviderListResponse,
  TelematicsProviderResponse,
  Workshop,
  CreateWorkshopData,
  UpdateWorkshopData,
  WorkshopFilters,
  WorkshopListResponse,
  WorkshopResponse,
  DeadlineType,
  CreateDeadlineTypeData,
  UpdateDeadlineTypeData,
  DeadlineTypeListResponse,
  DeadlineTypeResponse,
  MaintenanceType,
  CreateMaintenanceTypeData,
  UpdateMaintenanceTypeData,
  MaintenanceTypeListResponse,
  MaintenanceTypeResponse,
} from '../types/lookups.types';

// ─────────────────────────────────────────────────────────────────────────────
// Un'istanza della factory per ciascuna lookup table — generici sempre su una
// sola riga (esbuild in dev interpreta male i generici multi-riga seguiti da
// una chiamata, li scambia per un cast JSX-like: stesso problema già risolto
// in STATUS_CONFIG, SIZE_CONFIG e createLookupCrud)
// ─────────────────────────────────────────────────────────────────────────────

export const vehicleCategoriesApi = createLookupCrud<
  VehicleCategory,
  LookupListFilters,
  CreateVehicleCategoryData,
  UpdateVehicleCategoryData
>('/categories');

export const telematicsProvidersApi = createLookupCrud<
  TelematicsProvider,
  LookupListFilters,
  CreateTelematicsProviderData,
  UpdateTelematicsProviderData
>('/telematics-providers');

export const workshopsApi = createLookupCrud<Workshop, WorkshopFilters, CreateWorkshopData, UpdateWorkshopData>('/workshops');

export const deadlineTypesApi = createLookupCrud<
  DeadlineType,
  LookupListFilters,
  CreateDeadlineTypeData,
  UpdateDeadlineTypeData
>('/deadline-types');

export const maintenanceTypesApi = createLookupCrud<
  MaintenanceType,
  LookupListFilters,
  CreateMaintenanceTypeData,
  UpdateMaintenanceTypeData
>('/maintenance-types');
// ─────────────────────────────────────────────────────────────────────────────
// Re-export tipi comodi
// ─────────────────────────────────────────────────────────────────────────────

export type { VehicleCategory, TelematicsProvider, Workshop, DeadlineType, MaintenanceType };
