# EDG Frontend Template - Schema Filesystem

**Versione**: 3.0  
**Ultimo aggiornamento**: 15 Dicembre 2025

---

## Legenda
- 🟢 File implementato e testato
- 🟡 File da implementare

---

```
pro-frontend/
├── config/                                         # Folder config
│   ├── eslint.config.js                            # 🟢 Configurazione ESLint
│   ├── tsconfig.app.json                           # 🟢 Configurazione TypeScript per compilazione
│   ├── tsconfig.json                               # 🟢 Configurazione TypeScript principale
│   ├── tsconfig.node.json                          # 🟢 Configurazione TypeScript per ambiente Node
│   └── vite.config.ts                              # 🟢 Configurazione Vite
│
├── public/                                         # Public folder
│   └── favicon.png                                 # 🟢 Favicon applicazione
│
├── src/                                            # Source folder
│   ├── app/                                        # Redux store e configurazione
│   │   ├── middleware/                             # Middleware Redux
│   │   │   ├── index.ts                            # 🟢 Barrel file middleware
│   │   │   └── persistenceMiddleware.ts            # 🟢 Middleware persistenza localStorage
│   │   │
│   │   ├── slices/                                 # Redux slices
│   │   │   ├── index.ts                            # 🟢 Barrel file slices
│   │   │   └── uiSlice.ts                          # 🟢 Slice per impostazioni UI
│   │   │
│   │   ├── index.ts                                # 🟢 Barrel file app
│   │   ├── constants.ts                            # 🟢 Costanti globali
│   │   ├── hooks.ts                                # 🟢 Redux hooks tipizzati
│   │   └── store.ts                                # 🟢 Redux store configuration
│   │
│   ├── assets/                                     # Assets statici
│   │   ├── icon.png                                # 🟢 Icona light mode
│   │   ├── icon-reverse.png                        # 🟢 Icona dark mode
│   │   ├── logo.png                                # 🟢 Logo light mode
│   │   └── logo-reverse.png                        # 🟢 Logo dark mode
│   │
│   ├── config/                                     # Configurazioni applicazione
│   │   ├── index.ts                                # 🟢 Configurazioni unificate
│   │   ├── navigation.config.ts                    # 🟢 Configurazione navigazione
│   │   └── routes.config.ts                        # 🟢 Definizione routes
│   │
│   ├── core/                                       # Componenti e utilities condivise
│   │   ├── components/                             # Componenti riutilizzabili
│   │   │   │
│   │   │   ├── actions/                            # Componenti per azioni CRUD
│   │   │   │   ├── index.ts                        # 🟢 Barrel file
│   │   │   │   ├── ActionMenu.tsx                  # 🟢 Menu dropdown azioni
│   │   │   │   ├── CreateAction.tsx                # 🟢 Azione creazione
│   │   │   │   ├── DeleteAction.tsx                # 🟢 Azione eliminazione
│   │   │   │   └── EditAction.tsx                  # 🟢 Azione modifica
│   │   │   │
│   │   │   ├── data/                               # Componenti visualizzazione dati
│   │   │   │   ├── table/                          # Table
│   │   │   │   │   ├── Table.data.ts               # 🟢 Metadata componente
│   │   │   │   │   ├── Table.showcase.tsx          # 🟢 Esempi d'uso
│   │   │   │   │   └── Table.tsx                   # 🟢 Componente
│   │   │   │   │
│   │   │   │   ├── table-link/                     # TableLink
│   │   │   │   │   ├── TableLink.data.ts           # 🟢 Metadata componente
│   │   │   │   │   ├── TableLink.showcase.tsx      # 🟢 Esempi d'uso
│   │   │   │   │   └── TableLink.tsx               # 🟢 Componente
│   │   │   │   │
│   │   │   │   └── index.ts                        # 🟢 Barrel file
│   │   │   │
│   │   │   ├── feedback/                           # Componenti feedback utente
│   │   │   │   ├── alert/                          # Alert
│   │   │   │   │   ├── Alert.data.ts               # 🟢 Metadata
│   │   │   │   │   ├── Alert.showcase.tsx          # 🟢 Esempi
│   │   │   │   │   └── Alert.tsx                   # 🟢 Componente
│   │   │   │   │
│   │   │   │   ├── progress/                       # Progress bar
│   │   │   │   │   ├── Progress.data.ts            # 🟢 Metadata
│   │   │   │   │   ├── Progress.showcase.tsx       # 🟢 Esempi
│   │   │   │   │   └── Progress.tsx                # 🟢 Componente
│   │   │   │   │
│   │   │   │   ├── skeleton/                       # Skeleton loader
│   │   │   │   │   ├── Skeleton.data.ts            # 🟢 Metadata
│   │   │   │   │   ├── Skeleton.showcase.tsx       # 🟢 Esempi
│   │   │   │   │   └── Skeleton.tsx                # 🟢 Componente
│   │   │   │   │
│   │   │   │   ├── spinner/                        # Spinner
│   │   │   │   │   ├── Spinner.data.ts             # 🟢 Metadata
│   │   │   │   │   ├── Spinner.showcase.tsx        # 🟢 Esempi
│   │   │   │   │   └── Spinner.tsx                 # 🟢 Componente
│   │   │   │   │
│   │   │   │   ├── toast/                          # Toast notifications
│   │   │   │   │   ├── Toast.context.ts            # 🟢 Context
│   │   │   │   │   ├── Toast.provider.tsx          # 🟢 Provider
│   │   │   │   │   ├── Toast.data.ts               # 🟢 Metadata
│   │   │   │   │   ├── Toast.showcase.tsx          # 🟢 Esempi
│   │   │   │   │   ├── Toast.tsx                   # 🟢 Componente
│   │   │   │   │   └── useToast.hook.ts            # 🟢 Hook
│   │   │   │   │
│   │   │   │   ├── tooltip/                        # Tooltip
│   │   │   │   │   ├── Tooltip.data.ts             # 🟢 Metadata
│   │   │   │   │   ├── Tooltip.showcase.tsx        # 🟢 Esempi
│   │   │   │   │   └── Tooltip.tsx                 # 🟢 Componente
│   │   │   │   │
│   │   │   │   └── index.ts                        # 🟢 Barrel file
│   │   │   │
│   │   │   ├── form/                               # Componenti form
│   │   │   │   ├── checkbox/                       # Checkbox
│   │   │   │   │   ├── Checkbox.data.ts            # 🟢 Metadata
│   │   │   │   │   ├── Checkbox.showcase.tsx       # 🟢 Esempi
│   │   │   │   │   └── Checkbox.tsx                # 🟢 Componente
│   │   │   │   │
│   │   │   │   ├── date-picker/                    # DatePicker
│   │   │   │   │   ├── DatePicker.data.ts          # 🟢 Metadata
│   │   │   │   │   ├── DatePicker.showcase.tsx     # 🟢 Esempi
│   │   │   │   │   └── DatePicker.tsx              # 🟢 Componente
│   │   │   │   │
│   │   │   │   ├── form-field/                     # FormField wrapper
│   │   │   │   │   ├── FormField.data.ts           # 🟢 Metadata
│   │   │   │   │   ├── FormField.showcase.tsx      # 🟢 Esempi
│   │   │   │   │   └── FormField.tsx               # 🟢 Componente
│   │   │   │   │
│   │   │   │   ├── input/                          # Input
│   │   │   │   │   ├── Input.data.ts               # 🟢 Metadata
│   │   │   │   │   ├── Input.showcase.tsx          # 🟢 Esempi
│   │   │   │   │   └── Input.tsx                   # 🟢 Componente
│   │   │   │   │
│   │   │   │   ├── label/                          # Label
│   │   │   │   │   ├── Label.data.ts               # 🟢 Metadata
│   │   │   │   │   ├── Label.showcase.tsx          # 🟢 Esempi
│   │   │   │   │   └── Label.tsx                   # 🟢 Componente
│   │   │   │   │
│   │   │   │   ├── multi-select/                   # MultiSelect
│   │   │   │   │   ├── MultiSelect.data.ts         # 🟢 Metadata
│   │   │   │   │   ├── MultiSelect.showcase.tsx    # 🟢 Esempi
│   │   │   │   │   └── MultiSelect.tsx             # 🟢 Componente
│   │   │   │   │
│   │   │   │   ├── radio-group/                    # RadioGroup
│   │   │   │   │   ├── RadioGroup.data.ts          # 🟢 Metadata
│   │   │   │   │   ├── RadioGroup.showcase.tsx     # 🟢 Esempi
│   │   │   │   │   └── RadioGroup.tsx              # 🟢 Componente
│   │   │   │   │
│   │   │   │   ├── select/                         # Select
│   │   │   │   │   ├── Select.data.ts              # 🟢 Metadata
│   │   │   │   │   ├── Select.showcase.tsx         # 🟢 Esempi
│   │   │   │   │   └── Select.tsx                  # 🟢 Componente
│   │   │   │   │
│   │   │   │   ├── switch/                         # Switch
│   │   │   │   │   ├── Switch.data.ts              # 🟢 Metadata
│   │   │   │   │   ├── Switch.showcase.tsx         # 🟢 Esempi
│   │   │   │   │   └── Switch.tsx                  # 🟢 Componente
│   │   │   │   │
│   │   │   │   ├── textarea/                       # TextArea
│   │   │   │   │   ├── TextArea.data.ts            # 🟢 Metadata
│   │   │   │   │   ├── TextArea.showcase.tsx       # 🟢 Esempi
│   │   │   │   │   └── TextArea.tsx                # 🟢 Componente
│   │   │   │   │
│   │   │   │   ├── time-picker/                    # TimePicker
│   │   │   │   │   ├── TimePicker.data.ts          # 🟢 Metadata
│   │   │   │   │   ├── TimePicker.showcase.tsx     # 🟢 Esempi
│   │   │   │   │   └── TimePicker.tsx              # 🟢 Componente
│   │   │   │   │
│   │   │   │   └── index.ts                        # 🟢 Barrel file
│   │   │   │
│   │   │   ├── info/                               # Componenti informativi
│   │   │   │   ├── index.ts                        # 🟢 Barrel file
│   │   │   │   ├── ConnectionStatus.tsx            # 🟢 Stato connessione backend
│   │   │   │   ├── Logo.tsx                        # 🟢 Logo applicazione
│   │   │   │   ├── QuickLink.tsx                   # 🟢 Link rapidi
│   │   │   │   ├── UserAvatar.tsx                  # 🟢 Avatar utente
│   │   │   │   └── VersionInfo.tsx                 # 🟢 Info versione
│   │   │   │
│   │   │   ├── layout/                             # Componenti layout
│   │   │   │   ├── card/                           # Card
│   │   │   │   │   ├── Card.data.ts                # 🟢 Metadata
│   │   │   │   │   ├── Card.showcase.tsx           # 🟢 Esempi
│   │   │   │   │   └── Card.tsx                    # 🟢 Componente
│   │   │   │   │
│   │   │   │   ├── custom/                         # Layout custom
│   │   │   │   │   ├── CenteredPage.tsx            # 🟢 Pagina centrata
│   │   │   │   │   ├── CenteredSection.tsx         # 🟢 Sezione centrata
│   │   │   │   │   ├── Footer.tsx                  # 🟢 Footer
│   │   │   │   │   ├── Header.tsx                  # 🟢 Header
│   │   │   │   │   ├── HeaderGroup.tsx             # 🟢 Gruppo titolo/sottotitolo
│   │   │   │   │   ├── MainLayout.tsx              # 🟢 Layout principale
│   │   │   │   │   ├── Sidebar.tsx                 # 🟢 Sidebar
│   │   │   │   │   └── TitledSurface.tsx           # 🟢 Surface con titolo
│   │   │   │   │
│   │   │   │   ├── separator/                      # Separator
│   │   │   │   │   ├── Separator.data.ts           # 🟢 Metadata
│   │   │   │   │   ├── Separator.showcase.tsx      # 🟢 Esempi
│   │   │   │   │   └── Separator.tsx               # 🟢 Componente
│   │   │   │   │
│   │   │   │   ├── sheet/                          # Sheet (drawer)
│   │   │   │   │   ├── Sheet.data.ts               # 🟢 Metadata
│   │   │   │   │   ├── Sheet.showcase.tsx          # 🟢 Esempi
│   │   │   │   │   └── Sheet.tsx                   # 🟢 Componente
│   │   │   │   │
│   │   │   │   └── index.ts                        # 🟢 Barrel file
│   │   │   │
│   │   │   ├── navigation/                         # Componenti navigazione
│   │   │   │   ├── command/                        # Command palette
│   │   │   │   │   ├── Command.data.ts             # 🟢 Metadata
│   │   │   │   │   ├── Command.showcase.tsx        # 🟢 Esempi
│   │   │   │   │   └── Command.tsx                 # 🟢 Componente
│   │   │   │   │
│   │   │   │   ├── custom/                         # Navigation custom
│   │   │   │   │   ├── MobileMenu.tsx              # 🟢 Menu mobile
│   │   │   │   │   ├── SettingsMenu.tsx            # 🟢 Menu impostazioni
│   │   │   │   │   └── UserMenu.tsx                # 🟢 Menu utente
│   │   │   │   │
│   │   │   │   ├── navigation-menu/                # NavigationMenu
│   │   │   │   │   ├── NavigationMenu.data.ts      # 🟢 Metadata
│   │   │   │   │   ├── NavigationMenu.showcase.tsx # 🟢 Esempi
│   │   │   │   │   └── NavigationMenu.tsx          # 🟢 Componente
│   │   │   │   │
│   │   │   │   ├── tabs/                           # Tabs
│   │   │   │   │   ├── Tabs.data.ts                # 🟢 Metadata
│   │   │   │   │   ├── Tabs.showcase.tsx           # 🟢 Esempi
│   │   │   │   │   └── Tabs.tsx                    # 🟢 Componente
│   │   │   │   │
│   │   │   │   └── index.ts                        # 🟢 Barrel file
│   │   │   │
│   │   │   └── ui/                                 # Componenti UI base
│   │   │       ├── accordion/                      # Accordion
│   │   │       │   ├── Accordion.data.ts           # 🟢 Metadata
│   │   │       │   ├── Accordion.showcase.tsx      # 🟢 Esempi
│   │   │       │   └── Accordion.tsx               # 🟢 Componente
│   │   │       │
│   │   │       ├── avatar/                         # Avatar
│   │   │       │   ├── Avatar.data.ts              # 🟢 Metadata
│   │   │       │   ├── Avatar.showcase.tsx         # 🟢 Esempi
│   │   │       │   └── Avatar.tsx                  # 🟢 Componente
│   │   │       │
│   │   │       ├── badge/                          # Badge
│   │   │       │   ├── Badge.data.ts               # 🟢 Metadata
│   │   │       │   ├── Badge.showcase.tsx          # 🟢 Esempi
│   │   │       │   └── Badge.tsx                   # 🟢 Componente
│   │   │       │
│   │   │       ├── button/                         # Button
│   │   │       │   ├── Button.data.ts              # 🟢 Metadata
│   │   │       │   ├── Button.showcase.tsx         # 🟢 Esempi
│   │   │       │   └── Button.tsx                  # 🟢 Componente
│   │   │       │
│   │   │       ├── confirm-modal/                  # ConfirmModal
│   │   │       │   ├── ConfirmModal.data.ts        # 🟢 Metadata
│   │   │       │   ├── ConfirmModal.showcase.tsx   # 🟢 Esempi
│   │   │       │   └── ConfirmModal.tsx            # 🟢 Componente
│   │   │       │
│   │   │       ├── info-card/                      # InfoCard
│   │   │       │   ├── InfoCard.data.ts            # 🟢 Metadata
│   │   │       │   ├── InfoCard.showcase.tsx       # 🟢 Esempi
│   │   │       │   └── InfoCard.tsx                # 🟢 Componente
│   │   │       │
│   │   │       ├── modal/                          # Modal
│   │   │       │   ├── Modal.data.ts               # 🟢 Metadata
│   │   │       │   ├── Modal.showcase.tsx          # 🟢 Esempi
│   │   │       │   └── Modal.tsx                   # 🟢 Componente
│   │   │       │
│   │   │       └── index.ts                        # 🟢 Barrel file
│   │   │
│   │   ├── hooks/                                  # Custom hooks
│   │   │   ├── index.ts                            # 🟢 Barrel file
│   │   │   ├── useMediaQuery.ts                    # 🟢 Hook media queries
│   │   │   └── useThemedImage.ts                   # 🟢 Hook immagini themed
│   │   │
│   │   ├── services/                               # Services
│   │   │   ├── index.ts                            # 🟢 Barrel file
│   │   │   └── apiService.ts                       # 🟢 Client HTTP
│   │   │
│   │   ├── utils/                                  # Utilities
│   │   │   └── index.ts                            # 🟢 Barrel file utilities
│   │   │
│   │   └── types.ts                                # 🟢 Tipi condivisi
│   │
│   ├── features/                                   # Moduli funzionali (da popolare)
│   │
│   ├── pages/                                      # Pagine applicazione
│   │   ├── index.ts                                # 🟢 Barrel file
│   │   ├── Dashboard.tsx                           # 🟢 Pagina principale
│   │   ├── Explorer.tsx                            # 🟢 Explorer componenti
│   │   ├── ExplorerModal.tsx                       # 🟢 Modal dettaglio componente
│   │   └── NotFound.tsx                            # 🟢 Pagina 404
│   │
│   ├── styles/                                     # Stili globali
│   │   ├── globals.css                             # 🟢 CSS variables tema
│   │   ├── index.css                               # 🟢 Tailwind + theme mapping
│   │   ├── lazy-loading.css                        # 🟢 Stili lazy loading
│   │   └── typography.css                          # 🟢 Classi tipografiche
│   │
│   ├── template/                                   # Template pagine esempio
│   │
│   ├── App.tsx                                     # 🟢 Componente root
│   ├── main.tsx                                    # 🟢 Entry point React
│   └── vite-env.d.ts                               # 🟢 Tipi Vite
│
├── .env.development                                # 🟢 Variabili ambiente sviluppo
├── .env.production                                 # 🟢 Variabili ambiente produzione
├── .gitignore                                      # 🟢 Git ignore
├── .prettierignore                                 # 🟢 Prettier ignore
├── index.html                                      # 🟢 HTML entry point
├── package.json                                    # 🟢 Dipendenze progetto
│
├── CHANGELOG.md                                    # 🟢 Cronologia modifiche
├── COMPONENTS.md                                   # 🟢 Catalogo componenti
├── DOCUMENTATION.md                                # 🟢 Documentazione architettura
├── README.md                                       # 🟢 Documentazione principale
└── SCHEMA.md                                       # 🟢 Questo file
```

---

## Statistiche

| Categoria | File |
|-----------|------|
| Componenti | 143 |
| Hooks | 2 |
| Services | 1 |
| Pagine | 4 |
| Stili | 4 |
| **Totale src/** | ~155 |