// =============================================================================
// ASSET AZIENDALI — COMPONENT: DriverComplianceBadge
// features/vehicles/components/DriverComplianceBadge.tsx
// =============================================================================
//
// Badge riassuntivo dello stato di conformità documentale di un autista.
// Presentazionale puro — riceve il riepilogo già calcolato da useDriverCompliances,
// nessuna logica di business qui dentro.
//

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { CheckCircle2, AlertTriangle, XCircle, MinusCircle, HelpCircle } from 'lucide-react';
import { Badge } from '@/core/components/ui';
import type { BadgeVariant } from '@/core/components/ui/badge/Badge';
import { Tooltip } from '@/core/components/feedback';
import { DRIVER_COMPLIANCE_STATUS_LABELS } from '../types/vehicles.types';
import type { DriverComplianceSummary } from '../hooks/useDriverCompliances';

interface DriverComplianceBadgeProps {
  /** undefined mentre il batch è in corso di caricamento */
  summary?: DriverComplianceSummary;
}

interface StatusConfigEntry {
  variant: BadgeVariant;
  icon: LucideIcon; // riferimento al componente, NON un elemento JSX già istanziato
}

const STATUS_CONFIG: Record<DriverComplianceSummary['status'], StatusConfigEntry> = {
  valid: { variant: 'success', icon: CheckCircle2 },
  expiring: { variant: 'warning', icon: AlertTriangle },
  expired: { variant: 'danger', icon: XCircle },
  not_applicable: { variant: 'default', icon: MinusCircle },
  none: { variant: 'default', icon: HelpCircle },
};

/** Costruisce il testo del tooltip in base al dettaglio del riepilogo */
const buildTooltipText = (summary: DriverComplianceSummary): string => {
  if (summary.status === 'none') return 'Nessun documento registrato';
  if (summary.status === 'expired') {
    const parts = [`${summary.expiredCount} scadut${summary.expiredCount === 1 ? 'o' : 'i'}`];
    if (summary.expiringCount > 0) parts.push(`${summary.expiringCount} in scadenza`);
    return parts.join(', ');
  }
  if (summary.status === 'expiring')
    return `${summary.expiringCount} document${summary.expiringCount === 1 ? 'o' : 'i'} in scadenza`;
  if (summary.status === 'not_applicable') return 'Nessun documento con scadenza';
  return `${summary.totalCount} document${summary.totalCount === 1 ? 'o' : 'i'} in regola`;
};

export const DriverComplianceBadge: React.FC<DriverComplianceBadgeProps> = ({ summary }) => {
  // Stato di caricamento — placeholder discreto, evita layout shift nella colonna
  if (!summary) {
    return (
      <Badge variant='default' size='sm'>
        <span className='inline-block w-3 h-3 rounded-full border-2 border-text-placeholder border-t-transparent animate-spin' />
      </Badge>
    );
  }

  const { variant, icon: Icon } = STATUS_CONFIG[summary.status];

  return (
    <Tooltip content={buildTooltipText(summary)} side='top'>
      <Badge variant={variant} size='sm' className='inline-flex items-center gap-1 cursor-default'>
        <Icon className='w-3.5 h-3.5' />
        {DRIVER_COMPLIANCE_STATUS_LABELS[summary.status]}
      </Badge>
    </Tooltip>
  );
};

export default DriverComplianceBadge;
