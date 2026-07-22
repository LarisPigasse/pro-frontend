// =============================================================================
// ASSET AZIENDALI — COMPONENT: RecentNotificationsPanel
// features/vehicles/components/RecentNotificationsPanel.tsx
// =============================================================================

import React, { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { Card } from '@/core/components/layout';
import { Button, Badge } from '@/core/components/ui';
import { Skeleton } from '@/core/components/feedback';
import { NOTIFICATION_SEVERITY_LABELS } from '../types/vehicles.types';
import type { Notification, NotificationSeverity } from '../types/vehicles.types';

const SEVERITY_BADGE_VARIANT: Record<NotificationSeverity, 'info' | 'warning' | 'danger'> = {
  info: 'info',
  warning: 'warning',
  critical: 'danger',
};

const formatRelativeTime = (iso: string): string => {
  const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (diffMin < 1) return 'Adesso';
  if (diffMin < 60) return `${diffMin} min fa`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} ${diffH === 1 ? 'ora' : 'ore'} fa`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD} ${diffD === 1 ? 'giorno' : 'giorni'} fa`;
};

interface RecentNotificationsPanelProps {
  notifications: Notification[];
  unreadCount: number;
  loading?: boolean;
  onMarkRead: (id: number) => Promise<void>;
  onMarkAllRead: () => Promise<void>;
  className?: string; // ⚠️ nuovo
}

export const RecentNotificationsPanel: React.FC<RecentNotificationsPanelProps> = ({
  notifications,
  unreadCount,
  loading,
  onMarkRead,
  onMarkAllRead,
  className = '',
}) => {
  const [markingId, setMarkingId] = useState<number | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const handleMarkRead = async (id: number) => {
    setMarkingId(id);
    try {
      await onMarkRead(id);
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await onMarkAllRead();
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <Card variant='default' padding='none' className={`flex flex-col ${className}`}>
      <div className='px-4 py-3 border-b border-border-default flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Bell className='w-4 h-4 text-text-secondary' />
          <h2 className='text-sm font-semibold text-text-secondary uppercase tracking-wider'>Notifiche recenti</h2>
        </div>
        {unreadCount > 0 && (
          <Button variant='ghost' size='sm' onClick={handleMarkAllRead} disabled={markingAll}>
            <CheckCheck className='w-4 h-4 mr-1.5' />
            Segna tutte
          </Button>
        )}
      </div>

      {loading ? (
        <div className='flex flex-col gap-3 p-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className='h-10 w-full' />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <p className='text-sm text-text-secondary text-center py-8'>Nessuna notifica</p>
      ) : (
        <div className='divide-y divide-border-default flex-1 overflow-y-auto min-h-0'>
          {notifications.map(n => (
            <div key={n.id} className={`flex items-start gap-3 px-4 py-3 ${!n.isRead ? 'bg-bg-secondary' : ''}`}>
              <Badge variant={SEVERITY_BADGE_VARIANT[n.severity]} size='sm'>
                {NOTIFICATION_SEVERITY_LABELS[n.severity]}
              </Badge>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-text-primary'>{n.title}</p>
                <p className='text-xs text-text-secondary mt-0.5'>{n.message}</p>
                <p className='text-xs text-text-secondary mt-1'>{formatRelativeTime(n.createdAt)}</p>
              </div>
              {!n.isRead && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => handleMarkRead(n.id)}
                  disabled={markingId === n.id}
                  title='Segna come letta'
                >
                  <CheckCheck className='w-4 h-4' />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default RecentNotificationsPanel;
