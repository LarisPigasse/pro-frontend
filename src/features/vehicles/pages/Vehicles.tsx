// =============================================================================
// ASSET AZIENDALI — PAGE: Vehicles (Dotazione)
// features/vehicles/pages/Vehicles.tsx
// =============================================================================

import React, { useCallback } from 'react';

import { useVehicles } from '../hooks/useVehicles';
import { useLookups } from '../hooks/useLookups';
import { VehicleFilters } from '../components/VehicleFilters';
import { VehicleTable } from '../components/VehicleTable';
import { ViewVehicleModal } from '../components/ViewVehicleModal';
import { CreateVehicleModal } from '../components/CreateVehicleModal';
import { EditVehicleModal } from '../components/EditVehicleModal';
import { Button } from '@/core/components/ui/';

// -----------------------------------------------------------------------------
// SUB-COMPONENT: Paginazione
// -----------------------------------------------------------------------------

interface PaginationProps {
  page:         number;
  totalPages:   number;
  total:        number;
  limit:        number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, total, limit, onPageChange }) => {
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);

  return (
    <div className='flex items-center justify-between px-1'>
      <span className='text-xs text-text-secondary'>
        {from}–{to} di {total} asset
      </span>

      <div className='flex items-center gap-1'>
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className='p-1.5 rounded-md text-text-secondary hover:text-text-primary
                     hover:bg-surface-tertiary disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
          aria-label='Prima pagina'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 19l-7-7 7-7M18 19l-7-7 7-7' />
          </svg>
        </button>

        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className='p-1.5 rounded-md text-text-secondary hover:text-text-primary
                     hover:bg-surface-tertiary disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
          aria-label='Pagina precedente'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
        </button>

        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let startPage = Math.max(1, page - 2);
          const endPage = Math.min(totalPages, startPage + 4);
          startPage = Math.max(1, endPage - 4);
          return startPage + i;
        })
          .filter(p => p >= 1 && p <= totalPages)
          .map(p => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`
                min-w-8 h-8 px-2 rounded-md text-sm transition-colors
                ${p === page
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-tertiary'}
              `}
            >
              {p}
            </button>
          ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className='p-1.5 rounded-md text-text-secondary hover:text-text-primary
                     hover:bg-surface-tertiary disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
          aria-label='Pagina successiva'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className='p-1.5 rounded-md text-text-secondary hover:text-text-primary
                     hover:bg-surface-tertiary disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
          aria-label='Ultima pagina'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 5l7 7-7 7M6 5l7 7-7 7' />
          </svg>
        </button>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// COMPONENT PRINCIPALE
// -----------------------------------------------------------------------------

export const Vehicles: React.FC = () => {
  const {
    vehicles, pagination, loading, error, submitting,
    filters, setFilters, resetFilters, setPage,
    modalState, openCreate, openEdit, openView, closeModal,
    createVehicle, updateVehicle, deleteVehicle,
  } = useVehicles();

  const { lookups, loading: lookupsLoading, error: lookupsError } = useLookups();

  const handleEditFromView = useCallback(() => {
    if (modalState.vehicle) openEdit(modalState.vehicle);
  }, [modalState.vehicle, openEdit]);

  return (
    <div className='flex flex-col gap-4 h-full'>

      {/* HEADER */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-semibold text-text-primary'>Dotazione</h1>
          <p className='text-sm text-text-secondary mt-0.5'>Anagrafica e stato operativo degli asset aziendali</p>
        </div>
        <Button variant='primary' onClick={openCreate}>
          <svg className='w-4 h-4 mr-1.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
          </svg>
          Nuovo asset
        </Button>
      </div>

      {/* ERRORE LOOKUP */}
      {lookupsError && (
        <div className='flex items-center gap-2 px-4 py-3 rounded-lg
                        bg-amber-500/10 border border-amber-500/20 text-amber-600 text-sm'>
          <svg className='w-4 h-4 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
              d='M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94
                 a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z' />
          </svg>
          I filtri per categoria, status e carburante non sono disponibili. I dati vengono comunque caricati.
        </div>
      )}

      {/* ERRORE LISTA */}
      {error && !loading && (
        <div className='flex items-center gap-2 px-4 py-3 rounded-lg
                        bg-red-500/10 border border-red-500/20 text-red-600 text-sm'>
          <svg className='w-4 h-4 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
              d='M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94
                 a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z' />
          </svg>
          {error}
        </div>
      )}

      {/* FILTRI */}
      <VehicleFilters
        filters={filters}
        lookups={lookups}
        lookupsLoading={lookupsLoading}
        onFiltersChange={setFilters}
        onReset={resetFilters}
        totalResults={loading ? undefined : pagination.total}
      />

      {/* TABELLA */}
      <div className='flex-1 min-h-0'>
        <VehicleTable
          vehicles={vehicles}
          loading={loading}
          submitting={submitting}
          onView={openView}
          onEdit={openEdit}
          onDelete={deleteVehicle}
        />
      </div>

      {/* PAGINAZIONE */}
      {!loading && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={setPage}
        />
      )}

      {/* MODALI */}
      <ViewVehicleModal
        vehicle={modalState.vehicle}
        isOpen={modalState.mode === 'view'}
        onClose={closeModal}
        onEdit={handleEditFromView}
      />
      <CreateVehicleModal
        isOpen={modalState.mode === 'create'}
        lookups={lookups}
        submitting={submitting}
        onClose={closeModal}
        onSubmit={createVehicle}
      />
      <EditVehicleModal
        vehicle={modalState.vehicle}
        isOpen={modalState.mode === 'edit'}
        lookups={lookups}
        submitting={submitting}
        onClose={closeModal}
        onSubmit={updateVehicle}
      />

    </div>
  );
};
