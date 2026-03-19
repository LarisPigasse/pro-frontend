// =============================================================================
// VEHICLES MODULE — COMPONENT: VehicleTable
// features/vehicles/components/VehicleTable.tsx
// =============================================================================
//
// Tabella principale lista veicoli.
// Colonne: targa/marca/modello | categoria | status | scadenze | autista | km | azioni
//
// Utilizzo:
//   <VehicleTable
//     vehicles={vehicles}
//     loading={loading}
//     onView={openView}
//     onEdit={openEdit}
//     onDelete={handleDelete}
//   />
// =============================================================================

import React, { useState, useCallback } from 'react';

import { VehicleStatusBadge } from './VehicleStatusBadge';
import { DeadlineStatusBadge } from './DeadlineStatusBadge';
import type { Vehicle } from '../types/vehicles.types';
import { ConfirmModal } from '@/core/components/ui/';

// -----------------------------------------------------------------------------
// PROPS
// -----------------------------------------------------------------------------

interface VehicleTableProps {
  vehicles: Vehicle[];
  loading: boolean;
  submitting: boolean;
  onView: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: number) => Promise<boolean>;
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

const formatKm = (km: number): string => new Intl.NumberFormat('it-IT').format(km) + ' km';

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getDriverFullName = (vehicle: Vehicle): string => {
  const driver = vehicle.currentAssignment?.driver;
  if (!driver) return '—';
  return `${driver.firstName} ${driver.lastName}`;
};

// -----------------------------------------------------------------------------
// SUB-COMPONENT: Skeleton row
// -----------------------------------------------------------------------------

const SkeletonRow: React.FC = () => (
  <tr className='border-b border-border-primary animate-pulse'>
    {Array.from({ length: 7 }).map((_, i) => (
      <td key={i} className='px-4 py-3'>
        <div className='h-4 rounded bg-surface-tertiary' style={{ width: `${60 + ((i * 13) % 40)}%` }} />
      </td>
    ))}
  </tr>
);

// -----------------------------------------------------------------------------
// SUB-COMPONENT: Empty state
// -----------------------------------------------------------------------------

const EmptyState: React.FC<{ hasFilters: boolean }> = ({ hasFilters }) => (
  <tr>
    <td colSpan={7} className='px-4 py-16 text-center'>
      <div className='flex flex-col items-center gap-3 text-text-secondary'>
        <svg className='w-12 h-12 opacity-30' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 1h8zM13 8h4l3 3v5h-7V8z'
          />
        </svg>
        <p className='text-sm font-medium'>{hasFilters ? 'Nessun veicolo corrisponde ai filtri' : 'Nessun veicolo presente'}</p>
        {hasFilters && <p className='text-xs'>Prova a modificare o resettare i filtri</p>}
      </div>
    </td>
  </tr>
);

// -----------------------------------------------------------------------------
// SUB-COMPONENT: Action menu
// -----------------------------------------------------------------------------

