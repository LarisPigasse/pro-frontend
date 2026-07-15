// =============================================================================
// ASSET AZIENDALI — COMPONENT: DriverFilters
// features/vehicles/components/DriverFilters.tsx
// =============================================================================

import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button, Badge } from '@/core/components/ui';
import { Input } from '@/core/components/form/input/Input';
import { Select } from '@/core/components/form/select/Select';
import type { DriverFilters as DriverFiltersType } from '../types/vehicles.types';

interface DriverFiltersProps {
  currentFilters: DriverFiltersType;
  onApply: (filters: Partial<DriverFiltersType>) => void;
  onReset: () => void;
}

const ACTIVE_OPTIONS = [
  { value: 'true', label: 'Attivi' },
  { value: 'false', label: 'Disattivati' },
];

export const DriverFilters: React.FC<DriverFiltersProps> = ({ currentFilters, onApply, onReset }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<DriverFiltersType>(currentFilters);

  // 'active' è sempre valorizzato (default true) — non è un filtro "opzionale" come search/city
  const activeCount = [currentFilters.search, currentFilters.city].filter(v => !!v).length;

  const handleOpen = () => {
    setDraft(currentFilters); // sincronizza il draft con i filtri correnti all'apertura
    setIsOpen(true);
  };

  const handleApply = () => {
    onApply({
      search: draft.search || undefined,
      city: draft.city || undefined,
      active: draft.active,
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    setDraft({ active: true }); // riflette localmente lo stato di default nel pannello
    onReset();
    setIsOpen(false);
  };
  return (
    <div className='relative mb-6'>
      {/* ── Trigger button ── */}
      <Button variant='outline' size='md' leftIcon={<Filter className='w-4 h-4' />} onClick={handleOpen}>
        Filtri
        {activeCount > 0 && (
          <Badge variant='info' size='xs' className='ml-2'>
            {activeCount}
          </Badge>
        )}
      </Button>

      {/* ── Dropdown panel ── */}
      {isOpen && (
        <>
          {/* Overlay per chiudere cliccando fuori */}
          <div className='fixed inset-0 z-40' onClick={() => setIsOpen(false)} />

          <div className='absolute top-full left-0 mt-2 w-80 bg-bg-primary rounded-lg shadow-themed-lg border border-border-default z-50'>
            {/* Header */}
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

            {/* Campi filtro */}
            <div className='p-4 space-y-5 max-h-96 overflow-y-auto'>
              <Input
                label='Cerca autista'
                helperText='Nome, cognome o codice fiscale'
                value={draft.search || ''}
                onChange={e => setDraft({ ...draft, search: e.target.value })}
              />

              <Input label='Città' value={draft.city || ''} onChange={e => setDraft({ ...draft, city: e.target.value })} />

              <Select
                label='Stato'
                options={ACTIVE_OPTIONS}
                value={String(draft.active ?? true)}
                onValueChange={value => setDraft({ ...draft, active: value === 'true' })}
              />
            </div>

            {/* Footer */}
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

export default DriverFilters;
