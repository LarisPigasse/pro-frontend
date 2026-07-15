// =============================================================================
// ASSET AZIENDALI — COMPONENT: MaintenanceRecordFilters
// features/vehicles/components/MaintenanceRecordFilters.tsx
// =============================================================================

import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button, Badge } from '@/core/components/ui';
import { Select } from '@/core/components/form/select/Select';
import { DatePicker } from '@/core/components/form/date-picker/DatePicker';
import { toISODate, fromISODate } from '@/core/utils';
import { useActiveVehicles } from '../hooks/useActiveVehicles';
import { useActiveMaintenanceTypes } from '../hooks/useActiveMaintenanceTypes';
import { useActiveWorkshops } from '../hooks/useActiveWorkshops';
import type { MaintenanceRecordFilters as MaintenanceRecordFiltersType } from '../types/vehicles.types';

interface MaintenanceRecordFiltersProps {
  currentFilters: MaintenanceRecordFiltersType;
  onApply: (filters: Partial<MaintenanceRecordFiltersType>) => void;
  onReset: () => void;
}

interface DraftValues {
  vehicleId?: number;
  maintenanceTypeId?: number;
  workshopId?: number;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
}

export const MaintenanceRecordFilters: React.FC<MaintenanceRecordFiltersProps> = ({ currentFilters, onApply, onReset }) => {
  const { options: vehicleOptions } = useActiveVehicles();
  const { options: typeOptions } = useActiveMaintenanceTypes();
  const { options: workshopOptions } = useActiveWorkshops();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<DraftValues>({
    vehicleId: currentFilters.vehicleId,
    maintenanceTypeId: currentFilters.maintenanceTypeId,
    workshopId: currentFilters.workshopId,
    dateFrom: fromISODate(currentFilters.dateFrom),
    dateTo: fromISODate(currentFilters.dateTo),
  });

  const activeCount = [
    currentFilters.vehicleId,
    currentFilters.maintenanceTypeId,
    currentFilters.workshopId,
    currentFilters.dateFrom,
    currentFilters.dateTo,
  ].filter(v => v !== undefined).length;

  const handleOpen = () => {
    setDraft({
      vehicleId: currentFilters.vehicleId,
      maintenanceTypeId: currentFilters.maintenanceTypeId,
      workshopId: currentFilters.workshopId,
      dateFrom: fromISODate(currentFilters.dateFrom),
      dateTo: fromISODate(currentFilters.dateTo),
    });
    setIsOpen(true);
  };

  const handleApply = () => {
    onApply({
      vehicleId: draft.vehicleId,
      maintenanceTypeId: draft.maintenanceTypeId,
      workshopId: draft.workshopId,
      dateFrom: toISODate(draft.dateFrom),
      dateTo: toISODate(draft.dateTo),
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    setDraft({
      vehicleId: undefined,
      maintenanceTypeId: undefined,
      workshopId: undefined,
      dateFrom: undefined,
      dateTo: undefined,
    });
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
              <Select
                label='Veicolo'
                options={[{ value: 'all', label: 'Tutti i veicoli' }, ...vehicleOptions]}
                value={draft.vehicleId != null ? String(draft.vehicleId) : 'all'}
                onValueChange={value => setDraft(prev => ({ ...prev, vehicleId: value === 'all' ? undefined : Number(value) }))}
              />

              <Select
                label='Tipo manutenzione'
                options={[{ value: 'all', label: 'Tutti i tipi' }, ...typeOptions]}
                value={draft.maintenanceTypeId != null ? String(draft.maintenanceTypeId) : 'all'}
                onValueChange={value =>
                  setDraft(prev => ({ ...prev, maintenanceTypeId: value === 'all' ? undefined : Number(value) }))
                }
              />

              <Select
                label='Officina'
                options={[{ value: 'all', label: 'Tutte le officine' }, ...workshopOptions]}
                value={draft.workshopId != null ? String(draft.workshopId) : 'all'}
                onValueChange={value =>
                  setDraft(prev => ({ ...prev, workshopId: value === 'all' ? undefined : Number(value) }))
                }
              />

              <div className='grid grid-cols-2 gap-3'>
                <DatePicker
                  label='Dal'
                  value={draft.dateFrom}
                  onChange={date => setDraft(prev => ({ ...prev, dateFrom: date }))}
                  maxDate={new Date()}
                  fullWidth
                />
                <DatePicker
                  label='Al'
                  value={draft.dateTo}
                  onChange={date => setDraft(prev => ({ ...prev, dateTo: date }))}
                  maxDate={new Date()}
                  fullWidth
                />
              </div>
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

export default MaintenanceRecordFilters;
