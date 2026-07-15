# EDG Platform — Gestione Mezzi: Documento di Handover Frontend

> **Versione 1.0 · Luglio 2025**  
> Backend: ✅ Completo e stabile · Frontend: 🔄 Reset — da sviluppare da zero

---

## Indice

1. [Contesto e Stato del Progetto](#1-contesto-e-stato-del-progetto)
2. [Architettura Backend — vehicle-service](#2-architettura-backend--vehicle-service)
3. [API Reference Completa](#3-api-reference-completa)
4. [Schemi Joi — Validazione Input](#4-schemi-joi--validazione-input)
5. [Database Schema — 16 Tabelle](#5-database-schema--16-tabelle)
6. [DEFAULT_INCLUDE nei Controller](#6-default_include-nei-controller)
7. [Convenzioni Frontend — pro-frontend](#7-convenzioni-frontend--pro-frontend)
8. [Gotcha & Lezioni Apprese](#8-gotcha--lezioni-apprese)
9. [Roadmap Frontend — Ordine di Sviluppo](#9-roadmap-frontend--ordine-di-sviluppo)
10. [Configurazione Gateway e Response Shapes](#10-configurazione-gateway-e-response-shapes)

---

## 1. Contesto e Stato del Progetto

Il modulo **Gestione Mezzi** è una feature del `pro-frontend` della piattaforma EDG (Express Delivery Group). Il backend (`vehicle-service`) è completamente sviluppato, testato e in produzione. Il frontend è stato **resettato a zero** per ripartire con pieno controllo: al momento esistono solo le pagine placeholder e il barrel di importazione.

### 1.1 Struttura Frontend Attuale (post-reset)

```
src/features/vehicles/
├── pages/
│   ├── Dashboard.tsx      ← placeholder
│   ├── Vehicles.tsx       ← placeholder
│   ├── Autisti.tsx        ← placeholder
│   ├── Scadenze.tsx       ← placeholder
│   ├── Storico.tsx        ← placeholder
│   └── Config.tsx         ← placeholder
└── index.ts               ← barrel con sole esportazioni pagine
```

### 1.2 Navigazione nel pro-frontend

Il modulo è raggiungibile tramite la voce "Gestione Mezzi" nel menu laterale. Il routing è già configurato nel router principale.

| Pagina | Route | Scopo |
|---|---|---|
| Dashboard | `/vehicles` | KPI, notifiche, stato flotta in sintesi |
| Vehicles (Dotazione) | `/vehicles/list` | Lista e CRUD veicoli |
| Autisti | `/vehicles/drivers` | Lista e CRUD autisti + conformità documentale |
| Scadenze | `/vehicles/deadlines` | Monitoraggio scadenze legali/amministrative |
| Storico | `/vehicles/history` | Storico assegnazioni, km, manutenzioni |
| Config | `/vehicles/config` | Gestione lookup tables |

---

## 2. Architettura Backend — vehicle-service

| Proprietà | Valore |
|---|---|
| Container Docker | `vehicle-service` (running, healthy) |
| Database | PostgreSQL — `edg_vehicles` |
| Base URL Gateway | `/api/vehicles` |
| Autenticazione | JWT Bearer — header `X-User-*` injettati dal gateway |
| Paginazione | Tutti gli endpoint lista → `meta: { total, page, limit, totalPages, hasNext, hasPrev }` |
| Formato risposta | `{ success: boolean, data: T, message?: string, meta?: PaginationMeta }` |

> **⚠️ CRITICO:** La paginazione è nel campo **`meta`**, NON `pagination`. Tutti gli hook devono leggere `res.meta.total`, `res.meta.page`, ecc.

### 2.1 Routing completo (routes/index.js)

| Mount path | Controller | Descrizione |
|---|---|---|
| `/categories` | vehicleCategoryController | Categorie veicoli (lookup) |
| `/telematics-providers` | telematicsProviderController | Provider GPS/telematici (lookup) |
| `/workshops` | workshopController | Officine e fornitori (lookup) |
| `/deadline-types` | deadlineTypeController | Tipi scadenza (lookup) |
| `/maintenance-types` | maintenanceTypeController | Tipi manutenzione (lookup) |
| `/driver-compliance-types` | driverComplianceTypeController | Tipi conformità autisti (lookup) |
| `/vehicles` | vehicleController | CRUD veicoli (core) |
| `/drivers` | driverController | CRUD autisti |
| `/km-readings` | kmReadingController | Letture chilometraggio |
| `/deadlines` | vehicleDeadlineController | Scadenze legali veicoli |
| `/maintenance-schedules` | maintenanceScheduleController | Piani manutenzione |
| `/maintenance-records` | maintenanceRecordController | Interventi eseguiti |
| `/assignments` | vehicleAssignmentController | Assegnazioni veicolo-autista |
| `/driver-compliances` | driverComplianceController | Conformità autisti |
| `/notifications` | notificationController | Notifiche sistema |
| `/attachments` | attachmentController | Allegati polimorfici |

---

## 3. API Reference Completa

### 3.1 Vehicles — CRUD Principale

> **⚠️** `DELETE /:id` NON è una cancellazione fisica: imposta `status="decommissioned"` e `decommission_date=oggi`. Nell'UI chiamare **"Dismetti"**, non "Elimina".

| Metodo | Path | Descrizione | Body / Query |
|---|---|---|---|
| GET | `/vehicles` | Lista veicoli paginata | `page, limit, search, status, categoryId, fuelType, hasPlate` |
| GET | `/vehicles/:id` | Singolo veicolo con include | — |
| POST | `/vehicles` | Crea veicolo | Vedi schema §4.1 |
| PUT | `/vehicles/:id` | Aggiorna veicolo | Vedi schema §4.1 (tutti opzionali) |
| PATCH | `/vehicles/:id/status` | Cambia solo lo stato | `{ status, notes? }` |
| DELETE | `/vehicles/:id` | Dismette veicolo (soft) | Imposta `status=decommissioned` |

**Note listQuery:** parametro `status` default `"active"` (solo attivi); passare `"all"` per vedere tutti gli stati. `fuelType` accetta la stringa enum direttamente (non un ID).

### 3.2 Drivers — CRUD Autisti

| Metodo | Path | Descrizione | Note |
|---|---|---|---|
| GET | `/drivers` | Lista autisti paginata | Query: `page, limit, search, active(bool), city` — `unknown(false)` |
| GET | `/drivers/:id` | Singolo autista | — |
| POST | `/drivers` | Crea autista | Vedi schema §4.2 |
| PUT | `/drivers/:id` | Aggiorna autista | Tutti i campi opzionali |
| PATCH | `/drivers/:id/toggle` | Toggle `isActive` (reversibile) | Sospensione temporanea |
| DELETE | `/drivers/:id` | Soft-delete: `isActive=false` + `terminationDate=oggi` | Cessazione rapporto |

> **⚠️** Il filtro `active` accetta booleano (`true`/`false`), NON stringa. Il backend non supporta "all": il default è `true` (solo attivi). L'UI offre solo "Attivi" / "Disattivati".

### 3.3 Driver Compliances

> **⚠️ CRITICO:** Non esiste `GET /drivers/:id/compliance`. La compliance è una risorsa **autonoma** sotto `/driver-compliances`. Per caricare i documenti di un autista: `GET /driver-compliances?driverId=X`.

| Metodo | Path | Descrizione | Note |
|---|---|---|---|
| GET | `/driver-compliances` | Lista conformità paginata | `driverId, status(valid\|expiring\|expired\|not_applicable\|all), page, limit` |
| GET | `/driver-compliances/:id` | Singola conformità | Include `complianceType` (as: `"complianceType"`) |
| POST | `/driver-compliances` | Crea documento | `{ driverId, typeId, issuedAt?, expiresAt?, issuingBody?, notes? }` |
| PUT | `/driver-compliances/:id` | Aggiorna documento | `issuedAt, expiresAt, issuingBody, status, notes` |
| PATCH | `/driver-compliances/:id/renew` | Rinnova documento | `{ issuedAt?, expiresAt(required), issuingBody?, notes? }` |
| DELETE | `/driver-compliances/:id` | Elimina documento | Hard delete |

### 3.4 Vehicle Deadlines — Scadenze

| Metodo | Path | Descrizione | Note |
|---|---|---|---|
| GET | `/deadlines` | Lista scadenze | `vehicleId, status(valid\|expiring\|expired\|all), page, limit` |
| GET | `/deadlines/:id` | Singola scadenza | Include `vehicle(id,brand,model,plate)`, `deadlineType` |
| POST | `/deadlines` | Crea scadenza | `{ vehicleId, deadlineTypeId, expiryDate, lastRenewalDate?, notes? }` — UNIQUE(vehicle+type) |
| PUT | `/deadlines/:id` | Aggiorna scadenza | `expiryDate, lastRenewalDate, status, notes` |
| PATCH | `/deadlines/:id/renew` | Rinnova scadenza | `{ expiryDate(required), lastRenewalDate?, notes? }` — ricalcola status |
| DELETE | `/deadlines/:id` | Elimina scadenza | Hard delete |

> **Nota:** `status` è calcolato automaticamente da `computeStatus()` usando `alertDays2` del DeadlineType. Non va impostato manualmente al create.

### 3.5 Vehicle Assignments — Assegnazioni

| Metodo | Path | Descrizione | Note |
|---|---|---|---|
| GET | `/assignments` | Lista assegnazioni | `vehicleId, driverId, active(bool), page, limit` |
| GET | `/assignments/:id` | Singola assegnazione | Include `vehicle(id,brand,model,plate)`, `driver(id,firstName,lastName,phone)` |
| GET | `/assignments/vehicle/:vehicleId/current` | Assegnazione attiva corrente | Ritorna `null` se non assegnato (200, non 404) |
| POST | `/assignments` | Crea assegnazione | `{ vehicleId, driverId, startedAt?, notes? }` — chiude auto assignment precedente del driver |
| PATCH | `/assignments/:id/end` | Chiudi assegnazione | `{ endedAt?, notes? }` — default `endedAt=oggi` |

> **Logica controller:** se il driver ha già un assignment aperto su altro veicolo, viene chiuso automaticamente. Se il veicolo è già assegnato ad altro driver → 409 Conflict.

### 3.6 KM Readings

| Metodo | Path | Descrizione | Note |
|---|---|---|---|
| GET | `/km-readings` | Lista letture km | `vehicleId, source(manual\|telematics_api), dateFrom, dateTo, page, limit` |
| GET | `/km-readings/:id` | Singola lettura | — |
| POST | `/km-readings` | Registra lettura km | `{ vehicleId, readingValue, readingDate, source?, notes? }` |

> **⚠️** Campo: `readingValue` (non `km`). Una lettura non può essere inferiore all'ultima registrata → 400. Aggiorna `currentKm` sul veicolo se il valore è superiore.

### 3.7 Maintenance Schedules e Records

| Metodo | Path | Descrizione |
|---|---|---|
| GET | `/maintenance-schedules` | Lista piani — `vehicleId, status(ok\|due_soon\|overdue\|all), page, limit` |
| GET | `/maintenance-schedules/:id` | Singolo piano |
| PUT | `/maintenance-schedules/:id` | Override manuale — `lastKm, lastDate, nextKm, nextDate, status, notes` |
| GET | `/maintenance-records` | Lista interventi — `vehicleId, maintenanceTypeId, workshopId, dateFrom, dateTo, page, limit` |
| GET | `/maintenance-records/:id` | Singolo intervento — include `vehicle, maintenanceType, workshop` |
| POST | `/maintenance-records` | Registra intervento (aggiorna schedule in transazione) |
| PUT | `/maintenance-records/:id` | Aggiorna intervento |
| DELETE | `/maintenance-records/:id` | Elimina intervento (hard delete) |

**Body create maintenance-record:** `{ vehicleId, maintenanceTypeId, performedAt, kmAtService?, cost?, description?, nextKm?, nextDate?, workshopId?, notes? }`

### 3.8 Notifications

| Metodo | Path | Descrizione |
|---|---|---|
| GET | `/notifications` | Lista — `vehicleId?, driverId?, type?, severity?, isRead?, isArchived?(default false), page, limit` |
| GET | `/notifications/:id` | Singola notifica |
| GET | `/notifications/unread-count` | Contatore non lette — `{ count }` — query: `vehicleId?, driverId?` |
| PATCH | `/notifications/:id/read` | Segna come letta |
| PATCH | `/notifications/read-all` | Segna tutte come lette — query: `vehicleId?, driverId?` |
| PATCH | `/notifications/:id/archive` | Archivia (imposta `isArchived=true, isRead=true`) |
| POST | `/notifications` | Crea notifica (admin/sistema) |
| DELETE | `/notifications/:id` | Elimina notifica |

---

## 4. Schemi Joi — Validazione Input

### 4.1 Vehicle — vehicleSchemas.create / .update

| Campo | Tipo | Required | Vincoli / Default |
|---|---|---|---|
| `categoryId` | integer | Sì (create) | FK vehicle_categories |
| `brand` | string | Sì (create) | max 100 |
| `model` | string | Sì (create) | max 100 |
| `hasPlate` | boolean | No | default `true` |
| `plate` | string | Condizionale | max 20, UPPERCASE — obbligatoria se `hasPlate=true` |
| `vin` | string | No | max 50, UPPERCASE, UNIQUE |
| `internalCode` | string | No | max 50 |
| `year` | integer | No | 1900 ≤ year ≤ currentYear+1 |
| `color` | string | No | max 50 |
| `fuelType` | string enum | No | `diesel\|petrol\|electric\|hybrid\|lpg\|cng\|other` — default: `diesel` |
| `emissionClass` | string | No | max 20 (es. "Euro 6") |
| `currentKm` | integer | No | ≥0, default 0 |
| `telematicsEnabled` | boolean | No | default false — gestito da sistema, non UI |
| `telematicsProviderId` | integer | No | FK telematics_providers — gestito da sistema |
| `telematicsVehicleId` | string | No | max 100 — gestito da sistema |
| `status` | string enum | No | `active\|maintenance\|inactive\|decommissioned` — default: `active` |
| `ownershipType` | string enum | No | `owned\|leased\|rented` — default: `owned` |
| `acquisitionDate` | date ISO | No | null ok |
| `decommissionDate` | date ISO | No | valorizzata da DELETE /:id |
| `notes` | string | No | max 2000 |

> `PATCH /:id/status` accetta solo `{ status: enum, notes?: string }` — endpoint separato dal PUT generico.

### 4.2 Driver — driverSchemas.create / .update

| Campo | Tipo | Required | Vincoli / Default |
|---|---|---|---|
| `firstName` | string | Sì (create) | max 100 |
| `lastName` | string | Sì (create) | max 100 |
| `fiscalCode` | string | No | esattamente 16 char, UPPERCASE, UNIQUE |
| `birthDate` | date ISO | No | ≤ oggi |
| `phone` | string | No | max 50 |
| `email` | string email | No | max 200 |
| `address` | string | No | max 300 |
| `city` | string | No | max 100 — usato anche come filtro in listQuery |
| `hireDate` | date ISO | No | null ok |
| `terminationDate` | date ISO | No | valorizzata da DELETE /:id |
| `authUserId` | integer | No | FK logica verso auth-service, null se autista senza accesso app |
| `isActive` | boolean | No | default true |
| `notes` | string | No | max 2000 |

> **⚠️** `listQuery` accetta **solo**: `page, limit, search, active(boolean), city` — `unknown(false)`: qualunque altro parametro viene scartato silenziosamente da Joi.

### 4.3 DriverCompliance — driverComplianceSchemas

| Campo | Tipo | Required | Note |
|---|---|---|---|
| `driverId` | integer | Sì (create) | FK drivers |
| `typeId` | integer | Sì (create) | FK driver_compliance_types |
| `issuedAt` | date ISO | No | null ok |
| `expiresAt` | date ISO | No | null ok — se null, status=not_applicable |
| `issuingBody` | string | No | max 150 |
| `notes` | string | No | max 500 |

UNIQUE(driver_id, type_id) — un solo documento per tipo per autista.
`renew`: `expiresAt` è required, `issuedAt` default=oggi.

### 4.4 KmReading — kmReadingSchemas.create

| Campo | Tipo | Required | Note |
|---|---|---|---|
| `vehicleId` | integer | Sì | FK vehicles |
| `readingValue` | integer | Sì | ≥0 — **attenzione: `readingValue`, non `km`** |
| `readingDate` | date ISO | Sì | ≤ oggi |
| `source` | string enum | No | `manual\|telematics_api` — default: `manual` |
| `notes` | string | No | max 500 |

### 4.5 VehicleDeadline — vehicleDeadlineSchemas

| Campo | Tipo | Required | Note |
|---|---|---|---|
| `vehicleId` | integer | Sì (create) | FK vehicles |
| `deadlineTypeId` | integer | Sì (create) | FK deadline_types — UNIQUE(vehicle_id, deadline_type_id) |
| `expiryDate` | date ISO | Sì | Il backend calcola `status` automaticamente |
| `lastRenewalDate` | date ISO | No | null ok |
| `notes` | string | No | max 500 |

### 4.6 VehicleAssignment — vehicleAssignmentSchemas

| Campo | Tipo | Required | Note |
|---|---|---|---|
| `vehicleId` | integer | Sì (create) | FK vehicles |
| `driverId` | integer | Sì (create) | FK drivers |
| `startedAt` | date ISO | No | default: oggi |
| `notes` | string | No | max 500 |

`end`: `{ endedAt?: date (default oggi), notes? }`

### 4.7 MaintenanceRecord — maintenanceRecordSchemas.create

| Campo | Tipo | Required | Note |
|---|---|---|---|
| `vehicleId` | integer | Sì | FK vehicles |
| `maintenanceTypeId` | integer | Sì | FK maintenance_types |
| `performedAt` | date ISO | Sì | ≤ oggi |
| `workshopId` | integer | No | FK workshops |
| `kmAtService` | integer | No | null ok |
| `cost` | decimal(10,2) | No | null ok |
| `description` | string | No | max 1000 |
| `nextKm` | integer | No | null ok |
| `nextDate` | date ISO | No | null ok |
| `notes` | string | No | max 500 |

---

## 5. Database Schema — 16 Tabelle

Database PostgreSQL, DB name: `edg_vehicles`. Tutte le tabelle usano `snake_case`. I modelli Sequelize usano `camelCase` con mappatura automatica.

### 5.1 vehicles (tabella principale)

| Colonna | Tipo PG | Nullable | Default / Vincoli |
|---|---|---|---|
| `id` | integer PK | No | autoincrement |
| `category_id` | integer FK | No | → vehicle_categories.id |
| `telematics_provider_id` | integer FK | Sì | → telematics_providers.id |
| `telematics_vehicle_id` | varchar(100) | Sì | — |
| `has_plate` | boolean | No | default true |
| `plate` | varchar(20) | Sì | CHECK: se has_plate allora plate NOT NULL — UNIQUE index |
| `vin` | varchar(50) | Sì | UNIQUE |
| `internal_code` | varchar(50) | Sì | Codice aziendale interno |
| `brand` | varchar(100) | No | — |
| `model` | varchar(100) | No | — |
| `year` | smallint | Sì | — |
| `color` | varchar(50) | Sì | — |
| `fuel_type` | varchar(20) | No | default `diesel` — enum: `diesel\|petrol\|electric\|hybrid\|lpg\|cng\|other` |
| `emission_class` | varchar(20) | Sì | es. "Euro 6" |
| `current_km` | integer | No | default 0 |
| `telematics_enabled` | boolean | No | default false |
| `status` | varchar(20) | No | default `active` — enum: `active\|maintenance\|inactive\|decommissioned` |
| `ownership_type` | varchar(20) | No | default `owned` — enum: `owned\|leased\|rented` |
| `acquisition_date` | date | Sì | — |
| `decommission_date` | date | Sì | Valorizzata da DELETE /:id |
| `photo_path` | varchar(500) | Sì | — |
| `notes` | text | Sì | — |
| `created_at` / `updated_at` | timestamptz | No | default now() |

### 5.2 drivers

| Colonna | Tipo PG | Nullable | Default / Vincoli |
|---|---|---|---|
| `id` | integer PK | No | autoincrement |
| `auth_user_id` | integer | Sì | FK logica verso auth-service — NULL se autista senza app |
| `first_name` | varchar(100) | No | — |
| `last_name` | varchar(100) | No | — |
| `fiscal_code` | varchar(20) | Sì | UNIQUE — 16 caratteri |
| `birth_date` | date | Sì | — |
| `phone` | varchar(50) | Sì | — |
| `email` | varchar(200) | Sì | — |
| `address` | varchar(300) | Sì | — |
| `city` | varchar(100) | Sì | Usato come filtro in listQuery |
| `hire_date` | date | Sì | — |
| `termination_date` | date | Sì | Valorizzata da DELETE /:id |
| `is_active` | boolean | No | default true |
| `notes` | text | Sì | — |
| `created_at` / `updated_at` | timestamptz | No | default now() |

### 5.3 driver_compliances

| Colonna | Tipo PG | Nullable | Default / Vincoli |
|---|---|---|---|
| `id` | integer PK | No | autoincrement |
| `driver_id` | integer FK | No | → drivers.id ON DELETE CASCADE |
| `type_id` | integer FK | No | → driver_compliance_types.id — UNIQUE(driver_id, type_id) |
| `issued_at` | date | Sì | — |
| `expires_at` | date | Sì | NULL → status=not_applicable |
| `issuing_body` | varchar(200) | Sì | — |
| `status` | varchar(20) | No | default `valid` — enum: `valid\|expiring\|expired\|not_applicable` |
| `notes` | text | Sì | — |
| `created_at` / `updated_at` | timestamptz | No | — |

### 5.4 vehicle_deadlines

| Colonna | Tipo PG | Nullable | Default / Vincoli |
|---|---|---|---|
| `id` | integer PK | No | — |
| `vehicle_id` | integer FK | No | → vehicles.id ON DELETE CASCADE |
| `deadline_type_id` | integer FK | No | → deadline_types.id — UNIQUE(vehicle_id, deadline_type_id) |
| `expiry_date` | date | No | — |
| `last_renewal_date` | date | Sì | — |
| `status` | varchar(20) | No | default `valid` — enum calcolato dal backend |
| `notes` | text | Sì | — |
| `created_at` / `updated_at` | timestamptz | No | — |

### 5.5 vehicle_assignments

| Colonna | Tipo PG | Nullable | Default / Vincoli |
|---|---|---|---|
| `id` | integer PK | No | — |
| `vehicle_id` | integer FK | No | → vehicles.id ON DELETE CASCADE |
| `driver_id` | integer FK | No | → drivers.id |
| `started_at` | date | No | — |
| `ended_at` | date | Sì | NULL = assegnazione attiva — CHECK ended_at >= started_at |
| `notes` | text | Sì | — |
| `created_at` / `updated_at` | timestamptz | No | Index su vehicle_id, driver_id; partial index su ended_at IS NULL |

### 5.6 km_readings

| Colonna | Tipo PG | Nullable | Note |
|---|---|---|---|
| `id` | integer PK | No | — |
| `vehicle_id` | integer FK | No | → vehicles.id ON DELETE CASCADE |
| `reading_value` | integer | No | Il campo Sequelize è `readingValue` — **non** `km` |
| `reading_date` | timestamptz | No | default now() |
| `source` | varchar(20) | No | default `manual` — enum: `manual\|telematics_api` |
| `notes` | varchar(300) | Sì | — |
| `created_at` | timestamptz | No | Solo created_at, no updated_at |

### 5.7 Tabelle Lookup

| Tabella | Campi principali | Note |
|---|---|---|
| `vehicle_categories` | `id, name, label, description, requires_plate, requires_tachograph, regulation_type(highway_code\|dlgs_81_08\|both), is_active, sort_order` | `requires_plate` usato nel form per mostrare/nascondere il campo targa |
| `telematics_providers` | `id, name, api_endpoint, api_key, api_secret, data_format, polling_minutes, is_active` | Sola lettura UI — configurazione di sistema |
| `workshops` | `id, name, address, city, postal_code, phone, email, specialization, is_active` | Officine per maintenance_records |
| `deadline_types` | `id, name, label, description, applies_to_categories(int[]), alert_days_1/2/3, is_recurring, recurrence_months, is_active, sort_order` | `alertDays2` usato per calcolo status scadenze |
| `maintenance_types` | `id, name, label, description, applies_to_categories(int[]), km_threshold, days_threshold, alert_km_before, alert_days_before, is_active, sort_order` | CHECK: km_threshold OR days_threshold NOT NULL |
| `driver_compliance_types` | `id, name, label, category(license\|medical\|training\|other), description, alert_days_1/2/3, is_renewable, has_expiry, issuing_body, is_active, sort_order` | — |

### 5.8 Altre tabelle operative

| Tabella | Scopo | Note principali |
|---|---|---|
| `maintenance_schedules` | Piano manutenzione per veicolo+tipo | UNIQUE(vehicle_id, maintenance_type_id) — status: `ok\|due_soon\|overdue` — aggiornata in transazione al create di MaintenanceRecord |
| `maintenance_records` | Storico interventi eseguiti | campi: vehicleId, maintenanceTypeId, scheduleId(auto), workshopId, performedAt, kmAtService, cost, description, nextKm, nextDate, createdBy |
| `notifications` | Notifiche sistema (scadenze, alert) | vehicleId?, driverId?, entityType, type, severity(low\|medium\|high\|critical), isRead, isArchived, emailSent |
| `attachments` | Allegati polimorfici | entityType, entityId, filename, filepath, filesize, mimetype, uploadedBy |

---

## 6. DEFAULT_INCLUDE nei Controller

Ogni controller definisce un `DEFAULT_INCLUDE` che determina le associazioni popolate nelle risposte. Fondamentale per tipizzare correttamente i dati.

| Controller | Associazioni incluse | Attributi restituiti |
|---|---|---|
| `vehicleController` | category (as: `"category"`), telematicsProvider (as: `"telematicsProvider"`, required:false) | category: `{id,name,label}`; telematicsProvider: `{id,name}\|null` |
| `vehicleDeadlineController` | vehicle (as: `"vehicle"`), deadlineType (as: `"deadlineType"`) | vehicle: `{id,brand,model,plate}`; deadlineType: `{id,name,label,alertDays1,alertDays2,alertDays3}` |
| `vehicleAssignmentController` | vehicle (as: `"vehicle"`), driver (as: `"driver"`) | vehicle: `{id,brand,model,plate}`; driver: `{id,firstName,lastName,phone}` |
| `kmReadingController` | vehicle (as: `"vehicle"`) | vehicle: `{id,brand,model,plate}` |
| `maintenanceScheduleController` | vehicle, maintenanceType (as: `"maintenanceType"`) | maintenanceType: `{id,name,label,kmThreshold,daysThreshold,alertKmBefore,alertDaysBefore}` |
| `maintenanceRecordController` | vehicle, maintenanceType, workshop (as: `"workshop"`, required:false) | workshop: `{id,name,city}\|null` |
| `driverComplianceController` | complianceType (as: `"complianceType"`) | complianceType: oggetto DriverComplianceType completo |

> **Importante:** i nomi degli alias Sequelize (es. `"complianceType"`) sono i nomi con cui arrivano i dati nel JSON. Usarli esattamente uguali nei tipi TypeScript.

---

## 7. Convenzioni Frontend — pro-frontend

### 7.1 Stack Tecnologico

| Tecnologia | Dettaglio |
|---|---|
| Framework | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v4 — variabili tema custom (MAI colori hard-coded) |
| UI Primitivi | Radix UI — usare sempre Modal, DropdownMenu, Dialog da `@/core/components/ui` |
| Icone | Lucide React |
| State globale | Redux Toolkit — **solo per auth**; tutti gli altri moduli: `useState` locale |
| HTTP Client | `apiService` da `@/core/services/` — mai axios diretto |

### 7.2 Metodologia Type-First (5 Layer)

> Ogni submodulo si sviluppa **sempre** in questo ordine. Nessun componente prima che tipi, API e hook siano approvati.

| Layer | File | Responsabilità |
|---|---|---|
| 1 — Types | `types/vehicles.types.ts` | Interfacce TypeScript allineate al contratto reale del backend. Nessuna inferenza: verificare sempre sul container. |
| 2 — API | `api/vehicles.api.ts` | Funzioni che chiamano `apiService`. Parametri query allineati agli schema Joi. |
| 3 — Hook | `hooks/use*.ts` | Stato locale, loading/error, CRUD, filtri, paginazione. Un hook per entità. |
| 4 — Pagina | `pages/*.tsx` | Composizione di hook + componenti. Root element: `<>...</>` o `<div>` senza classi dimensionali. |
| 5 — Componenti | `components/*.tsx` | Presentazionali, riusabili, con props tipizzate. Mai logica di business. |

### 7.3 Regole CSS e Theming

> **MAI** usare colori Tailwind hard-coded (`text-gray-900`, `bg-white`, ecc.). Usare **sempre** le variabili tema.

| Variabile tema | Uso |
|---|---|
| `text-text-primary` | Testo principale |
| `text-text-secondary` | Testo secondario, label, descrizioni |
| `text-text-tertiary` | Testo molto attenuato |
| `bg-bg-primary` / `bg-surface-primary` | Sfondo principale pagina/card |
| `bg-surface-secondary` | Sfondo alternato, input, select |
| `bg-surface-tertiary` | Hover states |
| `border-border-primary` | Bordi standard |
| `border-border-secondary` | Bordi hover |

**Classi tipografia standard:**

```
text-xl font-semibold text-text-primary          ← titolo pagina (h1)
text-sm text-text-secondary                       ← sottotitolo pagina
text-xs font-semibold uppercase tracking-wider    ← intestazione sezione/colonna
text-sm text-text-primary                         ← testo corpo tabella
text-xs text-text-secondary                       ← metadati, date, note
```

### 7.4 Struttura Cartelle del Modulo

```
src/features/vehicles/
├── types/
│   └── vehicles.types.ts
├── api/
│   └── vehicles.api.ts
├── hooks/
│   ├── useVehicles.ts
│   ├── useDrivers.ts
│   ├── useLookups.ts
│   └── [futuro: useDeadlines.ts, useAssignments.ts, ...]
├── components/
│   └── [componenti specifici del modulo]
├── pages/
│   ├── Dashboard.tsx
│   ├── Vehicles.tsx
│   ├── Autisti.tsx
│   ├── Scadenze.tsx
│   ├── Storico.tsx
│   └── Config.tsx
└── index.ts  ← barrel export
```

### 7.5 Regole per le Pagine

- Root element: `<></>` o `<div>` **senza** classi dimensionali (no `w-full`, `p-6`, `max-w-*`, ecc.)
- La pagina vive già dentro `MainLayout.tsx` che gestisce padding e sizing
- Pattern layout standard: `<div className="flex flex-col gap-4 h-full">`
- Header: titolo `h1` + sottotitolo a sinistra, azioni a destra
- Paginazione: sempre in fondo, nascosta se `totalPages ≤ 1`

### 7.6 Componenti Core Disponibili

| Componente | Import | Note |
|---|---|---|
| `Button` | `@/core/components/ui` | variant: `primary\|ghost\|secondary` |
| `Badge` | `@/core/components/ui` | variant: `success\|info\|warning\|danger`, size: `sm\|md` |
| `Modal` | `@/core/components/ui/` | size: `sm\|md\|lg\|xl`, prop `footer` per i bottoni |
| `ConfirmModal` | `@/core/components/ui/` | variant: **solo** `danger\|default` — MAI `"primary"` |
| `Alert` | `@/core/components/feedback` | variant: `danger\|warning\|success\|info` |
| `Spinner` | `@/core/components/feedback` | size: `sm\|md\|lg` |
| `Table` | `@/core/components/data/table/Table` | `data[], columns[], keyExtractor, isLoading, emptyMessage` |
| `Input` | `@/core/components/form/input/Input` | `label, required, error, value, onChange` |
| `Select` | `@/core/components/form/select/Select` | `options: SelectOption[], value, onChange` |
| `DatePicker` | `@/core/components/form/date-picker/DatePicker` | `value (YYYY-MM-DD), onChange` |
| `Switch` | `@/core/components/form/switch/Switch` | `checked, onChange` |
| `TextArea` | `@/core/components/form/textarea/TextArea` | `value, onChange, rows` |
| `Tooltip` | `@/core/components/feedback` | **NON** da `@/core/components/ui` |

### 7.7 Fix Noti da Applicare

- **Radix Dialog + DropdownMenu:** quando un Dialog si apre da DropdownMenu, il body rimane con `pointer-events:none` dopo la chiusura. FIX: aggiungere `modal={false}` a `DropdownMenu.Root` in `ActionMenu.tsx`
- **ConfirmModal variant:** usare solo `"danger"` o `"default"` — mai `"primary"`
- **Barrel `index.ts`:** i componenti si esportano dal barrel del folder genitore (es. `layout/index.ts`), non con un `index.ts` per-componente
- **Cartelle:** sempre in `kebab-case` (es. `page-header/`, non `PageHeader/`)

### 7.8 Pattern Hook Standard

Ogni hook che carica dati paginati dal `vehicle-service` deve:

- Leggere `res.meta` (non `res.pagination`) per i dati di paginazione
- Esporre: `data[], pagination{total,page,limit,totalPages}, loading, error, submitting`
- Esporre: `filters, setFilters(partial), resetFilters, setPage(n), reload()`
- **NON** esporre `fetchXxx(filters)` direttamente — usare `reload()` per il refresh manuale
- Gestire il batch compliance con `Promise.allSettled` (non `Promise.all`) per resilienza

### 7.9 Regole Modali

- Ogni entità ha tre modali: **View** (sola lettura), **Create**, **Edit**
- View: footer con "Chiudi" (ghost) + "Modifica" (primary)
- Create/Edit: footer con "Annulla" (ghost) + "Salva" (primary, `isLoading` durante submit)
- `preventClose={submitting}` su tutte le modali di edit/create
- Pre-popolamento EditModal: `useEffect` su `[entity, isOpen]` — resetta `errors` e `touched`
- Validazione: oggetto `errors` + oggetto `touched`; errore mostrato solo se `touched[field]=true`

---

## 8. Gotcha & Lezioni Apprese

### 🔴 CRITICO — `res.meta`, non `res.pagination`

`successResponse()` usa `buildPaginationMeta()` che mette la paginazione nel campo `meta` a livello root, **non** `pagination`. Ogni hook che legge `res.pagination` ottiene `undefined`.

**FIX:** leggere sempre `res.meta.total`, `res.meta.page`, `res.meta.totalPages`, ecc.

```typescript
// ❌ SBAGLIATO
pagination: res.pagination ?? EMPTY_PAGINATION

// ✅ CORRETTO
pagination: res.meta ?? EMPTY_PAGINATION
```

---

### 🔴 CRITICO — `driver-compliances` è una risorsa autonoma

Non esiste `GET /drivers/:id/compliance`. La compliance è sotto `/driver-compliances` con filtro `driverId`.

**FIX:** usare `driverComplianceApi.getAll({ driverId: X })` — richiede una chiamata per autista perché il backend non supporta `driverId` multipli. Usare `Promise.allSettled` (non `Promise.all`) per il batch.

---

### 🔴 CRITICO — `VehicleStatus` e `FuelType` non sono tabelle

Non esistono le route `/vehicle-statuses`, `/vehicle-categories` (come path lookup), `/fuel-types`. I percorsi corretti delle lookup sono:

- `/categories` (non `/vehicle-categories`)
- `/telematics-providers`

`status` e `fuelType` sono colonne enum direttamente su `vehicles`. Le label leggibili vanno definite come costanti in `vehicles.types.ts`:

```typescript
export const VEHICLE_STATUS_LABELS: Record<VehicleStatusValue, string> = {
  active: 'Attivo',
  maintenance: 'In manutenzione',
  inactive: 'Inattivo',
  decommissioned: 'Dismesso',
};

export const FUEL_TYPE_LABELS: Record<FuelTypeValue, string> = {
  diesel: 'Diesel', petrol: 'Benzina', electric: 'Elettrico',
  hybrid: 'Ibrido', lpg: 'GPL', cng: 'Metano', other: 'Altro',
};
```

---

### 🟡 ATTENZIONE — `DELETE /vehicles/:id` non è una cancellazione

Il controller imposta `status="decommissioned"` e `decommission_date=oggi`. Il record NON viene rimosso.

**FIX:** nell'UI usare il termine **"Dismetti"** (non "Elimina"). Non mostrare la voce "Dismetti" se il veicolo è già in stato `decommissioned`.

---

### 🟡 ATTENZIONE — `DELETE` vs `PATCH /toggle` per i driver

- `PATCH /drivers/:id/toggle`: inverte `isActive` (true→false o false→true). **Reversibile.** Usare per sospensioni temporanee (es. malattia, aspettativa).
- `DELETE /drivers/:id`: soft-delete con `isActive=false` + `terminationDate=oggi`. Usare per **cessazione rapporto**. L'UI deve mostrarle come azioni distinte.

---

### 🟡 ATTENZIONE — `driver listQuery` accetta solo `active:boolean`

Il parametro `active` è booleano, non stringa, e non esiste opzione "all". Il default è `true` (solo attivi).

**FIX:** il filtro UI "Stato" offre solo "Attivi" e "Disattivati" — nessuna opzione "Tutti".

---

### 🟡 ATTENZIONE — `km_readings` usa `readingValue` non `km`

Il campo del body si chiama `readingValue`. Una lettura non può essere inferiore all'ultima registrata → il backend risponde con 400.

---

### 🟡 ATTENZIONE — `plate` non `licensePlate`

Il campo targa su `Vehicle` si chiama `plate`. Un veicolo può non avere targa (`has_plate=false`, es. muletti). L'identificatore da mostrare nell'UI:

```typescript
const getVehicleIdentifier = (v: Vehicle): string => {
  if (v.hasPlate && v.plate) return v.plate;
  if (v.internalCode)        return v.internalCode;
  return `#${v.id}`;
};
```

---

### 🔵 INFO — `acquisitionDate` non `purchaseDate`

Il campo data acquisto si chiama `acquisitionDate`. La vecchia documentazione riportava erroneamente `purchaseDate`.

---

### 🔵 INFO — compliance `status` calcolato dal backend

Il campo `status` in `driver_compliances` viene calcolato e salvato dal backend a create/renew usando `computeStatus()` con la soglia `alertDays2` del tipo di conformità. **NON va ricalcolato lato frontend.**

Il frontend aggrega solo: `expired > expiring > valid > not_applicable`. Il valore `"none"` è **solo-frontend** e significa "nessun documento registrato per questo autista".

---

### 🔵 INFO — DriverCompliance usa `issuedAt`/`expiresAt`

I campi del documento di conformità si chiamano `issuedAt` e `expiresAt` (non `issueDate`/`expiryDate`). L'alias Sequelize dell'associazione è `complianceType` (as: `"complianceType"`).

---

## 9. Roadmap Frontend — Ordine di Sviluppo

Ogni blocco si sviluppa completamente (types → api → hook → pagina → componenti) prima di passare al successivo.

| Blocco | Pagina | Entità principali | Priorità |
|---|---|---|---|
| A | Vehicles (Dotazione) | Vehicle, VehicleCategory, TelematicsProvider | 1 — core |
| B | Autisti | Driver, DriverCompliance, DriverComplianceType | 1 — core |
| C | Scadenze | VehicleDeadline, DeadlineType | 2 — operativo |
| D | Storico | VehicleAssignment, KmReading, MaintenanceRecord, MaintenanceSchedule | 2 — operativo |
| E | Dashboard | Aggregazione KPI + Notification | 3 — dipende da A+B+C+D |
| I | Config | Tutte le lookup tables (CRUD) | 4 — amministrativo |

### 9.1 Tipi da Definire per Blocco

**Blocco A:**
```typescript
type VehicleStatusValue = 'active' | 'maintenance' | 'inactive' | 'decommissioned'
type FuelTypeValue = 'diesel' | 'petrol' | 'electric' | 'hybrid' | 'lpg' | 'cng' | 'other'
type OwnershipType = 'owned' | 'leased' | 'rented'
interface VehicleCategory { id, name, label, description, requiresPlate, requiresTachograph, regulationType, isActive, sortOrder }
interface TelematicsProvider { id, name, isActive }
interface Vehicle { id, categoryId, hasPlate, plate, vin, internalCode, brand, model, year, color, fuelType, emissionClass, currentKm, status, ownershipType, acquisitionDate, decommissionDate, telematicsEnabled, telematicsProviderId, telematicsVehicleId, ... }
interface VehicleLookups { categories: VehicleCategory[]; telematicsProviders: TelematicsProvider[] }
// + VehicleCreateData, VehicleEditData, VehicleFilters, VehicleModalState
```

**Blocco B:**
```typescript
interface Driver { id, authUserId, firstName, lastName, fiscalCode, birthDate, phone, email, address, city, hireDate, terminationDate, isActive, notes }
interface DriverCompliance { id, driverId, typeId, complianceType?, issuedAt, expiresAt, issuingBody, status, notes }
// status: 'valid' | 'expiring' | 'expired' | 'not_applicable'
// DriverOverallComplianceStatus = status | 'none'  ← 'none' solo-frontend
interface DriverComplianceType { id, name, label, category, alertDays1, alertDays2, alertDays3, isRenewable, hasExpiry, issuingBody, isActive, sortOrder }
```

**Blocco C:** `VehicleDeadline, DeadlineType, DeadlineStatusValue ('valid'|'expiring'|'expired')`

**Blocco D:** `VehicleAssignment, KmReading, MaintenanceRecord, MaintenanceSchedule, MaintenanceType, Workshop`

**Blocco E/I:** `Notification, tutti i tipi lookup completi`

### 9.2 Approccio per Sessione

1. Avviare ogni sessione leggendo SKILL.md e il dev-briefing dal MCP Control Tower
2. Verificare sempre i tipi direttamente sui file `.js` compilati nel container (non sulla documentazione)
3. Procedere un passo alla volta con interazione bidirezionale — approvare ogni layer prima di passare al successivo
4. Aggiornare `update-module-status` al termine di ogni sessione

---

## 10. Configurazione Gateway e Response Shapes

### 10.1 Gateway

| Proprietà | Valore |
|---|---|
| Prefix | `/api/vehicles` → `vehicle-service:3000` |
| Auth | JWT Bearer token — verificato da `requireAuth` middleware |
| Header injection | Il gateway inietta `X-User-Id`, `X-User-Email`, `X-User-Uuid` nel `req` dopo la verifica |
| RBAC | `requirePermission("vehicles", "read|create|update|delete")` su ogni route |

### 10.2 Response Shapes

```typescript
// Risposta lista paginata
{ success: true, data: T[], meta: { total, page, limit, totalPages, hasNext, hasPrev } }

// Risposta singolo elemento
{ success: true, data: T, message?: string }

// Risposta errore
{ success: false, message: string, errors?: string[] }

// 200 con null (es. getCurrent per veicolo non assegnato)
{ success: true, data: null }
```

### 10.3 Tipi ApiResponse e PaginatedApiResponse

```typescript
// Da @/core/services/ — già esistente nel progetto
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Da definire in vehicles.types.ts
interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;  // CAMPO "meta", NON "pagination"
}
```

---

*Documento generato il 1 luglio 2025 — verificato direttamente sui file compilati nel container `vehicle-service` in esecuzione.*
