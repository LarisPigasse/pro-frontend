// =============================================================================
// ASSET AZIENDALI — PAGE: LogEmail
// features/vehicles/pages/LogEmail.tsx
// =============================================================================

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Badge } from '@/core/components/ui';
import { Alert, Spinner } from '@/core/components/feedback';
import { PageHeader, Card } from '@/core/components/layout';
import Table from '@/core/components/data/table/Table';
import type { TableColumn } from '@/core/components/data/table/Table';
import { formatDate } from '@/core/utils';

import { useNotificationDeliveryLogs } from '../hooks/useNotificationDeliveryLogs';
import { LogEmailFilters } from '../components';
import { DELIVERY_STATUS_LABELS } from '../types/vehicles.types';
import type { NotificationDeliveryLog, DeliveryStatus } from '../types/vehicles.types';

const STATUS_BADGE_VARIANT: Record<DeliveryStatus, 'success' | 'danger'> = {
  sent: 'success',
  failed: 'danger',
};

export const LogEmail: React.FC = () => {
  const {
    data: logs,
    loading,
    error,
    filters,
    pagination,
    setFilters,
    resetFilters,
    setPage,
    reload,
  } = useNotificationDeliveryLogs();

  const columns: TableColumn<NotificationDeliveryLog>[] = [
    {
      header: 'Data invio',
      accessor: 'createdAt',
      sortable: true,
      render: l => <span className='text-sm whitespace-nowrap'>{formatDate(l.createdAt, 'long')}</span>,
    },
    {
      header: 'Notifica',
      accessor: n => n.notification?.title ?? '—',
      render: l => <span className='text-sm'>{l.notification?.title ?? `#${l.notificationId}`}</span>,
    },
    {
      header: 'Destinatario',
      accessor: 'recipientEmail',
      render: l => (
        <div className='flex flex-col'>
          {l.recipientName && <span className='text-sm font-medium text-text-primary'>{l.recipientName}</span>}
          <span className='text-xs text-text-secondary'>{l.recipientEmail}</span>
        </div>
      ),
    },
    {
      header: 'Esito',
      accessor: 'status',
      render: l => (
        <Badge variant={STATUS_BADGE_VARIANT[l.status]} size='sm'>
          {DELIVERY_STATUS_LABELS[l.status]}
        </Badge>
      ),
    },
    {
      header: 'Dettaglio',
      accessor: l => l.messageId ?? l.errorMessage ?? '—',
      render: l => (
        <span className='text-xs text-text-secondary font-mono truncate max-w-xs block'>
          {l.status === 'sent' ? (l.messageId ?? '—') : (l.errorMessage ?? '—')}
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title='Log invii email'
        subtitle='Storico consegne per destinatario, con messageId o errore'
        onRefresh={reload}
        isLoading={loading}
      />

      {error && (
        <Alert variant='danger' className='mb-6'>
          {error}
        </Alert>
      )}

      <LogEmailFilters currentFilters={filters} onApply={setFilters} onReset={resetFilters} />

      {loading && logs.length === 0 ? (
        <div className='flex items-center justify-center py-12'>
          <Spinner size='md' />
        </div>
      ) : (
        <Card variant='default' padding='none'>
          <Table
            data={logs}
            columns={columns}
            keyExtractor={l => l.id}
            isLoading={false}
            emptyMessage='Nessun invio registrato'
            size='md'
            striped
            hoverable={false}
          />

          <div className='bg-bg-secondary px-4 py-2 flex items-center justify-between border-t border-border-default'>
            <div className='text-sm text-text-secondary'>
              Pagina <span className='font-medium text-text-primary'>{pagination.page}</span> di{' '}
              <span className='font-medium text-text-primary'>{pagination.totalPages || 1}</span>
              {' · '}
              <span className='font-medium text-text-primary'>{pagination.total}</span> invii
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

export default LogEmail;
