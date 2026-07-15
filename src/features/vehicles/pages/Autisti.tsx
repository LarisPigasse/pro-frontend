// =============================================================================
// ASSET AZIENDALI — PAGE: Autisti
// features/vehicles/pages/Autisti.tsx
// =============================================================================

import React, { useMemo, useState } from 'react';
import { Plus, Eye, UserX, UserCheck, Ban, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Badge, ConfirmModal } from '@/core/components/ui';
import { Alert, Spinner } from '@/core/components/feedback';
import { PageHeader, Card } from '@/core/components/layout';
import Table from '@/core/components/data/table/Table';
import type { TableColumn } from '@/core/components/data/table/Table';
import { formatDate } from '@/core/utils';

import { useDrivers } from '../hooks/useDrivers';
import { useDriverCompliances } from '../hooks/useDriverCompliances';
import { useLookups } from '../hooks/useLookups';
import { DriverFilters, DriverComplianceBadge, CreateDriverModal, EditDriverModal, ViewDriverModal } from '../components';
import type { Driver, CreateDriverData, UpdateDriverData } from '../types/vehicles.types';

export const Autisti: React.FC = () => {
  const {
    data: drivers,
    loading,
    error,
    filters,
    pagination,
    setFilters,
    resetFilters,
    setPage,
    reload,
    createDriver,
    updateDriver,
    toggleDriver,
    deleteDriver,
  } = useDrivers();

  // Conformità aggregata per la colonna in tabella — batch sulla pagina corrente
  const driverIds = useMemo(() => drivers.map(d => d.id), [drivers]);
  const { summaries: complianceSummaries, reload: reloadComplianceSummaries } = useDriverCompliances(driverIds);

  // Catalogo tipi conformità — caricato una volta, passato al ViewDriverModal
  const { driverComplianceTypes } = useLookups();

  // ─── stato modali ────────────────────────────────────────────────────────

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [toggleModalOpen, setToggleModalOpen] = useState(false); // sospendi / riattiva — stesso endpoint reversibile
  const [terminateModalOpen, setTerminateModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const closeAndClearSelection = (close: () => void) => {
    close();
    setTimeout(() => setSelectedDriver(null), 0); // evita "flash" di contenuto vuoto durante l'animazione di chiusura
  };

  // ─── helpers di formattazione ───────────────────────────────────────────

  const getStatusBadge = (driver: Driver): React.ReactNode =>
    driver.isActive ? (
      <Badge variant='success' size='sm'>
        Attivo
      </Badge>
    ) : (
      <Badge variant='danger' size='sm'>
        {driver.terminationDate ? 'Cessato' : 'Sospeso'}
      </Badge>
    );

  // ─── handlers CRUD ───────────────────────────────────────────────────────

  const handleCreate = async (data: CreateDriverData) => {
    setActionLoading(true);
    try {
      await createDriver(data);
      setCreateModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (id: number, data: UpdateDriverData) => {
    setActionLoading(true);
    try {
      await updateDriver(id, data);
      closeAndClearSelection(() => setEditModalOpen(false));
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggle = async () => {
    if (!selectedDriver) return;
    setActionLoading(true);
    try {
      await toggleDriver(selectedDriver.id);
      closeAndClearSelection(() => setToggleModalOpen(false));
    } finally {
      setActionLoading(false);
    }
  };

  const handleTerminate = async () => {
    if (!selectedDriver) return;
    setActionLoading(true);
    try {
      await deleteDriver(selectedDriver.id);
      closeAndClearSelection(() => setTerminateModalOpen(false));
    } finally {
      setActionLoading(false);
    }
  };

  // ─── colonne tabella ─────────────────────────────────────────────────────

  const columns: TableColumn<Driver>[] = [
    {
      header: 'Autista',
      accessor: 'lastName',
      sortable: true,
      render: driver => (
        <div className='flex flex-col'>
          <span className='font-medium text-text-primary'>
            {driver.lastName} {driver.firstName}
          </span>
          {driver.fiscalCode && <span className='text-xs text-text-secondary'>{driver.fiscalCode}</span>}
        </div>
      ),
    },
    {
      header: 'Città',
      accessor: 'city',
      sortable: true,
      render: driver => driver.city || '—',
    },
    {
      header: 'Contatti',
      accessor: driver => (
        <div className='flex flex-col text-sm'>
          {driver.phone && <span>{driver.phone}</span>}
          {driver.email && <span className='text-text-secondary'>{driver.email}</span>}
          {!driver.phone && !driver.email && <span className='text-text-secondary'>—</span>}
        </div>
      ),
    },
    {
      header: 'Assunto il',
      accessor: 'hireDate',
      sortable: true,
      render: driver => <span className='text-sm'>{formatDate(driver.hireDate)}</span>,
    },
    {
      header: 'Conformità',
      accessor: driver => <DriverComplianceBadge summary={complianceSummaries[driver.id]} />,
    },
    {
      header: 'Stato',
      accessor: driver => getStatusBadge(driver),
    },
  ];

  // ─── render ──────────────────────────────────────────────────────────────

  return (
    <>
      <PageHeader
        title='Autisti'
        subtitle='Anagrafica autisti e conformità documentale'
        onRefresh={reload}
        isLoading={loading}
        actions={
          <Button variant='primary' leftIcon={<Plus className='w-4 h-4' />} onClick={() => setCreateModalOpen(true)}>
            Nuovo autista
          </Button>
        }
      />

      {error && (
        <Alert variant='danger' className='mb-6'>
          {error}
        </Alert>
      )}

      <DriverFilters currentFilters={filters} onApply={setFilters} onReset={resetFilters} />

      {loading && drivers.length === 0 ? (
        <div className='flex items-center justify-center py-12'>
          <Spinner size='md' />
        </div>
      ) : (
        <Card variant='default' padding='none'>
          <Table
            data={drivers}
            columns={columns}
            keyExtractor={driver => driver.id}
            isLoading={false}
            emptyMessage='Nessun autista trovato'
            size='md'
            striped
            hoverable
            rowActions={{
              enabled: true,
              mode: 'menu',
              quickActions: {
                edit: {
                  enabled: true,
                  onEdit: driver => {
                    setSelectedDriver(driver);
                    setEditModalOpen(true);
                  },
                },
              },
              actions: driver => {
                const canReactivate = !driver.isActive && !driver.terminationDate;
                const canSuspend = driver.isActive;
                const canTerminate = driver.isActive;

                return [
                  {
                    id: 'view',
                    label: 'Visualizza dettagli',
                    icon: <Eye className='w-4 h-4' />,
                    onClick: () => {
                      setSelectedDriver(driver);
                      setViewModalOpen(true);
                    },
                  },
                  ...(canSuspend
                    ? [
                        {
                          id: 'suspend',
                          label: 'Sospendi',
                          icon: <UserX className='w-4 h-4' />,
                          onClick: () => {
                            setSelectedDriver(driver);
                            setToggleModalOpen(true);
                          },
                          divider: true,
                        },
                      ]
                    : []),
                  ...(canReactivate
                    ? [
                        {
                          id: 'reactivate',
                          label: 'Riattiva',
                          icon: <UserCheck className='w-4 h-4' />,
                          onClick: () => {
                            setSelectedDriver(driver);
                            setToggleModalOpen(true);
                          },
                          divider: true,
                        },
                      ]
                    : []),
                  ...(canTerminate
                    ? [
                        {
                          id: 'terminate',
                          label: 'Cessa rapporto',
                          icon: <Ban className='w-4 h-4' />,
                          onClick: () => {
                            setSelectedDriver(driver);
                            setTerminateModalOpen(true);
                          },
                          variant: 'danger' as const,
                          divider: true,
                        },
                      ]
                    : []),
                ];
              },
            }}
          />

          {/* Paginazione */}
          <div className='bg-bg-secondary px-4 py-2 flex items-center justify-between border-t border-border-default'>
            <div className='text-sm text-text-secondary'>
              Pagina <span className='font-medium text-text-primary'>{pagination.page}</span> di{' '}
              <span className='font-medium text-text-primary'>{pagination.totalPages || 1}</span>
              {' · '}
              <span className='font-medium text-text-primary'>{pagination.total}</span> autisti
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

      <CreateDriverModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onConfirm={handleCreate}
        loading={actionLoading}
      />

      <ViewDriverModal
        isOpen={viewModalOpen}
        onClose={() => closeAndClearSelection(() => setViewModalOpen(false))}
        driver={selectedDriver}
        onEdit={() => {
          setViewModalOpen(false);
          setEditModalOpen(true);
        }}
        driverComplianceTypes={driverComplianceTypes}
        onComplianceChange={reloadComplianceSummaries}
      />

      <EditDriverModal
        isOpen={editModalOpen}
        onClose={() => closeAndClearSelection(() => setEditModalOpen(false))}
        onConfirm={handleEdit}
        driver={selectedDriver}
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={toggleModalOpen}
        onClose={() => closeAndClearSelection(() => setToggleModalOpen(false))}
        onConfirm={handleToggle}
        title={selectedDriver?.isActive ? 'Sospendi autista' : 'Riattiva autista'}
        message={
          selectedDriver?.isActive
            ? `Sospendere temporaneamente ${selectedDriver?.firstName} ${selectedDriver?.lastName}? Potrà essere riattivato in qualsiasi momento.`
            : `Riattivare ${selectedDriver?.firstName} ${selectedDriver?.lastName}?`
        }
        confirmText={selectedDriver?.isActive ? 'Sospendi' : 'Riattiva'}
        cancelText='Annulla'
        variant='default'
        isLoading={actionLoading}
      />

      <ConfirmModal
        isOpen={terminateModalOpen}
        onClose={() => closeAndClearSelection(() => setTerminateModalOpen(false))}
        onConfirm={handleTerminate}
        title='Cessa rapporto'
        message={`Cessare il rapporto con ${selectedDriver?.firstName} ${selectedDriver?.lastName}? L'operazione registra la data di cessazione ed è irreversibile dall'interfaccia.`}
        confirmText='Cessa rapporto'
        cancelText='Annulla'
        variant='danger'
        isLoading={actionLoading}
      />
    </>
  );
};

export default Autisti;
