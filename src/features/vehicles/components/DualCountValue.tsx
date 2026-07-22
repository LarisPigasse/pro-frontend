// =============================================================================
// ASSET AZIENDALI — COMPONENT: DualCountValue
// features/vehicles/components/DualCountValue.tsx
// =============================================================================
//
// Valore numerico "grande" di una StatCard, come rapporto pesato — "1 / 2",
// primo numero in rosso (scaduti), secondo in ambra (in scadenza). Controparte
// di DualCountSubtitle: stessa coppia di dati, resa in forma compatta.

import React from 'react';

interface DualCountValueProps {
  expiredCount: number;
  expiringCount: number;
}

export const DualCountValue: React.FC<DualCountValueProps> = ({ expiredCount, expiringCount }) => (
  <>
    <span className={expiredCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-text-primary'}>{expiredCount}</span>
    <span className='text-text-secondary mx-1'>/</span>
    <span className={expiringCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-text-primary'}>{expiringCount}</span>
  </>
);

export default DualCountValue;
