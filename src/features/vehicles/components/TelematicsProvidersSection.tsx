// =============================================================================
// ASSET AZIENDALI — COMPONENT: TelematicsProvidersSection
// features/vehicles/components/TelematicsProvidersSection.tsx
// =============================================================================

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Badge, Button, ConfirmModal } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import { useLookupCrud } from '../hooks/useLookupCrud';
import { telematicsProvidersApi } from '../api/lookups.api';
import { LookupTable } from './LookupTable';
import { TelematicsProviderFormModal } from './TelematicsProviderFormModal';
import type { LookupColumn } from './LookupTable';
import type { TelematicsProvider, LookupListFilters, CreateTelematicsProviderData } from '../types/lookups.types';

const DEFAULT_FILTERS: LookupListFilters = { active: true, page: 1, limit: 100 };

export const TelematicsProvidersSection: React.FC = () => {
  const { data, loading, error, submitting, create, update, toggle, remove } = useLookupCrud(
    telematicsProvidersApi,
    DEFAULT_FILTERS
  );

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<TelematicsProvider | null>(null);
  const [providerToDelete, setProviderToDelete] = useState<TelematicsProvider | null>(null);

  const handleCreate = async (formData: CreateTelematicsProviderData) => {
    await create(formData);
  };

  const handleUpdate = async (id: number, formData: CreateTelematicsProviderData) => {
    await update(id, formData);
  };

  const handleDeleteConfirm = async () => {
    if (!providerToDelete) return;
    await remove(providerToDelete.id);
    setProviderToDelete(null);
  };

  const columns: LookupColumn<TelematicsProvider>[] = [
    {
      header: 'Fornitore',
      sortable: true,
      sortKey: 'name',
      render: p => (
        <div className='flex flex-col'>
          <span className='font-medium text-text-primary'>{p.name}</span>
          {p.apiEndpoint && <span className='text-xs text-text-secondary truncate max-w-xs'>{p.apiEndpoint}</span>}
        </div>
      ),
    },
    {
      header: 'Credenziali',
      render: p => (
        <Badge variant={p.apiKey ? 'success' : 'default'} size='sm'>
          {p.apiKey ? 'Configurata' : 'Non configurata'}
        </Badge>
      ),
    },
    {
      header: 'Formato',
      render: p => <span className='text-sm uppercase'>{p.dataFormat}</span>,
    },
    {
      header: 'Interrogazione',
      render: p => <span className='text-sm'>ogni {p.pollingMinutes} min</span>,
    },
  ];

  return (
    <div>
      <div className='flex items-center justify-end mb-4'>
        <Button variant='primary' leftIcon={<Plus className='w-4 h-4' />} onClick={() => setCreateModalOpen(true)}>
          Nuovo fornitore
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
        emptyMessage='Nessun fornitore telematico registrato'
        onEdit={p => {
          setSelectedProvider(p);
          setEditModalOpen(true);
        }}
        onToggle={p => toggle(p.id)}
        onDelete={p => setProviderToDelete(p)}
        deleteLabel='Elimina fornitore'
      />

      <TelematicsProviderFormModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        mode='create'
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        loading={submitting}
      />

      <TelematicsProviderFormModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedProvider(null);
        }}
        mode='edit'
        provider={selectedProvider ?? undefined}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        loading={submitting}
      />

      <ConfirmModal
        isOpen={providerToDelete !== null}
        onClose={() => setProviderToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title='Elimina fornitore'
        message={`Eliminare "${providerToDelete?.name ?? ''}"? Se ci sono veicoli già collegati a questo fornitore, l'eliminazione potrebbe non essere possibile.`}
        confirmText='Elimina'
        cancelText='Annulla'
        variant='danger'
        isLoading={submitting}
      />
    </div>
  );
};

export default TelematicsProvidersSection;
