// src/features/sistema/components/ServiceStatusCard.tsx

import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Wifi } from 'lucide-react';
import { Card } from '@/core/components/layout';
import { Skeleton } from '@/core/components/feedback';
import type { ServiceHealth, ServiceStatus } from '../api/sistemaApi';

// ============================================================================
// HELPERS UI
// ============================================================================

const STATUS_CONFIG: Record<ServiceStatus, {
  icon:       React.ReactNode;
  label:      string;
  dotColor:   string;
  textColor:  string;
  cardBorder: string;
}> = {
  UP: {
    icon:       <CheckCircle className="w-5 h-5 text-emerald-500" />,
    label:      'Operativo',
    dotColor:   'bg-emerald-500',
    textColor:  'text-emerald-600 dark:text-emerald-400',
    cardBorder: 'border-l-4 border-l-emerald-500',
  },
  DEGRADED: {
    icon:       <AlertTriangle className="w-5 h-5 text-amber-500" />,
    label:      'Degradato',
    dotColor:   'bg-amber-500',
    textColor:  'text-amber-600 dark:text-amber-400',
    cardBorder: 'border-l-4 border-l-amber-500',
  },
  DOWN: {
    icon:       <XCircle className="w-5 h-5 text-red-500" />,
    label:      'Non disponibile',
    dotColor:   'bg-red-500',
    textColor:  'text-red-600 dark:text-red-400',
    cardBorder: 'border-l-4 border-l-red-500',
  },
};

// ============================================================================
// COMPONENTE
// ============================================================================

interface ServiceStatusCardProps {
  service:  ServiceHealth;
  loading?: boolean;
}

export const ServiceStatusCard: React.FC<ServiceStatusCardProps> = ({ service, loading }) => {
  if (loading) {
    return (
      <Card variant="default" padding="md">
        <Skeleton className="h-4 w-32 mb-3" />
        <Skeleton className="h-6 w-24 mb-2" />
        <Skeleton className="h-3 w-20" />
      </Card>
    );
  }

  const cfg = STATUS_CONFIG[service.status];

  return (
    <Card variant="default" padding="md" className={cfg.cardBorder}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">

          {/* Nome servizio */}
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-text-secondary" />
            <span className="text-sm font-semibold text-text-primary">
              {service.name}
            </span>
          </div>

          {/* Stato */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex h-2 w-2 rounded-full ${cfg.dotColor} ${
              service.status === 'UP' ? 'animate-pulse' : ''
            }`} />
            <span className={`text-sm font-medium ${cfg.textColor}`}>
              {cfg.label}
            </span>
          </div>

          {/* Response time o errore */}
          {service.status === 'UP' && service.responseTime !== null && (
            <span className="text-xs text-text-secondary">
              {service.responseTime} ms
            </span>
          )}
          {service.error && (
            <span className="text-xs text-red-500 font-mono">
              {service.error}
            </span>
          )}

        </div>

        {/* Icona stato */}
        <div className="mt-0.5">
          {cfg.icon}
        </div>
      </div>
    </Card>
  );
};

export default ServiceStatusCard;
