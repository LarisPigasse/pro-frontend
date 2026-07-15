// =============================================================================
// ASSET AZIENDALI — COMPONENT: ScheduleStatusBadge
// features/vehicles/components/ScheduleStatusBadge.tsx
// =============================================================================

import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/core/components/ui';
import type { BadgeVariant } from '@/core/components/ui/badge/Badge';
import { SCHEDULE_STATUS_LABELS } from '../types/vehicles.types';
import type { ScheduleStatus } from '../types/vehicles.types';

interface StatusConfigEntry {
  variant: BadgeVariant;
  icon: LucideIcon;
}

const STATUS_CONFIG: Record<ScheduleStatus, StatusConfigEntry> = {
  ok: { variant: 'success', icon: CheckCircle2 },
  warning: { variant: 'warning', icon: AlertTriangle },
  overdue: { variant: 'danger', icon: XCircle },
};

interface ScheduleStatusBadgeProps {
  status: ScheduleStatus;
}

export const ScheduleStatusBadge: React.FC<ScheduleStatusBadgeProps> = ({ status }) => {
  const { variant, icon: Icon } = STATUS_CONFIG[status];
  return (
    <Badge variant={variant} size='sm' className='inline-flex items-center gap-1'>
      <Icon className='w-3.5 h-3.5' />
      {SCHEDULE_STATUS_LABELS[status]}
    </Badge>
  );
};

export default ScheduleStatusBadge;
