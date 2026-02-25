import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useSessions } from '../hooks/useSessions';
import { Button } from '@/core/components/ui';
import { Alert, Spinner } from '@/core/components/feedback';
import SessionsTable from './components/SessionsTable';
import BlockedUsersTable from './components/BlockedUsersTable';
import BlockUserModal from './components/BlockUserModal';
import UnblockConfirmModal from './components/UnblockConfirmModal';
import type { BlockUserRequest } from '../types';

const SessionsPage: React.FC = () => {
  const {
    sessions,
    blockedUsers,
    loading,
    error,
    refreshSessions,
    handleRevokeSession,
    handleBlockUser,
    handleUnblockUser,
    currentSessionId,
  } = useSessions();

  // Modal states
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [unblockModalOpen, setUnblockModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  /**
   * Apri modal blocco utente
   */
  const openBlockModal = (userId: number) => {
    setSelectedUserId(userId);
    setBlockModalOpen(true);
    setActionError(null);
  };

  /**
   * Apri modal sblocco utente
   */
  const openUnblockModal = (userId: number) => {
    setSelectedUserId(userId);
    setUnblockModalOpen(true);
    setActionError(null);
  };

  /**
   * Conferma blocco utente
   */
  const confirmBlockUser = async (blockData: BlockUserRequest) => {
    if (!selectedUserId) return;

    setActionLoading(true);
    setActionError(null);

    try {
      await handleBlockUser(selectedUserId, blockData);
      setBlockModalOpen(false);
      setSelectedUserId(null);
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Conferma sblocco utente
   */
  const confirmUnblockUser = async () => {
    if (!selectedUserId) return;

    setActionLoading(true);
    setActionError(null);

    try {
      await handleUnblockUser(selectedUserId);
      setUnblockModalOpen(false);
      setSelectedUserId(null);
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Revoca sessione con conferma
   */
  const onRevokeSession = async (sessionId: number) => {
    if (!confirm('Sei sicuro di voler revocare questa sessione?')) return;

    setActionLoading(true);
    setActionError(null);

    try {
      await handleRevokeSession(sessionId);
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className='min-h-full'>
      {/* Header */}
      <div className='max-w-7xl mx-auto mb-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Sessioni Attive</h1>
            <p className='text-gray-600 mt-1'>Monitora e gestisci le sessioni utente attive</p>
          </div>

          <Button onClick={refreshSessions} disabled={loading} variant='primary' size='md'>
            <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Aggiorna
          </Button>
        </div>

        {/* Auto-refresh indicator */}
        <div className='mt-2 text-sm text-gray-500'>
          <span className='inline-flex items-center gap-1'>
            <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
            Auto-refresh ogni 30 secondi
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {(error || actionError) && (
        <div className='max-w-7xl mx-auto mb-6'>
          <Alert variant='danger' title='Errore'>
            {error || actionError}
          </Alert>
        </div>
      )}

      {/* Loading State */}
      {loading && sessions.length === 0 && blockedUsers.length === 0 ? (
        <div className='max-w-7xl mx-auto text-center py-12'>
          <Spinner size='md' className='mx-auto mb-4' />
          <p className='text-gray-600'>Caricamento sessioni...</p>
        </div>
      ) : (
        <div className='max-w-7xl mx-auto space-y-8'>
          {/* Sessions Table */}
          <div>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>Sessioni Attive</h2>
            <SessionsTable
              sessions={sessions}
              currentSessionId={currentSessionId}
              onRevokeSession={onRevokeSession}
              onBlockUser={openBlockModal}
              onUnblockUser={openUnblockModal}
              actionLoading={actionLoading}
            />
          </div>

          {/* Blocked Users Table */}
          <div>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>Utenti Bloccati</h2>
            <BlockedUsersTable blockedUsers={blockedUsers} onUnblockUser={openUnblockModal} actionLoading={actionLoading} />
          </div>
        </div>
      )}

      {/* Block User Modal */}
      <BlockUserModal
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        onConfirm={confirmBlockUser}
        loading={actionLoading}
        error={actionError}
      />

      {/* Unblock User Modal */}
      <UnblockConfirmModal
        isOpen={unblockModalOpen}
        onClose={() => setUnblockModalOpen(false)}
        onConfirm={confirmUnblockUser}
        loading={actionLoading}
      />
    </div>
  );
};

export default SessionsPage;
