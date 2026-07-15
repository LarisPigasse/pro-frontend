// =============================================================================
// ASSET AZIENDALI — COMPONENT: VehicleFormFields (interno, condiviso Create/Edit)
// features/vehicles/components/VehicleFormFields.tsx
// =============================================================================

import React from 'react';
import { Input } from '@/core/components/form/input/Input';
import { Select } from '@/core/components/form/select/Select';
import { Switch } from '@/core/components/form/switch/Switch';
import { DatePicker } from '@/core/components/form/date-picker/DatePicker';
import { TextArea } from '@/core/components/form/textarea/TextArea';
import { toISODate, fromISODate } from '@/core/utils';
import { useActiveVehicleCategories } from '../hooks/useActiveVehicleCategories';
import { useActiveTelematicsProviders } from '../hooks/useActiveTelematicsProviders';
import { FUEL_TYPE_LABELS, OWNERSHIP_TYPE_LABELS } from '../types/vehicles.types';
import type { CreateVehicleData, FuelType, OwnershipType, Vehicle } from '../types/vehicles.types';

// ─────────────────────────────────────────────────────────────────────────────
// Stato locale del form
// ─────────────────────────────────────────────────────────────────────────────

export interface VehicleFormValues {
  categoryId: string;
  brand: string;
  model: string;
  hasPlate: boolean;
  plate: string;
  vin: string;
  internalCode: string;
  year: string;
  color: string;
  fuelType: FuelType;
  emissionClass: string;
  currentKm: string;
  telematicsEnabled: boolean;
  telematicsProviderId: string;
  telematicsVehicleId: string;
  ownershipType: OwnershipType;
  acquisitionDate: Date | undefined;
  notes: string;
}

export const EMPTY_VEHICLE_FORM: VehicleFormValues = {
  categoryId: '',
  brand: '',
  model: '',
  hasPlate: true,
  plate: '',
  vin: '',
  internalCode: '',
  year: '',
  color: '',
  fuelType: 'diesel',
  emissionClass: '',
  currentKm: '0',
  telematicsEnabled: false,
  telematicsProviderId: '',
  telematicsVehicleId: '',
  ownershipType: 'owned',
  acquisitionDate: undefined,
  notes: '',
};

export type VehicleFormErrors = Partial<Record<keyof VehicleFormValues, string>>;
export type VehicleFormTouched = Partial<Record<keyof VehicleFormValues, boolean>>;

/** Veicolo → stato form (per pre-popolamento EditModal) */
export const vehicleToFormValues = (vehicle: Vehicle): VehicleFormValues => ({
  categoryId: String(vehicle.categoryId),
  brand: vehicle.brand,
  model: vehicle.model,
  hasPlate: vehicle.hasPlate,
  plate: vehicle.plate ?? '',
  vin: vehicle.vin ?? '',
  internalCode: vehicle.internalCode ?? '',
  year: vehicle.year != null ? String(vehicle.year) : '',
  color: vehicle.color ?? '',
  fuelType: vehicle.fuelType,
  emissionClass: vehicle.emissionClass ?? '',
  currentKm: String(vehicle.currentKm),
  telematicsEnabled: vehicle.telematicsEnabled,
  telematicsProviderId: vehicle.telematicsProviderId != null ? String(vehicle.telematicsProviderId) : '',
  telematicsVehicleId: vehicle.telematicsVehicleId ?? '',
  ownershipType: vehicle.ownershipType,
  acquisitionDate: fromISODate(vehicle.acquisitionDate),
  notes: vehicle.notes ?? '',
});

/** Stato form → payload API */
export const vehicleFormToPayload = (values: VehicleFormValues): CreateVehicleData => ({
  categoryId: Number(values.categoryId),
  brand: values.brand.trim(),
  model: values.model.trim(),
  hasPlate: values.hasPlate,
  plate: values.hasPlate ? values.plate.trim().toUpperCase() || undefined : undefined,
  vin: values.vin.trim().toUpperCase() || undefined,
  internalCode: values.internalCode.trim() || undefined,
  year: values.year.trim() ? Number(values.year) : undefined,
  color: values.color.trim() || undefined,
  fuelType: values.fuelType,
  emissionClass: values.emissionClass.trim() || undefined,
  currentKm: Number(values.currentKm) || 0,
  telematicsEnabled: values.telematicsEnabled,
  telematicsProviderId:
    values.telematicsEnabled && values.telematicsProviderId ? Number(values.telematicsProviderId) : undefined,
  telematicsVehicleId: values.telematicsEnabled ? values.telematicsVehicleId.trim() || undefined : undefined,
  ownershipType: values.ownershipType,
  acquisitionDate: toISODate(values.acquisitionDate),
  notes: values.notes.trim() || undefined,
});

// ─────────────────────────────────────────────────────────────────────────────
// Validazione
// ─────────────────────────────────────────────────────────────────────────────

export const validateVehicleForm = (values: VehicleFormValues): VehicleFormErrors => {
  const errors: VehicleFormErrors = {};
  if (!values.categoryId) errors.categoryId = 'La categoria è obbligatoria';
  if (!values.brand.trim()) errors.brand = 'La marca è obbligatoria';
  if (!values.model.trim()) errors.model = 'Il modello è obbligatorio';
  // Stessa regola del backend: targa obbligatoria per i mezzi che ne hanno una
  if (values.hasPlate && !values.plate.trim()) errors.plate = 'La targa è obbligatoria per un mezzo con targa';
  return errors;
};

// ─────────────────────────────────────────────────────────────────────────────
// Opzioni statiche
// ─────────────────────────────────────────────────────────────────────────────