interface RowActionsProps {
  submitting: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const RowActions: React.FC<RowActionsProps> = ({ submitting, onView, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  return (
    <div className='relative flex items-center justify-end'>
      <button
        onClick={() => setOpen(prev => !prev)}
        disabled={submitting}
        className='
          p-1.5 rounded-md text-text-secondary
          hover:text-text-primary hover:bg-surface-tertiary
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors
        '
        aria-label='Azioni'
      >
        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
          <circle cx='5' cy='12' r='2' />
          <circle cx='12' cy='12' r='2' />
          <circle cx='19' cy='12' r='2' />
        </svg>
      </button>

      {open && (
        <>
          {/* Overlay trasparente per chiudere il menu */}
          <div className='fixed inset-0 z-10' onClick={close} />

          <div
            className='
            absolute right-0 top-8 z-20 w-40
            bg-surface-primary border border-border-primary
            rounded-lg shadow-lg overflow-hidden
          '
          >
            <button
              onClick={() => {
                onView();
                close();
              }}
              className='
                w-full flex items-center gap-2 px-3 py-2 text-sm text-left
                text-text-primary hover:bg-surface-secondary transition-colors
              '
            >
              <svg className='w-4 h-4 text-text-secondary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7
                     -1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                />
              </svg>
              Visualizza
            </button>

            <button
              onClick={() => {
                onEdit();
                close();
              }}
              className='
                w-full flex items-center gap-2 px-3 py-2 text-sm text-left
                text-text-primary hover:bg-surface-secondary transition-colors
              '
            >
              <svg className='w-4 h-4 text-text-secondary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                     m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                />
              </svg>
              Modifica
            </button>

            <div className='border-t border-border-primary' />

            <button
              onClick={() => {
                onDelete();
                close();
              }}
              className='
                w-full flex items-center gap-2 px-3 py-2 text-sm text-left
                text-red-500 hover:bg-red-500/5 transition-colors
              '
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858
                     L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                />
              </svg>
              Elimina
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// COMPONENT PRINCIPALE
// -----------------------------------------------------------------------------

export const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles, loading, submitting, onView, onEdit, onDelete }) => {
  // --- Stato confirm delete ---
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);

  const handleDeleteRequest = useCallback((vehicle: Vehicle) => {
    setDeleteTarget(vehicle);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;
    onDelete(deleteTarget.id).then(() => setDeleteTarget(null));
  }, [deleteTarget, onDelete]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  const hasFilters = false; // verrà passato come prop se necessario

  return (
    <>
      <div className='overflow-x-auto rounded-lg border border-border-primary'>
        <table className='w-full text-sm'>
          {/* HEADER */}
          <thead>
            <tr className='border-b border-border-primary bg-surface-secondary'>
              <th className='px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider'>
                Veicolo
              </th>
              <th className='px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider'>
                Categoria
              </th>
              <th className='px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider'>Status</th>
              <th className='px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider'>
                Scadenze
              </th>
              <th className='px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider'>
                Autista
              </th>
              <th className='px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider'>
                KM attuali
              </th>
              <th className='px-4 py-3 w-12' />
            </tr>
          </thead>

          {/* BODY */}
          <tbody className='divide-y divide-border-primary bg-surface-primary'>
            {/* Skeleton durante il caricamento */}
            {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

            {/* Empty state */}
            {!loading && vehicles.length === 0 && <EmptyState hasFilters={hasFilters} />}

            {/* Righe dati */}
            {!loading &&
              vehicles.map(vehicle => (
                <tr
                  key={vehicle.id}
                  className='hover:bg-surface-secondary/50 transition-colors cursor-pointer group'
                  onClick={() => onView(vehicle)}
                >
                  {/* Veicolo: targa + marca/modello + anno */}
                  <td className='px-4 py-3'>
                    <div className='flex flex-col gap-0.5'>
                      <span className='font-semibold text-text-primary tracking-wide'>{vehicle.licensePlate}</span>
                      <span className='text-xs text-text-secondary'>
                        {vehicle.brand} {vehicle.model}
                        {vehicle.year && <span className='ml-1 opacity-60'>· {vehicle.year}</span>}
                      </span>
                    </div>
                  </td>

                  {/* Categoria */}
                  <td className='px-4 py-3 text-text-secondary'>{vehicle.category?.name ?? '—'}</td>

                  {/* Status badge */}
                  <td className='px-4 py-3'>
                    <VehicleStatusBadge status={vehicle.status} size='sm' />
                  </td>

                  {/* Scadenze: badge worst status + data ultima lettura */}
                  <td className='px-4 py-3'>
                    {vehicle.worstDeadlineStatus ? (
                      <div className='flex flex-col gap-1'>
                        <DeadlineStatusBadge status={vehicle.worstDeadlineStatus} size='sm' />
                      </div>
                    ) : (
                      <span className='text-xs text-text-secondary'>—</span>
                    )}
                  </td>

                  {/* Autista corrente */}
                  <td className='px-4 py-3'>
                    {vehicle.currentAssignment ? (
                      <div className='flex flex-col gap-0.5'>
                        <span className='text-text-primary'>{getDriverFullName(vehicle)}</span>
                        <span className='text-xs text-text-secondary'>
                          Dal {formatDate(vehicle.currentAssignment.startDate)}
                        </span>
                      </div>
                    ) : (
                      <span className='text-xs text-text-secondary italic'>Non assegnato</span>
                    )}
                  </td>

                  {/* KM attuali + data ultima lettura */}
                  <td className='px-4 py-3'>
                    <div className='flex flex-col gap-0.5'>
                      <span className='text-text-primary font-medium tabular-nums'>{formatKm(vehicle.currentKm)}</span>
                      {vehicle.lastKmReading && (
                        <span className='text-xs text-text-secondary'>{formatDate(vehicle.lastKmReading.readingDate)}</span>
                      )}
                    </div>
                  </td>

                  {/* Azioni — stopPropagation per non aprire il modal view */}
                  <td className='px-4 py-3' onClick={e => e.stopPropagation()}>
                    <RowActions
                      submitting={submitting}
                      onView={() => onView(vehicle)}
                      onEdit={() => onEdit(vehicle)}
                      onDelete={() => handleDeleteRequest(vehicle)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal conferma eliminazione */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          variant='danger'
          title='Elimina veicolo'
          message={`Sei sicuro di voler eliminare il veicolo ${deleteTarget.licensePlate} — ${deleteTarget.brand} ${deleteTarget.model}? L'operazione non può essere annullata.`}
          confirmText='Elimina'
          onConfirm={handleDeleteConfirm}
          onClose={handleDeleteCancel}
        />
      )}
    </>
  );
};
