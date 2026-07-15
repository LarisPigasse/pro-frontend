// =============================================================================
// ASSET AZIENDALI — COMPONENT: WorkshopFormModal
// features/vehicles/components/WorkshopFormModal.tsx
// =============================================================================
//
// Un solo modale per creazione e modifica — a differenza di Autisti, qui i
// campi sono identici in entrambe le modalità (nessuna esclusione come
// isActive per i driver), quindi non serve un componente FormFields separato.
//

import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from '@/core/components/ui';
import { Alert } from '@/core/components/feedback';
import { Input } from '@/core/components/form/input/Input';
import { TextArea } from '@/core/components/form/textarea/TextArea';
import type { Workshop, CreateWorkshopData } from '../types/lookups.types';

interface WorkshopFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  workshop?: Workshop;
  onCreate: (data: CreateWorkshopData) => Promise<void>;
  onUpdate: (id: number, data: CreateWorkshopData) => Promise<void>;
  loading: boolean;
}

interface FormValues {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  specialization: string;
  notes: string;
}

const EMPTY_FORM: FormValues = {
  name: '',
  address: '',
  city: '',
  postalCode: '',
  phone: '',
  email: '',
  specialization: '',
  notes: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const WorkshopFormModal: React.FC<WorkshopFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  workshop,
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
    if (mode === 'edit' && workshop) {
      setValues({
        name: workshop.name,
        address: workshop.address ?? '',
        city: workshop.city ?? '',
        postalCode: workshop.postalCode ?? '',
        phone: workshop.phone ?? '',
        email: workshop.email ?? '',
        specialization: workshop.specialization ?? '',
        notes: workshop.notes ?? '',
      });
    } else {
      setValues(EMPTY_FORM);
    }
    setTouched({});
    setApiError(null);
  }, [isOpen, mode, workshop]);

  const errors: Partial<Record<keyof FormValues, string>> = {
    name: !values.name.trim() ? 'Il nome è obbligatorio' : undefined,
    email: values.email && !EMAIL_REGEX.test(values.email) ? 'Indirizzo email non valido' : undefined,
  };

  const handleChange = (field: keyof FormValues, value: string) => setValues(prev => ({ ...prev, [field]: value }));
  const handleBlur = (field: keyof FormValues) => setTouched(prev => ({ ...prev, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    setTouched({ name: true, email: true });
    if (errors.name || errors.email) return;

    const payload: CreateWorkshopData = {
      name: values.name.trim(),
      address: values.address.trim() || undefined,
      city: values.city.trim() || undefined,
      postalCode: values.postalCode.trim() || undefined,
      phone: values.phone.trim() || undefined,
      email: values.email.trim() || undefined,
      specialization: values.specialization.trim() || undefined,
      notes: values.notes.trim() || undefined,
    };

    submittingRef.current = true;
    setApiError(null);
    try {
      if (mode === 'create') {
        await onCreate(payload);
      } else if (workshop) {
        await onUpdate(workshop.id, payload);
      }
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Errore durante il salvataggio dell'officina");
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
        {mode === 'create' ? 'Crea officina' : 'Salva'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Nuova officina' : `Modifica — ${workshop?.name ?? ''}`}
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
            label='Nome officina'
            value={values.name}
            onChange={e => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            error={touched.name ? errors.name : undefined}
            disabled={loading}
            required
          />
          <div className='grid grid-cols-2 gap-4'>
            <Input
              label='Indirizzo'
              value={values.address}
              onChange={e => handleChange('address', e.target.value)}
              disabled={loading}
            />
            <Input label='Città' value={values.city} onChange={e => handleChange('city', e.target.value)} disabled={loading} />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <Input
              label='CAP'
              value={values.postalCode}
              onChange={e => handleChange('postalCode', e.target.value)}
              disabled={loading}
            />
            <Input
              label='Specializzazione'
              value={values.specialization}
              onChange={e => handleChange('specialization', e.target.value)}
              disabled={loading}
            />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <Input
              label='Telefono'
              value={values.phone}
              onChange={e => handleChange('phone', e.target.value)}
              disabled={loading}
            />
            <Input
              label='Email'
              type='email'
              value={values.email}
              onChange={e => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={touched.email ? errors.email : undefined}
              disabled={loading}
            />
          </div>
          <TextArea
            label='Note'
            value={values.notes}
            onChange={e => handleChange('notes', e.target.value)}
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

export default WorkshopFormModal;
