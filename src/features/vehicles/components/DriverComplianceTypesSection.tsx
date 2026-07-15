// =============================================================================
// ASSET AZIENDALI — COMPONENT: DriverComplianceTypesSection
// features/vehicles/components/DriverComplianceTypesSection.tsx
// =============================================================================

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Badge, Button, ConfirmModal } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import { useLookupCrud } from '../hooks/useLookupCrud';
import { driverComplianceTypesApi } from '../api/vehicles.api';
import { LookupTable } from './LookupTable';
import { DriverComplianceTypeFormModal } from './DriverComplianceTypeFormModal';
import { DRIVER_COMPLIANCE_CATEGORY_LABELS } from '../types/vehicles.types';
import type { LookupColumn } from './LookupTable';
import type { DriverComplianceType } from '../types/vehicles.types';
import type { CreateDriverComplianceTypeData } from '../types/lookups.types';

const DEFAULT_FILTERS = { active: true, page: 1, limit: 100 };

export const DriverComplianceTypesSection: React.FC = () => {
  const { data, loading, error, submitting, create, update, toggle, remove } = useLookupCrud(
    driverComplianceTypesApi,
    DEFAULT_FILTERS
  );

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<DriverComplianceType | null>(null);
  const [typeToDelete, setTypeToDelete] = useState<DriverComplianceType | null>(null);

  const handleCreate = async (formData: CreateDriverComplianceTypeData) => {
    await create(formData);
  };

  const handleUpdate = async (id: number, formData: CreateDriverComplianceTypeData) => {
    await update(id, formData);
  };

  const handleDeleteConfirm = async () => {
    if (!typeToDelete) return;
    await remove(typeToDelete.id);
    setTypeToDelete(null);
  };

  const columns: LookupColumn<DriverComplianceType>[] = [
    {
      header: 'Tipo documento',
      sortable: true,
      sortKey: 'label',
      render: t => (
        <div className='flex flex-col'>
          <span className='font-medium text-text-primary'>{t.label}</span>
          <span className='text-xs text-text-secondary'>{t.name}</span>
        </div>
      ),
    },
    {
      header: 'Categoria',
      render: t => (
        <Badge variant='info' size='sm'>
          {DRIVER_COMPLIANCE_CATEGORY_LABELS[t.category]}
        </Badge>
      ),
    },
    {
      header: 'Scadenza',
      render: t =>
        t.hasExpiry ? (
          <span className='text-sm'>
            Avvisi: {t.alertDays1}/{t.alertDays2}/{t.alertDays3} giorni
          </span>
        ) : (
          <span className='text-sm text-text-secondary'>Nessuna scadenza</span>
        ),
    },
    {
      header: 'Rinnovabile',
      render: t =>
        t.isRenewable ? <span className='text-sm'>Sì</span> : <span className='text-sm text-text-secondary'>No</span>,
    },
  ];

  return (
    <div>
      <div className='flex items-center justify-end mb-4'>
        <Button variant='primary' leftIcon={<Plus className='w-4 h-4' />} onClick={() => setCreateModalOpen(true)}>
          Nuovo tipo documento
        </Button>
      </div>

      {error && (
        <Alert variant='danger' className='mb-4'>
          {error}
        </Alert>
      )}

      <LookupTable
        data={data}
        columns={columns}
        loading={loading}
        emptyMessage='Nessun tipo di documento registrato'
        onEdit={t => {
          setSelectedType(t);
          setEditModalOpen(true);
        }}
        onToggle={t => toggle(t.id)}
        onDelete={t => setTypeToDelete(t)}
        deleteLabel='Elimina tipo documento'
      />

      <DriverComplianceTypeFormModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        mode='create'
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        loading={submitting}
      />

      <DriverComplianceTypeFormModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedType(null);
        }}
        mode='edit'
        complianceType={selectedType ?? undefined}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        loading={submitting}
      />

      <ConfirmModal
        isOpen={typeToDelete !== null}
        onClose={() => setTypeToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title='Elimina tipo documento'
        message={`Eliminare "${typeToDelete?.label ?? ''}"? Se ci sono documenti già registrati di questo tipo per qualche autista, l'eliminazione potrebbe non essere possibile.`}
        confirmText='Elimina'
        cancelText='Annulla'
        variant='danger'
        isLoading={submitting}
      />
    </div>
  );
};

export default DriverComplianceTypesSection;
