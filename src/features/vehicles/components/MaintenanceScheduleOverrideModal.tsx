// =============================================================================
// ASSET AZIENDALI — COMPONENT: MaintenanceScheduleOverrideModal
// features/vehicles/components/MaintenanceScheduleOverrideModal.tsx
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import { Select } from '@/core/components/form/select/Select';
import { Input } from '@/core/components/form/input/Input';
import { DatePicker } from '@/core/components/form/date-picker/DatePicker';
import { TextArea } from '@/core/components/form/textarea/TextArea';
import { toISODate, fromISODate } from '@/core/utils';
import { SCHEDULE_STATUS_LABELS } from '../types/vehicles.types';
import type { MaintenanceScheduleItem, ScheduleStatus, UpdateMaintenanceScheduleData } from '../types/vehicles.types';

interface MaintenanceScheduleOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: MaintenanceScheduleItem | null;
  onConfirm: (id: number, data: UpdateMaintenanceScheduleData) => Promise<void>;
  loading: boolean;
}

const STATUS_OPTIONS = (Object.entries(SCHEDULE_STATUS_LABELS) as [ScheduleStatus, string][]).map(([value, label]) => ({
  value,
  label,
}));

export const MaintenanceScheduleOverrideModal: React.FC<MaintenanceScheduleOverrideModalProps> = ({
  isOpen,
  onClose,
  schedule,
  onConfirm,
  loading,
}) => {
  const [nextKm, setNextKm] = useState('');
  const [nextDate, setNextDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<ScheduleStatus>('ok');
  const [notes, setNotes] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (isOpen && schedule) {
      setNextKm(schedule.nextKm != null ? String(schedule.nextKm) : '');
      setNextDate(fromISODate(schedule.nextDate));
      setStatus(schedule.status);
      setNotes(schedule.notes ?? '');
      setApiError(null);
    }
  }, [isOpen, schedule]);

  if (!schedule) return null;

  const handleSubmit = async () => {
    if (submittingRef.current) return;

    submittingRef.current = true;
    setApiError(null);
    try {
      await onConfirm(schedule.id, {
        nextKm: nextKm.trim() ? Number(nextKm) : undefined,
        nextDate: toISODate(nextDate),
        status,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Errore durante l'aggiornamento della programmazione");
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
        Salva override
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Override — ${schedule.vehicle.brand} ${schedule.vehicle.model} · ${schedule.maintenanceType.label}`}
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

        <Alert variant='info'>
          Modifica manuale della programmazione, senza registrare un intervento reale. Usala solo per correzioni eccezionali —
          normalmente la programmazione si aggiorna da sola registrando un intervento.
        </Alert>

        <div className='grid grid-cols-2 gap-4'>
          <Input
            label='Prossima manutenzione (km)'
            type='number'
            value={nextKm}
            onChange={e => setNextKm(e.target.value)}
            disabled={loading}
          />
          <DatePicker label='Oppure entro il' value={nextDate} onChange={setNextDate} disabled={loading} fullWidth />
        </div>

        <Select
          label='Stato'
          options={STATUS_OPTIONS}
          value={status}
          onValueChange={value => setStatus(value as ScheduleStatus)}
          disabled={loading}
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

export default MaintenanceScheduleOverrideModal;
