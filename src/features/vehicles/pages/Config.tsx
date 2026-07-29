// =============================================================================
// ASSET AZIENDALI — PAGE: Configurazione
// features/vehicles/pages/Config.tsx
// =============================================================================

import React from 'react';
import { PageHeader } from '@/core/components/layout';
import { Tabs } from '@/core/components/navigation/tabs/Tabs';
import type { TabItem } from '@/core/components/navigation/tabs/Tabs';
import {
  WorkshopsSection,
  CategoriesSection,
  DeadlineTypesSection,
  MaintenanceTypesSection,
  DriverComplianceTypesSection,
  TelematicsProvidersSection,
  AlertRecipientsSection,
} from '../components';

/** Segnaposto temporaneo per le sezioni non ancora costruite — sostituito una a una */
// const ComingSoon: React.FC<{ label: string }> = ({ label }) => (
//   <div className='flex items-center justify-center py-16 text-text-secondary italic'>Sezione "{label}" in costruzione</div>
// );

export const Config: React.FC = () => {
  const tabs: TabItem[] = [
    { id: 'categories', label: 'Categorie Veicolo', content: <CategoriesSection /> },
    { id: 'telematics', label: 'Fornitori Telematici', content: <TelematicsProvidersSection /> },
    { id: 'workshops', label: 'Officine', content: <WorkshopsSection /> },
    { id: 'deadline-types', label: 'Tipi Scadenza', content: <DeadlineTypesSection /> },
    { id: 'maintenance-types', label: 'Tipi Manutenzione', content: <MaintenanceTypesSection /> },
    { id: 'driver-compliance-types', label: 'Tipi Conformità Autisti', content: <DriverComplianceTypesSection /> },
    { id: 'alert-recipients', label: 'Destinatari Avvisi', content: <AlertRecipientsSection /> },
  ];

  return (
    <>
      <PageHeader title='Configurazione' subtitle='Gestione delle tabelle di riferimento del modulo Asset Aziendali' />

      <div className='mt-2'>
        <Tabs items={tabs} variant='underline' size='md' />
      </div>
    </>
  );
};

export default Config;
