// =============================================================================
// ASSET AZIENDALI — COMPONENT: NotificationFilters
// features/vehicles/components/NotificationFilters.tsx
// =============================================================================

import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button, Badge } from '@/core/components/ui';
import { Select } from '@/core/components/form/select/Select';
import { DatePicker } from '@/core/components/form/date-picker/DatePicker';
import { toISODate, fromISODate } from '@/core/utils';
import { useActiveVehicles } from '../hooks/useActiveVehicles';
import { useActiveDrivers } from '../hooks/useActiveDrivers';
import { NOTIFICATION_TYPE_LABELS, NOTIFICATION_SEVERITY_LABELS } from '../types/vehicles.types';
import type { NotificationFilters as NotificationFiltersType } from '../types/vehicles.types';

interface NotificationFiltersProps {
  currentFilters: NotificationFiltersType;
  onApply: (filters: Partial<NotificationFiltersType>) => void;
  onReset: () => void;
}

interface DraftValues {
  type?: NotificationFiltersType['type'];
  severity?: NotificationFiltersType['severity'];
  isRead?: boolean;
  vehicleId?: number;
  driverId?: number;
  isArchived: boolean;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
}

const TYPE_OPTIONS = Object.entries(NOTIFICATION_TYPE_LABELS).map(([value, label]) => ({ value, label }));
const SEVERITY_OPTIONS = Object.entries(NOTIFICATION_SEVERITY_LABELS).map(([value, label]) => ({ value, label }));
const READ_OPTIONS = [
  { value: 'all', label: 'Lette e non lette' },
  { value: 'unread', label: 'Solo non lette' },
  { value: 'read', label: 'Solo lette' },
];
const ARCHIVED_OPTIONS = [
  { value: 'false', label: 'Attive' },
  { value: 'true', label: 'Archiviate' },
];

const toDraft = (f: NotificationFiltersType): DraftValues => ({
  type: f.type,
  severity: f.severity,
  isRead: f.isRead,
  vehicleId: f.vehicleId,
  driverId: f.driverId,
  isArchived: f.isArchived ?? false,
  dateFrom: fromISODate(f.dateFrom),
  dateTo: fromISODate(f.dateTo),
});

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({ currentFilters, onApply, onReset }) => {
  const { options: vehicleOptions } = useActiveVehicles();
  const { options: driverOptions } = useActiveDrivers();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<DraftValues>(toDraft(currentFilters));

  const activeCount = [
    currentFilters.type,
    currentFilters.severity,
    currentFilters.isRead,
    currentFilters.vehicleId,
    currentFilters.driverId,
    currentFilters.dateFrom,
    currentFilters.dateTo,
    currentFilters.isArchived ? true : undefined, // "Attive" (false) è il default, non conta come filtro attivo
  ].filter(v => v !== undefined).length;

  const handleOpen = () => {
    setDraft(toDraft(currentFilters));
    setIsOpen(true);
  };

  const handleApply = () => {
    onApply({
      type: draft.type,
      severity: draft.severity,
      isRead: draft.isRead,
      vehicleId: draft.vehicleId,
      driverId: draft.driverId,
      isArchived: draft.isArchived,
      dateFrom: toISODate(draft.dateFrom),
      dateTo: toISODate(draft.dateTo),
    });
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

            <div className='p-4 space-y-5 max-h-[32rem] overflow-y-auto'>
              <Select
                label='Tipo'
                options={[{ value: 'all', label: 'Tutti i tipi' }, ...TYPE_OPTIONS]}
                value={draft.type ?? 'all'}
                onValueChange={value =>
                  setDraft(prev => ({ ...prev, type: value === 'all' ? undefined : (value as DraftValues['type']) }))
                }
              />

              <Select
                label='Severità'
                options={[{ value: 'all', label: 'Tutte le severità' }, ...SEVERITY_OPTIONS]}
                value={draft.severity ?? 'all'}
                onValueChange={value =>
                  setDraft(prev => ({ ...prev, severity: value === 'all' ? undefined : (value as DraftValues['severity']) }))
                }
              />

              <Select
                label='Stato lettura'
                options={READ_OPTIONS}
                value={draft.isRead === undefined ? 'all' : draft.isRead ? 'read' : 'unread'}
                onValueChange={value => setDraft(prev => ({ ...prev, isRead: value === 'all' ? undefined : value === 'read' }))}
              />

              <Select
                label='Veicolo'
                options={[{ value: 'all', label: 'Tutti i veicoli' }, ...vehicleOptions]}
                value={draft.vehicleId != null ? String(draft.vehicleId) : 'all'}
                onValueChange={value => setDraft(prev => ({ ...prev, vehicleId: value === 'all' ? undefined : Number(value) }))}
              />

              <Select
                label='Autista'
                options={[{ value: 'all', label: 'Tutti gli autisti' }, ...driverOptions]}
                value={draft.driverId != null ? String(draft.driverId) : 'all'}
                onValueChange={value => setDraft(prev => ({ ...prev, driverId: value === 'all' ? undefined : Number(value) }))}
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

              <Select
                label='Archiviazione'
                options={ARCHIVED_OPTIONS}
                value={String(draft.isArchived)}
                onValueChange={value => setDraft(prev => ({ ...prev, isArchived: value === 'true' }))}
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

export default NotificationFilters;
