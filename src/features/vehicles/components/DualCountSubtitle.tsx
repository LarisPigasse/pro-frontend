// =============================================================================
// ASSET AZIENDALI — COMPONENT: DualCountSubtitle
// features/vehicles/components/DualCountSubtitle.tsx
// =============================================================================
//
// Subtitle per StatCard con due conteggi pesati — "N scaduti / M in scadenza".
// Usato dalle card "problematiche" della Dashboard (Scadenze/Manutenzioni/Conformità).

import React from 'react';

interface DualCountSubtitleProps {
  expiredCount: number;
  expiredLabel: { singular: string; plural: string };
  expiringCount: number;
}

export const DualCountSubtitle: React.FC<DualCountSubtitleProps> = ({ expiredCount, expiredLabel, expiringCount }) => (
  <>
    <span className={expiredCount > 0 ? 'font-semibold text-red-600 dark:text-red-400' : ''}>
      {expiredCount} {expiredCount === 1 ? expiredLabel.singular : expiredLabel.plural}
    </span>
    {' / '}
    <span className={expiringCount > 0 ? 'font-semibold text-amber-600 dark:text-amber-400' : ''}>
      {expiringCount} in scadenza
    </span>
  </>
);

export default DualCountSubtitle;
