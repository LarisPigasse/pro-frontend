// src/config/routes.config.ts

export const ROUTES = {
  // Home
  HOME: '/',

  // Modulo Anagrafiche
  ANAGRAFICHE: '/anagrafiche',
  ANAGRAFICHE_CLIENTI: '/anagrafiche/clienti',
  ANAGRAFICHE_DESTINATARI: '/anagrafiche/destinatari',
  ANAGRAFICHE_MEZZI: '/anagrafiche/mezzi',

  // Modulo Spedizioni
  SPEDIZIONI: '/spedizioni',
  SPEDIZIONI_NUOVA: '/spedizioni/nuova',
  SPEDIZIONI_INCORSO: '/spedizioni/in-corso',
  SPEDIZIONI_STORICO: '/spedizioni/storico',

  // Modulo Sistema
  SISTEMA: '/sistema',
  SISTEMA_ACCOUNT: '/sistema/account',
  SISTEMA_OPERATORI: '/sistema/operatori',
  SISTEMA_PARTNER: '/sistema/partner',

  // User menu
  EXPLORER: '/explorer',
  SETTINGS: '/settings',
  NOT_FOUND: '/404',
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RouteValues = (typeof ROUTES)[RouteKeys];
