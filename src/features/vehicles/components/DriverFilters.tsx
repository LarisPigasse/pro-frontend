// =============================================================================
// ASSET AZIENDALI — COMPONENT: DriverFilters
// features/vehicles/components/DriverFilters.tsx
// =============================================================================

import React, { useCallback } from 'react';

import Input from '@/core/components/form/input/Input';
import Select from '@/core/components/form/select/Select';
import { Button } from '@/core/components/ui';
import type { SelectOption } from '@/core/components/form/select/Select';
import type { DriverFilters, DriverComplianceStatusValue } from '../types/vehicles.types';

// -----------------------------------------------------------------------------
// OPZIONI
// -----------------------------------------------------------------------------

const COMPLIANCE_OPTIONS: SelectOption[] = [
  { value: 'all',      label: 'Tutti gli stati' },
  { value: 'ok',       label: 'In regola' },
  { value: 'expiring', label: 'In scadenza' },
  { value: 'expired',  label: 'Scaduti' },
  { value: 'none',     label: 'Senza documenti' },
];

const ACTIVE_OPTIONS: SelectOption[] = [
  { value: 'all',   label: 'Tutti' },
  { value: 'true',  label: 'Attivi' },
  { value: 'false', label: 'Disattivati' },
];

// -----------------------------------------------------------------------------
// PROPS
// -----------------------------------------------------------------------------

interface DriverFiltersProps {
  filters:         DriverFilters;
  onFiltersChange: (filters: Partial<DriverFilters>) => void;
  onReset:         () => void;
  totalResults?:   number;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export const DriverFilters: React.FC<DriverFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  totalResults,
}) => {
  const hasActiveFilters =
    filters.search !== '' ||
    filters.complianceStatus !== 'all' ||
    filters.isActive !== 'all';

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ search: e.target.value });
  }, [onFiltersChange]);

  const handleCompliance = useCallback((value: string) => {
    onFiltersChange({ complianceStatus: value as DriverComplianceStatusValue | 'all' });
  }, [onFiltersChange]);

  const handleActive = useCallback((value: string) => {
    onFiltersChange({ isActive: value as 'all' | 'true' | 'false' });
  }, [onFiltersChange]);

  return (
    <div className='flex flex-col gap-3 mb-6'>
      <div className='flex flex-wrap items-end gap-4'>

        {/* Ricerca */}
        <div className='flex-1 min-w-48'>
          <Input
            label='Cerca autista'
            value={filters.search}
            onChange={handleSearch}
          />
        </div>

        {/* Conformità */}
        <Select
          options={COMPLIANCE_OPTIONS}
          value={filters.complianceStatus}
          onChange={handleCompliance}
        />

        {/* Stato */}
        <Select
          options={ACTIVE_OPTIONS}
          value={filters.isActive}
          onChange={handleActive}
        />

        {/* Reset */}
        {hasActiveFilters && (
          <Button variant='ghost' size='sm' onClick={onReset}>
            Reset filtri
          </Button>
        )}

      </div>

      {/* Totale risultati */}
      {totalResults !== undefined && (
        <p className='text-xs text-text-secondary'>
          {totalResults === 0
            ? 'Nessun autista trovato'
            : `${totalResults} autist${totalResults === 1 ? 'a' : 'i'}`}
          {hasActiveFilters && ' con i filtri applicati'}
        </p>
      )}
    </div>
  );
};
