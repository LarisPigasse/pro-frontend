// =============================================================================
// ASSET AZIENDALI — COMPONENT: ActionItemsPanel
// features/vehicles/components/ActionItemsPanel.tsx
// =============================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, CalendarClock, Wrench, ShieldCheck } from 'lucide-react';
import { Card } from '@/core/components/layout';
import { Badge } from '@/core/components/ui';
import { Skeleton } from '@/core/components/feedback';
import type { DashboardActionItem, ActionItemSource } from '../types/dashboard.types';

const SOURCE_ICON: Record<ActionItemSource, React.ReactNode> = {
  vehicle_deadline: <CalendarClock className='w-4 h-4' />,
  maintenance_schedule: <Wrench className='w-4 h-4' />,
  driver_compliance: <ShieldCheck className='w-4 h-4' />,
};

interface ActionItemsPanelProps {
  items: DashboardActionItem[];
  loading?: boolean;
  className?: string;
}

export const ActionItemsPanel: React.FC<ActionItemsPanelProps> = ({ items, loading, className = '' }) => {
  if (loading) {
    return (
      <Card variant='default' padding='md' className={className}>
        <div className='flex flex-col gap-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-10 w-full' />
          ))}
        </div>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card variant='default' padding='md' className={className}>
        <div className='flex items-center gap-3 text-emerald-600 dark:text-emerald-400'>
          <CheckCircle2 className='w-6 h-6 flex-shrink-0' />
          <p className='text-sm font-medium'>
            Tutto in regola — nessuna scadenza, manutenzione o conformità richiede attenzione.
          </p>
        </div>
      </Card>
    );
  }

  const expiredCount = items.filter(i => i.urgency === 'expired').length;
  const expiringCount = items.length - expiredCount;

  return (
    <Card variant='default' padding='none' className={className}>
      <div className='px-4 py-3 border-b border-border-default flex items-center gap-3'>
        <h2 className='text-sm font-semibold text-text-primary'>Richiede attenzione</h2>
        {expiredCount > 0 && (
          <Badge variant='danger' size='sm'>
            {expiredCount} scadut{expiredCount === 1 ? 'o' : 'i'}
          </Badge>
        )}
        {expiringCount > 0 && (
          <Badge variant='warning' size='sm'>
            {expiringCount} in scadenza
          </Badge>
        )}
      </div>

      <div className='divide-y divide-border-default'>
        {items.map(item => (
          <Link
            key={item.id}
            to={item.linkTo}
            className='flex items-center gap-3 px-4 py-3 hover:bg-bg-hover transition-colors'
          >
            <span
              className={item.urgency === 'expired' ? 'text-red-500 dark:text-red-400' : 'text-amber-500 dark:text-amber-400'}
            >
              {SOURCE_ICON[item.source]}
            </span>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-text-primary truncate'>
                {item.label} <span className='text-text-secondary font-normal'>· {item.subject}</span>
              </p>
            </div>
            <Badge variant={item.urgency === 'expired' ? 'danger' : 'warning'} size='sm'>
              {item.dueLabel}
            </Badge>
          </Link>
        ))}
      </div>
    </Card>
  );
};

export default ActionItemsPanel;
