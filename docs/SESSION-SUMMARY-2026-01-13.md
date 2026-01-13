# EDG Pro-Frontend - Riepilogo Sessione 13 Gennaio 2026

## Stato Attuale del Progetto

**Versione**: 3.1
**Repository**: pro-frontend in edg-docker
**Container**: pro-frontend (Docker)
**Dev server**: porta 5173

---

## Modifiche Completate in Questa Sessione

### 1. Rimozione Sistema Sidebar (COMPLETATO ✅)

L'applicazione ora usa **solo navigazione via Header** (Opzione A), senza sidebar laterale.

**File modificati/eliminati:**

| File | Azione |
|------|--------|
| `src/app/slices/uiSlice.ts` | Rimossi `sidebarVisible`, `sidebarExpanded` e relative actions |
| `src/app/slices/index.ts` | Rimossi export sidebar |
| `src/app/hooks.ts` | Rimossi riferimenti sidebar da `useUISettings` |
| `src/core/components/layout/custom/MainLayout.tsx` | Rimossa sidebar dal layout |
| `src/core/components/layout/custom/Sidebar.tsx` | **ELIMINATO** |
| `src/core/components/layout/index.ts` | Rimosso export Sidebar |
| `src/core/components/navigation/custom/SettingsMenu.tsx` | Rimosso toggle sidebar |

### 2. Nuovo Sistema di Navigazione Header (COMPLETATO ✅)

**Comportamento attuale:**

```
In Home (/)
[Logo]  HOME | ANAGRAFICHE | SPEDIZIONI | SISTEMA      Admin Demo  [🔔] [👤] [⚙]

In un modulo (es. /anagrafiche/clienti)
[Logo]  HOME | ANAGRAFICHE : Clienti | Destinatari | Mezzi | SPEDIZIONI | SISTEMA      Admin Demo  [🔔] [👤] [⚙]
```

**Caratteristiche:**
- Logo + Navigazione raggruppati a sinistra
- Nome utente + Azioni a destra
- Altezza header: `h-10` (40px)
- Quando un modulo è attivo, mostra i suoi children dopo `:`

### 3. Sfondo Immagine Responsive (COMPLETATO ✅)

**Implementazione:**
- Immagine di sfondo fissa in `src/assets/background.jpg`
- Usa div separato con `position: fixed` per compatibilità cross-browser (incluso iOS)
- Non configurabile dall'utente
- Stessa immagine per tema light/dark

### 4. Dichiarazioni TypeScript per Assets (COMPLETATO ✅)

File `src/types/assets.d.ts` creato (oppure verificato `src/vite-env.d.ts`) per supportare import di immagini.

---

## File Chiave Attuali

### Configurazione Navigazione

| File | Scopo |
|------|-------|
| `src/config/routes.config.ts` | Definizione routes |
| `src/config/navigation.config.ts` | Configurazione moduli e helper |
| `src/config/index.ts` | Barrel exports config |

### Layout e Componenti

| File | Scopo |
|------|-------|
| `src/core/components/layout/custom/Header.tsx` | Header con navigazione a sinistra, user info a destra |
| `src/core/components/layout/custom/MainLayout.tsx` | Layout principale con sfondo immagine |
| `src/core/components/layout/custom/Footer.tsx` | Footer (toggle on/off in settings) |
| `src/core/components/navigation/custom/SettingsMenu.tsx` | Menu impostazioni (Dark Mode, Footer) |
| `src/core/components/navigation/custom/UserMenu.tsx` | Menu utente |
| `src/core/components/navigation/custom/MobileMenu.tsx` | Menu mobile (da implementare) |

### Redux State

| File | Scopo |
|------|-------|
| `src/app/slices/uiSlice.ts` | Stato UI (darkMode, footerVisible, menu states) |
| `src/app/hooks.ts` | Hook `useUISettings` |
| `src/app/store.ts` | Configurazione Redux store |

---

## Struttura UIState Attuale (Redux)

```typescript
interface UIState {
  darkMode: boolean;
  footerVisible: boolean;
  userMenuOpen: boolean;
  settingsMenuOpen: boolean;
  mobileMenuOpen: boolean;
}
```

**Nota:** `sidebarVisible` e `sidebarExpanded` sono stati rimossi.

---

## Configurazione Moduli Navigazione

```typescript
// src/config/navigation.config.ts
export const MODULES: ModuleConfig[] = [
  {
    id: 'home',
    label: 'HOME',
    href: ROUTES.HOME,
    icon: Home,
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
    id: 'sistema',
    label: 'SISTEMA',
    href: ROUTES.SISTEMA,
    icon: Truck,
    children: [
      { id: 'account', label: 'Account', href: ROUTES.SISTEMA_ACCOUNT },
      { id: 'operatori', label: 'Operatori', href: ROUTES.SISTEMA_OPERATORI },
      { id: 'partner', label: 'Partner', href: ROUTES.SISTEMA_PARTNER },
    ],
  },
];
```

---

## Codice File Principali Aggiornati

### Header.tsx

