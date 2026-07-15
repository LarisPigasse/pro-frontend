// =============================================================================
// ASSET AZIENDALI — COMPONENT: DriverFormFields (interno, condiviso Create/Edit)
// features/vehicles/components/DriverFormFields.tsx
// =============================================================================

import React from 'react';
import { Input } from '@/core/components/form/input/Input';
import { DatePicker } from '@/core/components/form/date-picker/DatePicker';
import { TextArea } from '@/core/components/form/textarea/TextArea';
import type { CreateDriverData } from '../types/vehicles.types';
import { toISODate, fromISODate } from '@/core/utils';

// ─────────────────────────────────────────────────────────────────────────────
// Stato locale del form — birthDate/hireDate come Date (richiesto da DatePicker),
// convertiti in ISO string solo al submit
// ─────────────────────────────────────────────────────────────────────────────

export interface DriverFormValues {
  firstName: string;
  lastName: string;
  fiscalCode: string;
  birthDate: Date | undefined;
  phone: string;
  email: string;
  address: string;
  city: string;
  hireDate: Date | undefined;
  notes: string;
}

export const EMPTY_DRIVER_FORM: DriverFormValues = {
  firstName: '',
  lastName: '',
  fiscalCode: '',
  birthDate: undefined,
  phone: '',
  email: '',
  address: '',
  city: '',
  hireDate: undefined,
  notes: '',
};

export type DriverFormErrors = Partial<Record<keyof DriverFormValues, string>>;
export type DriverFormTouched = Partial<Record<keyof DriverFormValues, boolean>>;

// ─────────────────────────────────────────────────────────────────────────────
// Conversioni Date ↔ ISO string
// ─────────────────────────────────────────────────────────────────────────────

/** Autista → stato form (per pre-popolamento EditModal) */
export const driverToFormValues = (driver: {
  firstName: string;
  lastName: string;
  fiscalCode: string | null;
  birthDate: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  hireDate: string | null;
  notes: string | null;
}): DriverFormValues => ({
  firstName: driver.firstName,
  lastName: driver.lastName,
  fiscalCode: driver.fiscalCode ?? '',
  birthDate: fromISODate(driver.birthDate),
  phone: driver.phone ?? '',
  email: driver.email ?? '',
  address: driver.address ?? '',
  city: driver.city ?? '',
  hireDate: fromISODate(driver.hireDate),
  notes: driver.notes ?? '',
});

/** Stato form → payload API — stringhe vuote diventano undefined */
export const driverFormToPayload = (values: DriverFormValues): CreateDriverData => ({
  firstName: values.firstName.trim(),
  lastName: values.lastName.trim(),
  fiscalCode: values.fiscalCode.trim() || undefined,
  birthDate: toISODate(values.birthDate),
  phone: values.phone.trim() || undefined,
  email: values.email.trim() || undefined,
  address: values.address.trim() || undefined,
  city: values.city.trim() || undefined,
  hireDate: toISODate(values.hireDate),
  notes: values.notes.trim() || undefined,
});

// ─────────────────────────────────────────────────────────────────────────────
// Validazione
// ─────────────────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateDriverForm = (values: DriverFormValues): DriverFormErrors => {
  const errors: DriverFormErrors = {};
  if (!values.firstName.trim()) errors.firstName = 'Il nome è obbligatorio';
  if (!values.lastName.trim()) errors.lastName = 'Il cognome è obbligatorio';
  if (values.fiscalCode && values.fiscalCode.length !== 16) errors.fiscalCode = 'Il codice fiscale deve avere 16 caratteri';
  if (values.email && !EMAIL_REGEX.test(values.email)) errors.email = 'Indirizzo email non valido';
  return errors;
};

// ─────────────────────────────────────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────────────────────────────────────

interface DriverFormFieldsProps {
  values: DriverFormValues;
  errors: DriverFormErrors;
  touched: DriverFormTouched;
  onChange: <K extends keyof DriverFormValues>(field: K, value: DriverFormValues[K]) => void;
  onBlur: (field: keyof DriverFormValues) => void;
  disabled?: boolean;
}

export const DriverFormFields: React.FC<DriverFormFieldsProps> = ({ values, errors, touched, onChange, onBlur, disabled }) => {
  const errorFor = (field: keyof DriverFormValues): string | undefined => (touched[field] ? errors[field] : undefined);

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-2 gap-4'>
        <Input
          label='Nome'
          value={values.firstName}
          onChange={e => onChange('firstName', e.target.value)}
          onBlur={() => onBlur('firstName')}
          error={errorFor('firstName')}
          disabled={disabled}
          required
        />
        <Input
          label='Cognome'
          value={values.lastName}
          onChange={e => onChange('lastName', e.target.value)}
          onBlur={() => onBlur('lastName')}
          error={errorFor('lastName')}
          disabled={disabled}
          required
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <Input
          label='Codice fiscale'
          value={values.fiscalCode}
          onChange={e => onChange('fiscalCode', e.target.value.toUpperCase())}
          onBlur={() => onBlur('fiscalCode')}
          error={errorFor('fiscalCode')}
          disabled={disabled}
          maxLength={16}
        />
        <DatePicker
          label='Data di nascita'
          value={values.birthDate}
          onChange={date => onChange('birthDate', date)}
          maxDate={new Date()}
          disabled={disabled}
          fullWidth
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <Input label='Telefono' value={values.phone} onChange={e => onChange('phone', e.target.value)} disabled={disabled} />
        <Input
          label='Email'
          type='email'
          value={values.email}
          onChange={e => onChange('email', e.target.value)}
          onBlur={() => onBlur('email')}
          error={errorFor('email')}
          disabled={disabled}
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <Input
          label='Indirizzo'
          value={values.address}
          onChange={e => onChange('address', e.target.value)}
          disabled={disabled}
        />
        <Input label='Città' value={values.city} onChange={e => onChange('city', e.target.value)} disabled={disabled} />
      </div>

      <DatePicker
        label='Data assunzione'
        value={values.hireDate}
        onChange={date => onChange('hireDate', date)}
        disabled={disabled}
        fullWidth
      />

      <TextArea
        label='Note'
        value={values.notes}
        onChange={e => onChange('notes', e.target.value)}
        disabled={disabled}
        minRows={2}
        maxRows={5}
        maxLength={2000}
        showCharCount
      />
    </div>
  );
};

export default DriverFormFields;
