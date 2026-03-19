// =============================================================================
// ASSET AZIENDALI — PAGE: Autisti
// features/vehicles/pages/Autisti.tsx
// =============================================================================

import React, { useCallback } from 'react';
import { Plus, RefreshCw } from 'lucide-react';

import { Button } from '@/core/components/ui';
import { Alert, Spinner } from '@/core/components/feedback';
import { useDrivers } from '../hooks/useDrivers';
import { DriverFilters } from '../components/DriverFilters';
import { DriverTable } from '../components/DriverTable';
import { ViewDriverModal } from '../components/ViewDriverModal';
import { CreateDriverModal } from '../components/CreateDriverModal';
import { EditDriverModal } from '../components/EditDriverModal';

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export const Autisti: React.FC = () => {
  const {
    drivers, pagination, loading, complianceLoading, error, submitting,
    filters, setFilters, resetFilters, setPage,
    modalState, openCreate, openEdit, openView, closeModal,
    createDriver, updateDriver, deactivateDriver,
    fetchDrivers,
  } = useDrivers();

  const handleEditFromView = useCallback(() => {
    if (modalState.driver) openEdit(modalState.driver);
  }, [modalState.driver, openEdit]);

  return (
    <div className='max-w-7xl mx-auto p-6'>

      {/* HEADER */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Autisti</h1>
          <p className='text-gray-600 mt-1'>
            Anagrafica e conformità documentale
            {complianceLoading && (
              <span className='ml-2 inline-flex items-center gap-1 text-xs text-gray-400'>
                <RefreshCw className='w-3 h-3 animate-spin' />
                Caricamento conformità…
              </span>
            )}
          </p>
        </div>
        <div className='flex items-center space-x-3'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => fetchDrivers(filters)}
            disabled={loading}
            title='Aggiorna'
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant='primary' onClick={openCreate}>
            <Plus className='w-4 h-4 mr-2' />
            Nuovo autista
          </Button>
        </div>
      </div>

      {/* ERRORE */}
      {error && (
        <Alert variant='danger' className='mb-6'>
          {error}
        </Alert>
      )}

      {/* FILTRI */}
      <DriverFilters
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
        totalResults={loading ? undefined : pagination.total}
      />

      {/* TABELLA */}
      {loading && !drivers.length ? (
        <div className='flex items-center justify-center py-12'>
          <Spinner size='md' />
        </div>
      ) : (
        <>
          <DriverTable
            drivers={drivers}
            loading={loading}
            submitting={submitting}
            filters={filters}
            onView={openView}
            onEdit={openEdit}
            onDeactivate={deactivateDriver}
          />

          {/* PAGINAZIONE */}
          <div className='mt-6 flex items-center justify-between'>
            <div className='text-sm text-gray-600'>
              Mostrando {drivers.length} di {pagination.total} autist{pagination.total === 1 ? 'a' : 'i'}
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setPage(pagination.page - 1)}
                disabled={pagination.page <= 1 || loading}
              >
                Indietro
              </Button>
              <span className='text-sm text-gray-600'>
                Pagina {pagination.page} di {pagination.totalPages || 1}
              </span>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setPage(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || loading}
              >
                Avanti
              </Button>
            </div>
          </div>
        </>
      )}

      {/* MODALI */}
      <ViewDriverModal
        driver={modalState.driver}
        isOpen={modalState.mode === 'view'}
        onClose={closeModal}
        onEdit={handleEditFromView}
      />

      <CreateDriverModal
        isOpen={modalState.mode === 'create'}
        submitting={submitting}
        onClose={closeModal}
        onSubmit={createDriver}
      />

      <EditDriverModal
        driver={modalState.driver}
        isOpen={modalState.mode === 'edit'}
        submitting={submitting}
        onClose={closeModal}
        onSubmit={updateDriver}
      />

    </div>
  );
};
