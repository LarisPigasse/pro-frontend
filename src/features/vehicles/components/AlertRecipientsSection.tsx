// =============================================================================
// ASSET AZIENDALI — COMPONENT: AlertRecipientsSection
// features/vehicles/components/AlertRecipientsSection.tsx
// =============================================================================

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Badge, Button, ConfirmModal } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import { useAlertRecipients } from '../hooks/useAlertRecipients';
import { LookupTable } from './LookupTable';
import { AlertRecipientFormModal } from './AlertRecipientFormModal';
import type { LookupColumn } from './LookupTable';
import type { AlertRecipient, CreateAlertRecipientData } from '../types/alertRecipients.types';

export const AlertRecipientsSection: React.FC = () => {
  const { data, loading, error, submitting, createRecipient, updateRecipient, removeRecipient } = useAlertRecipients();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<AlertRecipient | null>(null);
  const [recipientToDelete, setRecipientToDelete] = useState<AlertRecipient | null>(null);

  const handleCreate = async (formData: CreateAlertRecipientData) => {
    await createRecipient(formData);
  };

  const handleUpdate = async (id: number, formData: CreateAlertRecipientData) => {
    await updateRecipient(id, formData);
  };

  const handleDeleteConfirm = async () => {
    if (!recipientToDelete) return;
    await removeRecipient(recipientToDelete.id);
    setRecipientToDelete(null);
  };

  const columns: LookupColumn<AlertRecipient>[] = [
    {
      header: 'Destinatario',
      sortable: true,
      sortKey: 'email',
      render: r => (
        <div className='flex flex-col'>
          <span className='font-medium text-text-primary'>{r.email}</span>
          {r.name && <span className='text-xs text-text-secondary'>{r.name}</span>}
        </div>
      ),
    },
    {
      header: 'Riceve',
      render: r => {
        if (r.receivesAll) {
          return (
            <Badge variant='info' size='sm'>
              Tutti gli avvisi
            </Badge>
          );
        }
        if (r.preferences.length === 0) {
          return <span className='text-xs text-text-secondary italic'>Nessuna preferenza impostata</span>;
        }
        return (
          <div className='flex flex-wrap gap-1'>
            {r.preferences.map(p => {
              const label = p.deadlineType?.label ?? p.maintenanceType?.label ?? p.complianceType?.label ?? '—';
              return (
                <Badge key={p.id} variant='default' size='sm'>
                  {label}
                </Badge>
              );
            })}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className='flex items-center justify-end mb-4'>
        <Button variant='primary' leftIcon={<Plus className='w-4 h-4' />} onClick={() => setCreateModalOpen(true)}>
          Nuovo destinatario
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
        emptyMessage='Nessun destinatario configurato'
        onEdit={r => {
          setSelectedRecipient(r);
          setEditModalOpen(true);
        }}
        onToggle={r => updateRecipient(r.id, { isActive: !r.isActive })}
        onDelete={r => setRecipientToDelete(r)}
        deleteLabel='Elimina destinatario'
      />

      <AlertRecipientFormModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        mode='create'
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        loading={submitting}
      />

      <AlertRecipientFormModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedRecipient(null);
        }}
        mode='edit'
        recipient={selectedRecipient ?? undefined}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        loading={submitting}
      />

      <ConfirmModal
        isOpen={recipientToDelete !== null}
        onClose={() => setRecipientToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title='Elimina destinatario'
        message={`Eliminare "${recipientToDelete?.email ?? ''}"? Non riceverà più alcun avviso.`}
        confirmText='Elimina'
        cancelText='Annulla'
        variant='danger'
        isLoading={submitting}
      />
    </div>
  );
};

export default AlertRecipientsSection;
