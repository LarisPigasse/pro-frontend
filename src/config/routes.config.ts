// src/config/routes.config.ts

export const ROUTES = {
  // Home
  HOME: '/',
  DASHBOARD: '/',

  // Modulo Anagrafiche
  ANAGRAFICHE: '/anagrafiche',
  ANAGRAFICHE_CLIENTI: '/anagrafiche/clienti',
  ANAGRAFICHE_DESTINATARI: '/anagrafiche/destinatari',
  ANAGRAFICHE_MEZZI: '/anagrafiche/mezzi',
  ANAGRAFICHE_OPERATORI: '/anagrafiche/operatori',
  ANAGRAFICHE_PARTNER: '/anagrafiche/partner',

  // Modulo Spedizioni
  SPEDIZIONI: '/spedizioni',
  SPEDIZIONI_NUOVA: '/spedizioni/nuova',
  SPEDIZIONI_INCORSO: '/spedizioni/in-corso',
  SPEDIZIONI_STORICO: '/spedizioni/storico',

  // Modulo Asset Aziendali (route interne su /veicoli per compatibilità backend)
  VEICOLI: '/veicoli',
  VEICOLI_DOTAZIONE: '/veicoli/dotazione',
  VEICOLI_AUTISTI: '/veicoli/autisti',
  VEICOLI_SCADENZE: '/veicoli/scadenze',
  VEICOLI_INTERVENTI: '/veicoli/interventi',
  VEICOLI_CONFIGURAZIONE: '/veicoli/configurazione',

  // Modulo Sistema
  SISTEMA: '/sistema',
  SISTEMA_ACCOUNT: '/sistema/accounts',
  SISTEMA_SESSIONS: '/sistema/sessions',
  SISTEMA_LOGS: '/sistema/logs',
  SISTEMA_INFO: '/sistema/info',
  SISTEMA_EXPLORER: '/sistema/explorer',

  // Auth
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  CHANGE_PASSWORD: '/change-password',

  // User menu
  SETTINGS: '/settings',
  NOT_FOUND: '/404',
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RouteValues = (typeof ROUTES)[RouteKeys];
