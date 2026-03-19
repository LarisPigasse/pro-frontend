// =============================================================================
// VEHICLES MODULE — COMPONENT: EditVehicleModal
// features/vehicles/components/EditVehicleModal.tsx
// =============================================================================
//
// Modal form per la modifica di un veicolo esistente.
// Pre-popola il form con i dati attuali del veicolo.
// Invia solo i campi modificati (partial update via PUT).
//
// Utilizzo:
//   <EditVehicleModal
//     vehicle={modalState.vehicle}
//     isOpen={modalState.mode === 'edit'}
//     lookups={lookups}
//     submitting={submitting}
//     onClose={closeModal}
//     onSubmit={updateVehicle}
//   />
// =============================================================================

import React, { useState, useCallback, useEffect } from 'react';

import type { Vehicle, VehicleEditData, VehicleLookups } from '../types/vehicles.types';
import { Modal } from '@/core/components/ui/';
import { Button } from '@/core/components/ui/';

// -----------------------------------------------------------------------------
// PROPS
// -----------------------------------------------------------------------------

interface EditVehicleModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  lookups: VehicleLookups;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: VehicleEditData) => Promise<boolean>;
}

// -----------------------------------------------------------------------------
// STATO FORM
// -----------------------------------------------------------------------------

interface FormState {
  licensePlate: string;
  brand: string;
  model: string;
  year: string;
  vin: string;
  categoryId: string;
  statusId: string;
  fuelTypeId: string;
  currentKm: string;
  purchaseDate: string;
  notes: string;
}

interface FormErrors {
  licensePlate?: string;
  brand?: string;
  model?: string;
  categoryId?: string;
  statusId?: string;
  fuelTypeId?: string;
  currentKm?: string;
  vin?: string;
  year?: string;
  purchaseDate?: string;
}

// Converte un Vehicle nei valori stringa del form
const vehicleToForm = (vehicle: Vehicle): FormState => ({
  licensePlate: vehicle.licensePlate ?? '',
  brand: vehicle.brand ?? '',
  model: vehicle.model ?? '',
  year: vehicle.year?.toString() ?? '',
  vin: vehicle.vin ?? '',
  categoryId: vehicle.categoryId?.toString() ?? '',
  statusId: vehicle.statusId?.toString() ?? '',
  fuelTypeId: vehicle.fuelTypeId?.toString() ?? '',
  currentKm: vehicle.currentKm?.toString() ?? '0',
  purchaseDate: vehicle.purchaseDate?.substring(0, 10) ?? '', // ISO → YYYY-MM-DD
  notes: vehicle.notes ?? '',
});

// -----------------------------------------------------------------------------
// VALIDAZIONE
// -----------------------------------------------------------------------------

const validate = (form: FormState): FormErrors => {
  const errors: FormErrors = {};

  if (!form.licensePlate.trim()) errors.licensePlate = 'La targa è obbligatoria';
  else if (!/^[A-Z0-9]{5,10}$/i.test(form.licensePlate.trim())) errors.licensePlate = 'Formato targa non valido';

  if (!form.brand.trim()) errors.brand = 'La marca è obbligatoria';

  if (!form.model.trim()) errors.model = 'Il modello è obbligatorio';

  if (!form.categoryId) errors.categoryId = 'La categoria è obbligatoria';

  if (!form.statusId) errors.statusId = 'Lo status è obbligatorio';

  if (!form.fuelTypeId) errors.fuelTypeId = 'Il tipo carburante è obbligatorio';

  if (form.currentKm && isNaN(Number(form.currentKm))) errors.currentKm = 'Inserire un valore numerico valido';

  return errors;
};

// -----------------------------------------------------------------------------
// HELPERS UI (identici a CreateVehicleModal)
// -----------------------------------------------------------------------------

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, required, error, children }) => (
  <div className='flex flex-col gap-1'>
    <label className='text-xs font-medium text-text-secondary uppercase tracking-wider'>
      {label}
      {required && <span className='text-red-500 ml-0.5'>*</span>}
    </label>
    {children}
    {error && <span className='text-xs text-red-500'>{error}</span>}
  </div>
);

const inputClass = (error?: string) => `
  w-full px-3 py-2 text-sm rounded-lg border
  bg-surface-secondary border-border-primary
  text-text-primary placeholder:text-text-secondary
  focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
  transition-colors
  ${error ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500' : ''}
`;

// -----------------------------------------------------------------------------
// COMPONENT PRINCIPALE
// -----------------------------------------------------------------------------

