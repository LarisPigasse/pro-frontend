// =============================================================================
// ASSET AZIENDALI — COMPONENT: CreateVehicleModal
// features/vehicles/components/CreateVehicleModal.tsx
// =============================================================================

import React, { useState, useRef } from 'react';
import { Modal, Button } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import {
  VehicleFormFields,
  EMPTY_VEHICLE_FORM,
  validateVehicleForm,
  vehicleFormToPayload,
  type VehicleFormValues,
  type VehicleFormTouched,
} from './VehicleFormFields';
import type { CreateVehicleData } from '../types/vehicles.types';

interface CreateVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: CreateVehicleData) => Promise<void>;
  loading: boolean;
}

const ALL_FIELDS: (keyof VehicleFormValues)[] = ['categoryId', 'brand', 'model', 'plate'];

export const CreateVehicleModal: React.FC<CreateVehicleModalProps> = ({ isOpen, onClose, onConfirm, loading }) => {
  const [values, setValues] = useState<VehicleFormValues>(EMPTY_VEHICLE_FORM);
  const [touched, setTouched] = useState<VehicleFormTouched>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const errors = validateVehicleForm(values);

  const handleChange = <K extends keyof VehicleFormValues>(field: K, value: VehicleFormValues[K]) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof VehicleFormValues) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const resetForm = () => {
    setValues(EMPTY_VEHICLE_FORM);
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

    setTouched(Object.fromEntries(ALL_FIELDS.map(f => [f, true])) as VehicleFormTouched);
    if (Object.keys(errors).length > 0) return;

    submittingRef.current = true;
    setApiError(null);
    try {
      await onConfirm(vehicleFormToPayload(values));
      resetForm();
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Errore durante la creazione del veicolo');
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
        Crea veicolo
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='Nuovo veicolo' size='2xl' footer={footer} preventClose={loading}>
      <div className='p-6'>
        {apiError && (
          <Alert variant='danger' className='mb-4'>
            {apiError}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <VehicleFormFields
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

export default CreateVehicleModal;
