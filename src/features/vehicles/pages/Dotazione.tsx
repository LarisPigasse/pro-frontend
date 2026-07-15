// =============================================================================
// ASSET AZIENDALI — PAGE: Dotazione
// features/vehicles/pages/Dotazione.tsx
// =============================================================================

import React, { useState } from 'react';
import { Plus, RefreshCcw, Ban, ChevronLeft, ChevronRight, Gauge } from 'lucide-react';
import { Button, Badge, ConfirmModal } from '@/core/components/ui';
import { Alert, Spinner } from '@/core/components/feedback';
import { PageHeader, Card } from '@/core/components/layout';
import Table from '@/core/components/data/table/Table';
import type { TableColumn } from '@/core/components/data/table/Table';

import { useVehicles } from '../hooks/useVehicles';
import { VehicleFilters, CreateVehicleModal, EditVehicleModal, ChangeVehicleStatusModal } from '../components';
import { VEHICLE_STATUS_LABELS, FUEL_TYPE_LABELS } from '../types/vehicles.types';
import type {
  Vehicle,
  VehicleStatus,
  CreateVehicleData,
  UpdateVehicleData,
  UpdateVehicleStatusData,
} from '../types/vehicles.types';

const STATUS_BADGE_VARIANT: Record<VehicleStatus, 'success' | 'warning' | 'default' | 'danger'> = {
  active: 'success',
  maintenance: 'warning',
  inactive: 'default',
  decommissioned: 'danger',
};

