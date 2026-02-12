// src/features/logs/components/LogsTable.tsx

/**
 * Tabella principale eventi logs
 */

import React, { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import type { LogEvent } from '../types';
import {
  formatTimestamp,
  getCategoryLabel,
  getCategoryColor,
  getSeverityLabel,
  getSeverityColor,
  getLogMessage,
  getLogUser,
  getOutcomeColor,
} from '../utils/logFormatters';
import { LogDetailModal } from './LogDetailModal';

interface LogsTableProps {
  logs: LogEvent[];
  loading?: boolean;
  page: number;
  limit: number;
  hasMore: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export const LogsTable: React.FC<LogsTableProps> = ({
  logs,
  loading,
  page,
  limit,
  hasMore,
  onNextPage,
  onPrevPage,
}) => {
  const [selectedLog, setSelectedLog] = useState<LogEvent | null>(null);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          </div>
          <p className="mt-4 text-sm text-gray-600">Caricamento logs...</p>
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">Nessun log trovato</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severità
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Messaggio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Esito
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                  {/* Timestamp */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTimestamp(log.timestamp)}
                  </td>

                  {/* Categoria */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                        log.categoria || 'LEGACY'
                      )}`}
                    >
                      {getCategoryLabel(log.categoria || 'LEGACY')}
                    </span>
                  </td>

                  {/* Severità */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(
                        log.criticita || 'INFO'
                      )}`}
                    >
                      {getSeverityLabel(log.criticita || 'INFO')}
                    </span>
                  </td>

                  {/* Utente */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {getLogUser(log)}
                  </td>

                  {/* Messaggio */}
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                    {getLogMessage(log)}
                  </td>

                  {/* Esito */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getOutcomeColor(log.risultato.esito)}`}>
                      {log.risultato.esito}
                    </span>
                  </td>

                  {/* Azioni */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="text-violet-600 hover:text-violet-900 transition-colors"
                      title="Visualizza dettagli"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Pagina <span className="font-medium">{page}</span>
            {' · '}
            <span className="font-medium">{logs.length}</span> eventi
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrevPage}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onNextPage}
              disabled={!hasMore}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </>
  );
};

export default LogsTable;
