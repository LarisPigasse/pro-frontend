// src/features/logs/components/LogDetailModal.tsx

/**
 * Modal dettaglio singolo evento log
 */

import React from 'react';
import { X } from 'lucide-react';
import type { LogEvent } from '../types';
import {
  formatTimestamp,
  getCategoryLabel,
  getSeverityLabel,
  getLogMessage,
  getLogUser,
} from '../utils/logFormatters';

interface LogDetailModalProps {
  log: LogEvent;
  onClose: () => void;
}

export const LogDetailModal: React.FC<LogDetailModalProps> = ({ log, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Dettaglio Evento</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Overview */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Timestamp
                </label>
                <p className="text-gray-900">{formatTimestamp(log.timestamp)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  ID Evento
                </label>
                <p className="text-gray-900 font-mono text-sm">{log._id}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Categoria
                </label>
                <p className="text-gray-900">{getCategoryLabel(log.categoria || 'LEGACY')}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Severità
                </label>
                <p className="text-gray-900">{getSeverityLabel(log.criticita || 'INFO')}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Utente
                </label>
                <p className="text-gray-900">{getLogUser(log)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Esito
                </label>
                <p className="text-gray-900 capitalize">{log.risultato.esito}</p>
              </div>
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Messaggio
              </label>
              <p className="text-gray-900">{getLogMessage(log)}</p>
            </div>

            {/* Azione */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Azione</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Tipo:</span>
                    <span className="ml-2 text-sm text-gray-900">{log.azione.tipo}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Entità:</span>
                    <span className="ml-2 text-sm text-gray-900">{log.azione.entita}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">ID Entità:</span>
                    <span className="ml-2 text-sm text-gray-900 font-mono">{log.azione.idEntita}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Operazione:</span>
                    <span className="ml-2 text-sm text-gray-900">{log.azione.operazione}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contesto */}
            {log.contesto && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Contesto</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-900 whitespace-pre-wrap font-mono">
                    {JSON.stringify(log.contesto, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Metadata */}
            {log.metadata && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Metadata</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-900 whitespace-pre-wrap font-mono">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Stato (se presente) */}
            {log.stato && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Cambiamenti Stato</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Stato Precedente */}
                  {log.stato.precedente && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2">
                        Precedente
                      </label>
                      <div className="bg-red-50 rounded-lg p-3">
                        <pre className="text-xs text-gray-900 whitespace-pre-wrap font-mono">
                          {JSON.stringify(log.stato.precedente, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Stato Nuovo */}
                  {log.stato.nuovo && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2">
                        Nuovo
                      </label>
                      <div className="bg-green-50 rounded-lg p-3">
                        <pre className="text-xs text-gray-900 whitespace-pre-wrap font-mono">
                          {JSON.stringify(log.stato.nuovo, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {log.tags && log.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {log.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Raw JSON (collapsible) */}
            <details className="mb-4">
              <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">
                Visualizza JSON Completo
              </summary>
              <div className="mt-3 bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs text-green-400 font-mono">
                  {JSON.stringify(log, null, 2)}
                </pre>
              </div>
            </details>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogDetailModal;
