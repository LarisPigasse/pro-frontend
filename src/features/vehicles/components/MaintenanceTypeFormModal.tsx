// =============================================================================
// ASSET AZIENDALI — COMPONENT: MaintenanceTypeFormModal
// features/vehicles/components/MaintenanceTypeFormModal.tsx
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import { Input } from '@/core/components/form/input/Input';
import { TextArea } from '@/core/components/form/textarea/TextArea';
import { MultiSelect } from '@/core/components/form/multi-select/MultiSelect';
import { useActiveVehicleCategories } from '../hooks/useActiveVehicleCategories';
import type { MaintenanceType, CreateMaintenanceTypeData } from '../types/lookups.types';

interface MaintenanceTypeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  maintenanceType?: MaintenanceType;
  onCreate: (data: CreateMaintenanceTypeData) => Promise<void>;
  onUpdate: (id: number, data: CreateMaintenanceTypeData) => Promise<void>;
  loading: boolean;
}

interface FormValues {
  name: string;
  label: string;
  description: string;
  categoryIds: string[];
  kmThreshold: string;
  daysThreshold: string;
  alertKmBefore: string;
  alertDaysBefore: string;
  sortOrder: string;
}

const EMPTY_FORM: FormValues = {
  name: '',
  label: '',
  description: '',
  categoryIds: [],
  kmThreshold: '',
  daysThreshold: '',
  alertKmBefore: '',
  alertDaysBefore: '',
  sortOrder: '0',
};

