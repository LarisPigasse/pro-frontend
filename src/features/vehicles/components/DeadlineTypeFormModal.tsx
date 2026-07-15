// =============================================================================
// ASSET AZIENDALI — COMPONENT: DeadlineTypeFormModal
// features/vehicles/components/DeadlineTypeFormModal.tsx
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import { Input } from '@/core/components/form/input/Input';
import { TextArea } from '@/core/components/form/textarea/TextArea';
import { Switch } from '@/core/components/form/switch/Switch';
import { MultiSelect } from '@/core/components/form/multi-select/MultiSelect';
import { useActiveVehicleCategories } from '../hooks/useActiveVehicleCategories';
import type { DeadlineType, CreateDeadlineTypeData } from '../types/lookups.types';

interface DeadlineTypeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  deadlineType?: DeadlineType;
  onCreate: (data: CreateDeadlineTypeData) => Promise<void>;
  onUpdate: (id: number, data: CreateDeadlineTypeData) => Promise<void>;
  loading: boolean;
}

interface FormValues {
  name: string;
  label: string;
  description: string;
  categoryIds: string[]; // MultiSelect lavora su string[] — convertito a number[] al submit
  alertDays1: string;
  alertDays2: string;
  alertDays3: string;
  isRecurring: boolean;
  recurrenceMonths: string;
  sortOrder: string;
}

const EMPTY_FORM: FormValues = {
  name: '',
  label: '',
  description: '',
  categoryIds: [],
  alertDays1: '60',
  alertDays2: '30',
  alertDays3: '15',
  isRecurring: true,
  recurrenceMonths: '12',
  sortOrder: '0',
};

export const DeadlineTypeFormModal: React.FC<DeadlineTypeFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  deadlineType,
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
    if (mode === 'edit' && deadlineType) {
      setValues({
        name: deadlineType.name,
        label: deadlineType.label,
        description: deadlineType.description ?? '',
        categoryIds: deadlineType.appliesToCategories?.map(String) ?? [],
        alertDays1: String(deadlineType.alertDays1),
        alertDays2: String(deadlineType.alertDays2),
        alertDays3: String(deadlineType.alertDays3),
        isRecurring: deadlineType.isRecurring,
        recurrenceMonths: deadlineType.recurrenceMonths != null ? String(deadlineType.recurrenceMonths) : '',
        sortOrder: String(deadlineType.sortOrder),
      });
    } else {
      setValues(EMPTY_FORM);
    }
    setTouched({});
    setApiError(null);
  }, [isOpen, mode, deadlineType]);

  const errors: Partial<Record<keyof FormValues, string>> = {
    name: !values.name.trim() ? 'Il codice identificativo è obbligatorio' : undefined,
    label: !values.label.trim() ? "L'etichetta è obbligatoria" : undefined,
    recurrenceMonths:
      values.isRecurring && !values.recurrenceMonths.trim() ? 'Obbligatorio se la scadenza è ricorrente' : undefined,
  };

  const handleBlur = (field: keyof FormValues) => setTouched(prev => ({ ...prev, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    setTouched({ name: true, label: true, recurrenceMonths: true });
    if (errors.name || errors.label || errors.recurrenceMonths) return;

    const payload: CreateDeadlineTypeData = {
      name: values.name.trim(),
      label: values.label.trim(),
      description: values.description.trim() || undefined,
      // Nessuna categoria selezionata = si applica a tutte (null lato backend, undefined nel payload di creazione)
      appliesToCategories: values.categoryIds.length > 0 ? values.categoryIds.map(Number) : undefined,
      alertDays1: Number(values.alertDays1) || 60,
      alertDays2: Number(values.alertDays2) || 30,
      alertDays3: Number(values.alertDays3) || 15,
      isRecurring: values.isRecurring,
      recurrenceMonths: values.isRecurring ? Number(values.recurrenceMonths) || undefined : undefined,
      sortOrder: Number(values.sortOrder) || 0,
    };

    submittingRef.current = true;
    setApiError(null);
    try {
      if (mode === 'create') {
        await onCreate(payload);
      } else if (deadlineType) {
        await onUpdate(deadlineType.id, payload);
      }
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Errore durante il salvataggio del tipo scadenza');
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
        {mode === 'create' ? 'Crea tipo scadenza' : 'Salva'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Nuovo tipo scadenza' : `Modifica — ${deadlineType?.label ?? ''}`}
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
              helperText='es. revisione, bollo, assicurazione'
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
            helperText='Lascia vuoto per applicare la scadenza a tutte le categorie veicolo'
            disabled={loading}
          />

          <div>
            <p className='text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2'>
              Soglie di avviso (giorni prima della scadenza)
            </p>
            <div className='grid grid-cols-3 gap-4'>
              <Input
                label='1° avviso'
                type='number'
                value={values.alertDays1}
                onChange={e => setValues(prev => ({ ...prev, alertDays1: e.target.value }))}
                disabled={loading}
              />
              <Input
                label='2° avviso'
                type='number'
                value={values.alertDays2}
                onChange={e => setValues(prev => ({ ...prev, alertDays2: e.target.value }))}
                disabled={loading}
              />
              <Input
                label='3° avviso'
                type='number'
                value={values.alertDays3}
                onChange={e => setValues(prev => ({ ...prev, alertDays3: e.target.value }))}
                disabled={loading}
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4 items-start'>
            <div className='flex items-center justify-between border border-border-default rounded-lg px-4 py-3 h-[52px]'>
              <span className='text-sm text-text-primary'>Scadenza ricorrente</span>
              <Switch
                checked={values.isRecurring}
                onCheckedChange={checked => setValues(prev => ({ ...prev, isRecurring: checked }))}
                disabled={loading}
              />
            </div>
            {values.isRecurring && (
              <Input
                label='Ricorrenza (mesi)'
                type='number'
                value={values.recurrenceMonths}
                onChange={e => setValues(prev => ({ ...prev, recurrenceMonths: e.target.value }))}
                onBlur={() => handleBlur('recurrenceMonths')}
                error={touched.recurrenceMonths ? errors.recurrenceMonths : undefined}
                disabled={loading}
              />
            )}
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

export default DeadlineTypeFormModal;
