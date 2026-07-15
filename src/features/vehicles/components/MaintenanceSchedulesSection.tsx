// =============================================================================
// ASSET AZIENDALI — COMPONENT: MaintenanceSchedulesSection
// features/vehicles/components/MaintenanceSchedulesSection.tsx
// =============================================================================

import React, { useState } from 'react';
import { Plus, Settings2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, ConfirmModal } from '@/core/components/ui';
import { CreateMaintenanceScheduleModal } from './CreateMaintenanceScheduleModal';
import { Alert, Spinner } from '@/core/components/feedback';
import { Card } from '@/core/components/layout';
import { Select } from '@/core/components/form/select/Select';
import Table from '@/core/components/data/table/Table';
import type { TableColumn } from '@/core/components/data/table/Table';
import { formatDate } from '@/core/utils';

import { useMaintenanceSchedules } from '../hooks/useMaintenanceSchedules';
import { useActiveVehicles } from '../hooks/useActiveVehicles';
import { ScheduleStatusBadge } from './ScheduleStatusBadge';
import { MaintenanceScheduleOverrideModal } from './MaintenanceScheduleOverrideModal';
import { SCHEDULE_STATUS_LABELS } from '../types/vehicles.types';
import type { MaintenanceScheduleItem, ScheduleStatus } from '../types/vehicles.types';

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Tutti gli stati' },
  ...(Object.entries(SCHEDULE_STATUS_LABELS) as [ScheduleStatus, string][]).map(([value, label]) => ({ value, label })),
];

export const MaintenanceSchedulesSection: React.FC = () => {
  const {
    data: schedules,
    loading,
    error,
    filters,
    pagination,
    setFilters,
    setPage,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  } = useMaintenanceSchedules();
  const { options: vehicleOptions } = useActiveVehicles();

  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<MaintenanceScheduleItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleCreate = async (data: Parameters<typeof createSchedule>[0]) => {
    setActionLoading(true);
    try {
      await createSchedule(data);
      setCreateModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSchedule) return;
    setActionLoading(true);
    try {
      await deleteSchedule(selectedSchedule.id);
      setDeleteModalOpen(false);
      setTimeout(() => setSelectedSchedule(null), 0);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOverride = async (id: number, data: Parameters<typeof updateSchedule>[1]) => {
    setActionLoading(true);
    try {
      await updateSchedule(id, data);
      setOverrideModalOpen(false);
      setTimeout(() => setSelectedSchedule(null), 0);
    } finally {
      setActionLoading(false);
    }
  };

  const columns: TableColumn<MaintenanceScheduleItem>[] = [
    {
      header: 'Veicolo',
      accessor: 'vehicleId',
      render: s => (
        <div className='flex flex-col'>
          <span className='font-medium text-text-primary'>
            {s.vehicle.brand} {s.vehicle.model}
          </span>
          {s.vehicle.plate && <span className='text-xs text-text-secondary'>{s.vehicle.plate}</span>}
        </div>
      ),
    },
    {
      header: 'Tipo',
      accessor: 'maintenanceTypeId',
      render: s => <span className='text-sm'>{s.maintenanceType.label}</span>,
    },
    {
      header: 'Ultimo intervento',
      accessor: 'lastDate',
      render: s => (
        <span className='text-sm'>
          {formatDate(s.lastDate)}
          {s.lastKm != null && ` — ${s.lastKm.toLocaleString('it-IT')} km`}
        </span>
      ),
    },
    {
      header: 'Prossima scadenza',
      accessor: 'nextDate',
      sortable: true,
      render: s => (
        <span className='text-sm'>
          {s.nextDate ? formatDate(s.nextDate) : '—'}
          {s.nextKm != null && ` — ${s.nextKm.toLocaleString('it-IT')} km`}
        </span>
      ),
    },
    {
      header: 'Stato',
      accessor: 'status',
      sortable: true,
      render: s => <ScheduleStatusBadge status={s.status} />,
    },
  ];

  return (
    <div>
      <div className='flex items-center justify-between mb-4 gap-4'>
        <div className='flex items-center gap-3'>
          <div className='w-64'>
            <Select
              label='Veicolo'
              options={[{ value: 'all', label: 'Tutti i veicoli' }, ...vehicleOptions]}
              value={filters.vehicleId != null ? String(filters.vehicleId) : 'all'}
              onValueChange={value => setFilters({ vehicleId: value === 'all' ? undefined : Number(value) })}
            />
          </div>
          <div className='w-56'>
            <Select
              label='Stato'
              options={STATUS_FILTER_OPTIONS}
              value={filters.status ?? 'all'}
              onValueChange={value => setFilters({ status: value as ScheduleStatus | 'all' })}
            />
          </div>
        </div>
        <Button variant='primary' leftIcon={<Plus className='w-4 h-4' />} onClick={() => setCreateModalOpen(true)}>
          Nuova programmazione
        </Button>
      </div>

      {error && (
        <Alert variant='danger' className='mb-4'>
          {error}
        </Alert>
      )}

      <Alert variant='info' className='mb-4'>
        Questa tabella si aggiorna automaticamente quando registri un intervento nella tab "Interventi". Usa "Override" solo per
        correzioni manuali eccezionali.
      </Alert>

      {loading && schedules.length === 0 ? (
        <div className='flex items-center justify-center py-12'>
          <Spinner size='md' />
        </div>
      ) : (
        <Card variant='default' padding='none'>
          <Table
            data={schedules}
            columns={columns}
            keyExtractor={s => s.id}
            isLoading={false}
            emptyMessage='Nessuna programmazione presente — registra un intervento per generarne una'
            size='md'
            striped
            hoverable
            rowActions={{
              enabled: true,
              mode: 'menu',
              actions: s => [
                {
                  id: 'override',
                  label: 'Override manuale',
                  icon: <Settings2 className='w-4 h-4' />,
                  onClick: () => {
                    setSelectedSchedule(s);
                    setOverrideModalOpen(true);
                  },
                  divider: true,
                },
                {
                  id: 'delete',
                  label: 'Elimina programmazione',
                  icon: <Trash2 className='w-4 h-4' />,
                  onClick: () => {
                    setSelectedSchedule(s);
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
              <span className='font-medium text-text-primary'>{pagination.total}</span> programmazioni
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

      <MaintenanceScheduleOverrideModal
        isOpen={overrideModalOpen}
        onClose={() => {
          setOverrideModalOpen(false);
          setTimeout(() => setSelectedSchedule(null), 0);
        }}
        schedule={selectedSchedule}
        onConfirm={handleOverride}
        loading={actionLoading}
      />

      <CreateMaintenanceScheduleModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onConfirm={handleCreate}
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setTimeout(() => setSelectedSchedule(null), 0);
        }}
        onConfirm={handleDelete}
        title='Elimina programmazione'
        message={`Eliminare la programmazione per ${selectedSchedule?.vehicle.brand ?? ''} ${selectedSchedule?.vehicle.model ?? ''} — ${selectedSchedule?.maintenanceType.label ?? ''}? L'operazione non elimina eventuali interventi già registrati collegati.`}
        confirmText='Elimina'
        cancelText='Annulla'
        variant='danger'
        isLoading={actionLoading}
      />
    </div>
  );
};

export default MaintenanceSchedulesSection;
