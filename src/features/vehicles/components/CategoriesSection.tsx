// =============================================================================
// ASSET AZIENDALI — COMPONENT: CategoriesSection
// features/vehicles/components/CategoriesSection.tsx
// =============================================================================

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Badge, Button, ConfirmModal } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import { useLookupCrud } from '../hooks/useLookupCrud';
import { vehicleCategoriesApi } from '../api/lookups.api';
import { LookupTable } from './LookupTable';
import { CategoryFormModal } from './CategoryFormModal';
import type { LookupColumn } from './LookupTable';
import type { VehicleCategory, LookupListFilters, CreateVehicleCategoryData } from '../types/lookups.types';

const DEFAULT_FILTERS: LookupListFilters = { active: true, page: 1, limit: 100 };

const REGULATION_LABELS: Record<VehicleCategory['regulationType'], string> = {
  highway_code: 'Codice Strada',
  dlgs_81_08: 'D.Lgs 81/08',
  both: 'Entrambe',
};

export const CategoriesSection: React.FC = () => {
  const { data, loading, error, submitting, create, update, toggle, remove } = useLookupCrud(
    vehicleCategoriesApi,
    DEFAULT_FILTERS
  );

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<VehicleCategory | null>(null);

  const handleCreate = async (formData: CreateVehicleCategoryData) => {
    await create(formData);
  };

  const handleUpdate = async (id: number, formData: CreateVehicleCategoryData) => {
    await update(id, formData);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    await remove(categoryToDelete.id);
    setCategoryToDelete(null);
  };

  const columns: LookupColumn<VehicleCategory>[] = [
    {
      header: 'Categoria',
      sortable: true,
      sortKey: 'label',
      render: c => (
        <div className='flex flex-col'>
          <span className='font-medium text-text-primary'>{c.label}</span>
          <span className='text-xs text-text-secondary'>{c.name}</span>
        </div>
      ),
    },
    {
      header: 'Vincoli',
      render: c => (
        <div className='flex gap-1.5'>
          {c.requiresPlate && (
            <Badge variant='info' size='sm'>
              Targa
            </Badge>
          )}
          {c.requiresTachograph && (
            <Badge variant='info' size='sm'>
              Tachigrafo
            </Badge>
          )}
          {!c.requiresPlate && !c.requiresTachograph && <span className='text-text-secondary text-sm'>—</span>}
        </div>
      ),
    },
    {
      header: 'Normativa',
      render: c => <span className='text-sm'>{REGULATION_LABELS[c.regulationType]}</span>,
    },
  ];

  return (
    <div>
      <div className='flex items-center justify-end mb-4'>
        <Button variant='primary' leftIcon={<Plus className='w-4 h-4' />} onClick={() => setCreateModalOpen(true)}>
          Nuova categoria
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
        emptyMessage='Nessuna categoria registrata'
        onEdit={c => {
          setSelectedCategory(c);
          setEditModalOpen(true);
        }}
        onToggle={c => toggle(c.id)}
        onDelete={c => setCategoryToDelete(c)}
        deleteLabel='Elimina categoria'
      />

      <CategoryFormModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        mode='create'
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        loading={submitting}
      />

      <CategoryFormModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedCategory(null);
        }}
        mode='edit'
        category={selectedCategory ?? undefined}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        loading={submitting}
      />

      <ConfirmModal
        isOpen={categoryToDelete !== null}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title='Elimina categoria'
        message={`Eliminare "${categoryToDelete?.label ?? ''}"? Se ci sono veicoli già assegnati a questa categoria, l'eliminazione potrebbe non essere possibile.`}
        confirmText='Elimina'
        cancelText='Annulla'
        variant='danger'
        isLoading={submitting}
      />
    </div>
  );
};

export default CategoriesSection;
