// =============================================================================
// ASSET AZIENDALI — COMPONENT: TelematicsProviderFormModal
// features/vehicles/components/TelematicsProviderFormModal.tsx
// =============================================================================
//
// ⚠️ apiKey/apiSecret sono dati sensibili: usiamo PasswordInput (già presente
// nel template, stesso componente del login) invece di un Input normale — mai
// visibili in chiaro di default, mai loggati.
//

import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import { Input, PasswordInput } from '@/core/components/form';
import { TextArea } from '@/core/components/form/textarea/TextArea';
import { Select } from '@/core/components/form/select/Select';
import type { TelematicsProvider, CreateTelematicsProviderData, TelematicsDataFormat } from '../types/lookups.types';

interface TelematicsProviderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  provider?: TelematicsProvider;
  onCreate: (data: CreateTelematicsProviderData) => Promise<void>;
  onUpdate: (id: number, data: CreateTelematicsProviderData) => Promise<void>;
  loading: boolean;
}

interface FormValues {
  name: string;
  apiEndpoint: string;
  apiKey: string;
  apiSecret: string;
  dataFormat: TelematicsDataFormat;
  pollingMinutes: string;
  notes: string;
}

const EMPTY_FORM: FormValues = {
  name: '',
  apiEndpoint: '',
  apiKey: '',
  apiSecret: '',
  dataFormat: 'json',
  pollingMinutes: '15',
  notes: '',
};

const FORMAT_OPTIONS = [
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
];

/** Segnaposto — non rappresenta mai il valore reale, serve solo a indicare "già configurato" senza mostrarlo */
const MASKED_PLACEHOLDER = '••••••••••••';

export const TelematicsProviderFormModal: React.FC<TelematicsProviderFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  provider,
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
    if (mode === 'edit' && provider) {
      setValues({
        name: provider.name,
        apiEndpoint: provider.apiEndpoint ?? '',
        // Non precompiliamo mai apiKey/apiSecret con il valore reale, nemmeno in modifica —
        // l'utente li lascia vuoti per "non modificare", o ne inserisce di nuovi per sostituirli
        apiKey: '',
        apiSecret: '',
        dataFormat: provider.dataFormat,
        pollingMinutes: String(provider.pollingMinutes),
        notes: provider.notes ?? '',
      });
    } else {
      setValues(EMPTY_FORM);
    }
    setTouched({});
    setApiError(null);
  }, [isOpen, mode, provider]);

  const isValidAbsoluteUrl = (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const errors: Partial<Record<keyof FormValues, string>> = {
    name: !values.name.trim() ? 'Il nome è obbligatorio' : undefined,
    apiEndpoint:
      values.apiEndpoint.trim() && !isValidAbsoluteUrl(values.apiEndpoint.trim())
        ? 'Deve essere un URL completo, con protocollo (es. https://api.fornitore.it)'
        : undefined,
  };
  const handleBlur = (field: keyof FormValues) => setTouched(prev => ({ ...prev, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    setTouched({ name: true, apiEndpoint: true });
    if (errors.name || errors.apiEndpoint) return;

    const payload: CreateTelematicsProviderData = {
      name: values.name.trim(),
      apiEndpoint: values.apiEndpoint.trim() || undefined,
      // Campi vuoti = "non toccare" in edit (il backend ignora undefined); in create, vuoto=nessuna credenziale
      apiKey: values.apiKey.trim() || undefined,
      apiSecret: values.apiSecret.trim() || undefined,
      dataFormat: values.dataFormat,
      pollingMinutes: Number(values.pollingMinutes) || 15,
      notes: values.notes.trim() || undefined,
    };

    submittingRef.current = true;
    setApiError(null);
    try {
      if (mode === 'create') {
        await onCreate(payload);
      } else if (provider) {
        await onUpdate(provider.id, payload);
      }
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Errore durante il salvataggio del fornitore');
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
        {mode === 'create' ? 'Crea fornitore' : 'Salva'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Nuovo fornitore telematico' : `Modifica — ${provider?.name ?? ''}`}
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
          <Input
            label='Nome fornitore'
            value={values.name}
            onChange={e => setValues(prev => ({ ...prev, name: e.target.value }))}
            onBlur={() => handleBlur('name')}
            error={touched.name ? errors.name : undefined}
            disabled={loading}
            required
          />

          <Input
            label='Endpoint API'
            helperText={
              touched.apiEndpoint && errors.apiEndpoint
                ? undefined
                : 'URL completo con protocollo, es. https://api.fornitore.it'
            }
            error={touched.apiEndpoint ? errors.apiEndpoint : undefined}
            value={values.apiEndpoint}
            onChange={e => setValues(prev => ({ ...prev, apiEndpoint: e.target.value }))}
            onBlur={() => handleBlur('apiEndpoint')}
            disabled={loading}
          />

          <div className='grid grid-cols-2 gap-4'>
            <PasswordInput
              label='API Key'
              helperText={
                mode === 'edit' ? `Valore attuale: ${MASKED_PLACEHOLDER} — lascia vuoto per non modificarlo` : undefined
              }
              value={values.apiKey}
              onChange={e => setValues(prev => ({ ...prev, apiKey: e.target.value }))}
              disabled={loading}
              autoComplete='off'
            />
            <PasswordInput
              label='API Secret'
              helperText={
                mode === 'edit' ? `Valore attuale: ${MASKED_PLACEHOLDER} — lascia vuoto per non modificarlo` : undefined
              }
              value={values.apiSecret}
              onChange={e => setValues(prev => ({ ...prev, apiSecret: e.target.value }))}
              disabled={loading}
              autoComplete='off'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Select
              label='Formato dati'
              options={FORMAT_OPTIONS}
              value={values.dataFormat}
              onValueChange={value => setValues(prev => ({ ...prev, dataFormat: value as TelematicsDataFormat }))}
            />
            <Input
              label='Intervallo interrogazione (minuti)'
              type='number'
              value={values.pollingMinutes}
              onChange={e => setValues(prev => ({ ...prev, pollingMinutes: e.target.value }))}
              disabled={loading}
            />
          </div>

          <TextArea
            label='Note'
            value={values.notes}
            onChange={e => setValues(prev => ({ ...prev, notes: e.target.value }))}
            disabled={loading}
            minRows={2}
            maxRows={4}
            maxLength={500}
            showCharCount
          />
        </form>
      </div>
    </Modal>
  );
};

export default TelematicsProviderFormModal;
