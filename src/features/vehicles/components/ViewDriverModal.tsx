// =============================================================================
// ASSET AZIENDALI — COMPONENT: ViewDriverModal
// features/vehicles/components/ViewDriverModal.tsx
// =============================================================================
//
// Modal di dettaglio autista con due tab:
//   - Anagrafica   — dati personali e patente
//   - Scadenze     — conformità documentale con semaforo per documento
// =============================================================================

import React, { useState } from 'react';

import { Modal } from '@/core/components/ui/';
import { Button } from '@/core/components/ui/';
import { DriverComplianceBadge } from './DriverComplianceBadge';
import type { DriverWithCompliance, DriverCompliance, DriverComplianceStatusValue } from '../types/vehicles.types';

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function computeDocumentStatus(expiryDate: string | null): DriverComplianceStatusValue {
  if (!expiryDate) return 'none';
  const now = new Date();
  const limit = new Date();
  limit.setDate(limit.getDate() + 30);
  const expiry = new Date(expiryDate);
  if (expiry < now) return 'expired';
  if (expiry < limit) return 'expiring';
  return 'ok';
}

function daysUntilExpiry(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// -----------------------------------------------------------------------------
// LABEL TIPO DOCUMENTO
// -----------------------------------------------------------------------------

const COMPLIANCE_TYPE_LABELS: Record<string, string> = {
  license: 'Patente di guida',
  cqc: 'CQC',
  medical: 'Visita medica',
  tachograph: 'Tessera tachigrafo',
};

function getComplianceLabel(complianceType: unknown): string {
  if (!complianceType) return 'Documento';
  if (typeof complianceType === 'string') {
    return COMPLIANCE_TYPE_LABELS[complianceType] ?? complianceType;
  }
  // complianceType è un oggetto DriverComplianceType con .name
  if (typeof complianceType === 'object' && complianceType !== null && 'name' in complianceType) {
    const obj = complianceType as { name: string };
    return COMPLIANCE_TYPE_LABELS[obj.name] ?? obj.name;
  }
  return 'Documento';
}

// -----------------------------------------------------------------------------
// SUB-COMPONENT: Campo anagrafica
// -----------------------------------------------------------------------------

const Field: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className='flex flex-col gap-0.5'>
    <span className='text-xs text-text-secondary'>{label}</span>
    <span className='text-sm text-text-primary'>{value || '—'}</span>
  </div>
);

// -----------------------------------------------------------------------------
// SUB-COMPONENT: Tab Anagrafica
// -----------------------------------------------------------------------------

const TabAnagrafica: React.FC<{ driver: DriverWithCompliance }> = ({ driver }) => (
  <div className='flex flex-col gap-6'>
    {/* Dati personali */}
    <div>
      <h3 className='text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3'>Dati personali</h3>
      <div className='grid grid-cols-2 gap-4'>
        <Field label='Nome' value={driver.firstName} />
        <Field label='Cognome' value={driver.lastName} />
        <Field
          label='Codice fiscale'
          value={driver.fiscalCode ? <span className='font-mono'>{driver.fiscalCode}</span> : null}
        />
        <Field
          label='Stato'
          value={
            driver.isActive ? (
              <span className='text-green-600 font-medium'>Attivo</span>
            ) : (
              <span className='text-text-secondary'>Disattivato</span>
            )
          }
        />
      </div>
    </div>

    {/* Contatti */}
    <div>
      <h3 className='text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3'>Contatti</h3>
      <div className='grid grid-cols-2 gap-4'>
        <Field label='Email' value={driver.email} />
        <Field label='Telefono' value={driver.phone} />
      </div>
    </div>

    {/* Patente */}
    <div>
      <h3 className='text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3'>Patente di guida</h3>
      <div className='grid grid-cols-2 gap-4'>
        <Field
          label='Numero patente'
          value={driver.licenseNumber ? <span className='font-mono'>{driver.licenseNumber}</span> : null}
        />
        <Field
          label='Scadenza patente'
          value={
            <span
              className={
                computeDocumentStatus(driver.licenseExpiry) === 'expired'
                  ? 'text-red-600 font-medium'
                  : computeDocumentStatus(driver.licenseExpiry) === 'expiring'
                    ? 'text-amber-600 font-medium'
                    : ''
              }
            >
              {formatDate(driver.licenseExpiry)}
            </span>
          }
        />
      </div>
    </div>

    {/* Note */}
    {driver.notes && (
      <div>
        <h3 className='text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3'>Note</h3>
        <p className='text-sm text-text-primary whitespace-pre-wrap'>{driver.notes}</p>
      </div>
    )}
  </div>
);

// -----------------------------------------------------------------------------
// SUB-COMPONENT: Riga documento conformità
// -----------------------------------------------------------------------------

