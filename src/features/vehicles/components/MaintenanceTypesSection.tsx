// =============================================================================
// ASSET AZIENDALI — COMPONENT: MaintenanceTypesSection
// features/vehicles/components/MaintenanceTypesSection.tsx
// =============================================================================

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button, ConfirmModal } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import { useLookupCrud } from '../hooks/useLookupCrud';
import { useActiveVehicleCategories } from '../hooks/useActiveVehicleCategories';
import { maintenanceTypesApi } from '../api/lookups.api';
import { LookupTable } from './LookupTable';
import { MaintenanceTypeFormModal } from './MaintenanceTypeFormModal';
import type { LookupColumn } from './LookupTable';
import type { MaintenanceType, LookupListFilters, CreateMaintenanceTypeData } from '../types/lookups.types';

const DEFAULT_FILTERS: LookupListFilters = { active: true, page: 1, limit: 100 };

export const MaintenanceTypesSection: React.FC = () => {
  const { data, loading, error, submitting, create, update, toggle, remove } = useLookupCrud(
    maintenanceTypesApi,
    DEFAULT_FILTERS
  );
  const { options: categoryOptions } = useActiveVehicleCategories();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<MaintenanceType | null>(null);
  const [typeToDelete, setTypeToDelete] = useState<MaintenanceType | null>(null);

  const handleCreate = async (formData: CreateMaintenanceTypeData) => {
    await create(formData);
  };

  const handleUpdate = async (id: number, formData: CreateMaintenanceTypeData) => {
    await update(id, formData);
  };

  const handleDeleteConfirm = async () => {
    if (!typeToDelete) return;
    await remove(typeToDelete.id);
    setTypeToDelete(null);
  };

  const categoryLabelsFor = (ids: number[] | null): string => {
    if (!ids || ids.length === 0) return 'Tutte';
    const labels = ids.map(id => categoryOptions.find(o => o.value === String(id))?.label).filter(Boolean);
    return labels.length > 0 ? labels.join(', ') : 'Tutte';
  };

  const formatThreshold = (mt: MaintenanceType): string => {
    const parts: string[] = [];
    if (mt.kmThreshold != null) parts.push(`${mt.kmThreshold.toLocaleString('it-IT')} km`);
    if (mt.daysThreshold != null) parts.push(`${mt.daysThreshold} giorni`);
    return parts.length > 0 ? parts.join(' / ') : '—';
  };

  const columns: LookupColumn<MaintenanceType>[] = [
    {
      header: 'Tipo manutenzione',
      sortable: true,
      sortKey: 'label',
      render: mt => (
        <div className='flex flex-col'>
          <span className='font-medium text-text-primary'>{mt.label}</span>
          <span className='text-xs text-text-secondary'>{mt.name}</span>
        </div>
      ),
    },
    {
      header: 'Categorie',
      render: mt => <span className='text-sm text-text-secondary'>{categoryLabelsFor(mt.appliesToCategories)}</span>,
    },
    {
      header: 'Soglia',
      render: mt => <span className='text-sm'>{formatThreshold(mt)}</span>,
    },
  ];

  return (
    <div>
      <div className='flex items-center justify-end mb-4'>
        <Button variant='primary' leftIcon={<Plus className='w-4 h-4' />} onClick={() => setCreateModalOpen(true)}>
          Nuovo tipo manutenzione
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
        emptyMessage='Nessun tipo manutenzione registrato'
        onEdit={mt => {
          setSelectedType(mt);
          setEditModalOpen(true);
        }}
        onToggle={mt => toggle(mt.id)}
        onDelete={mt => setTypeToDelete(mt)}
        deleteLabel='Elimina tipo manutenzione'
      />

      <MaintenanceTypeFormModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        mode='create'
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        loading={submitting}
      />

      <MaintenanceTypeFormModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedType(null);
        }}
        mode='edit'
        maintenanceType={selectedType ?? undefined}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        loading={submitting}
      />

      <ConfirmModal
        isOpen={typeToDelete !== null}
        onClose={() => setTypeToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title='Elimina tipo manutenzione'
        message={`Eliminare "${typeToDelete?.label ?? ''}"? Se ci sono interventi già registrati di questo tipo, l'eliminazione potrebbe non essere possibile.`}
        confirmText='Elimina'
        cancelText='Annulla'
        variant='danger'
        isLoading={submitting}
      />
    </div>
  );
};

export default MaintenanceTypesSection;
