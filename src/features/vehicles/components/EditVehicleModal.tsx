// =============================================================================
// ASSET AZIENDALI — COMPONENT: EditVehicleModal
// features/vehicles/components/EditVehicleModal.tsx
// =============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import {
  VehicleFormFields,
  EMPTY_VEHICLE_FORM,
  vehicleToFormValues,
  validateVehicleForm,
  vehicleFormToPayload,
  type VehicleFormValues,
  type VehicleFormTouched,
} from './VehicleFormFields';
import type { Vehicle, UpdateVehicleData } from '../types/vehicles.types';

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number, data: UpdateVehicleData) => Promise<void>;
  vehicle: Vehicle | null;
  loading: boolean;
}

export const EditVehicleModal: React.FC<EditVehicleModalProps> = ({ isOpen, onClose, onConfirm, vehicle, loading }) => {
  const [values, setValues] = useState<VehicleFormValues>(EMPTY_VEHICLE_FORM);
  const [touched, setTouched] = useState<VehicleFormTouched>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (isOpen && vehicle) {
      setValues(vehicleToFormValues(vehicle));
      setTouched({});
      setApiError(null);
    }
  }, [isOpen, vehicle]);

  const errors = validateVehicleForm(values);

  const handleChange = <K extends keyof VehicleFormValues>(field: K, value: VehicleFormValues[K]) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof VehicleFormValues) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current || !vehicle) return;

    const allTouched = Object.fromEntries(Object.keys(values).map(f => [f, true])) as VehicleFormTouched;
    setTouched(allTouched);
    if (Object.keys(errors).length > 0) return;

    submittingRef.current = true;
    setApiError(null);
    try {
      await onConfirm(vehicle.id, vehicleFormToPayload(values));
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Errore durante l'aggiornamento del veicolo");
    } finally {
      submittingRef.current = false;
    }
  };

  if (!vehicle) return null;

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
      title={`Modifica veicolo — ${vehicle.brand} ${vehicle.model}`}
      size='2xl'
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

export default EditVehicleModal;
