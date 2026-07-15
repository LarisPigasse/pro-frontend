// =============================================================================
// ASSET AZIENDALI — COMPONENT: DeadlineTypesSection
// features/vehicles/components/DeadlineTypesSection.tsx
// =============================================================================

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Badge, Button, ConfirmModal } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import { useLookupCrud } from '../hooks/useLookupCrud';
import { useActiveVehicleCategories } from '../hooks/useActiveVehicleCategories';
import { deadlineTypesApi } from '../api/lookups.api';
import { LookupTable } from './LookupTable';
import { DeadlineTypeFormModal } from './DeadlineTypeFormModal';
import type { LookupColumn } from './LookupTable';
import type { DeadlineType, LookupListFilters, CreateDeadlineTypeData } from '../types/lookups.types';

const DEFAULT_FILTERS: LookupListFilters = { active: true, page: 1, limit: 100 };

export const DeadlineTypesSection: React.FC = () => {
  const { data, loading, error, submitting, create, update, toggle, remove } = useLookupCrud(deadlineTypesApi, DEFAULT_FILTERS);
  const { options: categoryOptions } = useActiveVehicleCategories();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<DeadlineType | null>(null);
  const [typeToDelete, setTypeToDelete] = useState<DeadlineType | null>(null);

  const handleCreate = async (formData: CreateDeadlineTypeData) => {
    await create(formData);
  };

  const handleUpdate = async (id: number, formData: CreateDeadlineTypeData) => {
    await update(id, formData);
  };

  const handleDeleteConfirm = async () => {
    if (!typeToDelete) return;
    await remove(typeToDelete.id);
    setTypeToDelete(null);
  };

  /** Da elenco di ID a etichette leggibili, per la colonna "Categorie" */
  const categoryLabelsFor = (ids: number[] | null): string => {
    if (!ids || ids.length === 0) return 'Tutte';
    const labels = ids.map(id => categoryOptions.find(o => o.value === String(id))?.label).filter(Boolean);
    return labels.length > 0 ? labels.join(', ') : 'Tutte';
  };

  const columns: LookupColumn<DeadlineType>[] = [
    {
      header: 'Tipo scadenza',
      sortable: true,
      sortKey: 'label',
      render: dt => (
        <div className='flex flex-col'>
          <span className='font-medium text-text-primary'>{dt.label}</span>
          <span className='text-xs text-text-secondary'>{dt.name}</span>
        </div>
      ),
    },
    {
      header: 'Categorie',
      render: dt => <span className='text-sm text-text-secondary'>{categoryLabelsFor(dt.appliesToCategories)}</span>,
    },
    {
      header: 'Avvisi (giorni)',
      render: dt => (
        <div className='flex gap-1'>
          <Badge variant='default' size='sm'>
            {dt.alertDays1}
          </Badge>
          <Badge variant='default' size='sm'>
            {dt.alertDays2}
          </Badge>
          <Badge variant='default' size='sm'>
            {dt.alertDays3}
          </Badge>
        </div>
      ),
    },
    {
      header: 'Ricorrenza',
      render: dt =>
        dt.isRecurring ? (
          <span className='text-sm'>Ogni {dt.recurrenceMonths} mesi</span>
        ) : (
          <span className='text-sm text-text-secondary'>Una tantum</span>
        ),
    },
  ];

  return (
    <div>
      <div className='flex items-center justify-end mb-4'>
        <Button variant='primary' leftIcon={<Plus className='w-4 h-4' />} onClick={() => setCreateModalOpen(true)}>
          Nuovo tipo scadenza
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
        emptyMessage='Nessun tipo scadenza registrato'
        onEdit={dt => {
          setSelectedType(dt);
          setEditModalOpen(true);
        }}
        onToggle={dt => toggle(dt.id)}
        onDelete={dt => setTypeToDelete(dt)}
        deleteLabel='Elimina tipo scadenza'
      />

      <DeadlineTypeFormModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        mode='create'
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        loading={submitting}
      />

      <DeadlineTypeFormModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedType(null);
        }}
        mode='edit'
        deadlineType={selectedType ?? undefined}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        loading={submitting}
      />

      <ConfirmModal
        isOpen={typeToDelete !== null}
        onClose={() => setTypeToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title='Elimina tipo scadenza'
        message={`Eliminare "${typeToDelete?.label ?? ''}"? Se ci sono scadenze già registrate di questo tipo, l'eliminazione potrebbe non essere possibile.`}
        confirmText='Elimina'
        cancelText='Annulla'
        variant='danger'
        isLoading={submitting}
      />
    </div>
  );
};

export default DeadlineTypesSection;
