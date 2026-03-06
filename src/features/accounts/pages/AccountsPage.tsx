// src/features/accounts/pages/AccountsPage.tsx

import React, { useState } from 'react';
import { Button, Badge, ConfirmModal } from '@/core/components/ui';
import { Alert, Spinner } from '@/core/components/feedback';
import Table from '@/core/components/data/table/Table';
import type { TableColumn } from '@/core/components/data/table/Table';
import { Plus, RefreshCw, Eye, Pencil, UserX, UserCheck } from 'lucide-react';
import { useAccounts } from '../hooks/useAccounts';
import { AccountFilters, CreateAccountModal, EditAccountModal, ViewAccountModal } from './components';
import type { Account } from '../types';

const AccountsPage: React.FC = () => {
  const {
    accounts,
    loading,
    error,
    filters,
    pagination,
    roles,
    setFilters,
    nextPage,
    prevPage,
    refetch,
    createAccount,
    updateAccount,
    deleteAccount,
    activateAccount,
  } = useAccounts();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activateModalOpen, setActivateModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ─── helpers ────────────────────────────────────────────────────────────────

  const isAccountBlocked = (account: Account): boolean => !!account.blockedUntil && new Date(account.blockedUntil) > new Date();

  const getStatusBadge = (account: Account): React.ReactNode => {
    if (isAccountBlocked(account))
      return (
        <Badge variant='danger' size='sm'>
          Bloccato
        </Badge>
      );
    if (!account.isActive)
      return (
        <Badge variant='info' size='sm'>
          Disattivato
        </Badge>
      );
    return (
      <Badge variant='success' size='sm'>
        Attivo
      </Badge>
    );
  };

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  // ─── handlers ───────────────────────────────────────────────────────────────

  const handleCreateAccount = async (data: any) => {
    setActionLoading(true);
    try {
      await createAccount(data);
      setCreateModalOpen(false);
    } catch (err) {
      console.error('Error creating account:', err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditAccount = async (accountId: number, data: any) => {
    setActionLoading(true);
    try {
      await updateAccount(accountId, data);
      setEditModalOpen(false);
      setSelectedAccount(null);
    } catch (err) {
      console.error('Error updating account:', err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!selectedAccount) return;
    setActionLoading(true);
    try {
      await deleteAccount(selectedAccount.id);
      setDeleteModalOpen(false);
      setSelectedAccount(null);
    } catch (err) {
      console.error('Error deleting account:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivateAccount = async () => {
    if (!selectedAccount) return;
    setActionLoading(true);
    try {
      await activateAccount(selectedAccount.id);
      setActivateModalOpen(false);
      setSelectedAccount(null);
    } catch (err) {
      console.error('Error activating account:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetFilters = () => setFilters({});

  // ─── colonna azioni contestuali ─────────────────────────────────────────────

  const renderActions = (account: Account): React.ReactNode => {
    const blocked = isAccountBlocked(account);
    const inactive = !account.isActive;

    return (
      <div className='flex items-center gap-1'>
        {/* Visualizza — sempre visibile */}
        <Button
          variant='ghost'
          size='sm'
          title='Visualizza dettagli'
          onClick={() => {
            setSelectedAccount(account);
            setViewModalOpen(true);
          }}
        >
          <Eye className='w-4 h-4 text-gray-500' />
        </Button>

        {/* Modifica — sempre visibile */}
        <Button
          variant='ghost'
          size='sm'
          title='Modifica account'
          onClick={() => {
            setSelectedAccount(account);
            setEditModalOpen(true);
          }}
        >
          <Pencil className='w-4 h-4 text-blue-500' />
        </Button>

        {/* Disattiva — solo se attivo e non bloccato */}
        {!inactive && !blocked && (
          <Button
            variant='ghost'
            size='sm'
            title='Disattiva account'
            onClick={() => {
              setSelectedAccount(account);
              setDeleteModalOpen(true);
            }}
          >
            <UserX className='w-4 h-4 text-red-500' />
          </Button>
        )}

        {/* Riattiva — solo se disattivato (non bloccato) */}
        {inactive && !blocked && (
          <Button
            variant='ghost'
            size='sm'
            title='Riattiva account'
            onClick={() => {
              setSelectedAccount(account);
              setActivateModalOpen(true);
            }}
          >
            <UserCheck className='w-4 h-4 text-green-500' />
          </Button>
        )}
      </div>
    );
  };

  // ─── colonne tabella ─────────────────────────────────────────────────────────

  const columns: TableColumn<Account>[] = [
    {
      header: 'Email',
      accessor: 'email',
      sortable: true,
    },
    {
      header: 'Ruolo',
      accessor: account => (
        <Badge variant='default' size='sm'>
          {account.role.name}
        </Badge>
      ),
      sortable: false,
    },
    {
      header: 'Tipo',
      accessor: 'accountType',
      sortable: true,
    },
    {
      header: 'Stato',
      accessor: account => getStatusBadge(account),
      sortable: false,
    },
    {
      header: 'Creato il',
      accessor: account => formatDate(account.createdAt),
      sortable: true,
      className: 'text-gray-600',
    },
    {
      header: 'Azioni',
      accessor: account => renderActions(account),
      sortable: false,
      className: 'text-right',
    },
  ];

  // ─── render ──────────────────────────────────────────────────────────────────

  return (
    <div className='max-w-7xl mx-auto p-6'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Gestione Account</h1>
          <p className='text-gray-600 mt-1'>Visualizza e gestisci tutti gli account della piattaforma</p>
        </div>
        <div className='flex items-center space-x-3'>
          <Button variant='ghost' size='sm' onClick={refetch} disabled={loading} title='Aggiorna'>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant='primary' onClick={() => setCreateModalOpen(true)}>
            <Plus className='w-4 h-4 mr-2' />
            Crea Account
          </Button>
        </div>
      </div>

      {/* Errore */}
      {error && (
        <Alert variant='danger' className='mb-6'>
          {error}
        </Alert>
      )}

      {/* Filtri */}
      <AccountFilters filters={filters} roles={roles} onChange={setFilters} onReset={handleResetFilters} />

      {/* Tabella */}
      {loading && !accounts.length ? (
        <div className='flex items-center justify-center py-12'>
          <Spinner size='md' />
        </div>
      ) : (
        <>
          <Table
            data={accounts}
            columns={columns}
            keyExtractor={account => account.id.toString()}
            isLoading={false}
            emptyMessage='Nessun account trovato'
            size='md'
            striped
            hoverable
          />

          {/* Paginazione */}
          <div className='mt-6 flex items-center justify-between'>
            <div className='text-sm text-gray-600'>
              Mostrando {accounts.length} di {pagination.total} account
            </div>
            <div className='flex items-center space-x-2'>
              <Button variant='ghost' size='sm' onClick={prevPage} disabled={pagination.page === 0 || loading}>
                Indietro
              </Button>
              <span className='text-sm text-gray-600'>
                Pagina {pagination.page + 1} di {pagination.totalPages || 1}
              </span>
              <Button variant='ghost' size='sm' onClick={nextPage} disabled={!pagination.hasMore || loading}>
                Avanti
              </Button>
            </div>
          </div>
        </>
      )}

      {/* ── Modali ─────────────────────────────────────────────────────────── */}

      <CreateAccountModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onConfirm={handleCreateAccount}
        loading={actionLoading}
        roles={roles}
      />

      <ViewAccountModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedAccount(null);
        }}
        account={selectedAccount}
      />

      <EditAccountModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedAccount(null);
        }}
        onConfirm={handleEditAccount}
        loading={actionLoading}
        account={selectedAccount}
        roles={roles}
      />

      {/* Disattiva account */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedAccount(null);
        }}
        onConfirm={handleDeleteAccount}
        title='Disattiva Account'
        message={`Sei sicuro di voler disattivare l'account di ${selectedAccount?.email}? L'utente non potrà più accedere al sistema.`}
        confirmText='Disattiva'
        cancelText='Annulla'
        variant='danger'
        isLoading={actionLoading}
      />

      {/* Riattiva account */}
      <ConfirmModal
        isOpen={activateModalOpen}
        onClose={() => {
          setActivateModalOpen(false);
          setSelectedAccount(null);
        }}
        onConfirm={handleActivateAccount}
        title='Riattiva Account'
        message={`Sei sicuro di voler riattivare l'account di ${selectedAccount?.email}? L'utente potrà nuovamente accedere al sistema.`}
        confirmText='Riattiva'
        cancelText='Annulla'
        variant='default'
        isLoading={actionLoading}
      />
    </div>
  );
};

export default AccountsPage;
