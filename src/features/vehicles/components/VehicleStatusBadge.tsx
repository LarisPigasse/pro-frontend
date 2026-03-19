// =============================================================================
// VEHICLES MODULE — COMPONENT: VehicleStatusBadge
// features/vehicles/components/VehicleStatusBadge.tsx
// =============================================================================
//
// Badge colorato per lo status di un veicolo.
// Il colore viene letto direttamente da VehicleStatus.color (hex dal backend).
//
// Utilizzo:
//   <VehicleStatusBadge status={vehicle.status} />
//   <VehicleStatusBadge status={vehicle.status} size="lg" />
// =============================================================================

import React from 'react';

import type { VehicleStatus } from '../types/vehicles.types';

// -----------------------------------------------------------------------------
// PROPS
// -----------------------------------------------------------------------------

interface VehicleStatusBadgeProps {
  /** Oggetto status completo (con name, label, color) */
  status?: VehicleStatus | null;
  /** Dimensione del badge */
  size?: 'sm' | 'md' | 'lg';
  /** Classi aggiuntive */
  className?: string;
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

/**
 * Genera un colore di sfondo con opacità a partire da un hex.
 * es. "#22c55e" → "rgba(34, 197, 94, 0.15)"
 */
const hexToRgba = (hex: string, alpha: number): string => {
  const sanitized = hex.replace('#', '');
  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(107, 114, 128, ${alpha})`; // fallback grigio
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const SIZE_CLASSES: Record<NonNullable<VehicleStatusBadgeProps['size']>, string> = {
  sm: 'text-xs px-1.5 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1   gap-1.5',
  lg: 'text-sm px-3   py-1.5 gap-2',
};

const DOT_SIZE_CLASSES: Record<NonNullable<VehicleStatusBadgeProps['size']>, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2   h-2',
  lg: 'w-2.5 h-2.5',
};

// Fallback quando lo status non è disponibile
const FALLBACK_COLOR = '#6b7280'; // gray-500
const FALLBACK_LABEL = '—';

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export const VehicleStatusBadge: React.FC<VehicleStatusBadgeProps> = ({ status, size = 'md', className = '' }) => {
  const color = status?.color ?? FALLBACK_COLOR;
  const label = status?.label ?? status?.name ?? FALLBACK_LABEL;

  const bgStyle = { backgroundColor: hexToRgba(color, 0.12) };
  const dotStyle = { backgroundColor: color };
  const textStyle = { color };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium border
        ${SIZE_CLASSES[size]}
        ${className}
      `}
      style={{
        ...bgStyle,
        borderColor: hexToRgba(color, 0.3),
      }}
    >
      {/* Dot indicatore */}
      <span className={`rounded-full flex-shrink-0 ${DOT_SIZE_CLASSES[size]}`} style={dotStyle} />
      {/* Label */}
      <span style={textStyle}>{label}</span>
    </span>
  );
};
