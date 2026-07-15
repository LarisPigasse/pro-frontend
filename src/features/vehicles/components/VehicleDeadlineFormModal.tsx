// =============================================================================
// ASSET AZIENDALI — COMPONENT: VehicleDeadlineFormModal
// features/vehicles/components/VehicleDeadlineFormModal.tsx
// =============================================================================
//
// Un solo modale per creazione e rinnovo. In 'create' si sceglie veicolo e tipo
// scadenza; in 'renew' quei due campi sono fissi (mostrati in sola lettura) e
// l'unica cosa che cambia è la nuova data di scadenza — coerente con la scelta
// di design che tiene separati update generico e rinnovo nel backend.
//

import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import { Select } from '@/core/components/form/select/Select';
import { DatePicker } from '@/core/components/form/date-picker/DatePicker';
import { TextArea } from '@/core/components/form/textarea/TextArea';
import { toISODate, fromISODate } from '@/core/utils';
import { useActiveVehicles } from '../hooks/useActiveVehicles';
import { useActiveDeadlineTypes } from '../hooks/useActiveDeadlineTypes';
import type { VehicleDeadline, CreateVehicleDeadlineData, RenewVehicleDeadlineData } from '../types/vehicles.types';

interface VehicleDeadlineFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'renew';
  deadline?: VehicleDeadline;
  onCreate: (data: CreateVehicleDeadlineData) => Promise<void>;
  onRenew: (id: number, data: RenewVehicleDeadlineData) => Promise<void>;
  loading: boolean;
}

interface FormValues {
  vehicleId: string;
  deadlineTypeId: string;
  expiryDate: Date | undefined;
  lastRenewalDate: Date | undefined;
  notes: string;
}

const EMPTY_FORM: FormValues = {
  vehicleId: '',
  deadlineTypeId: '',
  expiryDate: undefined,
  lastRenewalDate: undefined,
  notes: '',
};

export const VehicleDeadlineFormModal: React.FC<VehicleDeadlineFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  deadline,
  onCreate,
  onRenew,
  loading,
}) => {
  const { options: vehicleOptions } = useActiveVehicles();
  const { options: deadlineTypeOptions } = useActiveDeadlineTypes();
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [touched, setTouched] = useState<{ vehicleId?: boolean; deadlineTypeId?: boolean; expiryDate?: boolean }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'renew' && deadline) {
      setValues({
        vehicleId: String(deadline.vehicleId),
        deadlineTypeId: String(deadline.deadlineTypeId),
        expiryDate: undefined,
        lastRenewalDate: new Date(),
        notes: '',
      });
    } else {
      setValues(EMPTY_FORM);
    }
    setTouched({});
    setApiError(null);
  }, [isOpen, mode, deadline]);

  const errors = {
    vehicleId: mode === 'create' && !values.vehicleId ? 'Seleziona un veicolo' : undefined,
    deadlineTypeId: mode === 'create' && !values.deadlineTypeId ? 'Seleziona un tipo di scadenza' : undefined,
    expiryDate: !values.expiryDate ? 'La data di scadenza è obbligatoria' : undefined,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    setTouched({ vehicleId: true, deadlineTypeId: true, expiryDate: true });
    if (errors.vehicleId || errors.deadlineTypeId || errors.expiryDate) return;

    submittingRef.current = true;
    setApiError(null);
    try {
      if (mode === 'create') {
        await onCreate({
          vehicleId: Number(values.vehicleId),
          deadlineTypeId: Number(values.deadlineTypeId),
          expiryDate: toISODate(values.expiryDate) as string,
          lastRenewalDate: toISODate(values.lastRenewalDate),
          notes: values.notes.trim() || undefined,
        });
      } else if (deadline) {
        await onRenew(deadline.id, {
          expiryDate: toISODate(values.expiryDate) as string,
          lastRenewalDate: toISODate(values.lastRenewalDate),
          notes: values.notes.trim() || undefined,
        });
      }
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Errore durante il salvataggio della scadenza');
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
        {mode === 'create' ? 'Crea scadenza' : 'Conferma rinnovo'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Nuova scadenza' : `Rinnova — ${deadline?.deadlineType.label ?? ''}`}
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

        <form onSubmit={handleSubmit} className='space-y-4'>
          {mode === 'create' ? (
            <>
              <Select
                label='Veicolo'
                options={vehicleOptions}
                value={values.vehicleId}
                onValueChange={value => setValues(prev => ({ ...prev, vehicleId: value }))}
                error={touched.vehicleId ? errors.vehicleId : undefined}
              />
              <Select
                label='Tipo di scadenza'
                options={deadlineTypeOptions}
                value={values.deadlineTypeId}
                onValueChange={value => setValues(prev => ({ ...prev, deadlineTypeId: value }))}
                error={touched.deadlineTypeId ? errors.deadlineTypeId : undefined}
              />
            </>
          ) : (
            <div className='text-sm space-y-1'>
              <div>
                <span className='text-text-secondary'>Veicolo: </span>
                <span className='font-medium text-text-primary'>
                  {deadline?.vehicle.brand} {deadline?.vehicle.model}
                  {deadline?.vehicle.plate && ` — ${deadline.vehicle.plate}`}
                </span>
              </div>
              <div>
                <span className='text-text-secondary'>Tipo: </span>
                <span className='font-medium text-text-primary'>{deadline?.deadlineType.label}</span>
              </div>
            </div>
          )}

          <div className='grid grid-cols-2 gap-4'>
            <DatePicker
              label='Nuova data scadenza'
              value={values.expiryDate}
              onChange={date => setValues(prev => ({ ...prev, expiryDate: date }))}
              onBlur={() => setTouched(prev => ({ ...prev, expiryDate: true }))}
              error={touched.expiryDate ? errors.expiryDate : undefined}
              disabled={loading}
              fullWidth
            />
            <DatePicker
              label='Data rinnovo'
              value={values.lastRenewalDate}
              onChange={date => setValues(prev => ({ ...prev, lastRenewalDate: date }))}
              maxDate={new Date()}
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

export default VehicleDeadlineFormModal;
