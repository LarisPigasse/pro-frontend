// =============================================================================
// ASSET AZIENDALI — COMPONENT: DriverComplianceBadge
// features/vehicles/components/DriverComplianceBadge.tsx
// =============================================================================
//
// Semaforo visivo dello stato di conformità documentale di un autista.
//
// Varianti:
//   dot    — cerchio colorato (uso in tabella, compatto)
//   badge  — dot + etichetta testo (uso in header modal)
//   full   — dot + etichetta + conteggio documenti problematici
// =============================================================================

import React from 'react';
import type { DriverComplianceStatusValue } from '../types/vehicles.types';

// -----------------------------------------------------------------------------
// CONFIGURAZIONE STATUS
// -----------------------------------------------------------------------------

interface StatusConfig {
  dot: string; // classe colore del cerchio
  ring: string; // classe colore del ring (pulse)
  label: string; // etichetta testuale
  text: string; // classe colore del testo
}

const STATUS_CONFIG: Record<DriverComplianceStatusValue, StatusConfig> = {
  ok: {
    dot: 'bg-green-500',
    ring: 'bg-green-500',
    label: 'In regola',
    text: 'text-green-600',
  },
  expiring: {
    dot: 'bg-amber-500',
    ring: 'bg-amber-500',
    label: 'In scadenza',
    text: 'text-amber-600',
  },
  expired: {
    dot: 'bg-red-500',
    ring: 'bg-red-500',
    label: 'Scaduto',
    text: 'text-red-600',
  },
  none: {
    dot: 'bg-gray-400',
    ring: 'bg-gray-400',
    label: 'Nessun documento',
    text: 'text-text-secondary',
  },
};

// -----------------------------------------------------------------------------
// PROPS
// -----------------------------------------------------------------------------

interface DriverComplianceBadgeProps {
  status: DriverComplianceStatusValue;
  variant?: 'dot' | 'badge' | 'full';
  /** Numero documenti con problemi — usato solo in variant='full' */
  issueCount?: number;
  /** Aggiunge tooltip al passaggio del mouse */
  tooltip?: boolean;
  className?: string;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export const DriverComplianceBadge: React.FC<DriverComplianceBadgeProps> = ({
  status,
  variant = 'dot',
  issueCount,
  tooltip = true,
  className = '',
}) => {
  const config = STATUS_CONFIG[status];

  // ── Dot pulsante per stati critici ────────────────────────────────────────
  const dot = (
    <span className='relative flex items-center justify-center w-3 h-3 flex-shrink-0'>
      {/* Pulse animato per expired e expiring */}
      {(status === 'expired' || status === 'expiring') && (
        <span
          className={`absolute inline-flex w-full h-full rounded-full opacity-60
                      animate-ping ${config.ring}`}
        />
      )}
      <span className={`relative inline-flex w-2.5 h-2.5 rounded-full ${config.dot}`} />
    </span>
  );

  // ── Variante: solo dot ────────────────────────────────────────────────────
  if (variant === 'dot') {
    return (
      <span
        className={`inline-flex items-center justify-center ${className}`}
        title={tooltip ? config.label : undefined}
        aria-label={config.label}
      >
        {dot}
      </span>
    );
  }

  // ── Variante: dot + label ─────────────────────────────────────────────────
  if (variant === 'badge') {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`} aria-label={config.label}>
        {dot}
        <span className={`text-xs font-medium ${config.text}`}>{config.label}</span>
      </span>
    );
  }

  // ── Variante: dot + label + conteggio problemi ────────────────────────────
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-label={config.label}>
      {dot}
      <span className={`text-sm font-medium ${config.text}`}>{config.label}</span>
      {issueCount !== undefined && issueCount > 0 && (
        <span
          className={`
            inline-flex items-center justify-center min-w-5 h-5 px-1.5
            rounded-full text-xs font-semibold text-white
            ${status === 'expired' ? 'bg-red-500' : ''}
            ${status === 'expiring' ? 'bg-amber-500' : ''}
          `}
        >
          {issueCount}
        </span>
      )}
    </span>
  );
};
