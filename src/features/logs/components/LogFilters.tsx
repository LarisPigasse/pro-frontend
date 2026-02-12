// src/features/logs/components/LogFilters.tsx

/**
 * Sidebar filtri per logs
 */

import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import type { LogFilters, EventCategory, EventSeverity } from '../types';
import { EventCategory as CategoryEnum, EventSeverity as SeverityEnum } from '../types';

interface LogFiltersProps {
  onApply: (filters: LogFilters) => void;
  currentFilters: LogFilters;
}

export const LogFiltersPanel: React.FC<LogFiltersProps> = ({ onApply, currentFilters }) => {
  const [filters, setFilters] = useState<LogFilters>(currentFilters);
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    onApply(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const emptyFilters: LogFilters = {};
    setFilters(emptyFilters);
    onApply(emptyFilters);
  };

  const hasActiveFilters = Object.keys(currentFilters).length > 0;

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Filter className="w-4 h-4" />
        <span>Filtri</span>
        {hasActiveFilters && (
          <span className="ml-2 px-2 py-0.5 text-xs bg-violet-100 text-violet-800 rounded-full">
            {Object.keys(currentFilters).length}
          </span>
        )}
      </button>

      {/* Filters Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Filtri Avanzati</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Form */}
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={filters.categoria || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    categoria: e.target.value as EventCategory || undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="">Tutte</option>
                {Object.values(CategoryEnum).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Severità */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severità
              </label>
              <select
                value={filters.criticita || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    criticita: e.target.value as EventSeverity || undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="">Tutte</option>
                {Object.values(SeverityEnum).map((sev) => (
                  <option key={sev} value={sev}>
                    {sev}
                  </option>
                ))}
              </select>
            </div>

            {/* Esito */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Esito
              </label>
              <select
                value={filters.esito || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    esito: e.target.value as 'successo' | 'fallito' | 'parziale' || undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="">Tutti</option>
                <option value="successo">Successo</option>
                <option value="fallito">Fallito</option>
                <option value="parziale">Parziale</option>
              </select>
            </div>

            {/* User ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Utente
              </label>
              <input
                type="text"
                value={filters.userId || ''}
                onChange={(e) =>
                  setFilters({ ...filters, userId: e.target.value || undefined })
                }
                placeholder="es: user_123"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Inizio
              </label>
              <input
                type="datetime-local"
                value={filters.startDate || ''}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value || undefined })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Fine
              </label>
              <input
                type="datetime-local"
                value={filters.endDate || ''}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value || undefined })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
            >
              Applica
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogFiltersPanel;
