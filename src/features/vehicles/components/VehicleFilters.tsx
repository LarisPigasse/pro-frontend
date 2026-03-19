// =============================================================================
// VEHICLES MODULE — COMPONENT: VehicleFilters
// features/vehicles/components/VehicleFilters.tsx
// =============================================================================
//
// Pannello filtri per la lista veicoli.
// Gestisce: ricerca testuale, categoria, status, carburante.
//
// Utilizzo:
//   <VehicleFilters
//     filters={filters}
//     lookups={lookups}
//     lookupsLoading={loading}
//     onFiltersChange={setFilters}
//     onReset={resetFilters}
//   />
// =============================================================================

import React, { useCallback } from 'react';

import type { VehicleFiltersState, VehicleLookups } from '../types/vehicles.types';

// -----------------------------------------------------------------------------
// PROPS
// -----------------------------------------------------------------------------

interface VehicleFiltersProps {
  filters: VehicleFiltersState;
  lookups: VehicleLookups;
  lookupsLoading: boolean;
  onFiltersChange: (updates: Partial<VehicleFiltersState>) => void;
  onReset: () => void;
  /** Numero totale risultati — per mostrare il contatore */
  totalResults?: number;
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

/** Restituisce true se almeno un filtro non-default è attivo */
const hasActiveFilters = (filters: VehicleFiltersState): boolean =>
  Boolean(filters.search || filters.categoryId || filters.statusId || filters.fuelTypeId);

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  filters,
  lookups,
  lookupsLoading,
  onFiltersChange,
  onReset,
  totalResults,
}) => {
  // --- Handlers ---

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFiltersChange({ search: e.target.value || undefined });
    },
    [onFiltersChange]
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      onFiltersChange({ categoryId: value ? Number(value) : undefined });
    },
    [onFiltersChange]
  );

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      onFiltersChange({ statusId: value ? Number(value) : undefined });
    },
    [onFiltersChange]
  );

  const handleFuelTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      onFiltersChange({ fuelTypeId: value ? Number(value) : undefined });
    },
    [onFiltersChange]
  );

  const active = hasActiveFilters(filters);

  return (
    <div className='flex flex-col gap-3'>
      {/* --- Riga principale filtri --- */}
      <div className='flex flex-wrap items-center gap-2'>
        {/* Ricerca testuale */}
        <div className='relative flex-1 min-w-48'>
          <span className='absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-secondary'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z'
              />
            </svg>
          </span>
          <input
            type='text'
            placeholder='Cerca targa, marca, modello...'
            value={filters.search ?? ''}
            onChange={handleSearchChange}
            className='
              w-full pl-9 pr-3 py-2 text-sm rounded-lg border
              bg-surface-secondary border-border-primary
              text-text-primary placeholder:text-text-secondary
              focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
              transition-colors
            '
          />
        </div>

        {/* Select Categoria */}
        <select
          value={filters.categoryId ?? ''}
          onChange={handleCategoryChange}
          disabled={lookupsLoading}
          className='
            px-3 py-2 text-sm rounded-lg border min-w-36
            bg-surface-secondary border-border-primary
            text-text-primary
            focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          '
        >
          <option value=''>Tutte le categorie</option>
          {lookups.categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Select Status */}
        <select
          value={filters.statusId ?? ''}
          onChange={handleStatusChange}
          disabled={lookupsLoading}
          className='
            px-3 py-2 text-sm rounded-lg border min-w-36
            bg-surface-secondary border-border-primary
            text-text-primary
            focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          '
        >
          <option value=''>Tutti gli status</option>
          {lookups.statuses.map(s => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Select Carburante */}
        <select
          value={filters.fuelTypeId ?? ''}
          onChange={handleFuelTypeChange}
          disabled={lookupsLoading}
          className='
            px-3 py-2 text-sm rounded-lg border min-w-36
            bg-surface-secondary border-border-primary
            text-text-primary
            focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          '
        >
          <option value=''>Tutti i carburanti</option>
          {lookups.fuelTypes.map(ft => (
            <option key={ft.id} value={ft.id}>
              {ft.name}
            </option>
          ))}
        </select>

        {/* Bottone reset — visibile solo se c'è almeno un filtro attivo */}
        {active && (
          <button
            onClick={onReset}
            className='
              flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg
              text-text-secondary hover:text-text-primary
              border border-border-primary hover:border-border-secondary
              bg-surface-secondary hover:bg-surface-tertiary
              transition-colors
            '
          >
            <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
            Resetta
          </button>
        )}
      </div>

      {/* --- Riga info risultati + filtri attivi --- */}
      {(active || totalResults !== undefined) && (
        <div className='flex items-center gap-3 flex-wrap'>
          {/* Contatore risultati */}
          {totalResults !== undefined && (
            <span className='text-xs text-text-secondary'>
              {totalResults === 0
                ? 'Nessun veicolo trovato'
                : `${totalResults} veicol${totalResults === 1 ? 'o' : 'i'} trovati`}
            </span>
          )}

          {/* Chip filtri attivi */}
          {active && (
            <div className='flex items-center gap-1.5 flex-wrap'>
              {filters.search && (
                <FilterChip label={`"${filters.search}"`} onRemove={() => onFiltersChange({ search: undefined })} />
              )}
              {filters.categoryId && (
                <FilterChip
                  label={lookups.categories.find(c => c.id === filters.categoryId)?.name ?? 'Categoria'}
                  onRemove={() => onFiltersChange({ categoryId: undefined })}
                />
              )}
              {filters.statusId && (
                <FilterChip
                  label={lookups.statuses.find(s => s.id === filters.statusId)?.label ?? 'Status'}
                  onRemove={() => onFiltersChange({ statusId: undefined })}
                />
              )}
              {filters.fuelTypeId && (
                <FilterChip
                  label={lookups.fuelTypes.find(f => f.id === filters.fuelTypeId)?.name ?? 'Carburante'}
                  onRemove={() => onFiltersChange({ fuelTypeId: undefined })}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// SUB-COMPONENT: FilterChip
// -----------------------------------------------------------------------------

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, onRemove }) => (
  <span
    className='
    inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs
    bg-blue-500/10 text-blue-600 border border-blue-500/20
  '
  >
    {label}
    <button onClick={onRemove} className='hover:text-blue-800 transition-colors ml-0.5' aria-label={`Rimuovi filtro ${label}`}>
      <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M6 18L18 6M6 6l12 12' />
      </svg>
    </button>
  </span>
);
