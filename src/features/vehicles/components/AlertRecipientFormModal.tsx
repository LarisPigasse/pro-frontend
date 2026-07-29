// =============================================================================
// ASSET AZIENDALI — COMPONENT: AlertRecipientFormModal
// features/vehicles/components/AlertRecipientFormModal.tsx
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import { Input } from '@/core/components/form/input/Input';
import { Switch } from '@/core/components/form/switch/Switch';
import { MultiSelect } from '@/core/components/form/multi-select/MultiSelect';
import { useActiveDeadlineTypes } from '../hooks/useActiveDeadlineTypes';
import { useActiveMaintenanceTypes } from '../hooks/useActiveMaintenanceTypes';
import { useActiveDriverComplianceTypes } from '../hooks/useActiveDriverComplianceTypes';
import type { AlertRecipient, CreateAlertRecipientData, AlertPreferenceInput } from '../types/alertRecipients.types';

interface AlertRecipientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  recipient?: AlertRecipient;
  onCreate: (data: CreateAlertRecipientData) => Promise<void>;
  onUpdate: (id: number, data: CreateAlertRecipientData) => Promise<void>;
  loading: boolean;
}

interface FormValues {
  email: string;
  name: string;
  receivesAll: boolean;
  isActive: boolean;
  deadlineTypeIds: string[];
  maintenanceTypeIds: string[];
  complianceTypeIds: string[];
}

const EMPTY_FORM: FormValues = {
  email: '',
  name: '',
  receivesAll: false,
  isActive: true,
  deadlineTypeIds: [],
  maintenanceTypeIds: [],
  complianceTypeIds: [],
};

export const AlertRecipientFormModal: React.FC<AlertRecipientFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  recipient,
  onCreate,
  onUpdate,
  loading,
}) => {
  const { options: deadlineTypeOptions } = useActiveDeadlineTypes();
  const { options: maintenanceTypeOptions } = useActiveMaintenanceTypes();
  const { options: complianceTypeOptions } = useActiveDriverComplianceTypes();

  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [touched, setTouched] = useState<Partial<Record<'email' | 'preferences', boolean>>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && recipient) {
      setValues({
        email: recipient.email,
        name: recipient.name ?? '',
        receivesAll: recipient.receivesAll,
        isActive: recipient.isActive,
        deadlineTypeIds: recipient.preferences.filter(p => p.deadlineTypeId != null).map(p => String(p.deadlineTypeId)),
        maintenanceTypeIds: recipient.preferences
          .filter(p => p.maintenanceTypeId != null)
          .map(p => String(p.maintenanceTypeId)),
        complianceTypeIds: recipient.preferences.filter(p => p.complianceTypeId != null).map(p => String(p.complianceTypeId)),
      });
    } else {
      setValues(EMPTY_FORM);
    }
    setTouched({});
    setApiError(null);
  }, [isOpen, mode, recipient]);

  const totalSelected = values.deadlineTypeIds.length + values.maintenanceTypeIds.length + values.complianceTypeIds.length;

  const errors: Partial<Record<'email' | 'preferences', string>> = {
    email: !values.email.trim()
      ? "L'email è obbligatoria"
      : !/\S+@\S+\.\S+/.test(values.email)
        ? 'Email non valida'
        : undefined,
    preferences:
      !values.receivesAll && totalSelected === 0
        ? 'Seleziona almeno un tipo, oppure attiva "Riceve tutti gli avvisi"'
        : undefined,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    setTouched({ email: true, preferences: true });
    if (errors.email || errors.preferences) return;

    const preferences: AlertPreferenceInput[] = values.receivesAll
      ? []
      : [
          ...values.deadlineTypeIds.map(id => ({ deadlineTypeId: Number(id) })),
          ...values.maintenanceTypeIds.map(id => ({ maintenanceTypeId: Number(id) })),
          ...values.complianceTypeIds.map(id => ({ complianceTypeId: Number(id) })),
        ];

    const payload: CreateAlertRecipientData = {
      email: values.email.trim(),
      name: values.name.trim() || undefined,
      receivesAll: values.receivesAll,
      isActive: values.isActive,
      preferences,
    };

    submittingRef.current = true;
    setApiError(null);
    try {
      if (mode === 'create') {
        await onCreate(payload);
      } else if (recipient) {
        await onUpdate(recipient.id, payload);
      }
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Errore durante il salvataggio del destinatario');
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
        {mode === 'create' ? 'Crea destinatario' : 'Salva'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Nuovo destinatario' : `Modifica — ${recipient?.email ?? ''}`}
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
              label='Email'
              type='email'
              value={values.email}
              onChange={e => setValues(prev => ({ ...prev, email: e.target.value }))}
              onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
              error={touched.email ? errors.email : undefined}
              disabled={loading}
              required
            />
            <Input
              label='Nome (opzionale)'
              helperText='Per riconoscerlo facilmente, es. "Ufficio Amministrazione"'
              value={values.name}
              onChange={e => setValues(prev => ({ ...prev, name: e.target.value }))}
              disabled={loading}
            />
          </div>

          <div className='flex items-center justify-between border border-border-default rounded-lg px-4 py-3'>
            <div>
              <span className='text-sm text-text-primary'>Riceve tutti gli avvisi</span>
              <p className='text-xs text-text-secondary mt-0.5'>
                Se attivo, riceve ogni notifica indipendentemente dal tipo — la selezione sotto viene ignorata.
              </p>
            </div>
            <Switch
              checked={values.receivesAll}
              onCheckedChange={checked => setValues(prev => ({ ...prev, receivesAll: checked }))}
              disabled={loading}
            />
          </div>

          {!values.receivesAll && (
            <div className='space-y-4'>
              <MultiSelect
                label='Scadenze veicoli'
                placeholder='Nessuna selezionata'
                options={deadlineTypeOptions}
                value={values.deadlineTypeIds}
                onChange={selected => setValues(prev => ({ ...prev, deadlineTypeIds: selected }))}
                disabled={loading}
              />
              <MultiSelect
                label='Manutenzioni'
                placeholder='Nessuna selezionata'
                options={maintenanceTypeOptions}
                value={values.maintenanceTypeIds}
                onChange={selected => setValues(prev => ({ ...prev, maintenanceTypeIds: selected }))}
                disabled={loading}
              />
              <MultiSelect
                label='Conformità autisti'
                placeholder='Nessuna selezionata'
                options={complianceTypeOptions}
                value={values.complianceTypeIds}
                onChange={selected => setValues(prev => ({ ...prev, complianceTypeIds: selected }))}
                disabled={loading}
              />
              {touched.preferences && errors.preferences && <p className='text-sm text-text-error'>{errors.preferences}</p>}
            </div>
          )}

          {mode === 'edit' && (
            <div className='flex items-center justify-between border border-border-default rounded-lg px-4 py-3'>
              <span className='text-sm text-text-primary'>Attivo</span>
              <Switch
                checked={values.isActive}
                onCheckedChange={checked => setValues(prev => ({ ...prev, isActive: checked }))}
                disabled={loading}
              />
            </div>
          )}
        </form>
      </div>
    </Modal>
  );
};

export default AlertRecipientFormModal;
