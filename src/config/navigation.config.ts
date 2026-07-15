// src/config/navigation.config.ts
import type { LucideIcon } from 'lucide-react';
import { Home, Users, Truck, Settings, Package } from 'lucide-react';
import { ROUTES } from './routes.config';

/**
 * Sottomenu di un modulo
 */
export interface SubMenuItem {
  id: string;
  label: string;
  href: string;
}

/**
 * Configurazione di un modulo
 * - Se ha children, mostra il sottomenu quando attivo
 * - Se non ha children, è una voce semplice (es. Home)
 */
export interface ModuleConfig {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  children?: SubMenuItem[];
}

/**
 * Configurazione dei moduli dell'applicazione
 *
 * Per aggiungere un nuovo modulo:
 * 1. Aggiungi le routes in routes.config.ts
 * 2. Aggiungi il modulo qui con i suoi children
 */
export const MODULES: ModuleConfig[] = [
  {
    id: 'home',
    label: 'HOME',
    href: ROUTES.HOME,
    icon: Home,
    // Home non ha children, mostra tutti i moduli
  },
  {
    id: 'anagrafiche',
    label: 'ANAGRAFICHE',
    href: ROUTES.ANAGRAFICHE,
    icon: Users,
    children: [
      { id: 'clienti', label: 'Clienti', href: ROUTES.ANAGRAFICHE_CLIENTI },
      { id: 'destinatari', label: 'Destinatari', href: ROUTES.ANAGRAFICHE_DESTINATARI },
      { id: 'mezzi', label: 'Mezzi', href: ROUTES.ANAGRAFICHE_MEZZI },
      { id: 'operatori', label: 'Operatori', href: ROUTES.ANAGRAFICHE_OPERATORI },
      { id: 'partner', label: 'Partner', href: ROUTES.ANAGRAFICHE_PARTNER },
    ],
  },
  {
    id: 'spedizioni',
    label: 'SPEDIZIONI',
    href: ROUTES.SPEDIZIONI,
    icon: Truck,
    children: [
      { id: 'nuova', label: 'Nuova', href: ROUTES.SPEDIZIONI_NUOVA },
      { id: 'incorso', label: 'In corso', href: ROUTES.SPEDIZIONI_INCORSO },
      { id: 'storico', label: 'Storico', href: ROUTES.SPEDIZIONI_STORICO },
    ],
  },
  {
    id: 'veicoli',
    label: 'ASSET',
    href: ROUTES.VEICOLI,
    icon: Package,
    children: [
      { id: 'dotazione', label: 'Dotazione', href: ROUTES.VEICOLI_DOTAZIONE },
      { id: 'autisti', label: 'Autisti', href: ROUTES.VEICOLI_AUTISTI },
      { id: 'scadenze', label: 'Scadenze', href: ROUTES.VEICOLI_SCADENZE },
      { id: 'interventi', label: 'Interventi', href: ROUTES.VEICOLI_INTERVENTI },
      { id: 'configurazione', label: 'Configurazione', href: ROUTES.VEICOLI_CONFIGURAZIONE },
    ],
  },
  {
    id: 'sistema',
    label: 'SISTEMA',
    href: ROUTES.SISTEMA,
    icon: Settings,
    children: [
      { id: 'accounts', label: 'Accounts', href: ROUTES.SISTEMA_ACCOUNT },
      { id: 'sessions', label: 'Sessioni', href: ROUTES.SISTEMA_SESSIONS },
      { id: 'logs', label: 'Logs', href: ROUTES.SISTEMA_LOGS },
      { id: 'info', label: 'Info', href: ROUTES.SISTEMA_INFO },
      { id: 'explorer', label: 'Explorer', href: ROUTES.SISTEMA_EXPLORER },
    ],
  },
];

/**
 * Voci di sistema (non sono moduli, sempre visibili in altre posizioni)
 */
export const SYSTEM_ITEMS = {
  settings: {
    id: 'settings',
    label: 'Impostazioni',
    href: ROUTES.SETTINGS,
    icon: Settings,
  },
} as const;

/**
 * Helper: trova il modulo attivo dalla pathname
 */
export const getActiveModule = (pathname: string): ModuleConfig | null => {
  // Home è attivo solo se pathname è esattamente "/"
  if (pathname === '/') {
    return MODULES.find(m => m.id === 'home') || null;
  }

  // Trova il modulo che matcha il pathname
  return MODULES.find(m => m.id !== 'home' && pathname.startsWith(m.href)) || null;
};

/**
 * Helper: verifica se siamo in Home (mostra tutti i moduli)
 */
export const isHomeActive = (pathname: string): boolean => {
  return pathname === '/' || pathname === ROUTES.HOME;
};

// Type exports
export type ModuleId = ModuleConfig['id'];
