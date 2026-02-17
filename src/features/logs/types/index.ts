// src/features/logs/types/index.ts

/**
 * Types per il modulo Logs
 * Sincronizzati con @edg/log-service
 */

// ============================================================================
// ENUMS - Categorie e Severità
// ============================================================================

export enum EventCategory {
  AUTH = 'AUTH',
  DATA = 'DATA',
  EMAIL = 'EMAIL',
  SYSTEM = 'SYSTEM',
  AUDIT = 'AUDIT',
  SECURITY = 'SECURITY',
}

export enum EventSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

// ============================================================================
// LOG EVENT - Struttura evento dal backend
// ============================================================================

export interface LogEvent {
  _id: string;
  timestamp: string;
  
  // Campi standardizzati (FASE 1)
  categoria?: EventCategory;
  sottoCategoria?: string;
  criticita?: EventSeverity;
  metadata?: Record<string, any>;
  
  // Campi legacy (sempre presenti)
  origine: {
    tipo: 'utente' | 'sistema';
    id: string;
    dettagli?: Record<string, any>;
  };
  azione: {
    tipo: 'create' | 'update' | 'delete' | 'custom';
    entita: string;
    idEntita: string;
    operazione: string;
    dettagli?: Record<string, any>;
  };
  risultato: {
    esito: 'successo' | 'fallito' | 'parziale';
    messaggio?: string;
  };
  contesto?: {
    transazioneId?: string;
    causalita?: string[];
    sessione?: string;
    ip?: string;
    userAgent?: string;
    ambiente?: string;
  };
  stato?: {
    precedente?: Record<string, any> | null;
    nuovo?: Record<string, any> | null;
    diff?: Record<string, any> | null;
  };
  tags?: string[];
  
  // Audit fields
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// FILTERS - Filtri per query
// ============================================================================

export interface LogFilters {
  categoria?: EventCategory;
  criticita?: EventSeverity;
  userId?: string;
  entita?: string;
  esito?: 'successo' | 'fallito' | 'parziale';
  startDate?: string;
  endDate?: string;
  search?: string;
  limit?: number;
  skip?: number;
}

// ============================================================================
// STATISTICS - Statistiche aggregate
// ============================================================================

export interface LogStats {
  total: number;
  byCategory: Record<EventCategory, number>;
  bySeverity: Record<EventSeverity, number>;
  byOutcome: {
    successo: number;
    fallito: number;
    parziale: number;
  };
  criticalEvents: number;
  lastHourEvents: number;
  successRate: {
    overall: number;      // Tasso successo generale (tutti i dati)
    last30Days: number;   // Tasso successo ultimi 30 giorni
    trend: number;        // Differenza: last30Days - overall
  };
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface LogsListResponse {
  logs: LogEvent[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface LogDetailResponse {
  log: LogEvent;
}

export interface LogStatsResponse {
  stats: LogStats;
}

// ============================================================================
// UI HELPERS
// ============================================================================

export interface LogTableRow {
  id: string;
  timestamp: string;
  category: EventCategory | 'LEGACY';
  severity: EventSeverity | 'INFO';
  user: string;
  action: string;
  outcome: 'successo' | 'fallito' | 'parziale';
  message?: string;
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type { LogEvent as Log };
