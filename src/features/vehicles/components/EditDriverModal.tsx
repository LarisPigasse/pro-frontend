// =============================================================================
// ASSET AZIENDALI — COMPONENT: EditDriverModal
// features/vehicles/components/EditDriverModal.tsx
// =============================================================================

import React, { useState, useCallback, useEffect } from 'react';

import { Modal, Button } from '@/core/components/ui';
import Input from '@/core/components/form/input/Input';
import TextArea from '@/core/components/form/textarea/TextArea';
import DatePicker from '@/core/components/form/date-picker/DatePicker';
import Switch from '@/core/components/form/switch/Switch';
import type { DriverWithCompliance, DriverEditData } from '../types/vehicles.types';

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
  isActive:   boolean;
};

interface FormErrors {
  firstName?:  string;
  lastName?:   string;
  email?:      string;
  fiscalCode?: string;
}

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

function driverToForm(driver: DriverWithCompliance): FormData {
  return {
    firstName:  driver.firstName,
    lastName:   driver.lastName,
    email:      driver.email      ?? '',
    phone:      driver.phone      ?? '',
    birthDate:  '',
    fiscalCode: driver.fiscalCode ?? '',
    notes:      driver.notes      ?? '',
    isActive:   driver.isActive,
  };
}

// -----------------------------------------------------------------------------
// PROPS
// -----------------------------------------------------------------------------

interface EditDriverModalProps {
  driver:     DriverWithCompliance | null;
  isOpen:     boolean;
  submitting: boolean;
  onClose:    () => void;
  onSubmit:   (id: number, data: DriverEditData) => Promise<boolean>;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export const EditDriverModal: React.FC<EditDriverModalProps> = ({
  driver,
  isOpen,
  submitting,
  onClose,
  onSubmit,
}) => {
  const [form,   setForm]   = useState<FormData | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (driver && isOpen) {
      setForm(driverToForm(driver));
      setErrors({});
    }
  }, [driver, isOpen]);

  const handleChange = useCallback((field: keyof FormData, value: string | boolean) => {
    setForm(prev => prev ? { ...prev, [field]: value } : prev);
    if (typeof value === 'string') {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!driver || !form) return;
    const validation = validateForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    const payload: DriverEditData = {
      firstName:  form.firstName.trim(),
      lastName:   form.lastName.trim(),
      email:      nullIfEmpty(form.email),
      phone:      nullIfEmpty(form.phone),
      birthDate:  nullIfEmpty(form.birthDate),
      fiscalCode: nullIfEmpty(form.fiscalCode),
      notes:      nullIfEmpty(form.notes),
      isActive:   form.isActive,
    };
    try {
      await onSubmit(driver.id, payload);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore durante il salvataggio';
      setErrors({ firstName: message });
    }
  }, [driver, form, onSubmit]);

  if (!driver || !form) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Modifica autista'
      footer={
        <div className='flex justify-end gap-2'>
          <Button variant='ghost' onClick={onClose} disabled={submitting}>Annulla</Button>
          <Button variant='primary' onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Salvataggio…' : 'Salva modifiche'}
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

        {/* Stato attivo */}
        <div className='flex items-center justify-between p-3 mt-1 rounded-lg
                        border border-border-primary bg-surface-secondary/50'>
          <div>
            <p className='text-sm font-medium text-text-primary'>Autista attivo</p>
            <p className='text-xs text-text-secondary'>
              Un autista disattivato non è disponibile per nuove assegnazioni
            </p>
          </div>
          <Switch
            checked={form.isActive}
            onChange={val => handleChange('isActive', val)}
          />
        </div>

      </div>
    </Modal>
  );
};
