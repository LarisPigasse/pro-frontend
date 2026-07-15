// =============================================================================
// ASSET AZIENDALI — COMPONENT: ChangeVehicleStatusModal
// features/vehicles/components/ChangeVehicleStatusModal.tsx
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Badge } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import { Select } from '@/core/components/form/select/Select';
import { TextArea } from '@/core/components/form/textarea/TextArea';
import { VEHICLE_STATUS_LABELS } from '../types/vehicles.types';
import type { Vehicle, VehicleStatus, UpdateVehicleStatusData } from '../types/vehicles.types';

interface ChangeVehicleStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onConfirm: (id: number, data: UpdateVehicleStatusData) => Promise<void>;
  loading: boolean;
}

const STATUS_OPTIONS = (Object.entries(VEHICLE_STATUS_LABELS) as [VehicleStatus, string][]).map(([value, label]) => ({
  value,
  label,
}));

const STATUS_BADGE_VARIANT: Record<VehicleStatus, 'success' | 'warning' | 'default' | 'danger'> = {
  active: 'success',
  maintenance: 'warning',
  inactive: 'default',
  decommissioned: 'danger',
};

export const ChangeVehicleStatusModal: React.FC<ChangeVehicleStatusModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onConfirm,
  loading,
}) => {
  const [newStatus, setNewStatus] = useState<VehicleStatus>('active');
  const [notes, setNotes] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (isOpen && vehicle) {
      setNewStatus(vehicle.status);
      setNotes('');
      setApiError(null);
    }
  }, [isOpen, vehicle]);

  if (!vehicle) return null;

  const isUnchanged = newStatus === vehicle.status;

  const handleSubmit = async () => {
    if (submittingRef.current || isUnchanged) return;

    submittingRef.current = true;
    setApiError(null);
    try {
      await onConfirm(vehicle.id, { status: newStatus, notes: notes.trim() || undefined });
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Errore durante il cambio di stato');
    } finally {
      submittingRef.current = false;
    }
  };

  const footer = (
    <div className='flex items-center justify-end gap-3'>
      <Button variant='ghost' onClick={onClose} disabled={loading}>
        Annulla
      </Button>
      <Button variant='primary' onClick={handleSubmit} isLoading={loading} loadingText='Aggiornamento…' disabled={isUnchanged}>
        Conferma cambio stato
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Cambia stato — ${vehicle.brand} ${vehicle.model}`}
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

        <div className='flex items-center gap-2 text-sm text-text-secondary'>
          <span>Stato attuale:</span>
          <Badge variant={STATUS_BADGE_VARIANT[vehicle.status]} size='sm'>
            {VEHICLE_STATUS_LABELS[vehicle.status]}
          </Badge>
        </div>

        <Select
          label='Nuovo stato'
          options={STATUS_OPTIONS}
          value={newStatus}
          onValueChange={value => setNewStatus(value as VehicleStatus)}
          disabled={loading}
        />

        <TextArea
          label='Note sul cambio di stato'
          helperText="Facoltativo — es. motivo dell'ingresso in manutenzione"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          disabled={loading}
          minRows={2}
          maxRows={4}
          maxLength={500}
        />

        {isUnchanged && (
          <p className='text-xs text-text-secondary italic'>Seleziona uno stato diverso da quello attuale per procedere.</p>
        )}
      </div>
    </Modal>
  );
};

export default ChangeVehicleStatusModal;
