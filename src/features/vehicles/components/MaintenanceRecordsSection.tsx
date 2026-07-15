// =============================================================================
// ASSET AZIENDALI — COMPONENT: MaintenanceRecordsSection
// features/vehicles/components/MaintenanceRecordsSection.tsx
// =============================================================================

import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, ConfirmModal } from '@/core/components/ui';
import { Alert, Spinner } from '@/core/components/feedback';
import { Card } from '@/core/components/layout';
import Table from '@/core/components/data/table/Table';
import type { TableColumn } from '@/core/components/data/table/Table';
import { formatDate } from '@/core/utils';

import { useMaintenanceRecords } from '../hooks/useMaintenanceRecords';
import { MaintenanceRecordFilters } from './MaintenanceRecordFilters';
import { MaintenanceRecordFormModal } from './MaintenanceRecordFormModal';
import type { MaintenanceRecord } from '../types/vehicles.types';

const formatCost = (cost: number | null): string =>
  cost != null ? `€ ${cost.toLocaleString('it-IT', { minimumFractionDigits: 2 })}` : '—';

export const MaintenanceRecordsSection: React.FC = () => {
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
    createRecord,
    updateRecord,
    deleteRecord,
  } = useMaintenanceRecords();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const closeAndClearSelection = (close: () => void) => {
    close();
    setTimeout(() => setSelectedRecord(null), 0);
  };

  const handleCreate = async (data: Parameters<typeof createRecord>[0]) => {
    setActionLoading(true);
    try {
      await createRecord(data);
      setCreateModalOpen(false);
      reload();
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (id: number, data: Parameters<typeof updateRecord>[1]) => {
    setActionLoading(true);
    try {
      await updateRecord(id, data);
      closeAndClearSelection(() => setEditModalOpen(false));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRecord) return;
    setActionLoading(true);
    try {
      await deleteRecord(selectedRecord.id);
      closeAndClearSelection(() => setDeleteModalOpen(false));
    } finally {
      setActionLoading(false);
    }
  };

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
      header: 'Data',
      accessor: 'performedAt',
      sortable: true,
      render: r => <span className='text-sm'>{formatDate(r.performedAt, 'long')}</span>,
    },
    {
      header: 'Km',
      accessor: 'kmAtService',
      render: r => <span className='text-sm'>{r.kmAtService != null ? r.kmAtService.toLocaleString('it-IT') : '—'}</span>,
    },
    {
      header: 'Officina',
      accessor: 'workshopId',
      render: r => <span className='text-sm'>{r.workshop?.name ?? '—'}</span>,
    },
    {
      header: 'Costo',
      accessor: 'cost',
      sortable: true,
      render: r => <span className='text-sm'>{formatCost(r.cost)}</span>,
    },
  ];

  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <MaintenanceRecordFilters currentFilters={filters} onApply={setFilters} onReset={resetFilters} />
        <Button variant='primary' leftIcon={<Plus className='w-4 h-4' />} onClick={() => setCreateModalOpen(true)}>
          Registra intervento
        </Button>
      </div>

      {error && (
        <Alert variant='danger' className='mb-4'>
          {error}
        </Alert>
      )}

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
            hoverable
            rowActions={{
              enabled: true,
              mode: 'menu',
              quickActions: {
                edit: {
                  enabled: true,
                  onEdit: r => {
                    setSelectedRecord(r);
                    setEditModalOpen(true);
                  },
                },
              },
              actions: r => [
                {
                  id: 'delete',
                  label: 'Elimina',
                  onClick: () => {
                    setSelectedRecord(r);
                    setDeleteModalOpen(true);
                  },
                  variant: 'danger' as const,
                },
              ],
            }}
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

      <MaintenanceRecordFormModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        mode='create'
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        loading={actionLoading}
      />

      <MaintenanceRecordFormModal
        isOpen={editModalOpen}
        onClose={() => closeAndClearSelection(() => setEditModalOpen(false))}
        mode='edit'
        record={selectedRecord ?? undefined}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => closeAndClearSelection(() => setDeleteModalOpen(false))}
        onConfirm={handleDelete}
        title='Elimina intervento'
        message="Eliminare questo intervento di manutenzione? L'operazione è irreversibile e non aggiorna automaticamente la programmazione collegata."
        confirmText='Elimina'
        cancelText='Annulla'
        variant='danger'
        isLoading={actionLoading}
      />
    </div>
  );
};

export default MaintenanceRecordsSection;
