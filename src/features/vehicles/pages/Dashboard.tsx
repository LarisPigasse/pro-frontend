// =============================================================================
// ASSET AZIENDALI — PAGE: Dashboard
// features/vehicles/pages/Dashboard.tsx
// =============================================================================

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { vehiclesApi, vehicleDeadlinesApi, vehicleNotificationsApi } from '../api/vehicles.api';
import { DeadlineStatusBadge } from '../components/DeadlineStatusBadge';
import { ROUTES } from '@/config';

// -----------------------------------------------------------------------------
// TIPI INTERNI
// -----------------------------------------------------------------------------

interface DashboardStats {
  totalVehicles:        number;
  expiredDeadlines:     number;
  expiringDeadlines:    number;
  unassigned:           number;
  unreadNotifications:  number;
}

interface DashboardState {
  stats:   DashboardStats;
  loading: boolean;
  error:   string | null;
}

const EMPTY_STATS: DashboardStats = {
  totalVehicles:       0,
  expiredDeadlines:    0,
  expiringDeadlines:   0,
  unassigned:          0,
  unreadNotifications: 0,
};

// -----------------------------------------------------------------------------
// SUB-COMPONENT: KPI Card
// -----------------------------------------------------------------------------

interface KpiCardProps {
  title:     string;
  value:     number | string;
  subtitle?: string;
  icon:      React.ReactNode;
  iconBg:    string;
  trend?:    'ok' | 'warning' | 'danger' | 'neutral';
  onClick?:  () => void;
  loading?:  boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title, value, subtitle, icon, iconBg,
  trend = 'neutral', onClick, loading,
}) => {
  const trendBorder: Record<string, string> = {
    ok:      'border-green-500/20',
    warning: 'border-amber-500/20',
    danger:  'border-red-500/20',
    neutral: 'border-border-primary',
  };

  return (
    <div
      onClick={onClick}
      className={`
        flex flex-col gap-4 p-5 rounded-xl border bg-surface-primary
        ${trendBorder[trend]}
        ${onClick ? 'cursor-pointer hover:bg-surface-secondary transition-colors' : ''}
      `}
    >
      <div className='flex items-start justify-between'>
        <p className='text-sm font-medium text-text-secondary'>{title}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          {icon}
        </div>
      </div>

      {loading ? (
        <div className='h-8 w-24 rounded-md bg-surface-tertiary animate-pulse' />
      ) : (
        <div>
          <p className='text-2xl font-bold text-text-primary tabular-nums'>{value}</p>
          {subtitle && <p className='text-xs text-text-secondary mt-0.5'>{subtitle}</p>}
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// SUB-COMPONENT: Quick Action
// -----------------------------------------------------------------------------

interface QuickActionProps {
  title:    string;
  desc:     string;
  icon:     React.ReactNode;
  onClick?: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, desc, icon, onClick }) => (
  <button
    onClick={onClick}
    className='
      flex items-center gap-3 p-4 rounded-xl border border-border-primary
      bg-surface-primary hover:bg-surface-secondary hover:border-border-secondary
      text-left w-full transition-colors group
    '
  >
    <div className='
      w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center
      flex-shrink-0 text-blue-500 group-hover:bg-blue-500/20 transition-colors
    '>
      {icon}
    </div>
    <div className='min-w-0'>
      <p className='text-sm font-medium text-text-primary'>{title}</p>
      <p className='text-xs text-text-secondary truncate'>{desc}</p>
    </div>
    <svg
      className='w-4 h-4 text-text-secondary ml-auto flex-shrink-0
                 group-hover:translate-x-0.5 transition-transform'
      fill='none' stroke='currentColor' viewBox='0 0 24 24'
    >
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
    </svg>
  </button>
);

// -----------------------------------------------------------------------------
// COMPONENT PRINCIPALE
// -----------------------------------------------------------------------------

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [state, setState] = useState<DashboardState>({
    stats: EMPTY_STATS, loading: true, error: null,
  });

  const fetchStats = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const [vehiclesRes, expiredRes, expiringRes, notifRes] = await Promise.all([
        vehiclesApi.getAll({ page: 1, limit: 1 }),
        vehicleDeadlinesApi.getAll({ status: 'expired' }),
        vehicleDeadlinesApi.getAll({ status: 'expiring' }),
        vehicleNotificationsApi.getUnreadCount(),
      ]);

      const allVehiclesRes = await vehiclesApi.getAll({ page: 1, limit: 1000 });
      const unassigned = allVehiclesRes.data.filter(v => !v.currentAssignment).length;

      setState({
        stats: {
          totalVehicles:       vehiclesRes.pagination.total,
          expiredDeadlines:    expiredRes.pagination.total,
          expiringDeadlines:   expiringRes.pagination.total,
          unassigned,
          unreadNotifications: notifRes.data.count,
        },
        loading: false,
        error: null,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore nel caricamento dei dati dashboard';
      setState({ stats: EMPTY_STATS, loading: false, error: message });
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const { stats, loading, error } = state;

  return (
    <div className='flex flex-col gap-6'>

      {/* HEADER */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-semibold text-text-primary'>Asset Aziendali</h1>
          <p className='text-sm text-text-secondary mt-0.5'>Panoramica generale dello stato della flotta</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className='p-2 rounded-lg text-text-secondary hover:text-text-primary
                     hover:bg-surface-secondary disabled:opacity-40 transition-colors'
          aria-label='Aggiorna dati'
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
              d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003
                 8.003 0 01-15.357-2m15.357 2H15' />
          </svg>
        </button>
      </div>

      {/* ERRORE */}
      {error && !loading && (
        <div className='flex items-center gap-2 px-4 py-3 rounded-lg
                        bg-red-500/10 border border-red-500/20 text-red-600 text-sm'>
          <svg className='w-4 h-4 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
              d='M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94
                 a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z' />
          </svg>
          {error}
        </div>
      )}

      {/* KPI CARDS */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <KpiCard
          title='Totale asset'
          value={stats.totalVehicles}
          subtitle='In anagrafica'
          loading={loading}
          trend='neutral'
          onClick={() => navigate(ROUTES.VEICOLI_DOTAZIONE)}
          iconBg='bg-blue-500/10'
          icon={
            <svg className='w-5 h-5 text-blue-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75}
                d='M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z' />
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75}
                d='M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 1h8zM13 8h4l3 3v5h-7V8z' />
            </svg>
          }
        />

        <KpiCard
          title='Scadute'
          value={stats.expiredDeadlines}
          subtitle={stats.expiredDeadlines > 0 ? 'Intervento immediato' : 'Tutto in regola'}
          loading={loading}
          trend={stats.expiredDeadlines > 0 ? 'danger' : 'ok'}
          onClick={() => navigate(ROUTES.VEICOLI_SCADENZE)}
          iconBg={stats.expiredDeadlines > 0 ? 'bg-red-500/10' : 'bg-green-500/10'}
          icon={
            <svg
              className={`w-5 h-5 ${stats.expiredDeadlines > 0 ? 'text-red-500' : 'text-green-500'}`}
              fill='none' stroke='currentColor' viewBox='0 0 24 24'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75}
                d='M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94
                   a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z' />
            </svg>
          }
        />

        <KpiCard
          title='In scadenza'
          value={stats.expiringDeadlines}
          subtitle={stats.expiringDeadlines > 0 ? 'Da rinnovare a breve' : 'Nessuna urgenza'}
          loading={loading}
          trend={stats.expiringDeadlines > 0 ? 'warning' : 'ok'}
          onClick={() => navigate(ROUTES.VEICOLI_SCADENZE)}
          iconBg={stats.expiringDeadlines > 0 ? 'bg-amber-500/10' : 'bg-green-500/10'}
          icon={
            <svg
              className={`w-5 h-5 ${stats.expiringDeadlines > 0 ? 'text-amber-500' : 'text-green-500'}`}
              fill='none' stroke='currentColor' viewBox='0 0 24 24'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75}
                d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
          }
        />

        <KpiCard
          title='Non assegnati'
          value={stats.unassigned}
          subtitle={stats.unassigned > 0 ? 'Senza autista corrente' : 'Tutti assegnati'}
          loading={loading}
          trend={stats.unassigned > 0 ? 'warning' : 'ok'}
          onClick={() => navigate(ROUTES.VEICOLI_DOTAZIONE)}
          iconBg={stats.unassigned > 0 ? 'bg-amber-500/10' : 'bg-green-500/10'}
          icon={
            <svg
              className={`w-5 h-5 ${stats.unassigned > 0 ? 'text-amber-500' : 'text-green-500'}`}
              fill='none' stroke='currentColor' viewBox='0 0 24 24'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75}
                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
            </svg>
          }
        />
      </div>

      {/* RIEPILOGO SCADENZE */}
      {!loading && (stats.expiredDeadlines > 0 || stats.expiringDeadlines > 0) && (
        <div className='flex flex-col gap-3 p-4 rounded-xl border border-border-primary bg-surface-primary'>
          <h2 className='text-sm font-semibold text-text-primary'>Riepilogo scadenze</h2>
          <div className='flex flex-wrap gap-3'>
            {stats.expiredDeadlines > 0 && (
              <div className='flex items-center gap-2'>
                <DeadlineStatusBadge status='expired' size='sm' />
                <span className='text-sm text-text-secondary'>
                  {stats.expiredDeadlines} scadenz{stats.expiredDeadlines === 1 ? 'a' : 'e'}{' '}
                  scadut{stats.expiredDeadlines === 1 ? 'a' : 'e'}
                </span>
              </div>
            )}
            {stats.expiringDeadlines > 0 && (
              <div className='flex items-center gap-2'>
                <DeadlineStatusBadge status='expiring' size='sm' />
                <span className='text-sm text-text-secondary'>
                  {stats.expiringDeadlines} scadenz{stats.expiringDeadlines === 1 ? 'a' : 'e'} in avvicinamento
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate(ROUTES.VEICOLI_SCADENZE)}
            className='self-start text-xs text-blue-500 hover:text-blue-600
                       hover:underline transition-colors mt-1'
          >
            Vai alle scadenze →
          </button>
        </div>
      )}

      {/* QUICK ACTIONS */}
      <div>
        <h2 className='text-sm font-semibold text-text-primary mb-3'>Accesso rapido</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>

          <QuickAction
            title='Dotazione'
            desc='Anagrafica e stato operativo degli asset'
            onClick={() => navigate(ROUTES.VEICOLI_DOTAZIONE)}
            icon={
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75}
                  d='M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75}
                  d='M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 1h8zM13 8h4l3 3v5h-7V8z' />
              </svg>
            }
          />

          <QuickAction
            title='Autisti'
            desc='Gestione autisti e documenti'
            onClick={() => navigate(ROUTES.VEICOLI_AUTISTI)}
            icon={
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75}
                  d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857
                     M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857
                     m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' />
              </svg>
            }
          />

          <QuickAction
            title='Scadenze'
            desc='Revisioni, assicurazioni e documenti'
            onClick={() => navigate(ROUTES.VEICOLI_SCADENZE)}
            icon={
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75}
                  d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5
                     a2 2 0 00-2 2v12a2 2 0 002 2z' />
              </svg>
            }
          />

          <QuickAction
            title='Storico'
            desc='Assegnazioni, km e interventi di manutenzione'
            onClick={() => navigate(ROUTES.VEICOLI_STORICO)}
            icon={
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75}
                  d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            }
          />

          <QuickAction
            title='Notifiche'
            desc={
              stats.unreadNotifications > 0
                ? `${stats.unreadNotifications} notifich${stats.unreadNotifications === 1 ? 'a' : 'e'} non lett${stats.unreadNotifications === 1 ? 'a' : 'e'}`
                : 'Nessuna notifica non letta'
            }
            onClick={() => navigate(ROUTES.VEICOLI_STORICO)}
            icon={
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75}
                  d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0
                     00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159
                     c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
              </svg>
            }
          />

        </div>
      </div>

    </div>
  );
};
