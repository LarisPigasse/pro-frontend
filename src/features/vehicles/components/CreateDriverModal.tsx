// =============================================================================
// ASSET AZIENDALI — COMPONENT: CreateDriverModal
// features/vehicles/components/CreateDriverModal.tsx
// =============================================================================

import React, { useState, useRef } from 'react';
import { Modal, Button } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import {
  DriverFormFields,
  EMPTY_DRIVER_FORM,
  validateDriverForm,
  driverFormToPayload,
  type DriverFormValues,
  type DriverFormTouched,
} from './DriverFormFields';
import type { CreateDriverData } from '../types/vehicles.types';

interface CreateDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: CreateDriverData) => Promise<void>;
  loading: boolean;
}

const ALL_FIELDS: (keyof DriverFormValues)[] = [
  'firstName',
  'lastName',
  'fiscalCode',
  'birthDate',
  'phone',
  'email',
  'address',
  'city',
  'hireDate',
  'notes',
];

export const CreateDriverModal: React.FC<CreateDriverModalProps> = ({ isOpen, onClose, onConfirm, loading }) => {
  const [values, setValues] = useState<DriverFormValues>(EMPTY_DRIVER_FORM);
  const [touched, setTouched] = useState<DriverFormTouched>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const errors = validateDriverForm(values);

  const handleChange = <K extends keyof DriverFormValues>(field: K, value: DriverFormValues[K]) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof DriverFormValues) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const resetForm = () => {
    setValues(EMPTY_DRIVER_FORM);
    setTouched({});
    setApiError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    // Rivela tutti gli eventuali errori, anche sui campi non ancora "toccati"
    setTouched(Object.fromEntries(ALL_FIELDS.map(f => [f, true])) as DriverFormTouched);
    if (Object.keys(errors).length > 0) return;

    submittingRef.current = true;
    setApiError(null);
    try {
      await onConfirm(driverFormToPayload(values));
      resetForm();
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Errore durante la creazione dell'autista");
    } finally {
      submittingRef.current = false;
    }
  };

  const footer = (
    <div className='flex items-center justify-end gap-3'>
      <Button variant='ghost' onClick={handleClose} disabled={loading}>
        Annulla
      </Button>
      <Button variant='primary' onClick={handleSubmit} isLoading={loading} loadingText='Creazione in corso…'>
        Crea autista
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='Nuovo autista' size='lg' footer={footer} preventClose={loading}>
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

export default CreateDriverModal;
