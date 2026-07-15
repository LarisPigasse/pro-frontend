// =============================================================================
// ASSET AZIENDALI — PAGE: Interventi
// features/vehicles/pages/Interventi.tsx
// =============================================================================

import React from 'react';
import { PageHeader } from '@/core/components/layout';
import { Tabs } from '@/core/components/navigation/tabs/Tabs';
import type { TabItem } from '@/core/components/navigation/tabs/Tabs';
import { MaintenanceRecordsSection, MaintenanceSchedulesSection } from '../components';

export const Interventi: React.FC = () => {
  const tabs: TabItem[] = [
    { id: 'records', label: 'Interventi', content: <MaintenanceRecordsSection /> },
    { id: 'schedules', label: 'Programmazione', content: <MaintenanceSchedulesSection /> },
  ];

  return (
    <>
      <PageHeader title='Interventi' subtitle='Interventi di manutenzione e programmazione futura' />
      <div className='mt-2'>
        <Tabs items={tabs} variant='underline' size='md' />
      </div>
    </>
  );
};

export default Interventi;
