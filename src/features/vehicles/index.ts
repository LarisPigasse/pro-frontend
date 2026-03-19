// =============================================================================
// VEHICLES MODULE — BARREL EXPORT
// features/vehicles/index.ts
// =============================================================================
//
// Punto di accesso unico al modulo Asset Aziendali.
// Importare sempre da qui, mai dai file interni direttamente.
//
// Esempio:
//   import { Dashboard, Vehicles } from '@/features/vehicles';
//   import type { Vehicle, VehicleFiltersType } from '@/features/vehicles';
// =============================================================================

// --- Pagine ---
export { Dashboard } from './pages/Dashboard';
export { Vehicles } from './pages/Vehicles';
export { Autisti } from './pages/Autisti';
export { Scadenze } from './pages/Scadenze';
export { Storico } from './pages/Storico';
export { Config } from './pages/Config';

// --- Componenti (utili se riusati altrove nel progetto) ---
export { VehicleStatusBadge } from './components/VehicleStatusBadge';
export { DeadlineStatusBadge } from './components/DeadlineStatusBadge';
export { VehicleFilters } from './components/VehicleFilters';
export { VehicleTable } from './components/VehicleTable';
export { ViewVehicleModal } from './components/ViewVehicleModal';
export { CreateVehicleModal } from './components/CreateVehicleModal';
export { EditVehicleModal } from './components/EditVehicleModal';
export { DriverComplianceBadge } from './components/DriverComplianceBadge';
export { DriverFilters } from './components/DriverFilters';
export { DriverTable } from './components/DriverTable';
export { ViewDriverModal } from './components/ViewDriverModal';
export { CreateDriverModal } from './components/CreateDriverModal';
export { EditDriverModal } from './components/EditDriverModal';

// --- Hooks ---
export { useVehicles } from './hooks/useVehicles';
export { useLookups } from './hooks/useLookups';
export { useDrivers } from './hooks/useDrivers';

// --- API (utili per composizione in moduli futuri, es. Autisti) ---
export { vehiclesApi } from './api/vehicles.api';
export { driversApi } from './api/vehicles.api';
export { vehicleDeadlinesApi } from './api/vehicles.api';
export { vehicleAssignmentsApi } from './api/vehicles.api';
export { kmReadingsApi } from './api/vehicles.api';
export { vehicleLookupsApi } from './api/vehicles.api';
export { vehicleNotificationsApi } from './api/vehicles.api';

// --- Tipi ---
export type {
  // Lookup
  VehicleCategory,
  VehicleStatus,
  FuelType,
  DeadlineType,
  MaintenanceType,
  DriverComplianceType,
  VehicleLookups,

  // Core entities
  Vehicle,
  Driver,
  DriverSummary,

  // Operative
  VehicleDeadline,
  VehicleAssignment,
  KmReading,
  VehicleNotification,

  // Status
  DeadlineStatusValue,
  VehicleDeadlineStatus,

  // Form data
  VehicleCreateData,
  VehicleEditData,

  // Filters & pagination
  VehicleFilters as VehicleFiltersType, // ← alias
  VehicleFiltersState,
  DriverFilters as DriverFiltersType, // ← alias
  PaginatedApiResponse,

  // Autisti
  DriverCompliance,
  DriverComplianceStatus,
  DriverComplianceStatusValue,
  DriverWithCompliance,
  DriverCreateData,
  DriverEditData,
  DriverModalMode,
  DriverModalState,

  // Modal state
  VehicleModalMode,
  VehicleModalState,
} from './types/vehicles.types';
