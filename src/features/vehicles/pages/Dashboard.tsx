// =============================================================================
// ASSET AZIENDALI — PAGE: Dashboard
// features/vehicles/pages/Dashboard.tsx
// =============================================================================

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ClipboardList, ShieldCheck, Bell } from 'lucide-react';
import { PageHeader } from '@/core/components/layout';
import { Alert } from '@/core/components/feedback';
import { StatCard } from '@/core/components/data';
import { ROUTES } from '@/config';

import { useDashboardSummary } from '../hooks/useDashboardSummary';
import { createMaintenanceRecord, renewVehicleDeadline } from '../api/vehicles.api';
import {
  ComplianceStatusPanel,
  ScheduledActivitiesPanel,
  FleetStatusChart,
  RecentNotificationsPanel,
  DualCountValue,
  DualCountSubtitle,
  MaintenanceRecordFormModal,
  VehicleDeadlineFormModal,
} from '../components';
import type { ScheduledActivityItem } from '../types/dashboard.types';
import type { CreateMaintenanceRecordData, RenewVehicleDeadlineData } from '../types/vehicles.types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { summary, loading, error, reload, markAsRead, markAllAsRead } = useDashboardSummary();
  const { kpi, vehicleStatusBreakdown, complianceItems, scheduledActivities, recentNotifications } = summary;

  const scheduledActivitiesRef = useRef<HTMLDivElement>(null);
  const handleScrollToActivities = () => {
    scheduledActivitiesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ─── "Segna come svolta" — crea un vero MaintenanceRecord ──────────────────
  const [doneModalOpen, setDoneModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Extract<
    ScheduledActivityItem,
    { source: 'maintenance_schedule' }
  > | null>(null);
  const [markingDone, setMarkingDone] = useState(false);

  const handleOpenDoneModal = (item: Extract<ScheduledActivityItem, { source: 'maintenance_schedule' }>) => {
    setSelectedSchedule(item);
    setDoneModalOpen(true);
  };

  const handleMarkDone = async (data: CreateMaintenanceRecordData) => {
    setMarkingDone(true);
    try {
      await createMaintenanceRecord(data);
      setDoneModalOpen(false);
      await reload();
    } finally {
      setMarkingDone(false);
    }
  };

  // ─── "Rinnova" — riusa lo stesso modale di Scadenze.tsx ────────────────────
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState<Extract<
    ScheduledActivityItem,
    { source: 'vehicle_deadline' }
  > | null>(null);
  const [renewing, setRenewing] = useState(false);

  const handleOpenRenewModal = (item: Extract<ScheduledActivityItem, { source: 'vehicle_deadline' }>) => {
    setSelectedDeadline(item);
    setRenewModalOpen(true);
  };

  const handleRenew = async (id: number, data: RenewVehicleDeadlineData) => {
    setRenewing(true);
    try {
      await renewVehicleDeadline(id, data);
      setRenewModalOpen(false);
      await reload();
    } finally {
      setRenewing(false);
    }
  };

  return (
    <>
      <PageHeader
        title='Dashboard'
        subtitle='Stato generale del parco veicoli e degli autisti'
        onRefresh={reload}
        isLoading={loading}
      />

      {error && (
        <Alert variant='warning' className='mb-6'>
          {error}
        </Alert>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch'>
        {/* ── Colonna sinistra — 2/3 ────────────────────────────────────────── */}
        <div className='lg:col-span-2 flex flex-col gap-6'>
          <ComplianceStatusPanel items={complianceItems} loading={loading} />

          <div ref={scheduledActivitiesRef}>
            <ScheduledActivitiesPanel
              items={scheduledActivities}
              loading={loading}
              onRenewDeadline={handleOpenRenewModal}
              onMarkMaintenanceDone={handleOpenDoneModal}
            />
          </div>

          <RecentNotificationsPanel
            notifications={recentNotifications}
            unreadCount={kpi.unreadNotifications}
            loading={loading}
            onMarkRead={markAsRead}
            onMarkAllRead={markAllAsRead}
            className='flex-1'
          />
        </div>

        {/* ── Colonna destra — 1/3 ──────────────────────────────────────────── */}
        <div className='flex flex-col gap-4'>
          <StatCard
            title='Attività'
            value={<DualCountValue expiredCount={kpi.activitiesOverdue} expiringCount={kpi.activitiesUpcoming} />}
            subtitle={
              <DualCountSubtitle
                expiredCount={kpi.activitiesOverdue}
                expiredLabel={{ singular: 'scaduta', plural: 'scadute' }}
                expiringCount={kpi.activitiesUpcoming}
              />
            }
            icon={<ClipboardList className='w-6 h-6 text-white' />}
            color={kpi.activitiesOverdue > 0 ? 'bg-red-500 dark:bg-red-600' : 'bg-gray-400 dark:bg-gray-600'}
            alert={kpi.activitiesOverdue > 0}
            loading={loading}
            onClick={handleScrollToActivities}
          />

          <StatCard
            title='Conformità autisti'
            value={<DualCountValue expiredCount={kpi.complianceExpired} expiringCount={kpi.complianceExpiring} />}
            subtitle={
              <DualCountSubtitle
                expiredCount={kpi.complianceExpired}
                expiredLabel={{ singular: 'scaduto', plural: 'scaduti' }}
                expiringCount={kpi.complianceExpiring}
              />
            }
            icon={<ShieldCheck className='w-6 h-6 text-white' />}
            color={kpi.complianceExpired > 0 ? 'bg-red-500 dark:bg-red-600' : 'bg-gray-400 dark:bg-gray-600'}
            alert={kpi.complianceExpired > 0}
            loading={loading}
            onClick={() => navigate(ROUTES.VEICOLI_AUTISTI)}
          />

          <StatCard
            title='Notifiche'
            value={kpi.unreadNotifications}
            subtitle='non lette'
            icon={<Bell className='w-6 h-6 text-white' />}
            color={kpi.unreadNotifications > 0 ? 'bg-amber-500 dark:bg-amber-600' : 'bg-gray-400 dark:bg-gray-600'}
            alert={kpi.unreadNotifications > 0}
            loading={loading}
          />

          <StatCard
            title='Autisti'
            value={kpi.driversActive}
            subtitle={`su ${kpi.driversTotal} totali`}
            icon={<Users className='w-6 h-6 text-white' />}
            color='bg-violet-500 dark:bg-violet-600'
            loading={loading}
            onClick={() => navigate(ROUTES.VEICOLI_AUTISTI)}
          />

          <FleetStatusChart breakdown={vehicleStatusBreakdown} loading={loading} />
        </div>
      </div>

      {selectedSchedule && (
        <MaintenanceRecordFormModal
          isOpen={doneModalOpen}
          onClose={() => setDoneModalOpen(false)}
          mode='create'
          onCreate={handleMarkDone}
          onUpdate={async () => {}}
          loading={markingDone}
          initialVehicleId={selectedSchedule.schedule.vehicleId}
          initialMaintenanceTypeId={selectedSchedule.schedule.maintenanceTypeId}
        />
      )}

      {selectedDeadline && (
        <VehicleDeadlineFormModal
          isOpen={renewModalOpen}
          onClose={() => setRenewModalOpen(false)}
          mode='renew'
          deadline={selectedDeadline.deadline}
          onCreate={async () => {}}
          onRenew={handleRenew}
          loading={renewing}
        />
      )}
    </>
  );
};

export default Dashboard;
