// =============================================================================
// ASSET AZIENDALI — COMPONENT: ComplianceStatusPanel
// features/vehicles/components/ComplianceStatusPanel.tsx
// =============================================================================
//
// Rinominato da ActionItemsPanel.tsx — prima univa 3 domini (scadenze,
// manutenzioni, conformità), ora dedicato solo a Conformità autisti dopo la
// ristrutturazione della Dashboard.

import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { Card } from '@/core/components/layout';
import { Badge } from '@/core/components/ui';
import { Skeleton } from '@/core/components/feedback';
import type { ComplianceActionItem } from '../types/dashboard.types';

interface ComplianceStatusPanelProps {
  items: ComplianceActionItem[];
  loading?: boolean;
  className?: string;
}

export const ComplianceStatusPanel: React.FC<ComplianceStatusPanelProps> = ({ items, loading, className = '' }) => {
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
          <p className='text-sm font-medium'>Tutte le conformità autisti sono in regola.</p>
        </div>
      </Card>
    );
  }

  const expiredCount = items.filter(i => i.urgency === 'expired').length;
  const expiringCount = items.length - expiredCount;

  return (
    <Card variant='default' padding='none' className={className}>
      <div className='px-4 py-3 border-b border-border-default flex items-center gap-3'>
        <h2 className='text-sm font-semibold text-text-primary'>Conformità autisti</h2>
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
              <ShieldCheck className='w-4 h-4' />
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

export default ComplianceStatusPanel;
