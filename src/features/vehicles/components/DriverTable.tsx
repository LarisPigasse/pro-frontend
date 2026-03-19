// =============================================================================
// ASSET AZIENDALI — COMPONENT: DriverTable
// features/vehicles/components/DriverTable.tsx
// =============================================================================

import React from 'react';
import { Eye, Pencil, Ban } from 'lucide-react';

import Table from '@/core/components/data/table/Table';
import type { TableColumn } from '@/core/components/data/table/Table';
import { Button, Badge, ConfirmModal } from '@/core/components/ui';
import { DriverComplianceBadge } from './DriverComplianceBadge';
import type { DriverWithCompliance, DriverFilters } from '../types/vehicles.types';

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

// -----------------------------------------------------------------------------
// SUB-COMPONENT: Azioni riga
// -----------------------------------------------------------------------------

interface RowActionsProps {
  driver:       DriverWithCompliance;
  submitting:   boolean;
  onView:       (driver: DriverWithCompliance) => void;
  onEdit:       (driver: DriverWithCompliance) => void;
  onDeactivate: (id: number) => void;
}

const RowActions: React.FC<RowActionsProps> = ({ driver, submitting, onView, onEdit, onDeactivate }) => {
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  return (
    <div className='flex items-center gap-1'>
      <Button variant='ghost' size='sm' title='Visualizza dettagli' onClick={() => onView(driver)}>
        <Eye className='w-4 h-4 text-gray-500' />
      </Button>

      <Button variant='ghost' size='sm' title='Modifica' onClick={() => onEdit(driver)}>
        <Pencil className='w-4 h-4 text-blue-500' />
      </Button>

      {driver.isActive && (
        <Button variant='ghost' size='sm' title='Disattiva' onClick={() => setConfirmOpen(true)}>
          <Ban className='w-4 h-4 text-red-500' />
        </Button>
      )}

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onDeactivate(driver.id);
        }}
        title='Disattiva autista'
        message={`Vuoi disattivare ${driver.firstName} ${driver.lastName}? L'autista non sarà più disponibile per nuove assegnazioni.`}
        variant='default'
        confirmText='Disattiva'
        cancelText='Annulla'
        isLoading={submitting}
        loadingText='Disattivazione…'
      />
    </div>
  );
};

// -----------------------------------------------------------------------------
// PROPS
// -----------------------------------------------------------------------------

interface DriverTableProps {
  drivers:      DriverWithCompliance[];
  loading:      boolean;
  submitting:   boolean;
  filters:      DriverFilters;
  onView:       (driver: DriverWithCompliance) => void;
  onEdit:       (driver: DriverWithCompliance) => void;
  onDeactivate: (id: number) => void;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export const DriverTable: React.FC<DriverTableProps> = ({
  drivers,
  loading,
  submitting,
  filters,
  onView,
  onEdit,
  onDeactivate,
}) => {
  // Filtro complianceStatus applicato lato client
  const visibleDrivers = React.useMemo(() => {
    if (filters.complianceStatus === 'all') return drivers;
    return drivers.filter(d => d.complianceStatus.overall === filters.complianceStatus);
  }, [drivers, filters.complianceStatus]);

  const columns: TableColumn<DriverWithCompliance>[] = [
    {
      header: 'Autista',
      accessor: driver => (
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center
                          flex-shrink-0 text-blue-600 text-xs font-semibold'>
            {getInitials(driver.firstName, driver.lastName)}
          </div>
          <div>
            <p className='font-medium text-text-primary'>
              {driver.firstName} {driver.lastName}
            </p>
            {driver.fiscalCode && (
              <p className='text-xs text-text-secondary font-mono'>{driver.fiscalCode}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Contatti',
      accessor: driver => (
        <div className='flex flex-col gap-0.5'>
          {driver.email && <span className='text-text-primary'>{driver.email}</span>}
          {driver.phone && <span className='text-text-secondary'>{driver.phone}</span>}
          {!driver.email && !driver.phone && <span className='text-text-secondary'>—</span>}
        </div>
      ),
    },
    {
      header: 'Patente',
      accessor: driver => (
        <div className='flex flex-col gap-0.5'>
          <span className='font-mono text-xs text-text-primary'>{driver.licenseNumber}</span>
          <span className='text-xs text-text-secondary'>Scad. {formatDate(driver.licenseExpiry)}</span>
        </div>
      ),
    },
    {
      header: 'Stato',
      accessor: driver => driver.isActive
        ? <Badge variant='success' size='sm'>Attivo</Badge>
        : <Badge variant='info'    size='sm'>Disattivato</Badge>,
    },
    {
      header: 'Conformità',
      accessor: driver => (
        <button
          onClick={() => onView(driver)}
          className='inline-flex items-center justify-center w-8 h-8 rounded-full
                     hover:bg-surface-secondary transition-colors'
          title='Vedi dettagli conformità'
          aria-label={`Conformità: ${driver.complianceStatus.overall}`}
        >
          <DriverComplianceBadge
            status={driver.complianceStatus.overall}
            variant='dot'
            tooltip={false}
          />
        </button>
      ),
      className: 'text-center',
    },
    {
      header: 'Azioni',
      accessor: driver => (
        <RowActions
          driver={driver}
          submitting={submitting}
          onView={onView}
          onEdit={onEdit}
          onDeactivate={onDeactivate}
        />
      ),
      className: 'text-right',
    },
  ];

  return (
    <Table
      data={visibleDrivers}
      columns={columns}
      keyExtractor={d => d.id.toString()}
      isLoading={loading}
      emptyMessage='Nessun autista trovato'
      size='md'
      striped
      hoverable
    />
  );
};
