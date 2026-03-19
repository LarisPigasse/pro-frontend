// =============================================================================
// ASSET AZIENDALI — COMPONENT: CreateDriverModal
// features/vehicles/components/CreateDriverModal.tsx
// =============================================================================

import React, { useState, useCallback } from 'react';

import { Modal, Button } from '@/core/components/ui';
import Input from '@/core/components/form/input/Input';
import TextArea from '@/core/components/form/textarea/TextArea';
import DatePicker from '@/core/components/form/date-picker/DatePicker';
import type { DriverCreateData } from '../types/vehicles.types';

// -----------------------------------------------------------------------------
// TIPI INTERNI
// -----------------------------------------------------------------------------

type FormData = {
  firstName:  string;
  lastName:   string;
  email:      string;
  phone:      string;
  birthDate:  string;
  fiscalCode: string;
  notes:      string;
};

interface FormErrors {
  firstName?:  string;
  lastName?:   string;
  email?:      string;
  fiscalCode?: string;
}

const EMPTY_FORM: FormData = {
  firstName:  '',
  lastName:   '',
  email:      '',
  phone:      '',
  birthDate:  '',
  fiscalCode: '',
  notes:      '',
};

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.firstName.trim())
    errors.firstName = 'Il nome è obbligatorio';
  if (!data.lastName.trim())
    errors.lastName = 'Il cognome è obbligatorio';
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'Email non valida';
  if (data.fiscalCode && !/^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i.test(data.fiscalCode))
    errors.fiscalCode = 'Codice fiscale non valido';
  return errors;
}

function nullIfEmpty(value: string): string | null {
  return value.trim() === '' ? null : value.trim();
}

// -----------------------------------------------------------------------------
// PROPS
// -----------------------------------------------------------------------------

interface CreateDriverModalProps {
  isOpen:     boolean;
  submitting: boolean;
  onClose:    () => void;
  onSubmit:   (data: DriverCreateData) => Promise<boolean>;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export const CreateDriverModal: React.FC<CreateDriverModalProps> = ({
  isOpen,
  submitting,
  onClose,
  onSubmit,
}) => {
  const [form,   setForm]   = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  React.useEffect(() => {
    if (!isOpen) {
      setForm(EMPTY_FORM);
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const handleSubmit = useCallback(async () => {
    const validation = validateForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    const payload: DriverCreateData = {
      firstName:  form.firstName.trim(),
      lastName:   form.lastName.trim(),
      email:      nullIfEmpty(form.email),
      phone:      nullIfEmpty(form.phone),
      birthDate:  nullIfEmpty(form.birthDate),
      fiscalCode: nullIfEmpty(form.fiscalCode),
      notes:      nullIfEmpty(form.notes),
    };
    try {
      await onSubmit(payload);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore durante il salvataggio';
      setErrors({ firstName: message });
    }
  }, [form, onSubmit]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Nuovo autista'
      footer={
        <div className='flex justify-end gap-2'>
          <Button variant='ghost' onClick={onClose} disabled={submitting}>Annulla</Button>
          <Button variant='primary' onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Salvataggio…' : 'Salva'}
          </Button>
        </div>
      }
    >
      <div className='flex flex-col gap-2'>

        {/* Nome e Cognome */}
        <div className='grid grid-cols-2 gap-4'>
          <Input
            label='Nome'
            required
            value={form.firstName}
            onChange={e => handleChange('firstName', e.target.value)}
            error={errors.firstName}
            autoFocus
          />
          <Input
            label='Cognome'
            required
            value={form.lastName}
            onChange={e => handleChange('lastName', e.target.value)}
            error={errors.lastName}
          />
        </div>

        {/* Codice fiscale */}
        <Input
          label='Codice fiscale'
          value={form.fiscalCode}
          onChange={e => handleChange('fiscalCode', e.target.value.toUpperCase())}
          error={errors.fiscalCode}
          maxLength={16}
        />

        {/* Data di nascita */}
        <DatePicker
          value={form.birthDate}
          onChange={val => handleChange('birthDate', val)}
        />

        {/* Email e Telefono */}
        <div className='grid grid-cols-2 gap-4'>
          <Input
            label='Email'
            type='email'
            value={form.email}
            onChange={e => handleChange('email', e.target.value)}
            error={errors.email}
          />
          <Input
            label='Telefono'
            type='tel'
            value={form.phone}
            onChange={e => handleChange('phone', e.target.value)}
          />
        </div>

        {/* Note */}
        <TextArea
          value={form.notes}
          onChange={e => handleChange('notes', e.target.value)}
          rows={3}
        />

      </div>
    </Modal>
  );
};
