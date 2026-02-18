// src/features/alerts/pages/AlertsPage.tsx

/**
 * Pagina principale del modulo Alerts.
 * Due tab: "Regole" (CRUD regole) e "Storico" (history + stats).
 * Accessibile solo a root via PrivateRoute con requiredPermission="sistema.alerts".
 */

import React, { useState, useCallback } from 'react';
import { Bell, List, Plus, RefreshCw } from 'lucide-react';
import Button from '@/core/components/ui/button/Button';
import { Card } from '@/core/components/layout';
import { useToast } from '@/core/components/feedback';
import { useAlertRules, useAlertHistory } from '../hooks';
import {
  AlertStatsCards,
  AlertRulesTable,
  AlertHistoryTable,
  AlertRuleForm,
} from '../components';
import type { AlertRule, AlertRuleFormData, AlertHistoryFilters } from '../types';

// ============================================================================
// TIPI LOCALI
// ============================================================================

type Tab = 'rules' | 'history';

// ============================================================================
// COMPONENTE
// ============================================================================

const AlertsPage: React.FC = () => {
  const toast = useToast();

  // --------------------------------------------------------------------------
  // Tab attiva
  // --------------------------------------------------------------------------

  const [activeTab, setActiveTab] = useState<Tab>('rules');

  // --------------------------------------------------------------------------
  // Hooks dati
  // --------------------------------------------------------------------------

  const {
    rules,
    loading:  rulesLoading,
    error:    rulesError,
    total:    rulesTotal,
    refetch:  refetchRules,
    createRule,
    updateRule,
    toggleRule,
    deleteRule,
  } = useAlertRules();

  const [historyFilters, setHistoryFilters] = useState<AlertHistoryFilters>({});

  const {
    history,
    stats,
    loading:      historyLoading,
    statsLoading,
    error:        historyError,
    pagination,
    nextPage,
    prevPage,
    setFilters:   applyHistoryFilters,
    refetch:      refetchHistory,
    refetchStats,
  } = useAlertHistory(historyFilters);

  // --------------------------------------------------------------------------
  // Stato modale form
  // --------------------------------------------------------------------------

  const [formOpen,    setFormOpen]    = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // --------------------------------------------------------------------------
  // Stato toggle in corso
  // --------------------------------------------------------------------------

  const [togglingId, setTogglingId] = useState<string | null>(null);

  // --------------------------------------------------------------------------
  // Handlers — Regole
  // --------------------------------------------------------------------------

  const handleOpenCreate = useCallback(() => {
    setEditingRule(null);
    setFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((rule: AlertRule) => {
    setEditingRule(rule);
    setFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setFormOpen(false);
    setEditingRule(null);
  }, []);

  const handleSubmitForm = useCallback(async (data: AlertRuleFormData) => {
    setFormLoading(true);
    try {
      if (editingRule) {
        await updateRule(editingRule._id, data);
        toast({ title: `Regola "${data.name}" aggiornata` });
      } else {
        await createRule(data);
        toast({ title: `Regola "${data.name}" creata` });
      }
      handleCloseForm();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Errore nel salvataggio';
      toast?.danger({ title: msg });
    } finally {
      setFormLoading(false);
    }
  }, [editingRule, createRule, updateRule, handleCloseForm, toast]);

  const handleToggle = useCallback(async (rule: AlertRule) => {
    setTogglingId(rule._id);
    try {
      await toggleRule(rule._id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Errore nel toggle';
      toast?.danger({ title: msg });
    } finally {
      setTogglingId(null);
    }
  }, [toggleRule, toast]);

  const handleDelete = useCallback(async (rule: AlertRule) => {
    if (!window.confirm(`Eliminare la regola "${rule.name}"?\nLo storico associato verrà mantenuto.`)) {
      return;
    }
    try {
      await deleteRule(rule._id);
      toast({ title: `Regola "${rule.name}" eliminata` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Errore nell\'eliminazione';
      toast?.danger({ title: msg });
    }
  }, [deleteRule, toast]);

  // --------------------------------------------------------------------------
  // Handlers — Storico
  // --------------------------------------------------------------------------

  const handleHistoryFilters = useCallback((filters: AlertHistoryFilters) => {
    setHistoryFilters(filters);
    applyHistoryFilters(filters);
  }, [applyHistoryFilters]);

  const handleRefreshHistory = useCallback(async () => {
    await Promise.all([refetchHistory(), refetchStats()]);
  }, [refetchHistory, refetchStats]);

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------

  return (
    <div className="flex flex-col gap-6">

      {/* ------------------------------------------------------------------ */}
      {/* Header pagina                                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30">
            <Bell className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Alert Manager</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Configura regole di alerting e monitora gli alert inviati
            </p>
          </div>
        </div>

        {/* Azioni header */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={activeTab === 'rules' ? refetchRules : handleRefreshHistory}
            title="Aggiorna"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>

          {activeTab === 'rules' && (
            <Button variant="primary" size="sm" onClick={handleOpenCreate}>
              <Plus className="w-4 h-4 mr-1.5" />
              Nuova regola
            </Button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Tab navigation                                                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex border-b border-border-default">
        <TabButton
          active={activeTab === 'rules'}
          onClick={() => setActiveTab('rules')}
          icon={<Bell className="w-4 h-4" />}
          label="Regole"
          count={rulesTotal}
        />
        <TabButton
          active={activeTab === 'history'}
          onClick={() => setActiveTab('history')}
          icon={<List className="w-4 h-4" />}
          label="Storico"
          count={stats?.total}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Contenuto tab                                                        */}
      {/* ------------------------------------------------------------------ */}

      {activeTab === 'rules' && (
        <div className="flex flex-col gap-4">
          {rulesError && <ErrorBanner message={rulesError} onRetry={refetchRules} />}

          <AlertRulesTable
            rules={rules}
            loading={rulesLoading}
            togglingId={togglingId}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        </div>
      )}

      {activeTab === 'history' && (
        <div className="flex flex-col gap-6">
          {/* Card statistiche */}
          <AlertStatsCards stats={stats} loading={statsLoading} />

          {historyError && <ErrorBanner message={historyError} onRetry={refetchHistory} />}

          {/* Tabella storico */}
          <AlertHistoryTable
            history={history}
            loading={historyLoading}
            pagination={pagination}
            filters={historyFilters}
            onNextPage={nextPage}
            onPrevPage={prevPage}
            onFilters={handleHistoryFilters}
          />
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Modale form                                                          */}
      {/* ------------------------------------------------------------------ */}
      {formOpen && (
        <AlertRuleForm
          rule={editingRule}
          onSubmit={handleSubmitForm}
          onClose={handleCloseForm}
          loading={formLoading}
        />
      )}

    </div>
  );
};

// ============================================================================
// SUB-COMPONENTI LOCALI
// ============================================================================

interface TabButtonProps {
  active:   boolean;
  onClick:  () => void;
  icon:     React.ReactNode;
  label:    string;
  count?:   number;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
      ${active
        ? 'border-violet-600 text-violet-600 dark:text-violet-400 dark:border-violet-400'
        : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-default'
      }
    `}
  >
    {icon}
    {label}
    {count !== undefined && (
      <span className={`
        inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-medium
        ${active
          ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
          : 'bg-bg-secondary text-text-secondary'
        }
      `}>
        {count}
      </span>
    )}
  </button>
);

interface ErrorBannerProps {
  message:  string;
  onRetry?: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry }) => (
  <Card variant="default" padding="md">
    <div className="flex items-center justify-between">
      <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry}>
          Riprova
        </Button>
      )}
    </div>
  </Card>
);

export default AlertsPage;
