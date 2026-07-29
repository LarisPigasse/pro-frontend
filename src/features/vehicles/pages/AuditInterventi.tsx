// =============================================================================
// ASSET AZIENDALI — PAGE: AuditInterventi
// features/vehicles/pages/AuditInterventi.tsx
// =============================================================================
//
// Log di sola lettura degli interventi registrati — chi li ha inseriti e quando.
// Accesso ristretto (permesso 'vehicles.audit', root+admin). Riusa i dati di
// useMaintenanceRecords già esistente: nessun nuovo endpoint backend.

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/core/components/ui';
import { Alert, Spinner } from '@/core/components/feedback';
import { PageHeader, Card } from '@/core/components/layout';
import Table from '@/core/components/data/table/Table';
import type { TableColumn } from '@/core/components/data/table/Table';
import { formatDate } from '@/core/utils';

import { useMaintenanceRecords } from '../hooks/useMaintenanceRecords';
import { useAccountsLookup } from '../hooks/useAccountsLookup';
import { MaintenanceRecordFilters } from '../components';
import type { MaintenanceRecord } from '../types/vehicles.types';

const formatCost = (cost: number | null): string =>
  cost != null ? `€ ${cost.toLocaleString('it-IT', { minimumFractionDigits: 2 })}` : '—';

export const AuditInterventi: React.FC = () => {
  const {
    data: records,
    loading,
    error,
    filters,
    pagination,
    setFilters,
    resetFilters,
    setPage,
    reload,
  } = useMaintenanceRecords();
  const { map: accountsMap } = useAccountsLookup();

  const columns: TableColumn<MaintenanceRecord>[] = [
    {
      header: 'Veicolo',
      accessor: 'vehicleId',
      render: r => (
        <div className='flex flex-col'>
          <span className='font-medium text-text-primary'>
            {r.vehicle.brand} {r.vehicle.model}
          </span>
          {r.vehicle.plate && <span className='text-xs text-text-secondary'>{r.vehicle.plate}</span>}
        </div>
      ),
    },
    {
      header: 'Tipo',
      accessor: 'maintenanceTypeId',
      render: r => <span className='text-sm'>{r.maintenanceType.label}</span>,
    },
    {
      header: 'Data intervento',
      accessor: 'performedAt',
      sortable: true,
      render: r => <span className='text-sm'>{formatDate(r.performedAt, 'long')}</span>,
    },
    {
      header: 'Costo',
      accessor: 'cost',
      sortable: true,
      render: r => <span className='text-sm'>{formatCost(r.cost)}</span>,
    },
    {
      header: 'Registrato da',
      accessor: 'createdBy',
      render: r => (
        <span className='text-sm text-text-secondary'>{accountsMap.get(r.createdBy) ?? `Account #${r.createdBy}`}</span>
      ),
    },
    {
      header: 'Registrato il',
      accessor: 'createdAt',
      sortable: true,
      render: r => <span className='text-sm text-text-secondary'>{formatDate(r.createdAt, 'long')}</span>,
    },
  ];

  return (
    <>
      <PageHeader
        title='Audit interventi'
        subtitle='Registro di sola lettura: chi ha registrato ogni intervento e quando — accesso riservato'
        onRefresh={reload}
        isLoading={loading}
      />

      {error && (
        <Alert variant='danger' className='mb-6'>
          {error}
        </Alert>
      )}

      <MaintenanceRecordFilters currentFilters={filters} onApply={setFilters} onReset={resetFilters} />

      {loading && records.length === 0 ? (
        <div className='flex items-center justify-center py-12'>
          <Spinner size='md' />
        </div>
      ) : (
        <Card variant='default' padding='none'>
          <Table
            data={records}
            columns={columns}
            keyExtractor={r => r.id}
            isLoading={false}
            emptyMessage='Nessun intervento registrato'
            size='md'
            striped
            hoverable={false}
          />

          <div className='bg-bg-secondary px-4 py-2 flex items-center justify-between border-t border-border-default'>
            <div className='text-sm text-text-secondary'>
              Pagina <span className='font-medium text-text-primary'>{pagination.page}</span> di{' '}
              <span className='font-medium text-text-primary'>{pagination.totalPages || 1}</span>
              {' · '}
              <span className='font-medium text-text-primary'>{pagination.total}</span> interventi
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                leftIcon={<ChevronLeft className='w-4 h-4' />}
                onClick={() => setPage(pagination.page - 1)}
                disabled={!pagination.hasPrev || loading}
              >
                Indietro
              </Button>
              <Button
                variant='outline'
                size='sm'
                rightIcon={<ChevronRight className='w-4 h-4' />}
                onClick={() => setPage(pagination.page + 1)}
                disabled={!pagination.hasNext || loading}
              >
                Avanti
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default AuditInterventi;
