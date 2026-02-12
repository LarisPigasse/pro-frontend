// src/features/logs/pages/LogsListPage.tsx

/**
 * Pagina principale lista logs
 * Accessibile solo a utenti root
 */

import React, { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { useLogsList, useLogsStats } from '../hooks';
import { LogStatsCards, LogFiltersPanel, LogsTable } from '../components';
import type { LogFilters } from '../types';
import { logsApi } from '../api/logsApi';
import { downloadFile, generateExportFilename } from '../utils/logFormatters';

export const LogsListPage: React.FC = () => {
  const [filters, setFilters] = useState<LogFilters>({ limit: 50 });

  // Data fetching hooks
  const {
    logs,
    loading: logsLoading,
    error: logsError,
    page,
    limit,
    hasMore,
    refetch,
    nextPage,
    prevPage,
    setFilters: applyFilters,
  } = useLogsList(filters);

  const { stats, loading: statsLoading } = useLogsStats(filters);

  // Export handlers
  const handleExportCsv = async () => {
    try {
      const blob = await logsApi.exportToCsv(filters);
      const filename = generateExportFilename('csv');
      downloadFile(blob, filename);
    } catch (error) {
      console.error('Export CSV failed:', error);
      alert('Errore durante l\'export CSV');
    }
  };

  const handleExportJson = async () => {
    try {
      const blob = await logsApi.exportToJson(filters);
      const filename = generateExportFilename('json');
      downloadFile(blob, filename);
    } catch (error) {
      console.error('Export JSON failed:', error);
      alert('Errore durante l\'export JSON');
    }
  };

  const handleApplyFilters = (newFilters: LogFilters) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Sistema Logs</h1>
        <p className="mt-2 text-sm text-gray-600">
          Monitoraggio eventi e attività del sistema EDG
        </p>
      </div>

      {/* Stats Cards */}
      <LogStatsCards stats={stats} loading={statsLoading} />

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        {/* Left: Filters */}
        <div className="flex items-center gap-3">
          <LogFiltersPanel onApply={handleApplyFilters} currentFilters={filters} />

          {/* Refresh Button */}
          <button
            onClick={() => refetch()}
            disabled={logsLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Aggiorna"
          >
            <RefreshCw className={`w-4 h-4 ${logsLoading ? 'animate-spin' : ''}`} />
            <span>Aggiorna</span>
          </button>
        </div>

        {/* Right: Export */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={handleExportCsv}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg transition-colors"
              >
                Esporta CSV
              </button>
              <button
                onClick={handleExportJson}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg transition-colors"
              >
                Esporta JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {logsError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">
            <strong>Errore:</strong> {logsError}
          </p>
        </div>
      )}

      {/* Logs Table */}
      <LogsTable
        logs={logs}
        loading={logsLoading}
        page={page}
        limit={limit}
        hasMore={hasMore}
        onNextPage={nextPage}
        onPrevPage={prevPage}
      />
    </div>
  );
};

export default LogsListPage;
