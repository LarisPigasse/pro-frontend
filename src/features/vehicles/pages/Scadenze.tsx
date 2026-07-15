// =============================================================================
// ASSET AZIENDALI — PAGE: Scadenze
// features/vehicles/pages/Scadenze.tsx
// =============================================================================

import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, ConfirmModal } from '@/core/components/ui';
import { Alert, Spinner } from '@/core/components/feedback';
import { PageHeader, Card } from '@/core/components/layout';
import Table from '@/core/components/data/table/Table';
import type { TableColumn } from '@/core/components/data/table/Table';
import { formatDate } from '@/core/utils';

import { useVehicleDeadlines } from '../hooks/useVehicleDeadlines';
import { DeadlineFilters, DeadlineStatusBadge, VehicleDeadlineFormModal, EditDeadlineModal } from '../components';
import type {
  VehicleDeadline,
  CreateVehicleDeadlineData,
  UpdateVehicleDeadlineData,
  RenewVehicleDeadlineData,
} from '../types/vehicles.types';

export const Scadenze: React.FC = () => {
  const {
    data: deadlines,
    loading,
    error,
    filters,
    pagination,
    setFilters,
    resetFilters,
    setPage,
    reload,
    createDeadline,
    updateDeadline,
    renewDeadline,
    deleteDeadline,
  } = useVehicleDeadlines();

  const [formModalMode, setFormModalMode] = useState<'create' | 'renew' | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState<VehicleDeadline | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const closeAndClearSelection = (close: () => void) => {
    close();
    setTimeout(() => setSelectedDeadline(null), 0);
  };

  // ─── handlers CRUD ───────────────────────────────────────────────────────

  const handleCreate = async (data: CreateVehicleDeadlineData) => {
    setActionLoading(true);
    try {
      await createDeadline(data);
      setFormModalMode(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRenew = async (id: number, data: RenewVehicleDeadlineData) => {
    setActionLoading(true);
    try {
      await renewDeadline(id, data);
      closeAndClearSelection(() => setFormModalMode(null));
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (id: number, data: UpdateVehicleDeadlineData) => {
    setActionLoading(true);
    try {
      await updateDeadline(id, data);
      closeAndClearSelection(() => setEditModalOpen(false));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDeadline) return;
    setActionLoading(true);
    try {
      await deleteDeadline(selectedDeadline.id);
      closeAndClearSelection(() => setDeleteModalOpen(false));
    } finally {
      setActionLoading(false);
    }
  };

  // ─── colonne tabella ─────────────────────────────────────────────────────

  const columns: TableColumn<VehicleDeadline>[] = [
    {
      header: 'Veicolo',
      accessor: 'vehicleId',
      render: d => (
        <div className='flex flex-col'>
          <span className='font-medium text-text-primary'>
            {d.vehicle.brand} {d.vehicle.model}
          </span>
          {d.vehicle.plate && <span className='text-xs text-text-secondary'>{d.vehicle.plate}</span>}
        </div>
      ),
    },
    {
      header: 'Tipo scadenza',
      accessor: 'deadlineTypeId',
      render: d => <span className='text-sm'>{d.deadlineType.label}</span>,
    },
    {
      header: 'Scadenza',
      accessor: 'expiryDate',
      sortable: true,
      render: d => <span className='text-sm'>{formatDate(d.expiryDate, 'long')}</span>,
    },
    {
      header: 'Ultimo rinnovo',
      accessor: 'lastRenewalDate',
      render: d => <span className='text-sm'>{formatDate(d.lastRenewalDate)}</span>,
    },
    {
      header: 'Stato',
      accessor: 'status',
      sortable: true,
      render: d => <DeadlineStatusBadge status={d.status} />,
    },
  ];

  return (
    <>
      <PageHeader
        title='Scadenze'
        subtitle='Scadenze documentali e amministrative dei veicoli'
        onRefresh={reload}
        isLoading={loading}
        actions={
          <Button variant='primary' leftIcon={<Plus className='w-4 h-4' />} onClick={() => setFormModalMode('create')}>
            Nuova scadenza
          </Button>
        }
      />

      {error && (
        <Alert variant='danger' className='mb-6'>
          {error}
        </Alert>
      )}

      <DeadlineFilters currentFilters={filters} onApply={setFilters} onReset={resetFilters} />

      {loading && deadlines.length === 0 ? (
        <div className='flex items-center justify-center py-12'>
          <Spinner size='md' />
        </div>
      ) : (
        <Card variant='default' padding='none'>
          <Table
            data={deadlines}
            columns={columns}
            keyExtractor={d => d.id}
            isLoading={false}
            emptyMessage='Nessuna scadenza registrata'
            size='md'
            striped
            hoverable
            rowActions={{
              enabled: true,
              mode: 'menu',
              quickActions: {
                edit: {
                  enabled: true,
                  onEdit: d => {
                    setSelectedDeadline(d);
                    setEditModalOpen(true);
                  },
                },
              },
              actions: d => [
                {
                  id: 'renew',
                  label: 'Rinnova',
                  onClick: () => {
                    setSelectedDeadline(d);
                    setFormModalMode('renew');
                  },
                  divider: true,
                },
                {
                  id: 'delete',
                  label: 'Elimina',
                  onClick: () => {
                    setSelectedDeadline(d);
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
              <span className='font-medium text-text-primary'>{pagination.total}</span> scadenze
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

      {/* ── Modali ──────────────────────────────────────────────────────── */}

      <VehicleDeadlineFormModal
        isOpen={formModalMode !== null}
        onClose={() => closeAndClearSelection(() => setFormModalMode(null))}
        mode={formModalMode ?? 'create'}
        deadline={selectedDeadline ?? undefined}
        onCreate={handleCreate}
        onRenew={handleRenew}
        loading={actionLoading}
      />

      <EditDeadlineModal
        isOpen={editModalOpen}
        onClose={() => closeAndClearSelection(() => setEditModalOpen(false))}
        deadline={selectedDeadline}
        onConfirm={handleEdit}
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => closeAndClearSelection(() => setDeleteModalOpen(false))}
        onConfirm={handleDelete}
        title='Elimina scadenza'
        message={`Eliminare la scadenza "${selectedDeadline?.deadlineType.label ?? ''}" per ${selectedDeadline?.vehicle.brand ?? ''} ${selectedDeadline?.vehicle.model ?? ''}? A differenza della dismissione di un veicolo, questa è una cancellazione definitiva dal database.`}
        confirmText='Elimina'
        cancelText='Annulla'
        variant='danger'
        isLoading={actionLoading}
      />
    </>
  );
};

export default Scadenze;
