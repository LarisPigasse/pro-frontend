// =============================================================================
// ASSET AZIENDALI — COMPONENT: DeadlineStatusBadge
// features/vehicles/components/DeadlineStatusBadge.tsx
// =============================================================================

import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/core/components/ui';
import type { BadgeVariant } from '@/core/components/ui/badge/Badge';
import { DEADLINE_STATUS_LABELS } from '../types/vehicles.types';
import type { DeadlineStatus } from '../types/vehicles.types';

interface StatusConfigEntry {
  variant: BadgeVariant;
  icon: LucideIcon;
}

const STATUS_CONFIG: Record<DeadlineStatus, StatusConfigEntry> = {
  valid: { variant: 'success', icon: CheckCircle2 },
  expiring: { variant: 'warning', icon: AlertTriangle },
  expired: { variant: 'danger', icon: XCircle },
};

interface DeadlineStatusBadgeProps {
  status: DeadlineStatus;
}

export const DeadlineStatusBadge: React.FC<DeadlineStatusBadgeProps> = ({ status }) => {
  const { variant, icon: Icon } = STATUS_CONFIG[status];
  return (
    <Badge variant={variant} size='sm' className='inline-flex items-center gap-1'>
      <Icon className='w-3.5 h-3.5' />
      {DEADLINE_STATUS_LABELS[status]}
    </Badge>
  );
};

export default DeadlineStatusBadge;
