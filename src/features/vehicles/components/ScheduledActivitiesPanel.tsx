// =============================================================================
// ASSET AZIENDALI — COMPONENT: ScheduledActivitiesPanel
// features/vehicles/components/ScheduledActivitiesPanel.tsx
// =============================================================================
//
// Sostituisce ScheduledMaintenancePanel.tsx — unifica scadenze veicoli e
// manutenzioni. Le voci "in regola" sono nascoste di default in una sezione
// a comparsa, per non affollare la vista con ciò che non richiede attenzione.
//
// Tre livelli di evidenza per le voci critiche/in scadenza:
//  1. Scaduta E improrogabile (es. revisione)      → sfondo rosso pieno sulla riga
//  2. Scaduta ma prorogabile (bollo) o manutenzione → solo badge rosso
//  3. In scadenza                                    → badge ambra

import React, { useState } from 'react';
import { CalendarClock, Wrench, CheckCircle2, AlertTriangle, ChevronDown } from 'lucide-react';
import { Card } from '@/core/components/layout';
import { Badge, Button } from '@/core/components/ui';
import { Skeleton } from '@/core/components/feedback';
import type { ScheduledActivityItem } from '../types/dashboard.types';

interface ScheduledActivitiesPanelProps {
  items: ScheduledActivityItem[];
  loading?: boolean;
  onRenewDeadline: (item: Extract<ScheduledActivityItem, { source: 'vehicle_deadline' }>) => void;
  onMarkMaintenanceDone: (item: Extract<ScheduledActivityItem, { source: 'maintenance_schedule' }>) => void;
}

export const ScheduledActivitiesPanel: React.FC<ScheduledActivitiesPanelProps> = ({
  items,
  loading,
  onRenewDeadline,
  onMarkMaintenanceDone,
}) => {
  const [showOk, setShowOk] = useState(false);

  const header = (
    <div className='px-4 py-3 border-b border-border-default'>
      <h2 className='text-sm font-semibold text-text-primary'>
        Programmazione{' '}
        <span className='font-normal text-text-secondary'>· scadenze e manutenzioni in ordine di prossimità</span>
      </h2>
    </div>
  );

  if (loading) {
    return (
      <Card variant='default' padding='none'>
        {header}
        <div className='flex flex-col gap-3 p-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-10 w-full' />
          ))}
        </div>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card variant='default' padding='none'>
        {header}
        <div className='flex items-center gap-3 text-text-secondary px-4 py-6'>
          <CheckCircle2 className='w-5 h-5 flex-shrink-0' />
          <p className='text-sm'>Nessuna scadenza o manutenzione programmata al momento.</p>
        </div>
      </Card>
    );
  }

  const criticalItems = items.filter(i => i.urgency !== 'ok');
  const okItems = items.filter(i => i.urgency === 'ok');

  const renderRow = (item: ScheduledActivityItem) => {
    const isCriticalRow = item.urgency === 'overdue' && item.source === 'vehicle_deadline' && !item.isPostponable;
    const badgeVariant = item.urgency === 'overdue' ? 'danger' : item.urgency === 'upcoming' ? 'warning' : 'default';

    return (
      <div
        key={item.id}
        className={`flex items-center gap-3 px-4 py-3 transition-colors ${
          isCriticalRow ? 'bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50' : 'hover:bg-bg-hover'
        }`}
      >
        <span
          className={
            item.urgency === 'overdue'
              ? 'text-red-500 dark:text-red-400'
              : item.urgency === 'upcoming'
                ? 'text-amber-500 dark:text-amber-400'
                : 'text-text-secondary'
          }
        >
          {item.source === 'vehicle_deadline' ? <CalendarClock className='w-4 h-4' /> : <Wrench className='w-4 h-4' />}
        </span>

        <div className='flex-1 min-w-0'>
          <p className='text-sm font-medium text-text-primary truncate flex items-center gap-1.5'>
            {item.label} <span className='text-text-secondary font-normal'>· {item.subject}</span>
            {isCriticalRow && (
              <span title='Scadenza improrogabile'>
                <AlertTriangle className='w-3.5 h-3.5 text-red-500 dark:text-red-400 flex-shrink-0' />
              </span>
            )}
          </p>
        </div>

        <Badge variant={badgeVariant} size='sm'>
          {item.dueLabel}
        </Badge>

        {item.source === 'vehicle_deadline' ? (
          <Button variant='ghost' size='sm' onClick={() => onRenewDeadline(item)}>
            Rinnova
          </Button>
        ) : (
          <Button variant='ghost' size='sm' onClick={() => onMarkMaintenanceDone(item)}>
            Segna come svolta
          </Button>
        )}
      </div>
    );
  };

  return (
    <Card variant='default' padding='none'>
      {header}

      <div className='divide-y divide-border-default max-h-96 overflow-y-auto'>
        {criticalItems.length > 0 ? (
          criticalItems.map(renderRow)
        ) : (
          <div className='flex items-center gap-3 text-emerald-600 dark:text-emerald-400 px-4 py-4'>
            <CheckCircle2 className='w-5 h-5 flex-shrink-0' />
            <p className='text-sm font-medium'>Nessuna scadenza o manutenzione urgente al momento.</p>
          </div>
        )}
      </div>

      {okItems.length > 0 && (
        <div className='border-t border-border-default'>
          <button
            type='button'
            onClick={() => setShowOk(prev => !prev)}
            className='w-full flex items-center justify-between px-4 py-3 text-sm text-text-secondary hover:bg-bg-hover transition-colors'
          >
            <span>{okItems.length} in regola, non ancora da programmare</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showOk ? 'rotate-180' : ''}`} />
          </button>
          {showOk && (
            <div className='divide-y divide-border-default border-t border-border-default'>{okItems.map(renderRow)}</div>
          )}
        </div>
      )}
    </Card>
  );
};

export default ScheduledActivitiesPanel;