export const MaintenanceTypeFormModal: React.FC<MaintenanceTypeFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  maintenanceType,
  onCreate,
  onUpdate,
  loading,
}) => {
  const { options: categoryOptions } = useActiveVehicleCategories();
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && maintenanceType) {
      setValues({
        name: maintenanceType.name,
        label: maintenanceType.label,
        description: maintenanceType.description ?? '',
        categoryIds: maintenanceType.appliesToCategories?.map(String) ?? [],
        kmThreshold: maintenanceType.kmThreshold != null ? String(maintenanceType.kmThreshold) : '',
        daysThreshold: maintenanceType.daysThreshold != null ? String(maintenanceType.daysThreshold) : '',
        alertKmBefore: maintenanceType.alertKmBefore != null ? String(maintenanceType.alertKmBefore) : '',
        alertDaysBefore: maintenanceType.alertDaysBefore != null ? String(maintenanceType.alertDaysBefore) : '',
        sortOrder: String(maintenanceType.sortOrder),
      });
    } else {
      setValues(EMPTY_FORM);
    }
    setTouched({});
    setApiError(null);
  }, [isOpen, mode, maintenanceType]);

  const noThresholdSet = !values.kmThreshold.trim() && !values.daysThreshold.trim();

  const errors: Partial<Record<keyof FormValues, string>> = {
    name: !values.name.trim() ? 'Il codice identificativo è obbligatorio' : undefined,
    label: !values.label.trim() ? "L'etichetta è obbligatoria" : undefined,
    kmThreshold: noThresholdSet ? 'Specifica almeno una soglia (km o giorni)' : undefined,
  };

  const handleBlur = (field: keyof FormValues) => setTouched(prev => ({ ...prev, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    setTouched({ name: true, label: true, kmThreshold: true });
    if (errors.name || errors.label || errors.kmThreshold) return;

    const payload: CreateMaintenanceTypeData = {
      name: values.name.trim(),
      label: values.label.trim(),
      description: values.description.trim() || undefined,
      appliesToCategories: values.categoryIds.length > 0 ? values.categoryIds.map(Number) : undefined,
      kmThreshold: values.kmThreshold.trim() ? Number(values.kmThreshold) : undefined,
      daysThreshold: values.daysThreshold.trim() ? Number(values.daysThreshold) : undefined,
      alertKmBefore: values.alertKmBefore.trim() ? Number(values.alertKmBefore) : undefined,
      alertDaysBefore: values.alertDaysBefore.trim() ? Number(values.alertDaysBefore) : undefined,
      sortOrder: Number(values.sortOrder) || 0,
    };

    submittingRef.current = true;
    setApiError(null);
    try {
      if (mode === 'create') {
        await onCreate(payload);
      } else if (maintenanceType) {
        await onUpdate(maintenanceType.id, payload);
      }
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Errore durante il salvataggio del tipo manutenzione');
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
        {mode === 'create' ? 'Crea tipo manutenzione' : 'Salva'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Nuovo tipo manutenzione' : `Modifica — ${maintenanceType?.label ?? ''}`}
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
          <div className='grid grid-cols-2 gap-4'>
            <Input
              label='Codice identificativo'
              helperText='es. tagliando, cambio_olio, revisione_freni'
              value={values.name}
              onChange={e => setValues(prev => ({ ...prev, name: e.target.value }))}
              onBlur={() => handleBlur('name')}
              error={touched.name ? errors.name : undefined}
              disabled={loading || mode === 'edit'}
              required
            />
            <Input
              label='Etichetta visualizzata'
              value={values.label}
              onChange={e => setValues(prev => ({ ...prev, label: e.target.value }))}
              onBlur={() => handleBlur('label')}
              error={touched.label ? errors.label : undefined}
              disabled={loading}
              required
            />
          </div>

          <TextArea
            label='Descrizione'
            value={values.description}
            onChange={e => setValues(prev => ({ ...prev, description: e.target.value }))}
            disabled={loading}
            minRows={2}
            maxRows={3}
            maxLength={500}
          />

          <MultiSelect
            label='Categorie a cui si applica'
            placeholder='Tutte le categorie'
            options={categoryOptions}
            value={values.categoryIds}
            onChange={selected => setValues(prev => ({ ...prev, categoryIds: selected }))}
            helperText='Lascia vuoto per applicare la manutenzione a tutte le categorie veicolo'
            disabled={loading}
          />

          <div>
            <p className='text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2'>
              Soglia di intervento — specifica almeno una
            </p>
            <div className='grid grid-cols-2 gap-4'>
              <Input
                label='Ogni X km'
                type='number'
                value={values.kmThreshold}
                onChange={e => setValues(prev => ({ ...prev, kmThreshold: e.target.value }))}
                onBlur={() => handleBlur('kmThreshold')}
                error={touched.kmThreshold ? errors.kmThreshold : undefined}
                disabled={loading}
              />
              <Input
                label='Ogni X giorni'
                type='number'
                value={values.daysThreshold}
                onChange={e => setValues(prev => ({ ...prev, daysThreshold: e.target.value }))}
                disabled={loading}
              />
            </div>
            <p className='text-xs text-text-secondary mt-1.5'>
              Se compili entrambe, vale la soglia raggiunta per prima (es. tagliando ogni 20.000 km o 12 mesi, quale prima)
            </p>
          </div>

          <div>
            <p className='text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2'>Preavviso</p>
            <div className='grid grid-cols-2 gap-4'>
              <Input
                label='Avvisa X km prima'
                type='number'
                value={values.alertKmBefore}
                onChange={e => setValues(prev => ({ ...prev, alertKmBefore: e.target.value }))}
                disabled={loading || !values.kmThreshold.trim()}
              />
              <Input
                label='Avvisa X giorni prima'
                type='number'
                value={values.alertDaysBefore}
                onChange={e => setValues(prev => ({ ...prev, alertDaysBefore: e.target.value }))}
                disabled={loading || !values.daysThreshold.trim()}
              />
            </div>
          </div>

          <Input
            label='Ordine di visualizzazione'
            type='number'
            value={values.sortOrder}
            onChange={e => setValues(prev => ({ ...prev, sortOrder: e.target.value }))}
            disabled={loading}
          />
        </form>
      </div>
    </Modal>
  );
};

export default MaintenanceTypeFormModal;
