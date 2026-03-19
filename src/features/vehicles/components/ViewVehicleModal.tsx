// =============================================================================
// VEHICLES MODULE — COMPONENT: ViewVehicleModal
// features/vehicles/components/ViewVehicleModal.tsx
// =============================================================================
//
// Modal di dettaglio veicolo — sola lettura.
// Mostra tutti i dati anagrafici + associazioni (category, status, fuelType,
// autista corrente, KM attuali, stato scadenze peggiore).
//
// Utilizzo:
//   <ViewVehicleModal
//     vehicle={modalState.vehicle}
//     isOpen={modalState.mode === 'view'}
//     onClose={closeModal}
//     onEdit={() => openEdit(modalState.vehicle!)}
//   />
// =============================================================================

import React from 'react';

import { VehicleStatusBadge } from './VehicleStatusBadge';
import { DeadlineStatusBadge } from './DeadlineStatusBadge';
import type { Vehicle } from '../types/vehicles.types';
import { Modal } from '@/core/components/ui/';
import { Button } from '@/core/components/ui/';

// -----------------------------------------------------------------------------
// PROPS
// -----------------------------------------------------------------------------

interface ViewVehicleModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatKm = (km: number): string => new Intl.NumberFormat('it-IT').format(km) + ' km';

// -----------------------------------------------------------------------------
// SUB-COMPONENT: Campo informativo
// -----------------------------------------------------------------------------

interface InfoFieldProps {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, fullWidth = false }) => (
  <div className={fullWidth ? 'col-span-2' : ''}>
    <dt className='text-xs font-medium text-text-secondary uppercase tracking-wider mb-1'>{label}</dt>
    <dd className='text-sm text-text-primary'>{value || <span className='text-text-secondary italic'>—</span>}</dd>
  </div>
);

// -----------------------------------------------------------------------------
// SUB-COMPONENT: Sezione
// -----------------------------------------------------------------------------

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className='flex flex-col gap-3'>
    <h3
      className='text-xs font-semibold text-text-secondary uppercase tracking-wider
                   pb-2 border-b border-border-primary'
    >
      {title}
    </h3>
    <dl className='grid grid-cols-2 gap-x-6 gap-y-4'>{children}</dl>
  </div>
);

// -----------------------------------------------------------------------------
// COMPONENT PRINCIPALE
// -----------------------------------------------------------------------------

export const ViewVehicleModal: React.FC<ViewVehicleModalProps> = ({ vehicle, isOpen, onClose, onEdit }) => {
  if (!vehicle) return null;

  const driver = vehicle.currentAssignment?.driver;

  const footer = (
    <div className='flex items-center justify-between w-full'>
      <Button variant='ghost' onClick={onClose}>
        Chiudi
      </Button>
      <Button variant='primary' onClick={onEdit}>
        Modifica
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${vehicle.licensePlate} — ${vehicle.brand} ${vehicle.model}`}
      size='lg'
      footer={footer}
    >
      <div className='flex flex-col gap-6 p-6'>
        {/* ---------------------------------------------------------------- */}
        {/* SEZIONE 1 — Anagrafica veicolo                                   */}
        {/* ---------------------------------------------------------------- */}
        <Section title='Anagrafica veicolo'>
          <InfoField label='Targa' value={vehicle.licensePlate} />
          <InfoField label='Marca' value={vehicle.brand} />
          <InfoField label='Modello' value={vehicle.model} />
          <InfoField label='Anno' value={vehicle.year?.toString()} />
          <InfoField label='VIN / Telaio' value={vehicle.vin} />
          <InfoField label='Categoria' value={vehicle.category?.name} />
          <InfoField label='Carburante' value={vehicle.fuelType?.name} />
          <InfoField label='Data acquisto' value={formatDate(vehicle.purchaseDate)} />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* SEZIONE 2 — Stato operativo                                      */}
        {/* ---------------------------------------------------------------- */}
        <Section title='Stato operativo'>
          <InfoField label='Status' value={<VehicleStatusBadge status={vehicle.status} size='sm' />} />
          <InfoField
            label='Scadenze'
            value={
              vehicle.worstDeadlineStatus ? <DeadlineStatusBadge status={vehicle.worstDeadlineStatus} size='sm' /> : undefined
            }
          />
          <InfoField
            label='KM attuali'
            value={<span className='font-medium tabular-nums'>{formatKm(vehicle.currentKm)}</span>}
          />
          <InfoField label='Ultima lettura km' value={formatDate(vehicle.lastKmReading?.readingDate)} />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* SEZIONE 3 — Autista corrente                                     */}
        {/* ---------------------------------------------------------------- */}
        <Section title='Autista corrente'>
          {driver ? (
            <>
              <InfoField label='Nome' value={`${driver.firstName} ${driver.lastName}`} />
              <InfoField label='Assegnato dal' value={formatDate(vehicle.currentAssignment?.startDate)} />
              {driver.phone && <InfoField label='Telefono' value={driver.phone} />}
              {driver.email && <InfoField label='Email' value={driver.email} />}
            </>
          ) : (
            <div className='col-span-2'>
              <p className='text-sm text-text-secondary italic'>Nessun autista assegnato</p>
            </div>
          )}
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* SEZIONE 4 — Note                                                 */}
        {/* ---------------------------------------------------------------- */}
        {vehicle.notes && (
          <Section title='Note'>
            <InfoField label='Note' value={vehicle.notes} fullWidth />
          </Section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Footer info: date creazione/modifica                             */}
        {/* ---------------------------------------------------------------- */}
        <div
          className='flex items-center justify-between pt-2 border-t border-border-primary
                        text-xs text-text-secondary'
        >
          <span>Creato il {formatDate(vehicle.createdAt)}</span>
          <span>Modificato il {formatDate(vehicle.updatedAt)}</span>
        </div>
      </div>
    </Modal>
  );
};
