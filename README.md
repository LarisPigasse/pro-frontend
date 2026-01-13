# EDG Frontend Template

🚀 **Modern React TypeScript frontend template with complete UI component system and theming**

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.10-38B2AC.svg)](https://tailwindcss.com/)

> Un template frontend completo e riutilizzabile per avviare rapidamente lo sviluppo di applicazioni React moderne con un sistema di design robusto e scalabile.

## ✨ Caratteristiche Principali

### 🎨 Sistema di Design
- **50+ componenti UI** pronti all'uso organizzati per categoria
- **Dark/Light mode** automatico con CSS variables e persistenza
- **Radix UI primitives** per accessibilità completa
- **Tailwind CSS 4** con theming tramite custom properties

### 🛠️ Stack Tecnologico
- **React 19** con hooks e TypeScript rigoroso
- **Vite** per build ultrarapidi e HMR istantaneo
- **Redux Toolkit** per state management con persistenza
- **React Router** per routing tipizzato

### 📱 Layout Responsivo
- **Mobile-first** design con breakpoints intelligenti
- **Sidebar collassabile** con stati espanso/compresso
- **Header/Footer** condizionali e configurabili

## 🚀 Quick Start

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Build per produzione
npm run build

# Anteprima build di produzione
npm run preview
```

## 📁 Struttura del Progetto

```
src/
├── app/                    # Redux store e configurazione
│   ├── middleware/         # Persistence middleware
│   ├── slices/             # Redux slices (UI state)
│   └── store.ts            # Store configuration
├── core/                   # Componenti core riutilizzabili
│   ├── components/
│   │   ├── actions/        # Action menu, CRUD actions
│   │   ├── data/           # Table, TableLink
│   │   ├── feedback/       # Alert, Modal, Toast, Progress
│   │   ├── form/           # Input, Select, Checkbox, DatePicker
│   │   ├── info/           # Logo, Avatar, VersionInfo
│   │   ├── layout/         # Header, Sidebar, Footer, Card
│   │   ├── navigation/     # Menu, Tabs, Command
│   │   └── ui/             # Button, Badge, Accordion
│   ├── hooks/              # Custom hooks
│   ├── services/           # API services
│   └── utils/              # Utilities
├── features/               # Feature modules (da popolare)
├── pages/                  # Pagine applicazione
├── config/                 # Configurazioni app (routes, navigation)
├── assets/                 # Assets statici
└── styles/                 # CSS globali e tema
```

## 🎨 Sistema di Theming

Il template usa **CSS custom properties** per il theming, mappate direttamente a classi Tailwind:

```css
/* globals.css - Definizione variabili */
:root {
  --bg-primary: #ffffff;
  --text-primary: #111827;
  /* ... */
}

.dark {
  --bg-primary: #1a1f2e;
  --text-primary: #f8fafc;
  /* ... */
}
```

```css
/* index.css - Mapping a Tailwind */
@theme {
  --color-bg-primary: var(--bg-primary);
  --color-text-primary: var(--text-primary);
}
```

**Uso nei componenti** - classi Tailwind dirette:

```tsx
<div className="bg-bg-primary text-text-primary border border-border-default">
  Contenuto con theming automatico
</div>
```

Il tema si applica automaticamente aggiungendo/rimuovendo la classe `.dark` al documento.

## 📚 Documentazione

| Documento | Descrizione |
|-----------|-------------|
| [COMPONENTS.md](./COMPONENTS.md) | Catalogo completo dei componenti |
| [CHANGELOG.md](./CHANGELOG.md) | Cronologia delle modifiche |

## 🗺️ Roadmap

### Prossimi passi
- [ ] Error Boundary per gestione errori
- [ ] Authentication system
- [ ] Testing suite (Vitest + Testing Library)

### Componenti pianificati
- FileUpload con drag & drop
- DataTable con sorting/filtering
- Charts per data visualization

## 📄 Licenza

Questo progetto è rilasciato sotto licenza **MIT**.

---

**Creato con ❤️ da EDG Team**
