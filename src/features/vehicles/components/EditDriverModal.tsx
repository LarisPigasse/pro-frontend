// =============================================================================
// ASSET AZIENDALI — COMPONENT: EditDriverModal
// features/vehicles/components/EditDriverModal.tsx
// =============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import {
  DriverFormFields,
  EMPTY_DRIVER_FORM,
  driverToFormValues,
  validateDriverForm,
  driverFormToPayload,
  type DriverFormValues,
  type DriverFormTouched,
} from './DriverFormFields';
import type { Driver, UpdateDriverData } from '../types/vehicles.types';

interface EditDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number, data: UpdateDriverData) => Promise<void>;
  driver: Driver | null;
  loading: boolean;
}

export const EditDriverModal: React.FC<EditDriverModalProps> = ({ isOpen, onClose, onConfirm, driver, loading }) => {
  const [values, setValues] = useState<DriverFormValues>(EMPTY_DRIVER_FORM);
  const [touched, setTouched] = useState<DriverFormTouched>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  // Pre-popolamento: ogni volta che il modale si apre su un autista diverso,
  // resetta valori, errori e touched — §7.9 dell'handover
  useEffect(() => {
    if (isOpen && driver) {
      setValues(driverToFormValues(driver));
      setTouched({});
      setApiError(null);
    }
  }, [isOpen, driver]);

  const errors = validateDriverForm(values);

  const handleChange = <K extends keyof DriverFormValues>(field: K, value: DriverFormValues[K]) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof DriverFormValues) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current || !driver) return;

    const allTouched = Object.fromEntries(Object.keys(values).map(f => [f, true])) as DriverFormTouched;
    setTouched(allTouched);
    if (Object.keys(errors).length > 0) return;

    submittingRef.current = true;
    setApiError(null);
    try {
      await onConfirm(driver.id, driverFormToPayload(values));
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Errore durante l'aggiornamento dell'autista");
    } finally {
      submittingRef.current = false;
    }
  };

  if (!driver) return null;

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
      title={`Modifica autista — ${driver.firstName} ${driver.lastName}`}
      size='lg'
      footer={footer}
      preventClose={loading}
    >
      <div className='p-6'>
        {apiError && (
          <Alert variant='danger' className='mb-4'>
            {apiError}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <DriverFormFields
            values={values}
            errors={errors}
            touched={touched}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
          />
        </form>
      </div>
    </Modal>
  );
};

export default EditDriverModal;
