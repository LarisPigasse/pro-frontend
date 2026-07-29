// =============================================================================
// ASSET AZIENDALI — PAGE: Notifiche
// features/vehicles/pages/Notifiche.tsx
// =============================================================================

import React from 'react';
import { ChevronLeft, ChevronRight, CheckCheck } from 'lucide-react';
import { Button } from '@/core/components/ui';
import { Badge } from '@/core/components/ui';
import { Alert, Spinner } from '@/core/components/feedback';
import { PageHeader, Card } from '@/core/components/layout';
import Table from '@/core/components/data/table/Table';
import type { TableColumn } from '@/core/components/data/table/Table';
import { formatDate } from '@/core/utils';

import { useNotifications } from '../hooks/useNotifications';
import { NotificationFilters } from '../components';
import { NOTIFICATION_TYPE_LABELS, NOTIFICATION_SEVERITY_LABELS } from '../types/vehicles.types';
import type { Notification, NotificationSeverity } from '../types/vehicles.types';

const SEVERITY_BADGE_VARIANT: Record<NotificationSeverity, 'info' | 'warning' | 'danger'> = {
  info: 'info',
  warning: 'warning',
  critical: 'danger',
};

const vehicleOrDriverLabel = (n: Notification): string => {
  if (n.vehicle) return `${n.vehicle.brand} ${n.vehicle.model}${n.vehicle.plate ? ` · ${n.vehicle.plate}` : ''}`;
  if (n.driver) return `${n.driver.firstName} ${n.driver.lastName}`;
  return '—';
};

export const Notifiche: React.FC = () => {
  const {
    data: notifications,
    loading,
    error,
    filters,
    pagination,
    unreadCount,
    setFilters,
    resetFilters,
    setPage,
    reload,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [markingId, setMarkingId] = React.useState<number | null>(null);
  const [markingAll, setMarkingAll] = React.useState(false);

  const handleMarkAsRead = async (id: number) => {
    setMarkingId(id);
    try {
      await markAsRead(id);
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await markAllAsRead();
    } finally {
      setMarkingAll(false);
    }
  };

  const columns: TableColumn<Notification>[] = [
    {
      header: 'Data',
      accessor: 'createdAt',
      sortable: true,
      render: n => <span className='text-sm whitespace-nowrap'>{formatDate(n.createdAt, 'long')}</span>,
    },
    {
      header: 'Tipo',
      accessor: 'type',
      render: n => <span className='text-sm'>{NOTIFICATION_TYPE_LABELS[n.type]}</span>,
    },
    {
      header: 'Severità',
      accessor: 'severity',
      sortable: true,
      render: n => (
        <Badge variant={SEVERITY_BADGE_VARIANT[n.severity]} size='sm'>
          {NOTIFICATION_SEVERITY_LABELS[n.severity]}
        </Badge>
      ),
    },
    {
      header: 'Messaggio',
      accessor: 'title',
      render: n => (
        <div className='flex flex-col max-w-md'>
          <span className={`text-sm ${!n.isRead ? 'font-semibold text-text-primary' : 'text-text-primary'}`}>{n.title}</span>
          <span className='text-xs text-text-secondary truncate'>{n.message}</span>
        </div>
      ),
    },
    {
      header: 'Veicolo/Autista',
      accessor: n => vehicleOrDriverLabel(n),
      render: n => <span className='text-sm text-text-secondary'>{vehicleOrDriverLabel(n)}</span>,
    },
    {
      header: 'Email',
      accessor: 'emailSent',
      render: n => (
        <span className={`text-sm ${n.emailSent ? 'text-text-success' : 'text-text-placeholder'}`}>
          {n.emailSent ? '✓' : '—'}
        </span>
      ),
    },
    {
      header: '',
      accessor: 'isRead',
      className: 'text-right',
      render: n =>
        n.isRead ? (
          <span className='text-xs text-text-secondary'>Letta</span>
        ) : (
          <Button
            variant='ghost'
            size='sm'
            onClick={e => {
              e.stopPropagation();
              handleMarkAsRead(n.id);
            }}
            disabled={markingId === n.id}
          >
            Segna come letta
          </Button>
        ),
    },
  ];

  return (
    <>
      <PageHeader
        title='Notifiche'
        subtitle={`${pagination.total} totali · ${unreadCount} non lette`}
        onRefresh={reload}
        isLoading={loading}
        actions={
          unreadCount > 0 ? (
            <Button
              variant='outline'
              size='sm'
              leftIcon={<CheckCheck className='w-4 h-4' />}
              onClick={handleMarkAllAsRead}
              disabled={markingAll}
            >
              Segna tutte come lette
            </Button>
          ) : undefined
        }
      />

      {error && (
        <Alert variant='danger' className='mb-6'>
          {error}
        </Alert>
      )}

      <NotificationFilters currentFilters={filters} onApply={setFilters} onReset={resetFilters} />

      {loading && notifications.length === 0 ? (
        <div className='flex items-center justify-center py-12'>
          <Spinner size='md' />
        </div>
      ) : (
        <Card variant='default' padding='none'>
          <Table
            data={notifications}
            columns={columns}
            keyExtractor={n => n.id}
            isLoading={false}
            emptyMessage='Nessuna notifica'
            size='md'
            striped
            hoverable={false}
            expandable={{
              render: n => (
                <div className='text-sm text-text-secondary space-y-1 py-1'>
                  <p className='text-text-primary'>{n.message}</p>
                  <p>Creata il {formatDate(n.createdAt, 'long')}</p>
                  {n.readAt && <p>Letta il {formatDate(n.readAt, 'long')}</p>}
                  {n.emailSent && n.emailSentAt && <p>Email inviata il {formatDate(n.emailSentAt, 'long')}</p>}
                  {!n.emailSent && <p>Nessuna email inviata per questa notifica</p>}
                </div>
              ),
            }}
          />

          <div className='bg-bg-secondary px-4 py-2 flex items-center justify-between border-t border-border-default'>
            <div className='text-sm text-text-secondary'>
              Pagina <span className='font-medium text-text-primary'>{pagination.page}</span> di{' '}
              <span className='font-medium text-text-primary'>{pagination.totalPages || 1}</span>
              {' · '}
              <span className='font-medium text-text-primary'>{pagination.total}</span> notifiche
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                leftIcon={<ChevronLeft className='w-4 h-4' />}
                onClick={() => setPage(pagination.page - 1)}
                disabled={!pagination.hasPrev || loading}
              >
                Indietro
              </Button>
              <Button
                variant='outline'
                size='sm'
                rightIcon={<ChevronRight className='w-4 h-4' />}
                onClick={() => setPage(pagination.page + 1)}
                disabled={!pagination.hasNext || loading}
              >
                Avanti
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default Notifiche;