```typescript
// src/core/components/layout/custom/Header.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Settings, Bell } from "lucide-react";

import { UserAvatar, Logo } from "../../info";
import { useUISettings } from "../../../../app/hooks";
import { useIsMobile } from "../../../hooks";
import { MODULES, getActiveModule } from "../../../../config";
import type { SubMenuItem } from "../../../../config";

interface HeaderProps {
  userInitials?: string;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ userInitials = "AD", userName = "Admin Demo" }) => {
  const { toggleSettingsMenu, toggleUserMenu, toggleMobileMenu } = useUISettings();
  const isMobile = useIsMobile();
  const location = useLocation();

  const activeModule = getActiveModule(location.pathname);

  const isActiveLink = (href: string) => location.pathname === href;

  const isModuleActive = (moduleHref: string, moduleId: string) => {
    if (moduleId === "home") {
      return location.pathname === "/" || location.pathname === moduleHref;
    }
    return location.pathname.startsWith(moduleHref);
  };

  const renderDesktopNav = () => {
    return (
      <nav className="hidden md:flex items-center">
        {MODULES.map((module, index) => {
          const isActive = isModuleActive(module.href, module.id);
          const isCurrentModule = activeModule?.id === module.id;
          const hasChildren = module.children && module.children.length > 0;
          const showChildren = isCurrentModule && hasChildren;

          return (
            <React.Fragment key={module.id}>
              {index > 0 && <span className="mx-3 text-border-default">|</span>}

              {showChildren ? (
                <>
                  <Link to={module.href} className="text-sm font-medium text-violet-600 whitespace-nowrap">
                    {module.label}
                  </Link>

                  <span className="text-text-tertiary mx-2">:</span>

                  <div className="flex items-center space-x-4">
                    {module.children!.map((child: SubMenuItem) => (
                      <Link
                        key={child.id}
                        to={child.href}
                        className={`text-sm font-medium transition-colors whitespace-nowrap ${
                          isActiveLink(child.href) ? "text-violet-600" : "text-text-primary hover:text-violet-500"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={module.href}
                  className={`text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive ? "text-violet-600" : "text-text-primary hover:text-violet-500"
                  }`}
                >
                  {module.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    );
  };

  return (
    <header className="bg-bg-primary border-b border-border-default">
      <div className="w-full px-2 sm:px-4">
        <div className="flex items-center h-10">
          {/* LEFT AREA - Logo + Navigation */}
          <div className="flex items-center space-x-6">
            <Logo />
            {isMobile ? (
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-bg-hover transition-colors md:hidden"
                title="Apri menu navigazione"
                aria-label="Menu navigazione"
              >
                <Menu className="w-5 h-5" />
              </button>
            ) : (
              renderDesktopNav()
            )}
          </div>

          {/* SPACER */}
          <div className="flex-1" />

          {/* RIGHT AREA - User Name + Actions */}
          <div className="flex items-center space-x-3">
            {!isMobile && (
              <>
                <span className="text-sm text-text-secondary">{userName}</span>
                <button
                  className="p-2 rounded-lg hover:bg-bg-hover transition-colors relative"
                  title="Notifiche"
                  aria-label="Notifiche"
                >
                  <Bell className="w-5 h-5 text-text-primary" />
                </button>
              </>
            )}

            <UserAvatar initials={userInitials} size="md" onClick={toggleUserMenu} />

            <button
              onClick={toggleSettingsMenu}
              className="p-2 rounded-lg hover:bg-bg-hover transition-colors text-text-primary"
              title="Impostazioni app"
              aria-label="Menu impostazioni"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
```

### MainLayout.tsx

```typescript
// src/core/components/layout/custom/MainLayout.tsx
import React from "react";

import { Header, Footer } from "..";
import { SettingsMenu, UserMenu } from "../../navigation";
import { useUISettings } from "../../../../app/hooks";
import { useIsMobile } from "../../../hooks";
import backgroundImage from "../../../../assets/background.jpg";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { footerVisible } = useUISettings();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col relative">
        {/* Background fisso per mobile */}
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <Header />
        <main className="flex-1">
          <div className="w-full px-4 sm:px-6 py-8">{children}</div>
        </main>
        {footerVisible && <Footer showVersionInfo={true} />}
        <SettingsMenu />
        <UserMenu />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background fisso per desktop */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] min-h-screen">
        <header className="sticky top-0 z-40 col-span-full">
          <Header />
        </header>

        <main className="flex-1 min-w-0 overflow-y-auto flex flex-col">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">{children}</div>
        </main>

        {footerVisible && (
          <footer className="sticky bottom-0 z-40 col-span-full">
            <Footer showVersionInfo={true} />
          </footer>
        )}
      </div>

      <SettingsMenu />
      <UserMenu />
    </div>
  );
};

export default MainLayout;
```

---

## Prossimi Passi: Modulo Autenticazione

### Obiettivi della prossima sessione:

1. **Verificare auth-service backend** - Capire endpoint disponibili e stato di sviluppo
2. **Definire struttura dati utente** - Ruoli, permessi, informazioni profilo
3. **Creare pagine UI:**
   - Login page
   - (Eventuale) Registrazione
   - (Eventuale) Password dimenticata
4. **Implementare protezione route** - Redirect a login se non autenticato
5. **Integrare JWT** - Storage token, refresh, logout
6. **Aggiornare Header** - Mostrare nome utente reale invece di "Admin Demo"

### Note tecniche:

- Auth-service usa **JWT**
- È un microservizio nell'architettura Docker EDG
- Struttura dati utente da definire insieme

---

## Architettura Docker EDG

L'applicazione fa parte di un'architettura a microservizi:

- **pro-frontend**: Frontend React (questo progetto)
- **auth-service**: Microservizio autenticazione (JWT)
- **api-gateway**: Gateway API
- **Altri microservizi**: Log service, etc.

---

## Stack Tecnologico

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS con sistema di theming custom
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build**: Vite

---

*Documento creato: 13 Gennaio 2026*
*Per continuare: caricare questo documento nella nuova chat dedicata all'autenticazione*
