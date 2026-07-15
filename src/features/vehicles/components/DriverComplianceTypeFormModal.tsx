// =============================================================================
// ASSET AZIENDALI — COMPONENT: DriverComplianceTypeFormModal
// features/vehicles/components/DriverComplianceTypeFormModal.tsx
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import { Input } from '@/core/components/form/input/Input';
import { TextArea } from '@/core/components/form/textarea/TextArea';
import { Select } from '@/core/components/form/select/Select';
import { Switch } from '@/core/components/form/switch/Switch';
import { DRIVER_COMPLIANCE_CATEGORY_LABELS } from '../types/vehicles.types';
import type { DriverComplianceType, DriverComplianceCategory } from '../types/vehicles.types';
import type { CreateDriverComplianceTypeData } from '../types/lookups.types';

interface DriverComplianceTypeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  complianceType?: DriverComplianceType;
  onCreate: (data: CreateDriverComplianceTypeData) => Promise<void>;
  onUpdate: (id: number, data: CreateDriverComplianceTypeData) => Promise<void>;
  loading: boolean;
}

interface FormValues {
  name: string;
  label: string;
  category: DriverComplianceCategory;
  description: string;
  hasExpiry: boolean;
  isRenewable: boolean;
  alertDays1: string;
  alertDays2: string;
  alertDays3: string;
  issuingBody: string;
  sortOrder: string;
}

const EMPTY_FORM: FormValues = {
  name: '',
  label: '',
  category: 'license',
  description: '',
  hasExpiry: true,
  isRenewable: true,
  alertDays1: '60',
  alertDays2: '30',
  alertDays3: '15',
  issuingBody: '',
  sortOrder: '0',
};

const CATEGORY_OPTIONS = (Object.entries(DRIVER_COMPLIANCE_CATEGORY_LABELS) as [DriverComplianceCategory, string][]).map(
  ([value, label]) => ({ value, label })
);

export const DriverComplianceTypeFormModal: React.FC<DriverComplianceTypeFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  complianceType,
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
    if (mode === 'edit' && complianceType) {
      setValues({
        name: complianceType.name,
        label: complianceType.label,
        category: complianceType.category,
        description: complianceType.description ?? '',
        hasExpiry: complianceType.hasExpiry,
        isRenewable: complianceType.isRenewable,
        alertDays1: complianceType.alertDays1 != null ? String(complianceType.alertDays1) : '60',
        alertDays2: complianceType.alertDays2 != null ? String(complianceType.alertDays2) : '30',
        alertDays3: complianceType.alertDays3 != null ? String(complianceType.alertDays3) : '15',
        issuingBody: complianceType.issuingBody ?? '',
        sortOrder: String(complianceType.sortOrder),
      });
    } else {
      setValues(EMPTY_FORM);
    }
    setTouched({});
    setApiError(null);
  }, [isOpen, mode, complianceType]);

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

    const payload: CreateDriverComplianceTypeData = {
      name: values.name.trim(),
      label: values.label.trim(),
      category: values.category,
      description: values.description.trim() || undefined,
      hasExpiry: values.hasExpiry,
      isRenewable: values.isRenewable,
      // Le soglie di avviso hanno senso solo se il documento ha una scadenza
      alertDays1: values.hasExpiry ? Number(values.alertDays1) || 60 : undefined,
      alertDays2: values.hasExpiry ? Number(values.alertDays2) || 30 : undefined,
      alertDays3: values.hasExpiry ? Number(values.alertDays3) || 15 : undefined,
      issuingBody: values.issuingBody.trim() || undefined,
      sortOrder: Number(values.sortOrder) || 0,
    };

    submittingRef.current = true;
    setApiError(null);
    try {
      if (mode === 'create') {
        await onCreate(payload);
      } else if (complianceType) {
        await onUpdate(complianceType.id, payload);
      }
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Errore durante il salvataggio del tipo di documento');
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
        {mode === 'create' ? 'Crea tipo documento' : 'Salva'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Nuovo tipo documento' : `Modifica — ${complianceType?.label ?? ''}`}
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
              helperText='es. patente_b, cqc_merci, idoneita_lavorativa'
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

          <Select
            label='Categoria'
            options={CATEGORY_OPTIONS}
            value={values.category}
            onValueChange={value => setValues(prev => ({ ...prev, category: value as DriverComplianceCategory }))}
          />

          <TextArea
            label='Descrizione'
            value={values.description}
            onChange={e => setValues(prev => ({ ...prev, description: e.target.value }))}
            disabled={loading}
            minRows={2}
            maxRows={3}
            maxLength={500}
          />

          <Input
            label='Ente rilasciante predefinito'
            helperText='Facoltativo — es. Motorizzazione Civile, Medico competente aziendale'
            value={values.issuingBody}
            onChange={e => setValues(prev => ({ ...prev, issuingBody: e.target.value }))}
            disabled={loading}
          />

          <div className='grid grid-cols-2 gap-4'>
            <div className='flex items-center justify-between border border-border-default rounded-lg px-4 py-3'>
              <span className='text-sm text-text-primary'>Ha una scadenza</span>
              <Switch
                checked={values.hasExpiry}
                onCheckedChange={checked => setValues(prev => ({ ...prev, hasExpiry: checked }))}
                disabled={loading}
              />
            </div>
            <div className='flex items-center justify-between border border-border-default rounded-lg px-4 py-3'>
              <span className='text-sm text-text-primary'>Rinnovabile</span>
              <Switch
                checked={values.isRenewable}
                onCheckedChange={checked => setValues(prev => ({ ...prev, isRenewable: checked }))}
                disabled={loading}
              />
            </div>
          </div>

          {values.hasExpiry && (
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
          )}

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

export default DriverComplianceTypeFormModal;
