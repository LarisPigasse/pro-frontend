// =============================================================================
// ASSET AZIENDALI — COMPONENT: CategoryFormModal
// features/vehicles/components/CategoryFormModal.tsx
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import { Input } from '@/core/components/form/input/Input';
import { TextArea } from '@/core/components/form/textarea/TextArea';
import { Select } from '@/core/components/form/select/Select';
import { Switch } from '@/core/components/form/switch/Switch';
import type { VehicleCategory, CreateVehicleCategoryData, RegulationType } from '../types/lookups.types';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  category?: VehicleCategory;
  onCreate: (data: CreateVehicleCategoryData) => Promise<void>;
  onUpdate: (id: number, data: CreateVehicleCategoryData) => Promise<void>;
  loading: boolean;
}

interface FormValues {
  name: string;
  label: string;
  description: string;
  requiresPlate: boolean;
  requiresTachograph: boolean;
  regulationType: RegulationType;
  sortOrder: string;
}

const EMPTY_FORM: FormValues = {
  name: '',
  label: '',
  description: '',
  requiresPlate: true,
  requiresTachograph: false,
  regulationType: 'highway_code',
  sortOrder: '0',
};

const REGULATION_OPTIONS = [
  { value: 'highway_code', label: 'Codice della Strada' },
  { value: 'dlgs_81_08', label: 'D.Lgs 81/08 (sicurezza sul lavoro)' },
  { value: 'both', label: 'Entrambe le normative' },
];

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  category,
  onCreate,
  onUpdate,
  loading,
}) => {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && category) {
      setValues({
        name: category.name,
        label: category.label,
        description: category.description ?? '',
        requiresPlate: category.requiresPlate,
        requiresTachograph: category.requiresTachograph,
        regulationType: category.regulationType,
        sortOrder: String(category.sortOrder),
      });
    } else {
      setValues(EMPTY_FORM);
    }
    setTouched({});
    setApiError(null);
  }, [isOpen, mode, category]);

  const errors: Partial<Record<keyof FormValues, string>> = {
    name: !values.name.trim() ? 'Il codice identificativo è obbligatorio' : undefined,
    label: !values.label.trim() ? "L'etichetta è obbligatoria" : undefined,
  };

  const handleBlur = (field: keyof FormValues) => setTouched(prev => ({ ...prev, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    setTouched({ name: true, label: true });
    if (errors.name || errors.label) return;

    const payload: CreateVehicleCategoryData = {
      name: values.name.trim(),
      label: values.label.trim(),
      description: values.description.trim() || undefined,
      requiresPlate: values.requiresPlate,
      requiresTachograph: values.requiresTachograph,
      regulationType: values.regulationType,
      sortOrder: Number(values.sortOrder) || 0,
    };

    submittingRef.current = true;
    setApiError(null);
    try {
      if (mode === 'create') {
        await onCreate(payload);
      } else if (category) {
        await onUpdate(category.id, payload);
      }
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Errore durante il salvataggio della categoria');
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
        {mode === 'create' ? 'Crea categoria' : 'Salva'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Nuova categoria veicolo' : `Modifica — ${category?.label ?? ''}`}
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
              helperText='es. autocarro, furgone, muletto — usato internamente, non modificabile con spazi'
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

          <Select
            label='Normativa di riferimento'
            options={REGULATION_OPTIONS}
            value={values.regulationType}
            onValueChange={value => setValues(prev => ({ ...prev, regulationType: value as RegulationType }))}
          />

          <div className='grid grid-cols-2 gap-4 items-center'>
            <div className='flex items-center justify-between border border-border-default rounded-lg px-4 py-3'>
              <span className='text-sm text-text-primary'>Richiede targa</span>
              <Switch
                checked={values.requiresPlate}
                onCheckedChange={checked => setValues(prev => ({ ...prev, requiresPlate: checked }))}
                disabled={loading}
              />
            </div>
            <div className='flex items-center justify-between border border-border-default rounded-lg px-4 py-3'>
              <span className='text-sm text-text-primary'>Richiede tachigrafo</span>
              <Switch
                checked={values.requiresTachograph}
                onCheckedChange={checked => setValues(prev => ({ ...prev, requiresTachograph: checked }))}
                disabled={loading}
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

export default CategoryFormModal;