export const Dotazione: React.FC = () => {
  const {
    data: vehicles,
    loading,
    error,
    filters,
    pagination,
    setFilters,
    resetFilters,
    setPage,
    reload,
    createVehicle,
    updateVehicle,
    updateVehicleStatus,
    decommissionVehicle,
  } = useVehicles();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [decommissionModalOpen, setDecommissionModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const closeAndClearSelection = (close: () => void) => {
    close();
    setTimeout(() => setSelectedVehicle(null), 0);
  };

  const formatKm = (km: number): string => `${km.toLocaleString('it-IT')} km`;

  // ─── handlers CRUD ───────────────────────────────────────────────────────

  const handleCreate = async (data: CreateVehicleData) => {
    setActionLoading(true);
    try {
      await createVehicle(data);
      setCreateModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (id: number, data: UpdateVehicleData) => {
    setActionLoading(true);
    try {
      await updateVehicle(id, data);
      closeAndClearSelection(() => setEditModalOpen(false));
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeStatus = async (id: number, data: UpdateVehicleStatusData) => {
    setActionLoading(true);
    try {
      await updateVehicleStatus(id, data);
      closeAndClearSelection(() => setStatusModalOpen(false));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecommission = async () => {
    if (!selectedVehicle) return;
    setActionLoading(true);
    try {
      await decommissionVehicle(selectedVehicle.id);
      closeAndClearSelection(() => setDecommissionModalOpen(false));
    } finally {
      setActionLoading(false);
    }
  };

  // ─── colonne tabella ─────────────────────────────────────────────────────

  const columns: TableColumn<Vehicle>[] = [
    {
      header: 'Veicolo',
      accessor: 'brand',
      sortable: true,
      render: v => (
        <div className='flex flex-col'>
          <span className='font-medium text-text-primary'>
            {v.brand} {v.model}
          </span>
          <span className='text-xs text-text-secondary'>
            {v.hasPlate ? v.plate : v.vin ? `VIN: ${v.vin}` : v.internalCode || '—'}
          </span>
        </div>
      ),
    },
    {
      header: 'Categoria',
      accessor: 'categoryId',
      render: v => (
        <Badge variant='info' size='sm'>
          {v.category.label}
        </Badge>
      ),
    },
    {
      header: 'Carburante',
      accessor: 'fuelType',
      sortable: true,
      render: v => <span className='text-sm'>{FUEL_TYPE_LABELS[v.fuelType]}</span>,
    },
    {
      header: 'Km attuali',
      sortable: true,
      accessor: 'currentKm',
      render: v => (
        <span className='text-sm inline-flex items-center gap-1'>
          <Gauge className='w-3.5 h-3.5 text-text-secondary' />
          {formatKm(v.currentKm)}
        </span>
      ),
    },
    {
      header: 'Fornitore telematico',
      accessor: 'telematicsProviderId',
      render: v =>
        v.telematicsEnabled && v.telematicsProvider ? (
          <span className='text-sm'>{v.telematicsProvider.name}</span>
        ) : (
          <span className='text-sm text-text-secondary'>—</span>
        ),
    },
    {
      header: 'Stato',
      accessor: 'status',
      sortable: true,
      render: v => (
        <Badge variant={STATUS_BADGE_VARIANT[v.status]} size='sm'>
          {VEHICLE_STATUS_LABELS[v.status]}
        </Badge>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title='Dotazione'
        subtitle='Anagrafica veicoli aziendali'
        onRefresh={reload}
        isLoading={loading}
        actions={
          <Button variant='primary' leftIcon={<Plus className='w-4 h-4' />} onClick={() => setCreateModalOpen(true)}>
            Nuovo veicolo
          </Button>
        }
      />

      {error && (
        <Alert variant='danger' className='mb-6'>
          {error}
        </Alert>
      )}

      <VehicleFilters currentFilters={filters} onApply={setFilters} onReset={resetFilters} />

      {loading && vehicles.length === 0 ? (
        <div className='flex items-center justify-center py-12'>
          <Spinner size='md' />
        </div>
      ) : (
        <Card variant='default' padding='none'>
          <Table
            data={vehicles}
            columns={columns}
            keyExtractor={v => v.id}
            isLoading={false}
            emptyMessage='Nessun veicolo trovato'
            size='md'
            striped
            hoverable
            rowActions={{
              enabled: true,
              mode: 'menu',
              quickActions: {
                edit: {
                  enabled: true,
                  onEdit: v => {
                    setSelectedVehicle(v);
                    setEditModalOpen(true);
                  },
                },
              },
              actions: v => [
                {
                  id: 'change-status',
                  label: 'Cambia stato',
                  icon: <RefreshCcw className='w-4 h-4' />,
                  onClick: () => {
                    setSelectedVehicle(v);
                    setStatusModalOpen(true);
                  },
                  divider: true,
                },
                ...(v.status !== 'decommissioned'
                  ? [
                      {
                        id: 'decommission',
                        label: 'Dismetti veicolo',
                        icon: <Ban className='w-4 h-4' />,
                        onClick: () => {
                          setSelectedVehicle(v);
                          setDecommissionModalOpen(true);
                        },
                        variant: 'danger' as const,
                      },
                    ]
                  : []),
              ],
            }}
          />

          <div className='bg-bg-secondary px-4 py-2 flex items-center justify-between border-t border-border-default'>
            <div className='text-sm text-text-secondary'>
              Pagina <span className='font-medium text-text-primary'>{pagination.page}</span> di{' '}
              <span className='font-medium text-text-primary'>{pagination.totalPages || 1}</span>
              {' · '}
              <span className='font-medium text-text-primary'>{pagination.total}</span> veicoli
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

      <CreateVehicleModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onConfirm={handleCreate}
        loading={actionLoading}
      />

      <EditVehicleModal
        isOpen={editModalOpen}
        onClose={() => closeAndClearSelection(() => setEditModalOpen(false))}
        onConfirm={handleEdit}
        vehicle={selectedVehicle}
        loading={actionLoading}
      />

      <ChangeVehicleStatusModal
        isOpen={statusModalOpen}
        onClose={() => closeAndClearSelection(() => setStatusModalOpen(false))}
        vehicle={selectedVehicle}
        onConfirm={handleChangeStatus}
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={decommissionModalOpen}
        onClose={() => closeAndClearSelection(() => setDecommissionModalOpen(false))}
        onConfirm={handleDecommission}
        title='Dismetti veicolo'
        message={`Dismettere ${selectedVehicle?.brand ?? ''} ${selectedVehicle?.model ?? ''}? Il veicolo passerà allo stato "Dismesso" con la data odierna. L'operazione non cancella il veicolo, resta consultabile nello storico.`}
        confirmText='Dismetti'
        cancelText='Annulla'
        variant='danger'
        isLoading={actionLoading}
      />
    </>
  );
};

export default Dotazione;