const FUEL_OPTIONS = (Object.entries(FUEL_TYPE_LABELS) as [FuelType, string][]).map(([value, label]) => ({ value, label }));
const OWNERSHIP_OPTIONS = (Object.entries(OWNERSHIP_TYPE_LABELS) as [OwnershipType, string][]).map(([value, label]) => ({
  value,
  label,
}));

// ─────────────────────────────────────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────────────────────────────────────

interface VehicleFormFieldsProps {
  values: VehicleFormValues;
  errors: VehicleFormErrors;
  touched: VehicleFormTouched;
  onChange: <K extends keyof VehicleFormValues>(field: K, value: VehicleFormValues[K]) => void;
  onBlur: (field: keyof VehicleFormValues) => void;
  disabled?: boolean;
}

export const VehicleFormFields: React.FC<VehicleFormFieldsProps> = ({
  values,
  errors,
  touched,
  onChange,
  onBlur,
  disabled,
}) => {
  const { options: categoryOptions } = useActiveVehicleCategories();
  const { options: telematicsOptions } = useActiveTelematicsProviders();

  const errorFor = (field: keyof VehicleFormValues): string | undefined => (touched[field] ? errors[field] : undefined);

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-2 gap-4'>
        <Select
          label='Categoria'
          options={categoryOptions}
          value={values.categoryId}
          onValueChange={value => onChange('categoryId', value)}
          error={errorFor('categoryId')}
          disabled={disabled}
        />
        <Select
          label='Tipo di carburante'
          options={FUEL_OPTIONS}
          value={values.fuelType}
          onValueChange={value => onChange('fuelType', value as FuelType)}
          disabled={disabled}
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <Input
          label='Marca'
          value={values.brand}
          onChange={e => onChange('brand', e.target.value)}
          onBlur={() => onBlur('brand')}
          error={errorFor('brand')}
          disabled={disabled}
          required
        />
        <Input
          label='Modello'
          value={values.model}
          onChange={e => onChange('model', e.target.value)}
          onBlur={() => onBlur('model')}
          error={errorFor('model')}
          disabled={disabled}
          required
        />
      </div>

      <div className='flex items-center justify-between border border-border-default rounded-lg px-4 py-3'>
        <span className='text-sm text-text-primary'>Il mezzo ha una targa</span>
        <Switch checked={values.hasPlate} onCheckedChange={checked => onChange('hasPlate', checked)} disabled={disabled} />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        {values.hasPlate ? (
          <Input
            label='Targa'
            value={values.plate}
            onChange={e => onChange('plate', e.target.value.toUpperCase())}
            onBlur={() => onBlur('plate')}
            error={errorFor('plate')}
            disabled={disabled}
            required
          />
        ) : (
          <Input
            label='Codice interno'
            helperText='Identificativo per mezzi senza targa (es. muletti)'
            value={values.internalCode}
            onChange={e => onChange('internalCode', e.target.value)}
            disabled={disabled}
          />
        )}
        <Input
          label='Telaio (VIN)'
          value={values.vin}
          onChange={e => onChange('vin', e.target.value.toUpperCase())}
          disabled={disabled}
        />
      </div>

      <div className='grid grid-cols-3 gap-4'>
        <Input
          label='Anno'
          type='number'
          value={values.year}
          onChange={e => onChange('year', e.target.value)}
          disabled={disabled}
        />
        <Input label='Colore' value={values.color} onChange={e => onChange('color', e.target.value)} disabled={disabled} />
        <Input
          label='Classe emissioni'
          helperText='es. Euro 6'
          value={values.emissionClass}
          onChange={e => onChange('emissionClass', e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <Input
          label='Chilometraggio attuale'
          type='number'
          value={values.currentKm}
          onChange={e => onChange('currentKm', e.target.value)}
          disabled={disabled}
        />
        <Select
          label='Tipo di possesso'
          options={OWNERSHIP_OPTIONS}
          value={values.ownershipType}
          onValueChange={value => onChange('ownershipType', value as OwnershipType)}
          disabled={disabled}
        />
      </div>

      <DatePicker
        label='Data di acquisizione'
        value={values.acquisitionDate}
        onChange={date => onChange('acquisitionDate', date)}
        maxDate={new Date()}
        disabled={disabled}
        fullWidth
      />

      <div className='flex items-center justify-between border border-border-default rounded-lg px-4 py-3'>
        <span className='text-sm text-text-primary'>Tracciamento telematico attivo</span>
        <Switch
          checked={values.telematicsEnabled}
          onCheckedChange={checked => onChange('telematicsEnabled', checked)}
          disabled={disabled}
        />
      </div>

      {values.telematicsEnabled && (
        <div className='grid grid-cols-2 gap-4'>
          <Select
            label='Fornitore telematico'
            options={telematicsOptions}
            value={values.telematicsProviderId}
            onValueChange={value => onChange('telematicsProviderId', value)}
            disabled={disabled}
          />
          <Input
            label='ID veicolo sul fornitore'
            helperText='Identificativo con cui il fornitore riconosce questo mezzo'
            value={values.telematicsVehicleId}
            onChange={e => onChange('telematicsVehicleId', e.target.value)}
            disabled={disabled}
          />
        </div>
      )}

      <TextArea
        label='Note'
        value={values.notes}
        onChange={e => onChange('notes', e.target.value)}
        disabled={disabled}
        minRows={2}
        maxRows={4}
        maxLength={2000}
        showCharCount
      />
    </div>
  );
};

export default VehicleFormFields;
