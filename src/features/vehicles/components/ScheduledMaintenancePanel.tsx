// =============================================================================
// ASSET AZIENDALI — COMPONENT: ScheduledMaintenancePanel
// features/vehicles/components/ScheduledMaintenancePanel.tsx
// =============================================================================

import React from 'react';
import { Wrench, CheckCircle2 } from 'lucide-react';
import { Card } from '@/core/components/layout';
import { Badge, Button } from '@/core/components/ui';
import { Skeleton } from '@/core/components/feedback';
import type { ScheduledMaintenanceItem } from '../types/dashboard.types';

interface ScheduledMaintenancePanelProps {
  items: ScheduledMaintenanceItem[];
  loading?: boolean;
  onMarkDone: (item: ScheduledMaintenanceItem) => void;
}

export const ScheduledMaintenancePanel: React.FC<ScheduledMaintenancePanelProps> = ({ items, loading, onMarkDone }) => {
  const header = (
    <div className='px-4 py-3 border-b border-border-default'>
      <h2 className='text-sm font-semibold text-text-primary'>
        Programmazione <span className='font-normal text-text-secondary'>· da effettuare / scaduta non effettuata</span>
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
          <p className='text-sm'>Nessuna manutenzione programmata al momento.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant='default' padding='none'>
      {header}
      <div className='divide-y divide-border-default'>
        {items.map(item => {
          const badgeVariant = item.isOverdue ? 'danger' : item.schedule.status === 'warning' ? 'warning' : 'default';
          return (
            <div key={item.schedule.id} className='flex items-center gap-3 px-4 py-3 hover:bg-bg-hover transition-colors'>
              <span className={item.isOverdue ? 'text-red-500 dark:text-red-400' : 'text-text-secondary'}>
                <Wrench className='w-4 h-4' />
              </span>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-text-primary truncate'>
                  {item.schedule.maintenanceType.label}{' '}
                  <span className='text-text-secondary font-normal'>
                    · {item.schedule.vehicle.brand} {item.schedule.vehicle.model}
                    {item.schedule.vehicle.plate ? ` · ${item.schedule.vehicle.plate}` : ''}
                  </span>
                </p>
              </div>
              <Badge variant={badgeVariant} size='sm'>
                {item.dueLabel}
              </Badge>
              <Button variant='ghost' size='sm' onClick={() => onMarkDone(item)}>
                Segna come svolta
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ScheduledMaintenancePanel;