export const EditVehicleModal: React.FC<EditVehicleModalProps> = ({
  vehicle,
  isOpen,
  lookups,
  submitting,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<FormState>(vehicle ? vehicleToForm(vehicle) : ({} as FormState));
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});

  // Pre-popola il form ogni volta che cambia il veicolo
  useEffect(() => {
    if (vehicle) {
      setForm(vehicleToForm(vehicle));
      setErrors({});
      setTouched({});
    }
  }, [vehicle]);

  // --- Chiusura ---
  const handleClose = useCallback(() => {
    setErrors({});
    setTouched({});
    onClose();
  }, [onClose]);

  // --- Aggiornamento campo ---
  const handleChange = useCallback(
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm(prev => ({ ...prev, [field]: value }));
      setTouched(prev => ({ ...prev, [field]: true }));
      setErrors(prev => ({ ...prev, [field]: undefined }));
    },
    []
  );

  // --- Submit ---
  const handleSubmit = useCallback(async () => {
    if (!vehicle) return;

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched(Object.keys(form).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }

    const payload: VehicleEditData = {
      licensePlate: form.licensePlate.trim().toUpperCase(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      categoryId: Number(form.categoryId),
      statusId: Number(form.statusId),
      fuelTypeId: Number(form.fuelTypeId),
      year: form.year ? Number(form.year) : null,
      vin: form.vin.trim() ? form.vin.trim() : null,
      currentKm: form.currentKm ? Number(form.currentKm) : 0,
      purchaseDate: form.purchaseDate ? form.purchaseDate : null,
      notes: form.notes.trim() ? form.notes.trim() : null,
    };

    await onSubmit(vehicle.id, payload);
  }, [vehicle, form, onSubmit]);

  if (!vehicle) return null;

  const footer = (
    <div className='flex items-center justify-between w-full'>
      <Button variant='ghost' onClick={handleClose} disabled={submitting}>
        Annulla
      </Button>
      <Button variant='primary' onClick={handleSubmit} isLoading={submitting} loadingText='Salvataggio...'>
        Salva modifiche
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Modifica — ${vehicle.licensePlate}`}
      size='lg'
      footer={footer}
      preventClose={submitting}
    >
      <div className='flex flex-col gap-5 p-6'>
        {/* ---------------------------------------------------------------- */}
        {/* SEZIONE 1 — Dati principali                                      */}
        {/* ---------------------------------------------------------------- */}
        <div>
          <h3
            className='text-xs font-semibold text-text-secondary uppercase tracking-wider
                         pb-2 mb-4 border-b border-border-primary'
          >
            Dati principali
          </h3>
          <div className='grid grid-cols-2 gap-4'>
            <Field label='Targa' required error={touched.licensePlate ? errors.licensePlate : undefined}>
              <input
                type='text'
                value={form.licensePlate}
                onChange={handleChange('licensePlate')}
                className={inputClass(touched.licensePlate ? errors.licensePlate : undefined)}
                maxLength={10}
                autoCapitalize='characters'
              />
            </Field>

            <Field label='VIN / Telaio' error={touched.vin ? errors.vin : undefined}>
              <input type='text' value={form.vin} onChange={handleChange('vin')} className={inputClass()} maxLength={50} />
            </Field>

            <Field label='Marca' required error={touched.brand ? errors.brand : undefined}>
              <input
                type='text'
                value={form.brand}
                onChange={handleChange('brand')}
                className={inputClass(touched.brand ? errors.brand : undefined)}
              />
            </Field>

            <Field label='Modello' required error={touched.model ? errors.model : undefined}>
              <input
                type='text'
                value={form.model}
                onChange={handleChange('model')}
                className={inputClass(touched.model ? errors.model : undefined)}
              />
            </Field>

            <Field label='Anno' error={touched.year ? errors.year : undefined}>
              <input
                type='number'
                value={form.year}
                onChange={handleChange('year')}
                className={inputClass()}
                min={1990}
                max={new Date().getFullYear() + 1}
              />
            </Field>

            <Field label='Data acquisto' error={touched.purchaseDate ? errors.purchaseDate : undefined}>
              <input type='date' value={form.purchaseDate} onChange={handleChange('purchaseDate')} className={inputClass()} />
            </Field>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* SEZIONE 2 — Classificazione                                      */}
        {/* ---------------------------------------------------------------- */}
        <div>
          <h3
            className='text-xs font-semibold text-text-secondary uppercase tracking-wider
                         pb-2 mb-4 border-b border-border-primary'
          >
            Classificazione
          </h3>
          <div className='grid grid-cols-3 gap-4'>
            <Field label='Categoria' required error={touched.categoryId ? errors.categoryId : undefined}>
              <select
                value={form.categoryId}
                onChange={handleChange('categoryId')}
                className={inputClass(touched.categoryId ? errors.categoryId : undefined)}
              >
                <option value=''>Seleziona...</option>
                {lookups.categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label='Status' required error={touched.statusId ? errors.statusId : undefined}>
              <select
                value={form.statusId}
                onChange={handleChange('statusId')}
                className={inputClass(touched.statusId ? errors.statusId : undefined)}
              >
                <option value=''>Seleziona...</option>
                {lookups.statuses.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label='Carburante' required error={touched.fuelTypeId ? errors.fuelTypeId : undefined}>
              <select
                value={form.fuelTypeId}
                onChange={handleChange('fuelTypeId')}
                className={inputClass(touched.fuelTypeId ? errors.fuelTypeId : undefined)}
              >
                <option value=''>Seleziona...</option>
                {lookups.fuelTypes.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* SEZIONE 3 — Chilometraggio                                       */}
        {/* ---------------------------------------------------------------- */}
        <div>
          <h3
            className='text-xs font-semibold text-text-secondary uppercase tracking-wider
                         pb-2 mb-4 border-b border-border-primary'
          >
            Chilometraggio
          </h3>
          <div className='grid grid-cols-2 gap-4'>
            <Field label='KM attuali' error={touched.currentKm ? errors.currentKm : undefined}>
              <div className='relative'>
                <input
                  type='number'
                  value={form.currentKm}
                  onChange={handleChange('currentKm')}
                  className={inputClass(touched.currentKm ? errors.currentKm : undefined) + ' pr-10'}
                  min={0}
                />
                <span
                  className='absolute inset-y-0 right-3 flex items-center
                                 text-xs text-text-secondary pointer-events-none'
                >
                  km
                </span>
              </div>
            </Field>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* SEZIONE 4 — Note                                                 */}
        {/* ---------------------------------------------------------------- */}
        <div>
          <h3
            className='text-xs font-semibold text-text-secondary uppercase tracking-wider
                         pb-2 mb-4 border-b border-border-primary'
          >
            Note
          </h3>
          <Field label='Note aggiuntive'>
            <textarea
              value={form.notes}
              onChange={handleChange('notes')}
              className={inputClass() + ' resize-none'}
              rows={3}
              maxLength={1000}
            />
          </Field>
        </div>
      </div>
    </Modal>
  );
};
