// =============================================================================
// ASSET AZIENDALI — COMPONENT: ViewDriverModal
// features/vehicles/components/ViewDriverModal.tsx
// =============================================================================

import React, { useEffect, useState, useCallback } from 'react';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import { Modal, Badge, Button, ConfirmModal } from '@/core/components/ui';
import { Spinner } from '@/core/components/feedback';
import { formatDate } from '@/core/utils';
import {
  fetchDriverCompliances,
  createDriverCompliance,
  renewDriverCompliance,
  deleteDriverCompliance,
} from '../api/vehicles.api';
import { DRIVER_COMPLIANCE_STATUS_LABELS, DRIVER_COMPLIANCE_CATEGORY_LABELS } from '../types/vehicles.types';
import { DriverComplianceFormModal } from './DriverComplianceFormModal';
import type {
  Driver,
  DriverCompliance,
  DriverComplianceType,
  DriverComplianceStatusValue,
  CreateDriverComplianceData,
  RenewDriverComplianceData,
} from '../types/vehicles.types';

interface ViewDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: Driver | null;
  onEdit: () => void;
  /** Catalogo tipi conformità (da useLookups, caricato una volta a livello di pagina) */
  driverComplianceTypes: DriverComplianceType[];
  /** Chiamato dopo ogni aggiunta/rinnovo/eliminazione — ricalcola il badge aggregato in tabella */
  onComplianceChange: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const COMPLIANCE_STATUS_VARIANT: Record<DriverComplianceStatusValue, 'success' | 'warning' | 'danger' | 'default'> = {
  valid: 'success',
  expiring: 'warning',
  expired: 'danger',
  not_applicable: 'default',
};

const getDriverStatusBadge = (driver: Driver): { label: string; variant: 'success' | 'danger' } => {
  if (!driver.isActive) return { label: driver.terminationDate ? 'Cessato' : 'Sospeso', variant: 'danger' };
  return { label: 'Attivo', variant: 'success' };
};

// ─────────────────────────────────────────────────────────────────────────────
// Sotto-componenti presentazionali
// ─────────────────────────────────────────────────────────────────────────────

const SectionTitle: React.FC<{ children: React.ReactNode; action?: React.ReactNode }> = ({ children, action }) => (
  <div className='flex items-center justify-between pt-4 pb-1'>
    <p className='text-xs font-semibold uppercase tracking-wider text-text-info'>{children}</p>
    {action}
  </div>
);

const DetailRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className='flex items-start py-2.5 border-b border-border-default last:border-0'>
    <span className='w-36 shrink-0 text-sm font-medium text-text-secondary'>{label}</span>
    <span className='text-sm text-text-primary break-words'>{children}</span>
  </div>
);

interface ComplianceRowProps {
  compliance: DriverCompliance;
  onRenew: () => void;
  onDelete: () => void;
}

