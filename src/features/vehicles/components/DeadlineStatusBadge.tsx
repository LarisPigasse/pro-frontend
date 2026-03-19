// =============================================================================
// VEHICLES MODULE — COMPONENT: DeadlineStatusBadge
// features/vehicles/components/DeadlineStatusBadge.tsx
// =============================================================================
//
// Badge per lo stato delle scadenze veicolo e conformità autisti.
// I colori sono fissi (logica applicativa), non configurabili dal backend.
//
// Stati possibili (da statusChecker.ts backend):
//   active    → verde   — scadenza valida
//   expiring  → arancio — scadenza in avvicinamento (entro alertDays1)
//   expired   → rosso   — scadenza superata
//
// Utilizzo:
//   <DeadlineStatusBadge status="active" />
//   <DeadlineStatusBadge status="expired" showLabel={false} />
//   <DeadlineStatusBadge status={vehicle.worstDeadlineStatus} size="sm" />
// =============================================================================

import React from 'react';

import type { DeadlineStatusValue } from '../types/vehicles.types';

// -----------------------------------------------------------------------------
// PROPS
// -----------------------------------------------------------------------------

interface DeadlineStatusBadgeProps {
  /** Valore status da statusChecker.ts */
  status?: DeadlineStatusValue | null;
  /** Dimensione badge */
  size?: 'sm' | 'md' | 'lg';
  /** Mostra il testo label (default: true) */
  showLabel?: boolean;
  /** Classi aggiuntive */
  className?: string;
}

// -----------------------------------------------------------------------------
// CONFIGURAZIONE STATI
// -----------------------------------------------------------------------------

interface StatusConfig {
  label: string;
  color: string; // testo e dot
  bgColor: string; // sfondo
  borderColor: string; // bordo
}

const STATUS_CONFIG: Record<DeadlineStatusValue, StatusConfig> = {
  active: {
    label: 'Attiva',
    color: '#16a34a', // green-600
    bgColor: 'rgba(22, 163, 74, 0.10)',
    borderColor: 'rgba(22, 163, 74, 0.25)',
  },
  expiring: {
    label: 'In scadenza',
    color: '#d97706', // amber-600
    bgColor: 'rgba(217, 119, 6, 0.10)',
    borderColor: 'rgba(217, 119, 6, 0.25)',
  },
  expired: {
    label: 'Scaduta',
    color: '#dc2626', // red-600
    bgColor: 'rgba(220, 38, 38, 0.10)',
    borderColor: 'rgba(220, 38, 38, 0.25)',
  },
};

const FALLBACK_CONFIG: StatusConfig = {
  label: '—',
  color: '#6b7280',
  bgColor: 'rgba(107, 114, 128, 0.10)',
  borderColor: 'rgba(107, 114, 128, 0.25)',
};

// -----------------------------------------------------------------------------
// SIZE CLASSES
// -----------------------------------------------------------------------------

const SIZE_CLASSES: Record<NonNullable<DeadlineStatusBadgeProps['size']>, string> = {
  sm: 'text-xs px-1.5 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1   gap-1.5',
  lg: 'text-sm px-3   py-1.5 gap-2',
};

const DOT_SIZE_CLASSES: Record<NonNullable<DeadlineStatusBadgeProps['size']>, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2   h-2',
  lg: 'w-2.5 h-2.5',
};

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export const DeadlineStatusBadge: React.FC<DeadlineStatusBadgeProps> = ({
  status,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  const config = status ? (STATUS_CONFIG[status] ?? FALLBACK_CONFIG) : FALLBACK_CONFIG;

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium border
        ${SIZE_CLASSES[size]}
        ${className}
      `}
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
      }}
    >
      {/* Dot — sempre visibile anche senza label */}
      <span className={`rounded-full flex-shrink-0 ${DOT_SIZE_CLASSES[size]}`} style={{ backgroundColor: config.color }} />

      {/* Label — opzionale */}
      {showLabel && <span style={{ color: config.color }}>{config.label}</span>}
    </span>
  );
};
