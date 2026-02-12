// src/features/logs/index.ts

/**
 * MODULO LOGS - Entry Point
 * 
 * Sistema di visualizzazione e analisi logs centralizzato.
 * Accessibile solo agli utenti root.
 * 
 * @example
 * ```tsx
 * // Importare pagine
 * import { LogsListPage } from '@/features/logs';
 * 
 * // Importare componenti
 * import { LogsTable, LogStatsCards } from '@/features/logs';
 * 
 * // Importare tipi
 * import type { LogEvent, LogFilters } from '@/features/logs';
 * ```
 */

// ============================================================================
// TYPES
// ============================================================================

export type {
  LogEvent,
  LogFilters,
  LogStats,
  LogTableRow,
  EventCategory,
  EventSeverity,
} from './types';

export { EventCategory, EventSeverity } from './types';

// ============================================================================
// API
// ============================================================================

export { logsApi } from './api/logsApi';

// ============================================================================
// HOOKS
// ============================================================================

export { useLogsList, useLogsStats } from './hooks';

// ============================================================================
// COMPONENTS
// ============================================================================

export { LogStatsCards, LogFiltersPanel, LogsTable, LogDetailModal } from './components';

// ============================================================================
// PAGES
// ============================================================================

export { LogsListPage } from './pages';

// ============================================================================
// UTILS
// ============================================================================

export {
  formatTimestamp,
  formatRelativeTime,
  getCategoryLabel,
  getCategoryColor,
  getSeverityLabel,
  getSeverityColor,
  getOutcomeLabel,
  getOutcomeColor,
  getLogMessage,
  getLogUser,
  downloadFile,
  generateExportFilename,
} from './utils/logFormatters';
