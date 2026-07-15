// =============================================================================
// ASSET AZIENDALI — COMPONENT: DriverComplianceFormModal
// features/vehicles/components/DriverComplianceFormModal.tsx
// =============================================================================
//
// Modale unico per aggiungere un nuovo documento di conformità o rinnovarne
// uno esistente. In modalità 'create' il tipo è selezionabile (solo tra quelli
// non ancora assegnati all'autista, per rispettare l'UNIQUE driver+type);
// in modalità 'renew' il tipo è fisso e la scadenza è sempre obbligatoria.
//

import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import { Select } from '@/core/components/form/select/Select';
import { Input } from '@/core/components/form/input/Input';
import { DatePicker } from '@/core/components/form/date-picker/DatePicker';
import { TextArea } from '@/core/components/form/textarea/TextArea';
import { toISODate, fromISODate } from '@/core/utils';
import { DRIVER_COMPLIANCE_CATEGORY_LABELS } from '../types/vehicles.types';
import type {
  DriverCompliance,
  DriverComplianceType,
  CreateDriverComplianceData,
  RenewDriverComplianceData,
} from '../types/vehicles.types';

interface DriverComplianceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverId: number;
  mode: 'create' | 'renew';
  /** Solo per mode='create' — già filtrati dal chiamante escludendo i tipi già assegnati */
  availableTypes: DriverComplianceType[];
  /** Richiesto per mode='renew' */
  compliance?: DriverCompliance;
  onCreate: (data: CreateDriverComplianceData) => Promise<void>;
  onRenew: (id: number, data: RenewDriverComplianceData) => Promise<void>;
  loading: boolean;
}

interface FormValues {
  typeId: string; // string per compatibilità Select — convertito a number al submit
  issuedAt: Date | undefined;
  expiresAt: Date | undefined;
  issuingBody: string;
  notes: string;
}

const EMPTY_FORM: FormValues = {
  typeId: '',
  issuedAt: new Date(), // default "oggi", modificabile
  expiresAt: undefined,
  issuingBody: '',
  notes: '',
};

export const DriverComplianceFormModal: React.FC<DriverComplianceFormModalProps> = ({
  isOpen,
  onClose,
  driverId,
  mode,
  availableTypes,
  compliance,
  onCreate,
  onRenew,
  loading,
}) => {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [touched, setTouched] = useState<{ typeId?: boolean; expiresAt?: boolean }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  // Reset ad ogni apertura — sia per una nuova aggiunta sia per un nuovo rinnovo
  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'renew' && compliance) {
      setValues({
        typeId: String(compliance.typeId),
        issuedAt: new Date(),
        expiresAt: fromISODate(compliance.expiresAt) ?? undefined,
        issuingBody: compliance.issuingBody ?? '',
        notes: '',
      });
    } else {
      setValues(EMPTY_FORM);
    }
    setTouched({});
    setApiError(null);
  }, [isOpen, mode, compliance]);

  // Tipo attualmente selezionato — determina se la scadenza è richiesta
  const selectedType: DriverComplianceType | undefined =
    mode === 'renew' ? compliance?.complianceType : availableTypes.find(t => String(t.id) === values.typeId);

  const expiresAtRequired = mode === 'renew' || selectedType?.hasExpiry === true;

  const errors = {
    typeId: mode === 'create' && !values.typeId ? 'Seleziona un tipo di documento' : undefined,
    expiresAt: expiresAtRequired && !values.expiresAt ? 'La data di scadenza è obbligatoria per questo tipo' : undefined,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    setTouched({ typeId: true, expiresAt: true });
    if (errors.typeId || errors.expiresAt) return;

    submittingRef.current = true;
    setApiError(null);
    try {
      if (mode === 'create') {
        await onCreate({
          driverId,
          typeId: Number(values.typeId),
          issuedAt: toISODate(values.issuedAt),
          expiresAt: toISODate(values.expiresAt),
          issuingBody: values.issuingBody.trim() || undefined,
          notes: values.notes.trim() || undefined,
        });
      } else if (compliance) {
        await onRenew(compliance.id, {
          issuedAt: toISODate(values.issuedAt),
          expiresAt: toISODate(values.expiresAt) as string, // validato sopra: sempre presente in renew
          issuingBody: values.issuingBody.trim() || undefined,
          notes: values.notes.trim() || undefined,
        });
      }
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Errore durante il salvataggio del documento');
    } finally {
      submittingRef.current = false;
    }
  };

  const typeOptions = availableTypes.map(t => ({ value: String(t.id), label: t.label }));

  const footer = (
    <div className='flex items-center justify-end gap-3'>
      <Button variant='ghost' onClick={onClose} disabled={loading}>
        Annulla
      </Button>
      <Button variant='primary' onClick={handleSubmit} isLoading={loading} loadingText='Salvataggio in corso…'>
        {mode === 'create' ? 'Aggiungi documento' : 'Conferma rinnovo'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Aggiungi documento' : `Rinnova — ${compliance?.complianceType?.label ?? ''}`}
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

        <form onSubmit={handleSubmit} className='space-y-4'>
          {mode === 'create' ? (
            availableTypes.length === 0 ? (
              <p className='text-sm text-text-secondary italic'>
                Tutti i tipi di documento disponibili sono già assegnati a questo autista.
              </p>
            ) : (
              <Select
                label='Tipo di documento'
                options={typeOptions}
                value={values.typeId}
                onValueChange={value => setValues(prev => ({ ...prev, typeId: value }))}
                error={touched.typeId ? errors.typeId : undefined}
              />
            )
          ) : (
            <div className='text-sm'>
              <span className='font-medium text-text-primary'>{compliance?.complianceType?.label}</span>
              {compliance?.complianceType && (
                <span className='text-text-secondary'>
                  {' '}
                  · {DRIVER_COMPLIANCE_CATEGORY_LABELS[compliance.complianceType.category]}
                </span>
              )}
            </div>
          )}

          <div className='grid grid-cols-2 gap-4'>
            <DatePicker
              label='Data emissione'
              value={values.issuedAt}
              onChange={date => setValues(prev => ({ ...prev, issuedAt: date }))}
              maxDate={new Date()}
              disabled={loading}
              fullWidth
            />
            <DatePicker
              label={`Data scadenza${expiresAtRequired ? ' *' : ' (facoltativa)'}`}
              value={values.expiresAt}
              onChange={date => setValues(prev => ({ ...prev, expiresAt: date }))}
              onBlur={() => setTouched(prev => ({ ...prev, expiresAt: true }))}
              error={touched.expiresAt ? errors.expiresAt : undefined}
              disabled={loading || (mode === 'create' && !selectedType)}
              fullWidth
            />
          </div>

          <Input
            label='Ente rilasciante'
            value={values.issuingBody}
            onChange={e => setValues(prev => ({ ...prev, issuingBody: e.target.value }))}
            disabled={loading}
          />

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

export default DriverComplianceFormModal;
