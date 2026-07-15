// =============================================================================
// ASSET AZIENDALI — COMPONENT: WorkshopsSection
// features/vehicles/components/WorkshopsSection.tsx
// =============================================================================

import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button, ConfirmModal } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import { Input } from '@/core/components/form/input/Input';
import { useLookupCrud } from '../hooks/useLookupCrud';
import { workshopsApi } from '../api/lookups.api';
import { LookupTable } from './LookupTable';
import { WorkshopFormModal } from './WorkshopFormModal';
import type { LookupColumn } from './LookupTable';
import type { Workshop, WorkshopFilters, CreateWorkshopData } from '../types/lookups.types';

const DEFAULT_FILTERS: WorkshopFilters = { active: true, page: 1, limit: 100 };

export const WorkshopsSection: React.FC = () => {
  const { data, loading, error, submitting, create, update, toggle, remove } = useLookupCrud(workshopsApi, DEFAULT_FILTERS);

  const [searchTerm, setSearchTerm] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [workshopToDelete, setWorkshopToDelete] = useState<Workshop | null>(null);

  // Filtro client-side — dataset tipicamente piccolo, non serve un round-trip al server per un semplice testo
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(w => w.name.toLowerCase().includes(term) || w.city?.toLowerCase().includes(term));
  }, [data, searchTerm]);

  const handleCreate = async (formData: CreateWorkshopData) => {
    await create(formData);
  };

  const handleUpdate = async (id: number, formData: CreateWorkshopData) => {
    await update(id, formData);
  };

  const handleDeleteConfirm = async () => {
    if (!workshopToDelete) return;
    await remove(workshopToDelete.id);
    setWorkshopToDelete(null);
  };

  const columns: LookupColumn<Workshop>[] = [
    {
      header: 'Officina',
      sortable: true,
      sortKey: 'name',
      render: w => (
        <div className='flex flex-col'>
          <span className='font-medium text-text-primary'>{w.name}</span>
          {w.city && <span className='text-xs text-text-secondary'>{w.city}</span>}
        </div>
      ),
    },
    {
      header: 'Contatti',
      render: w => (
        <div className='flex flex-col text-sm'>
          {w.phone && <span>{w.phone}</span>}
          {w.email && <span className='text-text-secondary'>{w.email}</span>}
          {!w.phone && !w.email && <span className='text-text-secondary'>—</span>}
        </div>
      ),
    },
    {
      header: 'Specializzazione',
      render: w => w.specialization || <span className='text-text-secondary'>—</span>,
    },
  ];

  return (
    <div>
      <div className='flex items-center justify-between mb-4 gap-4'>
        <div className='w-full max-w-xs'>
          <Input label='Cerca officina' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <Button variant='primary' leftIcon={<Plus className='w-4 h-4' />} onClick={() => setCreateModalOpen(true)}>
          Nuova officina
        </Button>
      </div>

      {error && (
        <Alert variant='danger' className='mb-4'>
          {error}
        </Alert>
      )}

      <LookupTable
        data={filteredData}
        columns={columns}
        loading={loading}
        emptyMessage='Nessuna officina registrata'
        onEdit={w => {
          setSelectedWorkshop(w);
          setEditModalOpen(true);
        }}
        onToggle={w => toggle(w.id)}
        onDelete={w => setWorkshopToDelete(w)}
        deleteLabel='Elimina officina'
      />

      <WorkshopFormModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        mode='create'
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        loading={submitting}
      />

      <WorkshopFormModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedWorkshop(null);
        }}
        mode='edit'
        workshop={selectedWorkshop ?? undefined}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        loading={submitting}
      />

      <ConfirmModal
        isOpen={workshopToDelete !== null}
        onClose={() => setWorkshopToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title='Elimina officina'
        message={`Eliminare "${workshopToDelete?.name ?? ''}"? Questa operazione è irreversibile. Se l'officina è già collegata a interventi di manutenzione registrati, l'eliminazione potrebbe non essere possibile.`}
        confirmText='Elimina'
        cancelText='Annulla'
        variant='danger'
        isLoading={submitting}
      />
    </div>
  );
};

export default WorkshopsSection;
