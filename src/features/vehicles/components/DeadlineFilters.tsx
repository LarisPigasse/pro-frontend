// =============================================================================
// ASSET AZIENDALI — COMPONENT: DeadlineFilters
// features/vehicles/components/DeadlineFilters.tsx
// =============================================================================

import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button, Badge } from '@/core/components/ui';
import { Select } from '@/core/components/form/select/Select';
import { useActiveVehicles } from '../hooks/useActiveVehicles';
import { DEADLINE_STATUS_LABELS } from '../types/vehicles.types';
import type { VehicleDeadlineFilters, DeadlineStatus } from '../types/vehicles.types';

interface DeadlineFiltersProps {
  currentFilters: VehicleDeadlineFilters;
  onApply: (filters: Partial<VehicleDeadlineFilters>) => void;
  onReset: () => void;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tutti gli stati' },
  ...(Object.entries(DEADLINE_STATUS_LABELS) as [DeadlineStatus, string][]).map(([value, label]) => ({ value, label })),
];

export const DeadlineFilters: React.FC<DeadlineFiltersProps> = ({ currentFilters, onApply, onReset }) => {
  const { options: vehicleOptions } = useActiveVehicles();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<VehicleDeadlineFilters>(currentFilters);

  const activeCount = [currentFilters.vehicleId].filter(v => v !== undefined).length;

  const handleOpen = () => {
    setDraft(currentFilters);
    setIsOpen(true);
  };

  const handleApply = () => {
    onApply({ vehicleId: draft.vehicleId, status: draft.status });
    setIsOpen(false);
  };

  const handleReset = () => {
    setDraft({ status: 'all' });
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

          <div className='absolute top-full left-0 mt-2 w-80 bg-bg-primary rounded-lg shadow-themed-lg border border-border-default z-50'>
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

            <div className='p-4 space-y-5'>
              <Select
                label='Veicolo'
                options={[{ value: 'all', label: 'Tutti i veicoli' }, ...vehicleOptions]}
                value={draft.vehicleId != null ? String(draft.vehicleId) : 'all'}
                onValueChange={value => setDraft({ ...draft, vehicleId: value === 'all' ? undefined : Number(value) })}
              />

              <Select
                label='Stato'
                options={STATUS_OPTIONS}
                value={draft.status ?? 'all'}
                onValueChange={value => setDraft({ ...draft, status: value as DeadlineStatus | 'all' })}
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

export default DeadlineFilters;
