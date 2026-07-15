// =============================================================================
// ASSET AZIENDALI — COMPONENT: MaintenanceRecordFormModal
// features/vehicles/components/MaintenanceRecordFormModal.tsx
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import { Select } from '@/core/components/form/select/Select';
import { Input } from '@/core/components/form/input/Input';
import { DatePicker } from '@/core/components/form/date-picker/DatePicker';
import { TextArea } from '@/core/components/form/textarea/TextArea';
import { toISODate, fromISODate } from '@/core/utils';
import { useActiveVehicles } from '../hooks/useActiveVehicles';
import { useActiveMaintenanceTypes } from '../hooks/useActiveMaintenanceTypes';
import { useActiveWorkshops } from '../hooks/useActiveWorkshops';
import type { MaintenanceRecord, CreateMaintenanceRecordData, UpdateMaintenanceRecordData } from '../types/vehicles.types';

interface MaintenanceRecordFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  record?: MaintenanceRecord;
  onCreate: (data: CreateMaintenanceRecordData) => Promise<void>;
  onUpdate: (id: number, data: UpdateMaintenanceRecordData) => Promise<void>;
  loading: boolean;
}

interface FormValues {
  vehicleId: string;
  maintenanceTypeId: string;
  workshopId: string;
  performedAt: Date | undefined;
  kmAtService: string;
  cost: string;
  description: string;
  nextKm: string;
  nextDate: Date | undefined;
  notes: string;
}

const EMPTY_FORM: FormValues = {
  vehicleId: '',
  maintenanceTypeId: '',
  workshopId: '',
  performedAt: new Date(),
  kmAtService: '',
  cost: '',
  description: '',
  nextKm: '',
  nextDate: undefined,
  notes: '',
};

export const MaintenanceRecordFormModal: React.FC<MaintenanceRecordFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  record,
  onCreate,
  onUpdate,
  loading,
}) => {
  const { options: vehicleOptions } = useActiveVehicles();
  const { options: typeOptions } = useActiveMaintenanceTypes();
  const { options: workshopOptions } = useActiveWorkshops();
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [touched, setTouched] = useState<{ vehicleId?: boolean; maintenanceTypeId?: boolean; performedAt?: boolean }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'edit' && record) {
      setValues({
        vehicleId: String(record.vehicleId),
        maintenanceTypeId: String(record.maintenanceTypeId),
        workshopId: record.workshopId != null ? String(record.workshopId) : '',
        performedAt: fromISODate(record.performedAt),
        kmAtService: record.kmAtService != null ? String(record.kmAtService) : '',
        cost: record.cost != null ? String(record.cost) : '',
        description: record.description ?? '',
        nextKm: record.nextKm != null ? String(record.nextKm) : '',
        nextDate: fromISODate(record.nextDate),
        notes: record.notes ?? '',
      });
    } else {
      setValues(EMPTY_FORM);
    }
    setTouched({});
    setApiError(null);
  }, [isOpen, mode, record]);

  const errors = {
    vehicleId: mode === 'create' && !values.vehicleId ? 'Seleziona un veicolo' : undefined,
    maintenanceTypeId: mode === 'create' && !values.maintenanceTypeId ? 'Seleziona un tipo di manutenzione' : undefined,
    performedAt: !values.performedAt ? 'La data di intervento è obbligatoria' : undefined,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    setTouched({ vehicleId: true, maintenanceTypeId: true, performedAt: true });
    if (errors.vehicleId || errors.maintenanceTypeId || errors.performedAt) return;

    submittingRef.current = true;
    setApiError(null);
    try {
      if (mode === 'create') {
        await onCreate({
          vehicleId: Number(values.vehicleId),
          maintenanceTypeId: Number(values.maintenanceTypeId),
          workshopId: values.workshopId ? Number(values.workshopId) : undefined,
          performedAt: toISODate(values.performedAt) as string,
          kmAtService: values.kmAtService.trim() ? Number(values.kmAtService) : undefined,
          cost: values.cost.trim() ? Number(values.cost) : undefined,
          description: values.description.trim() || undefined,
          nextKm: values.nextKm.trim() ? Number(values.nextKm) : undefined,
          nextDate: toISODate(values.nextDate),
          notes: values.notes.trim() || undefined,
        });
      } else if (record) {
        await onUpdate(record.id, {
          workshopId: values.workshopId ? Number(values.workshopId) : undefined,
          performedAt: toISODate(values.performedAt),
          kmAtService: values.kmAtService.trim() ? Number(values.kmAtService) : undefined,
          cost: values.cost.trim() ? Number(values.cost) : undefined,
          description: values.description.trim() || undefined,
          nextKm: values.nextKm.trim() ? Number(values.nextKm) : undefined,
          nextDate: toISODate(values.nextDate),
          notes: values.notes.trim() || undefined,
        });
      }
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Errore durante il salvataggio dell'intervento");
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
        {mode === 'create' ? 'Registra intervento' : 'Salva'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Nuovo intervento' : 'Modifica intervento'}
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

        <form onSubmit={handleSubmit} className='space-y-4'>
          {mode === 'create' ? (
            <div className='grid grid-cols-2 gap-4'>
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
            </div>
          ) : (
            <div className='text-sm space-y-1'>
              <div>
                <span className='text-text-secondary'>Veicolo: </span>
                <span className='font-medium text-text-primary'>
                  {record?.vehicle.brand} {record?.vehicle.model}
                  {record?.vehicle.plate && ` — ${record.vehicle.plate}`}
                </span>
              </div>
              <div>
                <span className='text-text-secondary'>Tipo: </span>
                <span className='font-medium text-text-primary'>{record?.maintenanceType.label}</span>
              </div>
            </div>
          )}

          <div className='grid grid-cols-2 gap-4'>
            <DatePicker
              label='Data intervento'
              value={values.performedAt}
              onChange={date => setValues(prev => ({ ...prev, performedAt: date }))}
              onBlur={() => setTouched(prev => ({ ...prev, performedAt: true }))}
              error={touched.performedAt ? errors.performedAt : undefined}
              maxDate={new Date()}
              disabled={loading}
              fullWidth
            />
            <Select
              label='Officina'
              options={workshopOptions}
              value={values.workshopId}
              onValueChange={value => setValues(prev => ({ ...prev, workshopId: value }))}
              disabled={loading}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Input
              label="Km al momento dell'intervento"
              type='number'
              value={values.kmAtService}
              onChange={e => setValues(prev => ({ ...prev, kmAtService: e.target.value }))}
              disabled={loading}
            />
            <Input
              label='Costo (€)'
              type='number'
              value={values.cost}
              onChange={e => setValues(prev => ({ ...prev, cost: e.target.value }))}
              disabled={loading}
            />
          </div>

          <TextArea
            label='Descrizione intervento'
            value={values.description}
            onChange={e => setValues(prev => ({ ...prev, description: e.target.value }))}
            disabled={loading}
            minRows={2}
            maxRows={4}
            maxLength={1000}
            showCharCount
          />

          <div>
            <p className='text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2'>
              Prossima manutenzione prevista (facoltativo)
            </p>
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
          </div>

          <TextArea
            label='Note'
            value={values.notes}
            onChange={e => setValues(prev => ({ ...prev, notes: e.target.value }))}
            disabled={loading}
            minRows={2}
            maxRows={3}
            maxLength={500}
          />
        </form>
      </div>
    </Modal>
  );
};

export default MaintenanceRecordFormModal;
