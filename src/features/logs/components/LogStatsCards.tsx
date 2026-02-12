// src/features/logs/components/LogStatsCards.tsx

/**
 * Cards statistiche overview logs
 */

import React from 'react';
import type { LogStats } from '../types';
import { Activity, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

interface LogStatsCardsProps {
  stats: LogStats | null;
  loading?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export const LogStatsCards: React.FC<LogStatsCardsProps> = ({ stats, loading }) => {
  const totalEvents = stats?.total || 0;
  const criticalEvents = stats?.criticalEvents || 0;
  const errorEvents = stats?.bySeverity?.ERROR || 0;
  const successRate = stats?.total 
    ? ((stats.byOutcome.successo / stats.total) * 100).toFixed(1)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Total Events */}
      <StatCard
        title="Eventi Totali"
        value={totalEvents}
        icon={<Activity className="w-6 h-6 text-white" />}
        color="bg-blue-500"
        loading={loading}
      />

      {/* Critical Events */}
      <StatCard
        title="Eventi Critici"
        value={criticalEvents}
        icon={<AlertCircle className="w-6 h-6 text-white" />}
        color="bg-red-500"
        loading={loading}
      />

      {/* Errors */}
      <StatCard
        title="Errori"
        value={errorEvents}
        icon={<AlertTriangle className="w-6 h-6 text-white" />}
        color="bg-amber-500"
        loading={loading}
      />

      {/* Success Rate */}
      <StatCard
        title="Tasso Successo"
        value={`${successRate}%`}
        icon={<CheckCircle className="w-6 h-6 text-white" />}
        color="bg-green-500"
        loading={loading}
      />
    </div>
  );
};

export default LogStatsCards;
