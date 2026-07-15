// =============================================================================
// ASSET AZIENDALI — COMPONENT: VehicleFilters
// features/vehicles/components/VehicleFilters.tsx
// =============================================================================

import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button, Badge } from '@/core/components/ui';
import { Input } from '@/core/components/form/input/Input';
import { Select } from '@/core/components/form/select/Select';
import { useActiveVehicleCategories } from '../hooks/useActiveVehicleCategories';
import { VEHICLE_STATUS_LABELS, FUEL_TYPE_LABELS } from '../types/vehicles.types';
import type { VehicleFilters as VehicleFiltersType, VehicleStatus, FuelType } from '../types/vehicles.types';

interface VehicleFiltersProps {
  currentFilters: VehicleFiltersType;
  onApply: (filters: Partial<VehicleFiltersType>) => void;
  onReset: () => void;
}

const STATUS_OPTIONS = [
  { value: 'active', label: VEHICLE_STATUS_LABELS.active },
  { value: 'maintenance', label: VEHICLE_STATUS_LABELS.maintenance },
  { value: 'inactive', label: VEHICLE_STATUS_LABELS.inactive },
  { value: 'decommissioned', label: VEHICLE_STATUS_LABELS.decommissioned },
  { value: 'all', label: 'Tutti gli stati' },
];

const FUEL_OPTIONS = [
  { value: 'all', label: 'Tutti i carburanti' },
  ...(Object.entries(FUEL_TYPE_LABELS) as [FuelType, string][]).map(([value, label]) => ({ value, label })),
];

const HAS_PLATE_OPTIONS = [
  { value: 'all', label: 'Tutti' },
  { value: 'true', label: 'Con targa' },
  { value: 'false', label: 'Senza targa' },
];

export const VehicleFilters: React.FC<VehicleFiltersProps> = ({ currentFilters, onApply, onReset }) => {
  const { options: categoryOptions } = useActiveVehicleCategories();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<VehicleFiltersType>(currentFilters);

  const activeCount = [
    currentFilters.search,
    currentFilters.categoryId,
    currentFilters.fuelType,
    currentFilters.hasPlate,
  ].filter(v => v !== undefined && v !== '').length;

  const handleOpen = () => {
    setDraft(currentFilters);
    setIsOpen(true);
  };

  const handleApply = () => {
    onApply({
      search: draft.search || undefined,
      status: draft.status,
      categoryId: draft.categoryId,
      fuelType: draft.fuelType,
      hasPlate: draft.hasPlate,
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    setDraft({ status: 'active' });
    onReset();
    setIsOpen(false);
  };

  return (
    <div className='relative mb-6'>
      <Button variant='outline' size='md' leftIcon={<Filter className='w-4 h-4' />} onClick={handleOpen}>
        Filtri
        {activeCount > 0 && (
          <Badge variant='info' size='xs' className='ml-2'>
            {activeCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          <div className='fixed inset-0 z-40' onClick={() => setIsOpen(false)} />

          <div className='absolute top-full left-0 mt-2 w-96 bg-bg-primary rounded-lg shadow-themed-lg border border-border-default z-50'>
            <div className='flex items-center justify-between p-4 border-b border-border-default'>
              <h3 className='text-section-title text-base'>Filtri</h3>
              <button
                onClick={() => setIsOpen(false)}
                className='p-1 rounded text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors'
                aria-label='Chiudi filtri'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='p-4 space-y-5 max-h-[28rem] overflow-y-auto'>
              <Input
                label='Cerca veicolo'
                helperText='Marca, modello, targa, VIN o codice interno'
                value={draft.search || ''}
                onChange={e => setDraft({ ...draft, search: e.target.value })}
              />

              <Select
                label='Stato'
                options={STATUS_OPTIONS}
                value={draft.status ?? 'active'}
                onValueChange={value => setDraft({ ...draft, status: value as VehicleStatus | 'all' })}
              />

              <Select
                label='Categoria'
                options={[{ value: 'all', label: 'Tutte le categorie' }, ...categoryOptions]}
                value={draft.categoryId != null ? String(draft.categoryId) : 'all'}
                onValueChange={value => setDraft({ ...draft, categoryId: value === 'all' ? undefined : Number(value) })}
              />

              <Select
                label='Carburante'
                options={FUEL_OPTIONS}
                value={draft.fuelType ?? 'all'}
                onValueChange={value => setDraft({ ...draft, fuelType: value === 'all' ? undefined : (value as FuelType) })}
              />

              <Select
                label='Targa'
                options={HAS_PLATE_OPTIONS}
                value={draft.hasPlate === undefined ? 'all' : String(draft.hasPlate)}
                onValueChange={value => setDraft({ ...draft, hasPlate: value === 'all' ? undefined : value === 'true' })}
              />
            </div>

            <div className='flex items-center justify-end gap-2 p-4 border-t border-border-default'>
              <Button variant='ghost' size='sm' onClick={handleReset}>
                Reset
              </Button>
              <Button variant='primary' size='sm' onClick={handleApply}>
                Applica
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VehicleFilters;