const ComplianceRow: React.FC<ComplianceRowProps> = ({ compliance, onRenew, onDelete }) => (
  <div className='flex items-center justify-between py-2.5 border-b border-border-default last:border-0 group'>
    <div className='flex flex-col'>
      <span className='text-sm font-medium text-text-primary'>{compliance.complianceType?.label ?? '—'}</span>
      <span className='text-xs text-text-secondary'>
        {compliance.complianceType && DRIVER_COMPLIANCE_CATEGORY_LABELS[compliance.complianceType.category]}
        {compliance.expiresAt && ` · Scadenza ${formatDate(compliance.expiresAt)}`}
      </span>
    </div>
    <div className='flex items-center gap-2'>
      <Badge variant={COMPLIANCE_STATUS_VARIANT[compliance.status]} size='sm'>
        {DRIVER_COMPLIANCE_STATUS_LABELS[compliance.status]}
      </Badge>
      {/* Azioni visibili solo per i tipi rinnovabili con scadenza — coerente con §5.7 */}
      <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
        {compliance.complianceType?.isRenewable && (
          <button
            onClick={onRenew}
            title='Rinnova'
            className='p-1.5 rounded text-text-secondary hover:text-text-info hover:bg-bg-hover transition-colors'
          >
            <RefreshCw className='w-4 h-4' />
          </button>
        )}
        <button
          onClick={onDelete}
          title='Elimina'
          className='p-1.5 rounded text-text-secondary hover:text-text-error hover:bg-bg-hover transition-colors'
        >
          <Trash2 className='w-4 h-4' />
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Componente principale
// ─────────────────────────────────────────────────────────────────────────────

export const ViewDriverModal: React.FC<ViewDriverModalProps> = ({
  isOpen,
  onClose,
  driver,
  onEdit,
  driverComplianceTypes,
  onComplianceChange,
}) => {
  const [compliances, setCompliances] = useState<DriverCompliance[]>([]);
  const [loadingCompliances, setLoadingCompliances] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Stato dei modali figli
  const [formModalMode, setFormModalMode] = useState<'create' | 'renew' | null>(null);
  const [complianceToRenew, setComplianceToRenew] = useState<DriverCompliance | null>(null);
  const [complianceToDelete, setComplianceToDelete] = useState<DriverCompliance | null>(null);

  // ─── caricamento documenti di questo autista ────────────────────────────

  const loadCompliances = useCallback(async () => {
    if (!driver) return;
    setLoadingCompliances(true);
    try {
      const res = await fetchDriverCompliances({ driverId: driver.id, status: 'all', limit: 50 });
      setCompliances(res.data);
    } catch {
      setCompliances([]);
    } finally {
      setLoadingCompliances(false);
    }
  }, [driver]);

  useEffect(() => {
    if (isOpen && driver) {
      loadCompliances();
    }
  }, [isOpen, driver, loadCompliances]);

  useEffect(() => {
    if (!isOpen) {
      setFormModalMode(null);
      setComplianceToRenew(null);
      setComplianceToDelete(null);
    }
  }, [isOpen]);

  // Tipi non ancora assegnati a questo autista — unici proponibili in "Aggiungi documento"
  const availableTypes = driverComplianceTypes.filter(t => !compliances.some(c => c.typeId === t.id));

  // ─── azioni CRUD documenti ──────────────────────────────────────────────

  const handleCreateCompliance = async (data: CreateDriverComplianceData) => {
    setActionLoading(true);
    try {
      await createDriverCompliance(data);
      await loadCompliances();
      onComplianceChange();
    } finally {
      setActionLoading(false);
    }
  };

  const handleRenewCompliance = async (id: number, data: RenewDriverComplianceData) => {
    setActionLoading(true);
    try {
      await renewDriverCompliance(id, data);
      await loadCompliances();
      onComplianceChange();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCompliance = async () => {
    if (!complianceToDelete) return;
    setActionLoading(true);
    try {
      await deleteDriverCompliance(complianceToDelete.id);
      await loadCompliances();
      onComplianceChange();
      setComplianceToDelete(null);
    } finally {
      setActionLoading(false);
    }
  };

  if (!driver) return null;

  const status = getDriverStatusBadge(driver);

  const footer = (
    <div className='flex items-center justify-end gap-3'>
      <Button variant='ghost' onClick={onClose}>
        Chiudi
      </Button>
      <Button variant='primary' onClick={onEdit}>
        Modifica
      </Button>
    </div>
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title='Dettaglio autista' size='2xl' footer={footer}>
        <div className='p-6'>
          {/* Header con nome e stato — full width, sopra le due colonne */}
          <div className='flex items-center justify-between mb-4 pb-4 border-b border-border-default'>
            <div>
              <p className='text-lg font-semibold text-text-primary'>
                {driver.firstName} {driver.lastName}
              </p>
              <p className='text-sm text-text-secondary'>ID: {driver.id}</p>
            </div>
            <Badge variant={status.variant} size='sm'>
              {status.label}
            </Badge>
          </div>

          {/* Corpo a due colonne: sinistra = dati anagrafici + note, destra = rapporto di lavoro + conformità */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-1'>
            {/* ── Colonna sinistra ── */}
            <div>
              <SectionTitle>Dati anagrafici</SectionTitle>
              <DetailRow label='Codice fiscale'>
                {driver.fiscalCode || <span className='italic text-text-placeholder'>Non specificato</span>}
              </DetailRow>
              <DetailRow label='Data di nascita'>{formatDate(driver.birthDate, 'long')}</DetailRow>
              <DetailRow label='Telefono'>
                {driver.phone || <span className='italic text-text-placeholder'>Non specificato</span>}
              </DetailRow>
              <DetailRow label='Email'>
                {driver.email || <span className='italic text-text-placeholder'>Non specificata</span>}
              </DetailRow>
              <DetailRow label='Indirizzo'>
                {driver.address || <span className='italic text-text-placeholder'>Non specificato</span>}
              </DetailRow>
              <DetailRow label='Città'>
                {driver.city || <span className='italic text-text-placeholder'>Non specificata</span>}
              </DetailRow>

              <SectionTitle>Rapporto di lavoro</SectionTitle>
              <DetailRow label='Assunto il'>{formatDate(driver.hireDate, 'long')}</DetailRow>
              {driver.terminationDate && (
                <DetailRow label='Cessato il'>
                  <span className='text-text-error'>{formatDate(driver.terminationDate, 'long')}</span>
                </DetailRow>
              )}

              <SectionTitle>Note</SectionTitle>
              {driver.notes ? (
                <p className='text-sm text-text-primary whitespace-pre-wrap py-1'>{driver.notes}</p>
              ) : (
                <p className='text-sm text-text-secondary italic py-2'>Nessuna nota</p>
              )}
            </div>

            {/* ── Colonna destra ── */}
            <div>
              <SectionTitle
                action={
                  <Button
                    variant='outline'
                    size='xs'
                    leftIcon={<Plus className='w-3.5 h-3.5' />}
                    onClick={() => setFormModalMode('create')}
                    disabled={availableTypes.length === 0}
                    title={availableTypes.length === 0 ? 'Tutti i tipi disponibili sono già assegnati' : undefined}
                  >
                    Aggiungi documento
                  </Button>
                }
              >
                Conformità documentale
              </SectionTitle>
              {loadingCompliances ? (
                <div className='flex items-center justify-center py-6'>
                  <Spinner size='sm' />
                </div>
              ) : compliances.length === 0 ? (
                <p className='text-sm text-text-secondary italic py-2'>Nessun documento registrato</p>
              ) : (
                <div>
                  {compliances.map(c => (
                    <ComplianceRow
                      key={c.id}
                      compliance={c}
                      onRenew={() => {
                        setComplianceToRenew(c);
                        setFormModalMode('renew');
                      }}
                      onDelete={() => setComplianceToDelete(c)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Aggiungi / Rinnova documento */}
      <DriverComplianceFormModal
        isOpen={formModalMode !== null}
        onClose={() => {
          setFormModalMode(null);
          setComplianceToRenew(null);
        }}
        driverId={driver.id}
        mode={formModalMode ?? 'create'}
        availableTypes={availableTypes}
        compliance={complianceToRenew ?? undefined}
        onCreate={handleCreateCompliance}
        onRenew={handleRenewCompliance}
        loading={actionLoading}
      />

      {/* Conferma eliminazione documento */}
      <ConfirmModal
        isOpen={complianceToDelete !== null}
        onClose={() => setComplianceToDelete(null)}
        onConfirm={handleDeleteCompliance}
        title='Elimina documento'
        message={`Eliminare "${complianceToDelete?.complianceType?.label ?? ''}"? L'operazione è irreversibile.`}
        confirmText='Elimina'
        cancelText='Annulla'
        variant='danger'
        isLoading={actionLoading}
      />
    </>
  );
};

export default ViewDriverModal;
