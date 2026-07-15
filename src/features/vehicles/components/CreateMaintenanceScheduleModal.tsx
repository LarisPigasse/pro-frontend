// =============================================================================
// ASSET AZIENDALI — COMPONENT: CreateMaintenanceScheduleModal
// features/vehicles/components/CreateMaintenanceScheduleModal.tsx
// =============================================================================
//
// Creazione autonoma di una programmazione, senza dover passare da un
// intervento reale — pensata per veicoli nuovi o programmazioni pianificate
// in anticipo, come discusso.
//

import React, { useState, useRef } from 'react';
import { Modal, Button } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import { Select } from '@/core/components/form/select/Select';
import { Input } from '@/core/components/form/input/Input';
import { DatePicker } from '@/core/components/form/date-picker/DatePicker';
import { TextArea } from '@/core/components/form/textarea/TextArea';
import { toISODate } from '@/core/utils';
import { useActiveVehicles } from '../hooks/useActiveVehicles';
import { useActiveMaintenanceTypes } from '../hooks/useActiveMaintenanceTypes';
import type { CreateMaintenanceScheduleData } from '../types/vehicles.types';

interface CreateMaintenanceScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: CreateMaintenanceScheduleData) => Promise<void>;
  loading: boolean;
}

interface FormValues {
  vehicleId: string;
  maintenanceTypeId: string;
  nextKm: string;
  nextDate: Date | undefined;
  notes: string;
}

const EMPTY_FORM: FormValues = { vehicleId: '', maintenanceTypeId: '', nextKm: '', nextDate: undefined, notes: '' };

export const CreateMaintenanceScheduleModal: React.FC<CreateMaintenanceScheduleModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const { options: vehicleOptions } = useActiveVehicles();
  const { options: typeOptions } = useActiveMaintenanceTypes();
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [touched, setTouched] = useState<{ vehicleId?: boolean; maintenanceTypeId?: boolean }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const errors = {
    vehicleId: !values.vehicleId ? 'Seleziona un veicolo' : undefined,
    maintenanceTypeId: !values.maintenanceTypeId ? 'Seleziona un tipo di manutenzione' : undefined,
  };

  const resetAndClose = () => {
    setValues(EMPTY_FORM);
    setTouched({});
    setApiError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    setTouched({ vehicleId: true, maintenanceTypeId: true });
    if (errors.vehicleId || errors.maintenanceTypeId) return;

    submittingRef.current = true;
    setApiError(null);
    try {
      await onConfirm({
        vehicleId: Number(values.vehicleId),
        maintenanceTypeId: Number(values.maintenanceTypeId),
        nextKm: values.nextKm.trim() ? Number(values.nextKm) : undefined,
        nextDate: toISODate(values.nextDate),
        notes: values.notes.trim() || undefined,
      });
      resetAndClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Errore durante la creazione della programmazione');
    } finally {
      submittingRef.current = false;
    }
  };

  const footer = (
    <div className='flex items-center justify-end gap-3'>
      <Button variant='ghost' onClick={resetAndClose} disabled={loading}>
        Annulla
      </Button>
      <Button variant='primary' onClick={handleSubmit} isLoading={loading} loadingText='Creazione in corso…'>
        Crea programmazione
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title='Nuova programmazione'
      size='lg'
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
          Usa questo modulo per pianificare una manutenzione futura senza dover prima registrare un intervento — utile per
          veicoli nuovi o programmazioni decise in anticipo.
        </Alert>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <Select
            label='Veicolo'
            options={vehicleOptions}
            value={values.vehicleId}
            onValueChange={value => setValues(prev => ({ ...prev, vehicleId: value }))}
            error={touched.vehicleId ? errors.vehicleId : undefined}
          />
          <Select
            label='Tipo manutenzione'
            options={typeOptions}
            value={values.maintenanceTypeId}
            onValueChange={value => setValues(prev => ({ ...prev, maintenanceTypeId: value }))}
            error={touched.maintenanceTypeId ? errors.maintenanceTypeId : undefined}
          />

          <div className='grid grid-cols-2 gap-4'>
            <Input
              label='Al raggiungimento di (km)'
              type='number'
              value={values.nextKm}
              onChange={e => setValues(prev => ({ ...prev, nextKm: e.target.value }))}
              disabled={loading}
            />
            <DatePicker
              label='Oppure entro il'
              value={values.nextDate}
              onChange={date => setValues(prev => ({ ...prev, nextDate: date }))}
              disabled={loading}
              fullWidth
            />
          </div>

          <TextArea
            label='Note'
            value={values.notes}
            onChange={e => setValues(prev => ({ ...prev, notes: e.target.value }))}
            disabled={loading}
            minRows={2}
            maxRows={4}
            maxLength={500}
            showCharCount
          />
        </form>
      </div>
    </Modal>
  );
};

export default CreateMaintenanceScheduleModal;
