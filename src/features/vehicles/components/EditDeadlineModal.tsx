// =============================================================================
// ASSET AZIENDALI — COMPONENT: EditDeadlineModal
// features/vehicles/components/EditDeadlineModal.tsx
// =============================================================================
//
// Modifica "sicura": solo note e data ultimo rinnovo. Cambiare la data di
// scadenza richiede sempre il modale "Rinnova" (VehicleDeadlineFormModal),
// l'unico che ricalcola correttamente lo stato lato backend.
//

import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import { DatePicker } from '@/core/components/form/date-picker/DatePicker';
import { TextArea } from '@/core/components/form/textarea/TextArea';
import { toISODate, fromISODate } from '@/core/utils';
import type { VehicleDeadline, UpdateVehicleDeadlineData } from '../types/vehicles.types';

interface EditDeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  deadline: VehicleDeadline | null;
  onConfirm: (id: number, data: UpdateVehicleDeadlineData) => Promise<void>;
  loading: boolean;
}

export const EditDeadlineModal: React.FC<EditDeadlineModalProps> = ({ isOpen, onClose, deadline, onConfirm, loading }) => {
  const [lastRenewalDate, setLastRenewalDate] = useState<Date | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (isOpen && deadline) {
      setLastRenewalDate(fromISODate(deadline.lastRenewalDate));
      setNotes(deadline.notes ?? '');
      setApiError(null);
    }
  }, [isOpen, deadline]);

  if (!deadline) return null;

  const handleSubmit = async () => {
    if (submittingRef.current) return;

    submittingRef.current = true;
    setApiError(null);
    try {
      await onConfirm(deadline.id, {
        lastRenewalDate: toISODate(lastRenewalDate),
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Errore durante l'aggiornamento della scadenza");
    } finally {
      submittingRef.current = false;
    }
  };

  const footer = (
    <div className='flex items-center justify-end gap-3'>
      <Button variant='ghost' onClick={onClose} disabled={loading}>
        Annulla
      </Button>
      <Button variant='primary' onClick={handleSubmit} isLoading={loading} loadingText='Salvataggio in corso…'>
        Salva
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Modifica — ${deadline.deadlineType.label}`}
      size='md'
      footer={footer}
      preventClose={loading}
    >
      <div className='p-6 space-y-4'>
        {apiError && (
          <Alert variant='danger' className='mb-2'>
            {apiError}
          </Alert>
        )}

        <div className='text-sm text-text-secondary'>
          Scadenza attuale:{' '}
          <span className='font-medium text-text-primary'>{new Date(deadline.expiryDate).toLocaleDateString('it-IT')}</span> —
          per modificarla usa "Rinnova", non questo modulo.
        </div>

        <DatePicker
          label='Data ultimo rinnovo'
          value={lastRenewalDate}
          onChange={setLastRenewalDate}
          maxDate={new Date()}
          disabled={loading}
          fullWidth
        />

        <TextArea
          label='Note'
          value={notes}
          onChange={e => setNotes(e.target.value)}
          disabled={loading}
          minRows={2}
          maxRows={4}
          maxLength={500}
          showCharCount
        />
      </div>
    </Modal>
  );
};

export default EditDeadlineModal;
