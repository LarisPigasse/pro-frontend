// =============================================================================
// ASSET AZIENDALI — COMPONENT: LogEmailFilters
// features/vehicles/components/LogEmailFilters.tsx
// =============================================================================

import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button, Badge } from '@/core/components/ui';
import { Select } from '@/core/components/form/select/Select';
import { DatePicker } from '@/core/components/form/date-picker/DatePicker';
import { toISODate, fromISODate } from '@/core/utils';
import type { NotificationDeliveryLogFilters as LogFiltersType } from '../types/vehicles.types';

interface LogEmailFiltersProps {
  currentFilters: LogFiltersType;
  onApply: (filters: Partial<LogFiltersType>) => void;
  onReset: () => void;
}

interface DraftValues {
  status?: LogFiltersType['status'];
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
}

const STATUS_OPTIONS = [
  { value: 'sent', label: 'Consegnate' },
  { value: 'failed', label: 'Fallite' },
];

const toDraft = (f: LogFiltersType): DraftValues => ({
  status: f.status,
  dateFrom: fromISODate(f.dateFrom),
  dateTo: fromISODate(f.dateTo),
});

export const LogEmailFilters: React.FC<LogEmailFiltersProps> = ({ currentFilters, onApply, onReset }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<DraftValues>(toDraft(currentFilters));

  const activeCount = [currentFilters.status, currentFilters.dateFrom, currentFilters.dateTo].filter(
    v => v !== undefined
  ).length;

  const handleOpen = () => {
    setDraft(toDraft(currentFilters));
    setIsOpen(true);
  };

  const handleApply = () => {
    onApply({ status: draft.status, dateFrom: toISODate(draft.dateFrom), dateTo: toISODate(draft.dateTo) });
    setIsOpen(false);
  };

  const handleReset = () => {
    setDraft(toDraft({}));
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
                label='Esito'
                options={[{ value: 'all', label: 'Tutti gli esiti' }, ...STATUS_OPTIONS]}
                value={draft.status ?? 'all'}
                onValueChange={value =>
                  setDraft(prev => ({ ...prev, status: value === 'all' ? undefined : (value as LogFiltersType['status']) }))
                }
              />
              <div className='grid grid-cols-2 gap-3'>
                <DatePicker
                  label='Dal'
                  value={draft.dateFrom}
                  onChange={date => setDraft(prev => ({ ...prev, dateFrom: date }))}
                  fullWidth
                />
                <DatePicker
                  label='Al'
                  value={draft.dateTo}
                  onChange={date => setDraft(prev => ({ ...prev, dateTo: date }))}
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

export default LogEmailFilters;