const ComplianceRow: React.FC<{ compliance: DriverCompliance }> = ({ compliance }) => {
  const status = computeDocumentStatus(compliance.expiryDate);
  const days = daysUntilExpiry(compliance.expiryDate);

  return (
    <div
      className='flex items-center justify-between gap-4 p-3 rounded-lg
                    border border-border-primary bg-surface-secondary/50'
    >
      <div className='flex items-center gap-3 min-w-0'>
        <DriverComplianceBadge status={status} variant='dot' tooltip={false} />
        <div className='min-w-0'>
          <p className='text-sm font-medium text-text-primary'>{getComplianceLabel(compliance.complianceType)}</p>
          {compliance.documentNumber && <p className='text-xs text-text-secondary font-mono'>{compliance.documentNumber}</p>}
        </div>
      </div>

      <div className='text-right flex-shrink-0'>
        <p
          className={`text-sm font-medium
          ${status === 'expired' ? 'text-red-600' : ''}
          ${status === 'expiring' ? 'text-amber-600' : ''}
          ${status === 'ok' ? 'text-text-primary' : ''}
          ${status === 'none' ? 'text-text-secondary' : ''}
        `}
        >
          {compliance.expiryDate ? formatDate(compliance.expiryDate) : '—'}
        </p>
        {days !== null && status !== 'none' && (
          <p className='text-xs text-text-secondary'>
            {days < 0 ? `Scaduta da ${Math.abs(days)} giorni` : days === 0 ? 'Scade oggi' : `Scade tra ${days} giorni`}
          </p>
        )}
        {!compliance.expiryDate && <p className='text-xs text-text-secondary'>Nessuna scadenza</p>}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// SUB-COMPONENT: Tab Scadenze
// -----------------------------------------------------------------------------

const TabScadenze: React.FC<{ driver: DriverWithCompliance }> = ({ driver }) => {
  const { details, overall } = driver.complianceStatus;

  return (
    <div className='flex flex-col gap-4'>
      {/* Riepilogo stato globale */}
      <div
        className='flex items-center justify-between p-3 rounded-lg
                      border border-border-primary bg-surface-secondary/50'
      >
        <span className='text-sm text-text-secondary'>Stato conformità globale</span>
        <DriverComplianceBadge status={overall} variant='badge' />
      </div>

      {/* Lista documenti */}
      {details.length === 0 ? (
        <div
          className='flex flex-col items-center justify-center gap-3 py-10
                        text-text-secondary'
        >
          <svg className='w-8 h-8 opacity-30' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586
                 a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
          <p className='text-sm'>Nessun documento registrato</p>
        </div>
      ) : (
        <div className='flex flex-col gap-2'>
          {details.map(c => (
            <ComplianceRow key={c.id} compliance={c} />
          ))}
        </div>
      )}

      {/* Note documento (se presenti) */}
      {details.some(c => c.notes) && (
        <div className='flex flex-col gap-2'>
          <h3 className='text-xs font-semibold text-text-secondary uppercase tracking-wide'>Note documenti</h3>
          {details
            .filter(c => c.notes)
            .map(c => (
              <div key={c.id} className='text-sm text-text-secondary'>
                <span className='font-medium text-text-primary'>{getComplianceLabel(c.complianceType)}:</span> {c.notes}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// TAB TYPES
// -----------------------------------------------------------------------------

type TabId = 'anagrafica' | 'scadenze';

const TABS: { id: TabId; label: string }[] = [
  { id: 'anagrafica', label: 'Anagrafica' },
  { id: 'scadenze', label: 'Scadenze' },
];

// -----------------------------------------------------------------------------
// PROPS
// -----------------------------------------------------------------------------

interface ViewDriverModalProps {
  driver: DriverWithCompliance | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

// -----------------------------------------------------------------------------
// COMPONENT PRINCIPALE
// -----------------------------------------------------------------------------

export const ViewDriverModal: React.FC<ViewDriverModalProps> = ({ driver, isOpen, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState<TabId>('anagrafica');

  // Reset tab quando si apre un nuovo autista
  React.useEffect(() => {
    if (isOpen) setActiveTab('anagrafica');
  }, [isOpen, driver?.id]);

  // Apre direttamente la tab scadenze se lo status non è ok
  React.useEffect(() => {
    if (isOpen && driver && driver.complianceStatus.overall !== 'ok') {
      setActiveTab('scadenze');
    }
  }, [isOpen, driver]);

  if (!driver) return null;

  const issueCount = driver.complianceStatus.details.filter(c => {
    const s = computeDocumentStatus(c.expiryDate);
    return s === 'expired' || s === 'expiring';
  }).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Dettaglio autista'
      footer={
        <div className='flex justify-end gap-2'>
          <Button variant='ghost' onClick={onClose}>
            Chiudi
          </Button>
          <Button variant='primary' onClick={onEdit}>
            Modifica
          </Button>
        </div>
      }
    >
      {/* HEADER CUSTOM — avatar + nome + badge conformità */}
      <div className='flex items-center gap-3 pb-4 mb-2 border-b border-border-primary'>
        <div
          className='w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center
                        flex-shrink-0 text-blue-600 text-sm font-semibold'
        >
          {getInitials(driver.firstName, driver.lastName)}
        </div>
        <div>
          <p className='font-semibold text-text-primary'>
            {driver.firstName} {driver.lastName}
          </p>
          <DriverComplianceBadge status={driver.complianceStatus.overall} variant='full' issueCount={issueCount} />
        </div>
      </div>

      {/* TAB BAR */}
      <div className='flex border-b border-border-primary mb-5'>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-2.5 text-sm font-medium border-b-2 transition-colors
              ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }
            `}
          >
            {tab.label}
            {/* Badge conteggio problemi sulla tab Scadenze */}
            {tab.id === 'scadenze' && issueCount > 0 && (
              <span
                className='ml-1.5 inline-flex items-center justify-center
                               min-w-4 h-4 px-1 rounded-full text-xs font-semibold
                               bg-red-500 text-white'
              >
                {issueCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* CONTENUTO TAB */}
      {activeTab === 'anagrafica' && <TabAnagrafica driver={driver} />}
      {activeTab === 'scadenze' && <TabScadenze driver={driver} />}
    </Modal>
  );
};
