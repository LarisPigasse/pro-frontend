// src/features/system/pages/SystemPage.tsx

import React from 'react';
import {
  Monitor, RefreshCw, Activity, AlertCircle,
  AlertTriangle, Bell, CheckCircle, XCircle, Mail, ShieldAlert,
} from 'lucide-react';
import Button from '@/core/components/ui/button/Button';
import { Card } from '@/core/components/layout';
import { Skeleton } from '@/core/components/feedback';
import { useSystem } from '../hooks/useSystem';
import { ServiceStatusCard } from '../components/ServiceStatusCard';

// ============================================================================
// STAT CARD ATOMICA
// ============================================================================

interface StatCardProps {
  title:    string;
  value:    string | number;
  icon:     React.ReactNode;
  color:    string;
  loading?: boolean;
  alert?:   boolean;   // evidenzia in rosso se critico
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title, value, icon, color, loading, alert, subtitle,
}) => {
  if (loading) {
    return (
      <Card variant="default" padding="md">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card
      variant="default"
      padding="md"
      className={alert ? 'border border-red-300 dark:border-red-700' : ''}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${alert ? 'text-red-600 dark:text-red-400' : 'text-text-primary'}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

// ============================================================================
// SEZIONE WRAPPER
// ============================================================================

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({
  title, icon, children,
}) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-2">
      <span className="text-text-secondary">{icon}</span>
      <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
        {title}
      </h2>
    </div>
    {children}
  </div>
);

// ============================================================================
// PAGINA PRINCIPALE
// ============================================================================

const SystemPage: React.FC = () => {
  const { data, loading, error, lastUpdate, refetch } = useSystem();

  const stats    = data?.stats;
  const services = data?.services ?? [];
  const last     = data?.lastAlert;

  // Formatta l'orario dell'ultimo aggiornamento
  const lastUpdateStr = lastUpdate
    ? lastUpdate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '—';

  // Controlla se ci sono servizi DOWN
  const hasDownServices = services.some(s => s.status === 'DOWN');

  return (
    <div className="flex flex-col gap-6">

      {/* ------------------------------------------------------------------ */}
      {/* Header                                                               */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${hasDownServices
            ? 'bg-red-100 dark:bg-red-900/30'
            : 'bg-emerald-100 dark:bg-emerald-900/30'
          }`}>
            <Monitor className={`w-6 h-6 ${hasDownServices
              ? 'text-red-600 dark:text-red-400'
              : 'text-emerald-600 dark:text-emerald-400'
            }`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Salute del Sistema</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Ultimo aggiornamento: {lastUpdateStr}
              <span className="ml-2 text-xs opacity-60">(auto ogni 60s)</span>
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={refetch}
          disabled={loading}
          title="Aggiorna ora"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Errore globale */}
      {error && (
        <Card variant="default" padding="md" className="border border-red-300 dark:border-red-700">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </Card>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Sezione: Servizi                                                     */}
      {/* ------------------------------------------------------------------ */}
      <Section
        title="Servizi"
        icon={<Activity className="w-4 h-4" />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ServiceStatusCard key={i} service={{} as any} loading />
              ))
            : services.map(s => (
                <ServiceStatusCard key={s.id} service={s} />
              ))
          }
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Sezione: Attività ultime 24 ore                                      */}
      {/* ------------------------------------------------------------------ */}
      <Section
        title="Attività ultime 24 ore"
        icon={<Activity className="w-4 h-4" />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard
            title="Log totali"
            value={stats?.logs24h ?? 0}
            icon={<Activity className="w-6 h-6 text-white" />}
            color="bg-sky-500 dark:bg-sky-600"
            loading={loading}
          />
          <StatCard
            title="Eventi critici"
            value={stats?.critici24h ?? 0}
            icon={<AlertCircle className="w-6 h-6 text-white" />}
            color={stats?.critici24h ? 'bg-red-500 dark:bg-red-600' : 'bg-gray-400 dark:bg-gray-600'}
            alert={(stats?.critici24h ?? 0) > 0}
            loading={loading}
            subtitle={(stats?.critici24h ?? 0) > 0 ? 'Richiedono attenzione' : undefined}
          />
          <StatCard
            title="Errori"
            value={stats?.errori24h ?? 0}
            icon={<AlertTriangle className="w-6 h-6 text-white" />}
            color={stats?.errori24h ? 'bg-amber-500 dark:bg-amber-600' : 'bg-gray-400 dark:bg-gray-600'}
            loading={loading}
          />
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Sezione: Alerting                                                    */}
      {/* ------------------------------------------------------------------ */}
      <Section
        title="Alerting"
        icon={<Bell className="w-4 h-4" />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard
            title="Regole attive"
            value={stats?.alertRules ?? 0}
            icon={<Bell className="w-6 h-6 text-white" />}
            color="bg-violet-500 dark:bg-violet-600"
            loading={loading}
          />
          <StatCard
            title="Alert ultimi 7gg"
            value={stats?.alertsWeek ?? 0}
            icon={<CheckCircle className="w-6 h-6 text-white" />}
            color="bg-emerald-500 dark:bg-emerald-600"
            loading={loading}
          />
          <StatCard
            title="Alert falliti"
            value={stats?.alertsFailed ?? 0}
            icon={<XCircle className="w-6 h-6 text-white" />}
            color={(stats?.alertsFailed ?? 0) > 0 ? 'bg-red-500 dark:bg-red-600' : 'bg-gray-400 dark:bg-gray-600'}
            alert={(stats?.alertsFailed ?? 0) > 0}
            loading={loading}
            subtitle={(stats?.alertsFailed ?? 0) > 0 ? 'Verificare email-service' : undefined}
          />
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Sezione: Ultimo alert inviato                                        */}
      {/* ------------------------------------------------------------------ */}
      <Section
        title="Ultimo alert inviato"
        icon={<Mail className="w-4 h-4" />}
      >
        {loading ? (
          <Card variant="default" padding="md">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        ) : last ? (
          <Card variant="default" padding="md">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-text-primary">{last.ruleName}</span>
                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{last.sentTo}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {last.status === 'SENT'
                    ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                    : <XCircle    className="w-4 h-4 text-red-500" />
                  }
                  <span className={`text-sm font-medium ${
                    last.status === 'SENT'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {last.status === 'SENT' ? 'Inviato' : 'Fallito'}
                  </span>
                </div>
                <span className="text-xs text-text-secondary tabular-nums">
                  {new Date(last.createdAt).toLocaleString('it-IT')}
                </span>
              </div>
            </div>
          </Card>
        ) : (
          <Card variant="default" padding="md">
            <p className="text-sm text-text-secondary text-center py-4">
              Nessun alert inviato finora
            </p>
          </Card>
        )}
      </Section>

    </div>
  );
};

export default SystemPage;
