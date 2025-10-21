# EDG-FRONTEND-TEMPLATE

## Obiettivo: realizzare un frontend template che sia riutilizzabile e contenga gli elementi basilari per avviare lo sviluppo di un frontend complesso

## Caratteristiche: 
- Stack tecnologico moderno e performante (React + Vite + TypeScript + Tailwind)
- Dipendenze ben scelte per coprire le esigenze comuni (form, state management, UI, validazione)
- Componenti personalizzati riutilizzabili per mantenere coerenza visiva
- Un layout header-mode, con header e main content, dal quale attivare o meno: la sidebar; il footer
- Visualizzazione Light e Dark attivabile dall'utente
- Struttura feature-based per organizzazione scalabile
- Design minimale e responsive
- Utilizzo di Radix primmitives
- Sistema di icone lucide-react
- Sistema di design atomico con componenti modulari  
- Collaborazione iterativa step-by-step con approccio "divide et impera"

## Struttura
I file che hanno il seguente simbolo associato 🟡 devono essere ancora creati
I file che hanno il seguente simbolo associato 🔴 presentanto un errore o un problema grave
I file che hanno il seguente simbolo associato 🟢 sono stati realizzati e testati


edg-frontend-template/
├── config/                                         # Folder config
│   ├── eslint.config.js                            # 🟢 Configurazione di esLint per il controllo del codice
│   ├── tsconfig.app.json                           # 🟢 Configurazione TypeScript specifica per la compilazione
│   ├── tsconfig.json                               # 🟢 Configurazione TypeScript principale per tutto il progetto
│   ├── tsconfig.node.json                          # 🟢 Configurazione TypeScript per l'esecuzione in ambiente node                           
│   └── vite.config.ts                              # 🟢 Configurazione Vite
├── node_modules  
| 
├── public/                                         # Public folder                             
│   └── favicon.png 
| 
├── src/                                            # Src folder
│   ├── app/                                        # Folder per gli elementi principali dell'app
|   |   ├── middleware/                             # App middleware folder
|   |   |   ├── index.ts                            # 🟢 barrel file del middleware 
│   │   |   └── persistenceMiddleware.ts            # 🟢 middleware per la persistenza
|   |   | 
|   |   ├── slices/                                 # App slices folder
|   |   |   ├── index.ts                            # 🟢 barrel file del middleware 
│   │   |   └── uiSlice.ts                          # 🟢 Redux slice per impostazioni ui
|   |   | 
|   |   ├── index.ts                                # 🟢 barrel file
|   |   ├── constants.ts                            # 🟢 Parametri e costanti globali
│   │   ├── hooks.ts                                # 🟢 Redux hooks tipizzati
│   │   └── store.ts                                # 🟢 Redux store
|   | 
|   ├── assets/                                     # Assets folder
│   |   ├── icon.png
│   |   ├── icon-reverse.png                             
│   |   ├── logo.png
│   |   └── icon-reverse.png
|   |
│   ├── config/                                     # Folder per le configurazioni
|   |   ├── index.ts                                # 🟢 Configurazioni unificate 
│   │   ├── navigation.config.ts                    # 🟢 Navigazione di default 
│   │   └── routes.config.ts                        # 🟢 Route definitions
|   |   
|   ├── core/                                       # Folder per Componenti e utility condivise
|   |   ├── components/                             # Folder dei Componenti riutilizzabili
|   │   │   ├── actions                             # Folder dei Componenti per le azioni principali
|   │   │   │   ├── index.ts                        # 🟢 barrel file dei componenti layout
|   │   │   │   ├── ActionMenu.tsx                  # 🟢 Menu a tendina delle actions
|   │   │   │   ├── CreateAction.tsx                # 🟢 Creare un nuovo elemento dell'identità
|   │   │   │   ├── DeleteAction.tsx                # 🟢 Eliminare l'elemento selezionato
|   │   │   │   └── EditAction.tsx                  # 🟢 Modificare l'elemento selezionato
|   |   |   | 
|   │   │   ├── atomic                              # Folder dei Componenti atomici per la gestione del tema
|   │   │   │   ├── index.ts                        # 🟢 barrel file dei componenti atomici
|   │   │   │   ├── ThemedSurface.tsx               # 🟢 Gestisce sfondo + testo + bordi per superfici
|   │   │   │   ├── ThemedText.tsx                  # 🟢 Gestisce solo i colori del testo semantici
|   │   │   │   ├── ThemedShadow.tsx                # 🟢 Gestisce le ombre
|   │   │   │   ├── ThemedImage.tsx                 # 🟢 Gestisce le immagini che si modificano con tema
|   │   │   │   └── ThemedBorder.tsx                # 🟢 Wrapper per elementi che hanno solo bordi tematici
|   |   |   |   
|   │   │   ├── data                                # Folder dei Componenti per la gestione delle tabelle
|   |   |   |   ├── table/                          # Folder per la Tabella semplice
|   │   │   |   |   ├── Table.data.ts               # 🟢 Informazioni sul componente
|   │   │   |   |   ├── Table.showcase.tsx          # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── Table.tsx                   # 🟢 Componente Table
|   |   |   |   | 
|   |   |   |   ├── table-link/                     # Folder per TableLink
|   │   │   |   |   ├── TableLink.data.ts           # 🟢 Informazioni sul componente
|   │   │   |   |   ├── TableLink.showcase.tsx      # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── TableLink.tsx               # 🟢 Componente TableLink
|   |   |   |   └── index.ts                        # 🟢 Barrel file per componenti data
|   |   |   |     
|   │   │   ├── feedback                            # Folder per Componenti della categoria feedback
|   |   |   |   ├── alert/                          # Folder per Alert
|   │   │   |   |   ├── Alert.data.ts               # 🟢 Informazioni sul componente
|   │   │   |   |   ├── Alert.showcase.tsx          # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── Alert.tsx                   # 🟢 Componente Alert
|   |   |   |   |   
|   |   |   |   ├── progress/                       # Folder per Progress bar
|   │   │   |   |   ├── Progress.data.ts            # 🟢 Informazioni sul componente
|   │   │   |   |   ├── Progress.showcase.tsx       # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── Progress.tsx                # 🟢 Componente Progress
|   |   |   |   | 
|   |   |   |   ├── skeleton/                       # Folder per Skeleton
|   │   │   |   |   ├── Skeleton.data.ts            # 🟢 Informazioni sul componente
|   │   │   |   |   ├── Skeleton.showcase.tsx       # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── Skeleton.tsx                # 🟢 Componente Skeleton
|   |   |   |   |   
|   |   |   |   ├── spinner/                        # Folder per Spinner
|   │   │   |   |   ├── Spinner.data.ts             # 🟢 Informazioni sul componente
|   │   │   |   |   ├── Spinner.showcase.tsx        # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── Spinner.tsx                 # 🟢 Componente Spinner
|   |   |   |   |   
|   |   |   |   ├── toast/                          # Folder per Toast
|   │   │   |   |   ├── Toast.context.ts            # 🟢 Context del componente
|   │   │   |   |   ├── Toast.provider.tsx          # 🟢 Provider del componente
|   │   │   |   |   ├── Toast.data.ts               # 🟢 Informazioni sul componente
|   │   │   |   |   ├── Toast.showcase.tsx          # 🟢 Esempi d'uso del componente
|   │   │   |   |   ├── Toast.tsx                   # 🟢 Componente Toast
|   │   │   |   |   └── useToast.hooks.ts           # 🟢 Hooks per utilizzare il comnponente
|   |   |   |   |   
|   |   |   |   ├── tooltip/                        # Folder per Tooltip
|   │   │   |   |   ├── Tooltip.data.ts             # 🟢 Informazioni sul componente
|   │   │   |   |   ├── Tooltip.showcase.tsx        # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── Tooltip.tsx                 # 🟢 Componente Tooltip
|   |   |   |   └── index.ts                        # 🟢 Barrel file per componenti feedback
|   |   |   |   
|   │   │   ├── form                                # Folder dei Componenti per la gestione delle form
|   |   |   |   ├── checkbox/                       # Folder per Checkbox
|   │   │   |   |   ├── Checkbox.data.ts            # 🟢 Informazioni sul componente
|   │   │   |   |   ├── Checkbox.showcase.tsx       # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── Checkbox.tsx                # 🟢 Componente Checkbox
|   |   |   |   |   
|   |   |   |   ├── date-picker/                    # Folder per DatePicker
|   │   │   |   |   ├── DatePicker.data.ts          # 🟢 Informazioni sul componente
|   │   │   |   |   ├── DatePicker.showcase.tsx     # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── DatePicker.tsx              # 🟢 Componente DatePicker
|   |   |   |   |   
|   |   |   |   ├── form-field/                     # Folder per FormField
|   │   │   |   |   ├── FormField.data.ts           # 🟢 Informazioni sul componente
|   │   │   |   |   ├── FormField.showcase.tsx      # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── FormField.tsx               # 🟢 Componente FormField
|   |   |   |   |   
|   |   |   |   ├── input/                          # Folder per Input
|   │   │   |   |   ├── Input.data.ts               # 🟢 Informazioni sul componente
|   │   │   |   |   ├── Input.showcase.tsx          # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── Input.tsx                   # 🟢 Componente Input
|   |   |   |   |   
|   |   |   |   ├── label/                          # Folder per Label
|   │   │   |   |   ├── Label.data.ts               # 🟢 Informazioni sul componente
|   │   │   |   |   ├── Label.showcase.tsx          # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── Label.tsx                   # 🟢 Componente Label
|   |   |   |   | 
|   |   |   |   ├── multi-select/                   # Folder per MultiSelect
|   │   │   |   |   ├── MultiSelect.data.ts         # 🟢 Informazioni sul componente
|   │   │   |   |   ├── MultiSelect.showcase.tsx    # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── MultiSelect.tsx             # 🟢 Componente MultiSelect
|   |   |   |   | 
|   |   |   |   ├── radio-group/                    # Folder per RadioGroup
|   │   │   |   |   ├── RadioGroup.data.ts          # 🟢 Informazioni sul componente
|   │   │   |   |   ├── RadioGroup.showcase.tsx     # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── RadioGroup.tsx              # 🟢 Componente RadioGroup
|   |   |   |   | 
|   |   |   |   ├── select/                         # Folder per Select
|   │   │   |   |   ├── Select.data.ts              # 🟢 Informazioni sul componente
|   │   │   |   |   ├── Select.showcase.tsx         # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── Select.tsx                  # 🟢 Componente Select
|   |   |   |   | 
|   |   |   |   ├── switch/                         # Folder per Switch
|   │   │   |   |   ├── Switch.data.ts              # 🟢 Informazioni sul componente
|   │   │   |   |   ├── Switch.showcase.tsx         # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── Switch.tsx                  # 🟢 Componente Switch
|   |   |   |   | 
|   |   |   |   ├── textarea/                       # Folder per Textarea
|   │   │   |   |   ├── TextArea.data.ts            # 🟢 Informazioni sul componente
|   │   │   |   |   ├── TextArea.showcase.tsx       # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── TextArea.tsx                # 🟢 Componente TextArea
|   |   |   |   | 
|   |   |   |   ├── time-picker/                    # Folder per TimePicker
|   │   │   |   |   ├── TimePicker.data.ts          # 🟢 Informazioni sul componente
|   │   │   |   |   ├── TimePicker.showcase.tsx     # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── TimePicker.tsx              # 🟢 Componente TimePicker
|   |   |   |   └── index.ts                        # 🟢 Barrel file per componenti data
|   |   |   | 
|   │   │   ├── info                                # Folder dei Componenti utili secondari e informativi
|   │   │   │   ├── index.ts                        # 🟢 Barrel file
|   │   │   │   ├── Logo.tsx                        # 🟢 Logo dell'applicazione
|   │   │   │   ├── UserAvatar.tsx                  # 🟢 Avatar dell'utente
|   │   │   │   ├── VersionInfo.tsx                 # 🟢 Componente info versione
|   │   │   │   ├── ConnectionStatus.tsx            # 🟢 Indicatore connessione backend
|   │   │   │   └── QuickLink.tsx                   # 🟢 Link rapidi
|   |   |   |   
|   │   │   ├── layout/                             # Folder dei Componenti base del layout
|   |   |   |   ├── card/                           # Folder per Card
|   │   │   |   |   ├── Card.data.ts                # 🟢 Informazioni sul componente
|   │   │   |   |   ├── Card.showcase.tsx           # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── Card.tsx                    # 🟢 Componente Card
|   |   |   |   |   
|   |   |   |   ├── custom/                         # Folder dei Componenti specifici custom
|   │   │   |   |   ├── CenteredPage.tsx            # 🟢 Container per pagine che richiedono vertical centering
|   │   │   |   |   ├── CenteredSection.tsx         # 🟢 Container per sezioni che richiedono vertical centering
|   │   │   |   |   ├── Footer.tsx                  # 🟢 footer
|   │   │   |   |   ├── Header.tsx                  # 🟢 header
|   │   │   |   |   ├── HeaderGroup.tsx             # 🟢 raggruppamenti nell'header
|   │   │   |   |   ├── MainLayout.tsx              # 🟢 Componente per l'intero layout
|   │   │   |   |   ├── Sidebar.tsx                 # 🟢 sidebar
|   │   │   |   |   └── TitledSurface.tsx           # 🟢 contenitore con titolo che si sovrappone al bordo superiore
|   |   |   |   | 
|   |   |   |   ├── separator/                      # Folder per Separator
|   │   │   |   |   ├── Separator.data.ts           # 🟢 Informazioni sul componente
|   │   │   |   |   ├── Separator.showcase.tsx      # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── Separator.tsx               # 🟢 Componente Separator
|   |   |   |   | 
|   |   |   |   ├── sheet/                          # Folder per Sheet
|   │   │   |   |    ├── Sheet.data.ts              # 🟢 Informazioni sul componente
|   │   │   |   |    ├── Sheet.showcase.tsx         # 🟢 Esempi d'uso del componente
|   │   │   |   |    └── Sheet.tsx                  # 🟢 Componente Sheet
|   |   |   |   | 
|   │   │   |   └── index.ts                        # 🟢 Barrel file dei componenti layout
|   |   |   | 
|   │   │   ├── navigation/                         # Folder dei Componenti navigazione
|   |   |   |   ├── command/                        # Folder per Command Dialog
|   │   │   |   |   ├── Command.data.ts             # 🟢 Informazioni sul componente
|   │   │   |   |   ├── Command.showcase.tsx        # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── Command.tsx                 # 🟢 Componente Command
|   |   |   |   | 
|   |   |   |   ├── custom/                         # Folder dei Componenti custom specifici per la navigazione
|   │   │   |   |   ├── FooterMenu.tsx              # 🟡 Informazioni sul componente
|   │   │   |   |   ├── MainMenu.tsx                # 🟡 Esempi d'uso del componente
|   │   │   │   |   ├── Settings.tsx                # 🟢 Menu per configurazione app
|   │   │   │   |   ├── UserMenu.tsx                # 🟢 Menu del profilo utente
|   │   │   │   |   └── MobileMenu.tsx              # 🟢 Mobile menu
|   |   |   |   |
|   |   |   |   ├── navigation-menu/                # Folder per Navigation Menu
|   │   │   |   |   ├── NavigationMenu.data.ts      # 🟢 Informazioni sul componente
|   │   │   |   |   ├── NavigationMenu.showcase.tsx # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── NavigationMenu.tsx          # 🟢 Componente NavigationMenu
|   |   |   |   |
|   |   |   |   ├── tabs/                           # Folder per Tabs
|   │   │   |   |   ├── Tabs.data.ts                # 🟢 Informazioni sul componente
|   │   │   |   |   ├── Tabs.showcase.tsx           # 🟢 Esempi d'uso del componente
|   │   │   |   |   └── Tabs.tsx                    # 🟢 Componente Tabs
|   |   |   |   |
|   │   │   |   └── index.ts                        # 🟢 Barrel file dei componenti navigation
|   |   |   |   
|   │   │   └── ui/                                 # Folder dei Componenti base dell'interfaccia utente
|   |   |       ├── accordion/                      # Folder per Accordion
|   │   │       |   ├── Accordion.data.ts           # 🟢 Informazioni sul componente
|   │   │       |   ├── Accordion.showcase.tsx      # 🟢 Esempi d'uso del componente
|   │   │       |   └── Accordion.tsx               # 🟢 Componente Accordion
|   |   |       |
|   |   |       ├── avatar/                         # Folder per Avatar
|   │   │       |   ├── Avatar.data.ts              # 🟢 Informazioni sul componente
|   │   │       |   ├── Avatar.showcase.tsx         # 🟢 Esempi d'uso del componente
|   │   │       |   └── Avatar.tsx                  # 🟢 Componente Avatar
|   |   |       |
|   |   |       ├── badge/                          # Folder per Badge
|   │   │       |   ├── Badge.data.ts               # 🟢 Informazioni sul componente
|   │   │       |   ├── Badge.showcase.tsx          # 🟢 Esempi d'uso del componente
|   │   │       |   └── Badge.tsx                   # 🟢 Componente Badge
|   |   |       |
|   |   |       ├── button/                         # Folder per Button
|   │   │       |   ├── Button.data.ts              # 🟢 Informazioni sul componente
|   │   │       |   ├── Button.showcase.tsx         # 🟢 Esempi d'uso del componente
|   │   │       |   └── Button.tsx                  # 🟢 Componente Button
|   |   |       |
|   |   |       ├── confirm-modal/                  # Folder per ConfirmModal
|   │   │       |   ├── ConfirmModal.data.ts        # 🟢 Informazioni sul componente
|   │   │       |   ├── ConfirmModal.showcase.tsx   # 🟢 Esempi d'uso del componente
|   │   │       |   └── ConfirmModal.tsx            # 🟢 Componente ConfirmModal
|   |   |       |
|   |   |       ├── info-card/                      # Folder per InfoCard
|   │   │       |   ├── InfoCard.data.ts            # 🟢 Informazioni sul componente
|   │   │       |   ├── InfoCard.showcase.tsx       # 🟢 Esempi d'uso del componente
|   │   │       |   └── InfoCard.tsx                # 🟢 Componente InfoCard
|   |   |       |
|   |   |       ├── modal/                          # Folder per Modal
|   │   │       |   ├── Modal.data.ts               # 🟢 Informazioni sul componente
|   │   │       |   ├── Modal.showcase.tsx          # 🟢 Esempi d'uso del componente
|   │   │       |   └── Modal.tsx                   # 🟢 Componente Modal
|   |   |       |
|   │   │       └── index.ts                        # 🟢 Barrel file dei componenti ui
|   |   |   
|   │   ├── hooks/                                  # Hook personalizzati condivisi
|   │   |    ├── index.ts                           # 🟢 Barrel file degli Hooks
|   │   |    ├── useLocalStorage.ts                 # 🟡 Hook per la gestione del local storage
|   │   |    ├── useModal.ts                        # 🟡 Hook per gestione modal
|   │   |    ├── useMediaQuery.ts                   # 🟢 Hook per rilevare media queries e gestire responsive behavior
|   │   |    ├── useThemedImage.ts                  # 🟢 Hook per gestione delle immagini che variano in base al tema
|   │   |    └── useThemeStyles.ts                  # 🟡 Hook per gestione stili e temi
|   |   |   
|   │   ├── services/                               # Services condivisi
|   │   |    ├── index.ts                           # 🟢 Barrel file dei services
|   │   |    └── apiService.ts                      # 🟢 Base service per richieste API
|   |   |   
|   │   └── utils/                                  # Utility condivise
|   │        └── index.ts                           # 🟢 Barrel file delle utility
│   │       
│   ├── features/                                   # contiene i moduli dell'applicazione
│   │   
│   ├── pages/                                      # Pagine principali dell'applicazione
│   │   ├── Dashboard.tsx                           # 🟢 Pagina principale
│   │   ├── Explorer.tsx                            # 🟢 Guida all'uso dei componenti
│   │   ├── ExplorerModal.tsx                       # 🟢 Visualizzazione dei componenti selezionati in Explorer
│   │   ├── NotFound.tsx                            # 🟢 Pagina 404
|   |   └── index.ts                                # 🟢 Barrel file
│   │   
│   ├── styles/                                     # Stili globali
│   │   ├── global.css                              # 🟢 Stili custom per definire il tema
|   │   ├── typography.css                          # 🟢 Classi per stili tipografici
|   |   └── index.css                               # 🟢 Stili di base Tailwind
│   │ 
│   ├── template/                                   # Pagine complete di esempio, pronte per essere utilizzate
│   │ 
│   ├── App.tsx                                     # 🟢 Componente root applicazione
│   ├── main.tsx                                    # 🟢 Entry point React
│   └── vite-env.d.ts                               # 🟢 Garantisce che TypeSscript validi il codice che interagisce con Vite
├── .env.development                                # 🟢 variabili d'ambiente per lo sviluppo
├── .env.production                                 # 🟢 variabili d'ambiente per la produzione
├── .gitignore                                      # 🟢 ignore per git
├── .prettierignore                                 # 🟢 ignore per estensione Prettier
├── index.html                                      # 🟢 l'index html dell'applicazione
├── package.json                                    # 🟢 Dipendenze del progetto
├── DOCUMENTATION.md                                # 🟢 Struttura e funzioni del progetto
├── CHANGELOG.md                                    # 🟢 Informazioni sui progressi nelllo sviluppo dell'applicazione
├── COMPONENTS.md                                   # 🟢 Guida ai componenti implementati
└── README.md                                       # 🟢 Documentazione principale


## Metodologia di sviluppo
- Procedere nello sviluppo passo per passo
- Seguire la logica dei piccoli componenti
- Semplificare il più possibile le importazioni
- Separare le responsabilità
- Scalabile
- Aggiornare la documentazione sullo stato di sviluppo
- Usare il moching in modo trasparente per sostituire le API
- Fornire un metodo semplice per passare dal moching alle API effettive
- File .env per la produzione e per lo sviluppo

## Strategia Ottimizzata per Dark/Light Mode in React & Tailwind

L'obiettivo è creare un sistema di theming estremamente flessibile, riusabile, manutenibile e performante, eliminando ogni logica condizionale dal JSX e garantendo un'esperienza utente impeccabile.

### Componenti Atomici e Astratti (Sfondi, Bordi, Testi Generici, Immagini)
La chiave di questa strategia è identificare e isolare i tipi di elementi UI più basilari che cambiano con il tema, trasformandoli in componenti atomici riusabili e tematici.

Invece di tematizzare direttamente componenti complessi come "l'Header" o "la Card", tematizziamo i loro costituenti più elementari che si ripetono.
Esempi:
ThemedSurface (o ThemedBackground): Un componente generico che gestisce lo sfondo e il colore del testo primario per tutte le "superfici" dell'UI (es. card, modal, sezioni di contenuto, pannelli). Questo componente include anche il bordo se le tue superfici lo condividono.
ThemedText: Un componente per vari tipi di testo (primario, secondario, disabilitato) che gestisce solo il colore del testo, utilizzabile ovunque sia necessario un blocco di testo con una specifica semantica.
ThemedBorder: Un componente o una classe helper per bordi che cambiano colore con il tema.
ThemedImage: per gestire le imamgini che cambiano tipo il logo
Vantaggio Maggiore: La logica del cambio tema (dark:) o il riferimento alle variabili CSS sono incapsulati completamente all'interno di questi pochissimi componenti atomici. Il JSX dei tuoi componenti più complessi (Header, Card, Modal) rimane pulito, semanticamente chiaro e libero da qualsiasi riferimento al tema o logica condizionale.

### Costanti di Colore Semantiche tramite Variabili CSS
Questo è il cuore del sistema per la gestione dei colori senza logica condizionale nel JSX.

Definizione Semantica: Dimentica i nomi di colore diretti di Tailwind (es. gray-900). Definisci variabili CSS (Custom Properties) con nomi semantici che descrivono il loro ruolo nell'interfaccia (es. --color-bg-primary, --color-text-secondary, --color-border-default, --color-action-primary).
Implementazione in globals.css:
Nel selettore :root, definisci i valori Hex/RGB per il tema light (default) per ciascuna variabile.
All'interno del selettore .dark, sovrascrivi i valori di queste stesse variabili CSS con i colori corrispondenti per il tema dark.
Integrazione con Tailwind (tailwind.config.js):
Utilizza darkMode: 'class' per indicare a Tailwind che il cambio di tema avviene tramite una classe CSS.
Estendi la sezione theme.extend.colors per mappare i tuoi nomi semantici (es. bg-primary, text-secondary) alle rispettive variabili CSS (var(--color-bg-primary), var(--color-text-secondary)).
Uso nei Componenti: Nei tuoi componenti React (in particolare nei tuoi componenti atomici tematizzati come ThemedSurface o ThemedText), userai le classi Tailwind semantiche (es. bg-bg-primary, text-text-secondary). Tailwind leggerà automaticamente il valore corretto della variabile CSS in base al tema attivo sul tag <html> o sul suo antenato.

### Gestione dello Stato del Tema in React
Per gestire il tema a livello applicativo e la persistenza della scelta dell'utente.

ThemeContext (React Context API): Un contesto React per centralizzare lo stato attuale del tema ('light' o 'dark') e le funzioni per modificarlo (toggleTheme, setTheme). Sarà fornito a livello radice dell'applicazione.
useTheme Hook: Un custom hook (const { theme, toggleTheme } = useTheme();) per rendere l'accesso e la modifica del tema semplici e puliti in qualsiasi componente.
Persistenza con Local Storage:
Lettura: All'avvio dell'applicazione, leggi la preferenza dell'utente dal localStorage. Se non è salvata, puoi usare la preferenza di sistema (window.matchMedia('(prefers-color-scheme: dark)')).
Scrittura: Ogni volta che il tema viene cambiato dall'utente, salva la nuova preferenza nel localStorage per assicurare che venga mantenuta nelle sessioni future.

### Prevenire il "Flash of Unstyled Content" (FOUC)
Un aspetto cruciale per un'esperienza utente fluida.

Soluzione: Un piccolo script JavaScript inline deve essere inserito nel <head> del tuo public/index.html (o l'equivalente del tuo framework). Questo script deve essere eseguito prima che il bundle di React venga caricato. Il suo compito è leggere la preferenza del tema dal localStorage (o di sistema) e applicare immediatamente la classe dark al tag <html>. Questo garantisce che la pagina si carichi già con il tema corretto, eliminando il "flash" iniziale del tema sbagliato.

### Interfaccia Utente per il Tema (Pannello di Configurazione)
Un semplice componente React (es. un toggle, un radio button) che, utilizzando l'hook useTheme, permette all'utente di selezionare o cambiare la modalità di visualizzazione.

### Massima Compatibilità con Radix UI
Questa strategia è ideale per Radix UI perché i suoi componenti sono "unstyled". Puoi applicare le tue classi Tailwind semantiche direttamente agli elementi che compongono i componenti Radix, ottenendo il theming desiderato senza conflitti o necessità di complesse personalizzazioni.
Questa architettura ti permette di avere un controllo capillare sul theming, garantendo al contempo massima flessibilità e una base di codice estremamente pulita e manutenibile per il tuo template riusabile.


# Stato di sviluppo

## Obiettivi Raggiunti

### Sistema di Design Atomico Completo
- **Componenti atomici** base per costruire interfacce coerenti
- **Theming system** automatico light/dark mode
- **Variabili CSS semantiche** per massima flessibilità
- **Componenti riutilizzabili** con props tipizzate

### State Management Centralizzato con Persistenza
- **Redux Toolkit** configurato con slice UI
- **Persistenza automatica** delle preferenze utente nel localStorage
- **Middleware custom** per salvataggio trasparente
- **Hooks tipizzati** per accesso allo stato
- **Sincronizzazione DOM** automatica per temi

### Layout System Responsivo
- **MainLayout** adattivo con/senza sidebar
- **Header/Footer** condizionali e configurabili
- **Sidebar** collassabile con icone semantiche (w-12/w-64)
- **Navigation** context-aware

### Sistema Immagini Tematiche
- **ThemedImage** component per immagini responsive al tema
- **useThemedImage** hook per gestione automatica
- **Asset management** centralizzato per light/dark mode

### 

## Componenti Atomici Implementati

### 1. ThemedSurface
**Scopo:** Gestisce sfondi, container e superfici  
**Varianti:**
- `base` - Sfondo app principale
- `primary` - Superfici primarie (card, panel)
- `secondary` - Superfici secondarie (sidebar, header)
- `info` - Superfici informative (alert, notice)
- `hover` - Stati hover
- `selected` - Stati selezionati
- `contrast` - Alto contrasto (pulsanti)

**Props:**
- `variant` - Variante superficie
- `borderVariant` - Tipo bordo (default, thin, thick)
- `textVariant` - Variante testo integrata
- `as` - Elemento HTML (polymorphic)
- `className` - Classi aggiuntive

### 2. ThemedText
**Scopo:** Testi semantici con theming automatico  
**Varianti:**
- `primary` - Testo principale
- `secondary` - Testo secondario
- `label` - Label e intestazioni
- `placeholder` - Placeholder e hint
- `disabled` - Testo disabilitato
- `link` - Link e elementi cliccabili
- `contrast` - Alto contrasto
- `inherit` - Eredita dal parent

**Props:**
- `variant` - Variante testo semantica
- `as` - Elemento HTML (h1, h2, p, span, etc.)
- `className` - Classi aggiuntive

### 3. ThemedBorder
**Scopo:** Wrapper per bordi tematici  
**Varianti:**
- `default` - Bordo standard
- `thin` - Bordo sottile
- `thick` - Bordo spesso

### 4. ThemedShadow
**Scopo:** Wrapper per ombre responsive  
**Varianti:**
- `sm` - Ombra piccola
- `default` - Ombra standard
- `md` - Ombra media
- `lg` - Ombra grande
- `xl` - Ombra extra large

### 5. ThemedImage 
**Scopo:** Immagini responsive al tema  
**Features:**
- **Auto-switching** - Cambia automaticamente con dark/light mode
- **Type-safe** - Chiavi immagini tipizzate
- **Performance** - Memoization con useMemo
- **Transition** - Cambio smooth tra immagini

**Props:**
- `imageKey` - Chiave immagine ("logo" | "icon")
- `alt` - Testo alternativo (obbligatorio)
- `className` - Classi CSS
- `...rest` - Tutti gli attributi HTML img

---

## Sistema di Theming

### Variabili CSS Implementate
```css
/* Light Mode */
:root {
  /* Superfici */
  --surface-base: theme('colors.gray.50');
  --surface-primary: theme('colors.white');
  --surface-secondary: theme('colors.gray.100');
  --surface-info: theme('colors.blue.50');
  --surface-hover: theme('colors.gray.100');
  --surface-selected: theme('colors.violet.100');
  --surface-contrast: theme('colors.violet.600');

  /* Contenuti */
  --content-primary: theme('colors.gray.900');
  --content-secondary: theme('colors.gray.600');
  --content-label: theme('colors.gray.700');
  --content-placeholder: theme('colors.gray.400');
  --content-disabled: theme('colors.gray.400');
  --content-link: theme('colors.violet.600');
  --content-contrast: theme('colors.white');

  /* Bordi */
  --outline-default: theme('colors.gray.200');
  --outline-thin: theme('colors.gray.100');
  --outline-thick: theme('colors.gray.300');

  /* Ombre */
  --shadow-sm: theme('boxShadow.sm');
  --shadow-default: theme('boxShadow.DEFAULT');
  --shadow-md: theme('boxShadow.md');
  --shadow-lg: theme('boxShadow.lg');
  --shadow-xl: theme('boxShadow.xl');
}

/* Dark Mode */
.dark {
  /* Superfici adattate per dark mode */
  --surface-base: theme('colors.gray.900');
  --surface-primary: theme('colors.gray.800');
  --surface-secondary: theme('colors.gray.700');
  /* ... altre variabili dark */
}
```

### Gestione Automatica del Tema
- **localStorage persistence** - Salva preferenza utente automaticamente
- **System preference detection** - Rileva preferenza sistema come fallback
- **Redux synchronization** - Stato centralizzato con middleware
- **DOM class application** - Applica classe `.dark` automaticamente

---

## Redux Store Architecture con Persistenza

### Store Configuration (app/store.ts)
```typescript
export const store = configureStore({
  reducer: {
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['ui/initializeFromStorage'],
      },
    }).concat(persistenceMiddleware), // Middleware di persistenza
  devTools: process.env.NODE_ENV !== 'production',
});
```

### Persistence Middleware (app/middleware/persistenceMiddleware.ts)
**Features:**
- **Auto-save** - Salva automaticamente ogni cambio UI
- **Type-safe** - Tipizzazione completa senza `any`
- **Error handling** - Gestione errori localStorage
- **Selective persistence** - Solo settings rilevanti salvati

**Tipizzazione:**
```typescript
export const persistenceMiddleware: Middleware<
  Record<string, never>, // Extra dispatch signature
  RootState,             // State type
  AppDispatch            // Dispatch type
> = (store) => (next) => (action: Action) => {
  // Logica di persistenza
};
```

### UI Slice con Persistenza (features/settings/uiSlice.ts)
**State Shape:**
```typescript
interface UIState {
  darkMode: boolean;           // Tema dark/light
  sidebarVisible: boolean;     // Visibilità sidebar  
  sidebarExpanded: boolean;    // Sidebar espansa/compressa
  footerVisible: boolean;      // Visibilità footer
  userMenuOpen: boolean;       // Menu impostazioni aperto
}
```

**Inizializzazione con localStorage:**
```typescript
const createInitialState = (): UIState => {
  const defaultState = { /* ... */ };
  const savedSettings = storageUtils.loadUISettings();
  
  return savedSettings 
    ? { ...defaultState, ...savedSettings, userMenuOpen: false }
    : defaultState;
};
```

**Actions Implementate:**
- `toggleDarkMode()` - Toggle tema
- `setDarkMode(boolean)` - Imposta tema specifico
- `toggleSidebar()` - Toggle visibilità sidebar
- `setSidebarVisible(boolean)` - Imposta visibilità sidebar
- `toggleSidebarExpanded()` - Toggle espansione sidebar
- `setSidebarExpanded(boolean)` - Imposta espansione sidebar
- `toggleFooter()` - Toggle visibilità footer
- `setFooterVisible(boolean)` - Imposta visibilità footer
- `toggleUserMenu()` - Toggle menu impostazioni
- `setUserMenuOpen(boolean)` - Imposta stato menu
- `closeUserMenu()` - Chiudi menu impostazioni
- `resetUISettings()` - Reset tutte le impostazioni + localStorage
- `initializeFromStorage()` -  Inizializza tema dal localStorage

**Selectors:**
- `selectDarkMode`
- `selectSidebarVisible`
- `selectSidebarExpanded`
- `selectFooterVisible`
- `selectUserMenuOpen`
- `selectUIState` - Intero stato UI

### Storage Utils (app/middleware/persistenceMiddleware.ts)
```typescript
export const storageUtils = {
  saveUISettings: (uiState) => { /* Salva nel localStorage */ },
  loadUISettings: () => { /* Carica dal localStorage con validazione */ },
  clearUISettings: () => { /* Pulisce localStorage */ },
};
```

**Chiave localStorage:** `"edg-ui-settings"`

**Dati salvati:**
```json
{
  "darkMode": true,
  "sidebarVisible": false, 
  "sidebarExpanded": true,
  "footerVisible": true
}
```

### Custom Hooks (app/hooks.ts)
**useUISettings()** - Hook principale per UI state:
```typescript
const {
  darkMode,
  sidebarVisible,
  sidebarExpanded,
  footerVisible,
  userMenuOpen,
  toggleDarkMode,
  toggleSidebar,
  toggleSidebarExpanded,
  toggleFooter,
  toggleUserMenu,
  closeUserMenu,
  resetUISettings
} = useUISettings();
```

---

## Sistema Immagini Tematiche  **NUOVO**

### useThemedImage Hook (core/hooks/useThemedImage.ts)
**Features:**
- **Reactive** - Cambia automaticamente con il tema
- **Centralized** - Mapping immagini in un posto
- **Type-safe** - TypeScript per chiavi immagini
- **Optimized** - useMemo per performance

**Image Mapping:**
```typescript
const THEMED_IMAGES = {
  logo: {
    light: '/src/assets/logo.png',
    dark: '/src/assets/logo-reverse.png',
  },
  icon: {
    light: '/src/assets/icon.png', 
    dark: '/src/assets/icon-reverse.png',
  },
} as const;
```

**Hooks disponibili:**
```typescript
// Hook generico
const src = useThemedImage('logo');

// Hooks specifici (convenience)
const logoSrc = useThemedLogo();
const iconSrc = useThemedIcon();
```

### ThemedImage Component (core/components/ui/ThemedImage.tsx)
**Utilizzo:**
```typescript
<ThemedImage 
  imageKey="logo" 
  alt="Company Logo" 
  className="w-8 h-8"
/>
```

**Features:**
- **Props standard** - Tutti gli attributi `<img>` supportati
- **Transition smooth** - Cambio fluido tra immagini
- **Accessibility** - Alt text obbligatorio
- **Type safety** - imageKey tipizzato

---

## Sistema di Routing

### Routes Configuration (config/routes.config.ts)
```typescript
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  SHOWCASE: "/showcase", 
  SETTINGS: "/settings",
  NOT_FOUND: "/404",
} as const;
```

### Navigation Configuration (config/navigation.config.ts)
```typescript
interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: "home" | "dashboard" | "components" | "settings" | "showcase";
  description?: string;
}
```

### App Router Structure (App.tsx)
- `/` → Redirect to `/dashboard`
- `/dashboard` → Dashboard component
- `/showcase` → Showcase component
- `/settings` → NotFound (placeholder)
- `/404` → NotFound component
- `*` → Catch-all NotFound

---

## Layout System

### MainLayout (layouts/MainLayout.tsx)  **AGGIORNATO**
**Responsabilità:**
- Gestisce layout con/senza sidebar
- Calcola margini dinamici corretti
- Controlla visibilità footer
- Adatta header context

**Layout Modes:**
1. **Normal Mode** (sidebarVisible = false):
   - Header completo con logo e navigation
   - Content full-width
   - Footer condizionale

2. **Sidebar Mode** (sidebarVisible = true):
   - Sidebar fixed a sinistra
   - Header senza logo e navigation
   - Content con margine dinamico  **CORRETTO**: `ml-12` / `ml-64`
   - Footer condizionale

**Margini corretti:**
```typescript
const getMainContentMargin = () => {
  if (!sidebarVisible) return "ml-0";
  return sidebarExpanded ? "ml-64" : "ml-12"; // Allineato con sidebar w-12/w-64
};
```

### Header (core/components/layout/Header.tsx) **PULITO**
**Features:**
- Logo condizionale (nascosto quando sidebar visible)
- Navigation desktop (nascosta quando sidebar visible)
- User avatar con immagine tematica
- Settings icon (apre UserMenu)
- Mobile menu toggle (placeholder)

**Props semplificate:**
```typescript
interface HeaderProps {
  showLogo?: boolean;
  showNavigation?: boolean;
}
```

**Utilizzo immagini tematiche:**
```typescript
<ThemedImage
  imageKey="icon"
  alt="User Avatar"
  className="w-8 h-8 rounded-full"
/>
```

### Sidebar (core/components/layout/Sidebar.tsx) **DIMENSIONI AGGIORNATE**
**Features:**
- Width dinamica **AGGIORNATA**: w-12 compressa, w-64 espansa
- Logo adattivo (compact/full con immagini tematiche)
- Navigation con icone Lucide semantiche
- Stati attivi automatici
- Toggle interno expand/collapse

**Navigation Icons:**
- Dashboard → `LayoutDashboard`
- Showcase → `Palette`
- Settings → `Settings`

### Footer (core/components/layout/Footer.tsx)
**Features:**
- Copyright dinamico
- Badge versione
- Link footer (Privacy, Termini, Supporto)
- Link social (GitHub)
- Design responsivo

**Props:**
- `showVersionInfo` - Mostra/nasconde info versione
- `className` - Classi aggiuntive

### Logo (core/components/layout/Logo.tsx) **CON IMMAGINI TEMATICHE**
**Aggiornato per usare ThemedImage:**
```typescript
// Logo compatto
<ThemedImage imageKey="icon" alt="EDG Logo" className="w-8 h-8" />

// Logo completo
<ThemedImage imageKey="icon" alt="EDG Logo" className="w-8 h-8" />
<div className="flex flex-col">
  <ThemedText variant="primary" className="font-bold text-lg leading-none">
    EDG
  </ThemedText>
  <ThemedText variant="secondary" className="text-xs leading-none">
    Frontend
  </ThemedText>
</div>
```

---

## UserMenu Panel con Persistenza **MIGLIORATO**

### Caratteristiche Implementate
**Design:**
- Panel sliding da destra (320px width)
- Backdrop con blur effect
- Animazioni fluide (400ms cubic-bezier)
- Responsive e accessibile

**Controlli UI:**
1. **Info Persistenza**  **NUOVO**
   - Badge "Auto-Save" nell'header
   - Spiegazione salvataggio automatico
   - Info localStorage

2. **Aspetto**
   - Toggle Dark Mode con switch animato
   - Descrizione funzionalità

3. **Layout**
   - Toggle Sidebar visibility
   - Toggle Footer visibility
   - Descrizioni per ogni opzione

4. **Debug** (solo development)  **MIGLIORATO**
   - Reset tutte le impostazioni + localStorage
   - JSON state viewer con chiave localStorage
   - Styled reset button

**Features persistenza:**
- Auto-Save badge** - Indicatore visivo nell'header
- localStorage info** - Mostra chiave e dati salvati
- Reset completo** - Pulisce anche localStorage
- User education** - Spiega il salvataggio automatico

**Interazioni:**
- ESC key per chiusura
- Click backdrop per chiusura
- Focus management
- Body scroll lock quando aperto

### ToggleSwitch Component
**Features:**
- Design iOS-style
- Animazioni micro-interaction
- Accessibility completa (ARIA)
- Scale effects su hover/click
- Theming automatico

---

## Features delle Pagine

### Dashboard (features/shared/Dashboard.tsx)
**Contenuto:**
- Hero section con titolo template
- Status cards con indicatori sistema
- Features grid con dettagli componenti
- Redux state test e visualizzazione

### Showcase (features/shared/Showcase.tsx)
**Contenuto:**
- Demo completa componenti atomici
- Varianti ThemedSurface
- Varianti ThemedText
- Varianti ThemedShadow
- Stati e interazioni
- Statistiche sistema

### NotFound (features/shared/NotFound.tsx)
**Features:**
- Design 404 centrato ed elegante
- Pulsanti funzionali (Home + Back)
- Icone Lucide per azioni
- Footer con link supporto
- Layout completamente responsive

---

## Utilità e Helpers

### Icon Mapping (core/utils/cn.ts)
```typescript
export const iconMap = {
  home: Home,
  dashboard: LayoutDashboard,
  settings: Settings,
  components: Package,
  showcase: Palette,
} as const;
```

### CSS Utility (core/utils/cn.ts)
```typescript
export function cn(...inputs: (string | undefined | null | false | 0)[]): string {
  return inputs.filter(Boolean).join(' ');
}
```

---

## Best Practices Applicate

### Architettura
- **Barrel files** per import puliti
- **Separation of concerns** per responsabilità
- **Modular architecture** per scalabilità
- **Type safety** completa con TypeScript
- **No any usage** - Tipizzazione rigorosa

### Componenti
- **Props tipizzate** con interfaces
- **Polymorphic components** con prop `as`
- **Conditional rendering** intelligente
- **Default props** sensati
- **Clean props** - Rimozione props non utilizzate

### State Management
- **Immutable updates** con Immer
- **Typed selectors** e hooks
- **Action creators** automatici
- **Side effects** gestiti (DOM manipulation)
- **Automatic persistence** - Middleware trasparente

### Styling
- **CSS Variables** per theming
- **Responsive design** mobile-first
- **Consistent spacing** con Tailwind
- **Semantic colors** per accessibility
- **Themed assets** per light/dark mode

### Accessibility
- **ARIA labels** appropriati
- **Keyboard navigation** completa
- **Focus management** corretto
- **Screen reader** friendly
- **Alt text** obbligatorio per immagini

### Performance
- **useMemo** per calcoli costosi
- **Selective re-renders** con selectors specifici
- **Efficient middleware** - Solo save quando necessario
- **Asset optimization** - Immagini tematiche cached

---

## Workflow di Sviluppo

### Metodologia Applicata
1. **Step-by-step development** - Un componente alla volta
2. **Iterative feedback** - Validazione ad ogni step
3. **Modular approach** - Divide et impera
4. **Documentation driven** - Commenti e types espliciti
5. **Clean code principles** - Rifattorizzazione costante

### Testing Strategy
- **Visual testing** - Showcase component
- **Theme switching** - Light/dark validation
- **Responsive testing** - Mobile/desktop
- **State persistence** - localStorage validation
- **Asset loading** - Immagini tematiche

------------------------------------------------------------------------------

# Appendice - Stato Sviluppo Layout System

**Data**: 26 Giugno 2025  
**Sessione**: Layout System Implementation  
**Obiettivo**: Memoria progetto per continuità sviluppo

## 🏗️ Layout System Implementato

### ✅ MainLayout Completato

#### Grid Structure
```css
grid-template-rows: auto 1fr auto
grid-template-areas: 
  "header"
  "content" 
  "footer"
```

- **Sticky header e sidebar** - Navigazione sempre accessibile
- **Content area responsive** - Flex container per sidebar + main
- **Footer compatto** - Altezza ridotta per design più elegante
- **Gestione altezze corretta** - Chain completa: Grid → Content → Main → Children

#### Responsive Behavior
- **Mobile** (< sm): Sidebar nascosta, header compatto
- **Desktop** (≥ sm): Sidebar visibile, layout completo
- **Transizioni smooth** - `transition-all duration-300 ease-in-out`

### 🎨 Componenti Atomic Ottimizzati

#### ThemedSurface
```typescript
interface ThemedSurfaceProps {
  variant?: "base" | "primary" | "secondary" | "modal" | "info" | "contrast" | "hover" | "selected"
  textVariant?: "primary" | "secondary" | "contrast" | "label" | "placeholder" | "disabled" | "link" | "linkHover"
  borderVariant?: "none" | "thin" | "default" | "strong"
  as?: keyof JSX.IntrinsicElements
}
```

**Pattern CSS Custom Properties**:
- `bg-bg-*` per backgrounds
- `text-text-*` per testi  
- `border-border-*` per bordi

#### Sidebar
- **Stati**: Espansa (w-64) vs Compressa (w-12)
- **Hook**: `useUISettings()` per gestione toggle
- **Navigation**: `NAVIGATION_ITEMS` da config
- **Icons**: `iconMap` utility per Lucide components
- **Visual feedback**: Stati attivi/hover gestiti dinamicamente

#### Header & Footer
- **Header**: Logo, sidebar toggle, area breadcrumb
- **Footer**: Design minimalista, solo copyright
- **Sticky positioning**: Sempre visibili durante scroll

### 🔧 Fix Tecnici Risolti

#### Problema Bordi Sidebar
```typescript
// ❌ PRIMA (Errato)
<ThemedSurface borderVariant="default" className="border-r">
// Risultato: bordi su tutti i lati + bordo destro duplicato

// ✅ DOPO (Corretto)  
<ThemedSurface borderVariant="none" className="border-r border-border-default">
// Risultato: solo bordo destro
```

#### Problema Altezze Pagine
```typescript
// ❌ PRIMA (Overflow)
className="min-h-screen" // Ignora header/footer

// ✅ DOPO (Corretto)
className="min-h-full"   // Usa altezza contenitore
```

**Soluzione MainLayout**:
```typescript
// Main content con altezza definita
<main className="flex-1 min-w-0 overflow-y-auto flex flex-col">
  <div className="w-full px-4 sm:px-6 py-8 flex-1">{children}</div>
</main>
```

#### Button Consistency NotFound
```typescript
// Pattern responsive uniforme per Link e Button
className="w-full sm:w-auto justify-center flex-shrink-0"
// Mobile: full width, Desktop: auto width
```

### 📱 Responsive Design Patterns

#### Breakpoints Utilizzati
- **sm (640px)**: Sidebar visibility toggle
- **md (768px)**: Layout adjustments  
- **lg (1024px)**: Full desktop experience

#### Mobile-First Approach
```css
/* Base (Mobile) */
flex-col gap-3

/* Desktop */
sm:flex-row sm:gap-4
```

#### Touch-Friendly Design
- **Button heights**: py-3 (48px+ touch target)
- **Click areas**: Padding generoso per touch
- **Icon sizes**: w-5 h-5 (20px) per leggibilità

### 🎯 Pattern e Convenzioni Stabiliti

#### Pagine Speciali
```typescript
// Template per pagine 404, Login, etc.
<ThemedSurface variant="base" className="min-h-full flex items-center justify-center p-4">
  <div className="max-w-lg w-full">
    {/* Contenuto centrato */}
  </div>
</ThemedSurface>
```

#### Gestione Stati UI
```typescript
// Hook pattern per UI state
const { sidebarExpanded, toggleSidebarExpanded } = useUISettings();

// Classi dinamiche per stati
const getMenuItemClasses = (isActive: boolean) => {
  const baseClasses = "flex items-center rounded-lg text-sm font-medium transition-colors duration-200";
  const paddingClasses = sidebarExpanded ? "px-3 py-3" : "px-2 py-2 justify-center";
  return isActive ? `${baseClasses} ${paddingClasses} bg-bg-selected` : `${baseClasses} ${paddingClasses} hover:bg-bg-hover`;
};
```

#### Icon System
```typescript
// Mapping centralizzato per icone
const iconMap = { /* Lucide components */ };
const getMenuIcon = (iconType: IconName) => {
  const IconComponent = iconMap[iconType];
  return <IconComponent className="w-5 h-5 flex-shrink-0" />;
};
```

### 🗂️ Struttura Files Consolidata

```
src/
├── core/
│   └── components/
│       ├── atomic/           # ThemedSurface, ThemedText
│       ├── layout/           # MainLayout, Header, Sidebar, Footer  
│       └── ui/               # Componenti specifici applicazione
├── features/
│   └── shared/              # NotFound, componenti cross-feature
├── config/
│   ├── index.ts            # ROUTES, NAVIGATION_ITEMS
│   └── constants.ts        # Costanti applicazione
└── utils/
    └── iconMap.ts          # Mapping icone Lucide
```

### 🚀 Stato Repository

#### Git Setup Completato
- **Repository**: `https://github.com/LarisPigasse/edg-frontend-template`
- **Strategia**: Delete/Recreate (Opzione 2)
- **`.gitignore`**: Ottimizzato per React/TypeScript/Vite stack

#### Files Protetti
```gitignore
# Environment specifici
.env.development
.env.production

# Build e cache
node_modules/
dist/
.vite/
*.tsbuildinfo
```

### 💡 Note Metodologiche

#### Approccio Sviluppo
- **Step-by-step incrementale** - Un problema alla volta
- **Feedback bidirezionale** - Analisi e verifica continua  
- **Soluzioni semplici** - Fix eleganti vs over-engineering
- **Componenti on-demand** - Solo quando realmente necessari

#### Principi Architetturali
- **Modularità** - Separazione logica/presentazione
- **Consistenza** - Pattern uniformi per ThemedSurface
- **Flessibilità** - Props per customizzazione
- **Performance** - CSS transitions, lazy loading ready

### 🔮 Prossimi Sviluppi Suggeriti

1. **Tema System** - Dark/light mode toggle
2. **Form Components** - Input, Select, Button variants  
3. **Modal System** - Overlay management
4. **Table Components** - Data display
5. **Loading States** - Skeleton, spinners
6. **Error Boundaries** - Gestione errori React

---

Appendice - Header System e Menu Implementation
Data: 30 Giugno 2025

Sessione: Header Restructuring e Menu System
Obiettivo: Documentazione implementazione dual menu system e componenti layout
🏗️ Header System Ristrutturato
✅ Architettura a 3 Zone
Layout Header Finale
┌─────────────────────────────────────────────┐
│ [Logo] [≡]     [Nav Menu]     [🔔] [AD] [⚙️] │
└─────────────────────────────────────────────┘
   LEFT          CENTER           RIGHT
Zone Responsabilità

LEFT: Logo + Mobile hamburger menu
CENTER: Navigation menu desktop (nascosto su mobile)
RIGHT: Notifications + User Avatar + Settings icon

🎯 Componenti Creati
UserAvatar.tsx ✨
typescript// Location: src/core/components/info/UserAvatar.tsx
interface UserAvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
  onClick?: () => void;
}
Features:

Cerchio con iniziali stile Trello
Hover effects e scale animations
Accessibility completa (focus, keyboard nav)
Color variants per diversi utenti/stati
Size responsive per diversi contesti

🔄 Dual Menu System
✅ Redux State Esteso
UISlice Aggiornato
typescriptinterface UIState {
  // ... existing state
  userMenuOpen: boolean;        // Menu profilo utente
  settingsMenuOpen: boolean;    // Menu impostazioni app
  mobileMenuOpen: boolean;      // Menu mobile navigation
}
Smart Menu Logic

Esclusività: Solo un menu aperto alla volta
Auto-close: Apertura di un menu chiude gli altri automaticamente
Persistence: Solo UI settings salvati, non stati menu temporanei

🎨 SettingsMenu (App Settings)
Design Evolution
Da: Panel laterale full-height → A: Modal ancorata sotto icona
typescript// Posizionamento sotto Settings icon
<div className="flex justify-end pt-16 pr-4 sm:pr-6">
  <ThemedSurface className="w-80 max-w-[90vw] rounded-xl">
Features:

Ancorato: Top-right sotto Settings icon
Transform origin: top right per animazioni naturali
Responsive: max-w-[90vw] su mobile
Stagger animations: Contenuti con delay progressivo

Settings Available

Dark Mode: Toggle tema con descrizione
Sidebar: Show/hide barra laterale
Footer: Show/hide footer
Auto-save: Info salvaggio automatico

🧑‍💼 UserMenu (Profile Menu)
Design Pattern
Dropdown ancorato sotto User Avatar con info complete utente
typescript// User info completo
interface UserMenuProps {
  userInitials?: string;    // "AD"
  userName?: string;        // "Admin Demo"  
  userEmail?: string;       // "admin@demo.com"
  userRole?: string;        // "Administrator"
}
Menu Structure:

Header: Avatar + info utente complete
Profile: Link al profilo utente
Preferences: Impostazioni personali
Logout: Uscita con styling red

🔧 Redux Integration
Hook Updates
typescript// useUISettings return object
{
  // Dual menu states
  settingsMenuOpen: boolean,
  userMenuOpen: boolean,
  
  // Dual menu actions  
  toggleSettingsMenu: () => void,
  toggleUserMenu: () => void,
  closeSettingsMenu: () => void,
  closeUserMenu: () => void,
}
Actions Logic
typescript// Smart exclusive behavior
toggleUserMenu: () => {
  if (!userMenuOpen) {
    // Close other menus before opening
    set({ settingsMenuOpen: false, mobileMenuOpen: false, userMenuOpen: true });
  } else {
    set({ userMenuOpen: false });
  }
}
🎨 Layout Enhancement Components
✅ HeaderGroup Component ✨
Purpose
Risolve problema interlinea tra title e subtitle
typescript// Location: src/core/components/layout/HeaderGroup.tsx
interface HeaderGroupProps {
  title: string;
  subtitle?: string;
  titleSize?: "sm" | "md" | "lg" | "xl" | "2xl";
  spacing?: "tight" | "normal" | "loose";
  align?: "left" | "center" | "right";
}
Usage:
typescript// Da questo (spacing eccessivo):
<ThemedText className="text-2xl font-bold mb-2" block>Title</ThemedText>
<ThemedText variant="secondary" className="text-sm">Subtitle</ThemedText>

// A questo (spacing ottimale):
<HeaderGroup title="Title" subtitle="Subtitle" spacing="tight" />
✅ TitledSurface Component ✨
Purpose
Surface con titolo che interrompe il bordo superiore (fieldset-style)
typescript// Location: src/core/components/layout/TitledSurface.tsx
interface TitledSurfaceProps {
  title: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "modal" | "info";
  borderVariant?: "none" | "thin" | "default" | "strong";
  titleSize?: "sm" | "md" | "lg";
  padding?: "sm" | "md" | "lg";
}
Visual Effect:
    ┌─── Controlli Tema ────┐
    │                       │
    │   [Toggle] [Info]     │
    │                       │
    └───────────────────────┘
Implementation:
typescript<TitledSurface title="Controlli Tema" padding="md">
  <div className="flex items-center gap-4">
    {/* content */}
  </div>
</TitledSurface>
🗂️ File Structure Updates
Componenti Organizzati
src/core/components/
├── atomic/           # Base components (ThemedSurface, ThemedText)
├── info/             # Info components
│   ├── Logo.tsx      # Moved from atomic (semantically better)
│   └── UserAvatar.tsx # ✨ New - Avatar con iniziali
├── layout/           # Layout components  
│   ├── HeaderGroup.tsx    # ✨ New - Title+subtitle con spacing
│   ├── TitledSurface.tsx  # ✨ New - Surface con title nel bordo
│   ├── Header.tsx         # ✨ Updated - 3-zone structure
│   └── MainLayout.tsx     # ✨ Updated - Includes menus
└── navigation/       # Menu components
    ├── SettingsMenu.tsx   # ✨ Renamed from UserMenu
    ├── UserMenu.tsx       # ✨ New - Profile menu
    └── index.ts           # ✨ Barrel exports
Import Pattern Updates
typescript// Nuovi import centralizzati
import { Logo, UserAvatar } from "../info";
import { HeaderGroup, TitledSurface } from "../layout";  
import { SettingsMenu, UserMenu } from "../navigation";
🎯 UX Improvements
Menu Behavior

Click fuori: Chiude menu automaticamente
ESC key: Chiude menu attivo
Body scroll lock: Quando modali aperte
Backdrop blur: Visual feedback apertura menu

Responsive Behavior

Mobile: Navigation hidden, hamburger menu visibile
Desktop: Full navigation, user controls visibili
Adaptive sizing: Menu si adattano a viewport

Visual Consistency

Stesso stile: SettingsMenu e UserMenu hanno design pattern uniforme
Transform origins: Animazioni ancorate ai trigger
Color system: Uso consistente CSS custom properties
Typography: HeaderGroup risolve spacing issues

📱 Mobile Considerations
Header Adaptation

Logo sempre visibile su mobile
Hamburger menu per navigation
User avatar nascosto su mobile (solo settings icon)
Navigation collassata in mobile menu

Menu Responsiveness

Modal sizing: max-w-[90vw] per non overflow su mobile
Touch targets: Button heights 48px+ per accessibility
Scroll behavior: Menu con max-height e scroll interno

🚀 Performance Optimizations
Animation Performance

CSS transforms: Uso di scale/translate invece di width/height
GPU acceleration: Transform 3D per smooth animations
Stagger delays: Contenuti animati in sequenza per fluidità
Reduced motion: Rispetta preferenze sistema utente

State Management

Selective persistence: Solo settings persistiti, non menu states
Optimistic updates: UI aggiornata immediatamente
Batched actions: Multiple state changes in single dispatch


# Form Components Implementation Update

**Data**: Primo Luglio 2025  
**Versione**: Post layout-system implementation  
**Obiettivo**: Documentazione aggiornamenti componenti form

---

## Componenti Form Implementati

### Input Component con Floating Label ✅
**Location**: `src/core/components/ui/Input.tsx`

**Features implementate:**
- **Floating label system** - Label che si sposta dinamicamente in alto
- **Underline semantico** - 4 stati distinti usando variabili CSS underline
- **Required support** - Asterisco rosso per campi obbligatori
- **Validation integration** - Error states con colori tematici
- **Autofill override** - CSS custom per eliminare sfondo browser autofill
- **Forward ref** - Compatibilità con form libraries
- **TypeScript completo** - Props tipizzate e controlled/uncontrolled support

**Stati underline:**
- `bg-underline-default` - Campo vuoto (grigio chiaro)
- `bg-underline-primary` - Campo con valore valido (viola sottile)
- `bg-underline-focus` - Campo in focus (grigio scuro spesso)
- `bg-underline-error` - Campo con errore (rosso spesso)

### Label Component Standalone ✅
**Location**: `src/core/components/ui/Label.tsx`

**Features implementate:**
- **Varianti semantiche** - default, required, disabled, error, info
- **Dimensioni** - xs, sm, md, lg
- **Pesi font** - normal, medium, semibold, bold
- **Indicatori automatici** - Asterisco rosso (required), badge "(opzionale)"
- **Accessibility** - ARIA labels e cursor management

### Button Component Enhanced ✅
**Location**: `src/core/components/ui/Button.tsx`

**Enhancement applicato:**
- **loadingText prop** - Testo personalizzato durante loading
- **Logica migliorata** - `{isLoading && loadingText ? loadingText : children}`

**Utilizzo form-friendly:**
```typescript
<Button 
  type="submit" 
  variant="primary" 
  isLoading={isSubmitting}
  loadingText="Invio in corso..."
>
  Invia Form
</Button>
```

### ShowForms Component Completo ✅
**Location**: `src/features/shared/components/ShowForms.tsx`

**Sezioni implementate:**
1. **Input Components** - Stati base e speciali con validation
2. **Form Demo** - Form funzionale con Button loading
3. **Label Components** - Showcase varianti, dimensioni, pesi
4. **Button Properties Info** - Box informativo con tutte le props disponibili
5. **Debug Panel** - Visualizzazione stato form in tempo reale

---

## CSS System Updates

### Variabili Underline Aggiunte ✅

**In `globals.css`:**
```css
/* Light mode */
--underline-default: #e4e6e8;
--underline-primary: #6e56cf;
--underline-focus: #a2a4a8;
--underline-error: #ef4444;

/* Dark mode */
--underline-default: #4b5563;
--underline-primary: #6e56cf;
--underline-focus: #c2c4c8;
--underline-error: #ef4444;
```

### Autofill Override CSS ✅

**In `globals.css`:**
```css
/* Disable autofill background */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: inset 0 0 0px 1000px var(--bg-primary) !important;
  box-shadow: inset 0 0 0px 1000px var(--bg-primary) !important;
  -webkit-text-fill-color: var(--text-primary) !important;
}
```

### Mapping CSS Variables ✅

**In `index.css` aggiunte:**
```css
--color-underline-default: var(--underline-default);
--color-underline-primary: var(--underline-primary);
--color-underline-focus: var(--underline-focus);
--color-underline-error: var(--underline-error);
```

---

## Barrel Files Updates

### ui/index.ts ✅
```typescript
// Existing exports
export { default as Button } from "./Button";
export type { ButtonVariant, ButtonSize } from "./Button";

// New form components exports
export { Input } from "./Input";
export { Label } from "./Label";
```

### shared/components/index.ts ✅
```typescript
export { default as ShowButtons } from "./ShowButtons";
export { default as ShowTheme } from "./ShowTheme";
export { default as ShowForms } from "./ShowForms"; // ✨ Added
```

---

## Stato Form System

### ✅ Componenti Completati
- **Input** - Floating label + underline states + validation
- **Label** - Standalone con varianti complete  
- **Button** - Enhanced con loadingText
- **ShowForms** - Showcase completo e funzionale

### 🟡 Prossimi Sviluppi Suggeriti
- **TextArea** - Area di testo con auto-resize
- **Select** - Dropdown con Radix UI
- **Checkbox/Radio** - Stati e gruppi
- **FormField** - Wrapper che combina componenti
- **Validation hooks** - Sistema di validazione custom

### 📊 Statistiche Implementazione
- **4 componenti** form completati
- **13 variabili CSS** aggiunte per underline system
- **1 fix autofill** per UX ottimale
- **Compatibilità** completa light/dark mode
- **TypeScript** completo su tutti i componenti

---

## Design Decisions

### Floating Label vs Traditional
**Scelta**: Floating label per modernità e space efficiency  
**Vantaggi**: Sempre visibile, animazioni smooth, UX intuitiva  
**Implementazione**: CSS transitions + React state management

### Underline vs Border
**Scelta**: Underline per design minimale  
**Vantaggi**: Meno invasivo, focus chiaro, stati semantici  
**Implementazione**: 4 variabili CSS dedicate per ogni stato

### Button Enhancement vs SubmitButton
**Scelta**: Enhancement del Button esistente  
**Vantaggi**: Meno componenti da mantenere, maggiore flessibilità  
**Implementazione**: Prop `loadingText` opzionale

### Validation Strategy
**Scelta**: Custom validation semplice  
**Vantaggi**: Controllo totale, zero dipendenze, lightweight  
**Implementazione**: onBlur validation + error clearing

---

## Breaking Changes
**Nessuno** - Tutti i cambiamenti sono backward compatible

## Migration Notes
**Non necessarie** - I nuovi componenti sono additivi al sistema esistente

---

# EDG Frontend Template - Complete Form System Documentation

**Data Completamento**: Gennaio 2025  
**Versione**: v2.0 - Sistema Form Completo  
**Stack**: React + Vite + TypeScript + Tailwind + Radix UI

---

## 🎯 Sistema Form Completo Implementato

### Panoramica Componenti
Il template ora include un **sistema form professionale completo** con:
- ✅ **8 componenti form** base + wrapper universale
- ✅ **Consistenza design** con floating labels e underline semantici
- ✅ **Accessibility completa** con Radix UI primitives
- ✅ **Theming automatico** light/dark mode
- ✅ **TypeScript rigoroso** senza `any`
- ✅ **Validation pattern** integrati

---

## 🏗️ Componenti Form Implementati

### 1. Input Component ✅
**Location**: `src/core/components/ui/Input.tsx`

**Features**:
- **Floating label system** - Label dinamica che si sposta in alto
- **Underline semantico** - 4 stati: default, primary, focus, error
- **Required support** - Asterisco rosso automatico
- **Autofill override** - CSS per eliminare colori browser
- **Forward ref** - Compatibilità con form libraries

**Props principali**:
```typescript
interface InputProps {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  variant?: 'default' | 'error';
  fullWidth?: boolean;
}
```

**Stati underline**:
- `bg-underline-default` - Campo vuoto (grigio chiaro)
- `bg-underline-primary` - Campo con valore (viola sottile) 
- `bg-underline-focus` - Campo in focus (grigio scuro spesso)
- `bg-underline-error` - Campo con errore (rosso spesso)

### 2. TextArea Component ✅
**Location**: `src/core/components/ui/TextArea.tsx`

**Features**:
- **Auto-resize intelligente** - Si espande con il contenuto
- **Character counter** - Opzionale con warning states
- **Min/Max rows** - Controllo altezza (default: 3-8)
- **Floating label** - Consistente con Input

**Props aggiuntive**:
```typescript
interface TextAreaProps extends InputProps {
  autoResize?: boolean;        // Default: true
  minRows?: number;           // Default: 3
  maxRows?: number;           // Default: 8
  showCharCount?: boolean;    // Default: false
  maxLength?: number;
}
```

### 3. Select Component ✅
**Location**: `src/core/components/ui/Select.tsx`  
**Dependency**: `@radix-ui/react-select`

**Features**:
- **Radix UI base** - Keyboard nav + accessibility completa
- **Portal rendering** - Z-index automatico
- **Opzioni disabilitabili** - Granular control
- **Floating label fix** - Label flotta anche con placeholder

**Interface**:
```typescript
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  onValueChange?: (value: string) => void;
}
```

### 4. Checkbox Component ✅
**Location**: `src/core/components/ui/Checkbox.tsx`  
**Dependency**: `@radix-ui/react-checkbox`

**Features**:
- **Stati avanzati** - Checked, unchecked, indeterminate, disabled
- **Label + description** - Layout flessibile
- **Dimensioni multiple** - sm, md, lg
- **Error handling** - Label rimane nera, error sotto label

**Fix applicati**:
- ✅ Label non diventa rossa con errore
- ✅ Error message posizionato sotto label (non sotto checkbox)

### 5. Switch Component ✅
**Location**: `src/core/components/ui/Switch.tsx`  
**Dependency**: `@radix-ui/react-switch`

**Features**:
- **Design iOS-style** - Animazioni smooth native
- **Touch-friendly** - Dimensioni ottimali
- **Disabled state** - `opacity-50` + no hover effects

### 6. RadioGroup Component ✅
**Location**: `src/core/components/ui/RadioGroup.tsx`  
**Dependency**: `@radix-ui/react-radio-group`

**Features**:
- **Orientazione** - Vertical (default) o horizontal
- **Opzioni con descrizione** - Label + description per ogni radio
- **Group management** - Mutually exclusive selection

**Interface**:
```typescript
interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  label?: string;
  options: RadioOption[];
  orientation?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
}
```

### 7. FormField Wrapper ✅
**Location**: `src/core/components/ui/FormField.tsx`

**Purpose**: Wrapper universale per eliminare codice ripetitivo e garantire layout consistente.

**Features**:
- **Universal wrapper** - Funziona con qualsiasi componente form
- **Smart labeling** - `hideLabel` per componenti con label interna
- **Accessibility automatica** - IDs e ARIA attributes
- **Error hierarchy** - Error sovrascrive helper text

**Pattern di utilizzo**:
```typescript
// Con componenti che hanno label interna (Input, Select, TextArea)
<FormField error={errors.email} helperText="Formato email" hideLabel>
  <Input label="Email" type="email" required />
</FormField>

// Con componenti che necessitano label esterna (RadioGroup, Checkbox groups)
<FormField label="Genere" required description="Informazione demografica">
  <RadioGroup options={genderOptions} />
</FormField>
```

**TypeScript fix**:
```typescript
// Fix applicato per evitare 'any'
} as React.HTMLAttributes<HTMLElement> & { [key: string]: unknown });
```

### 8. Label Component Standalone ✅
**Location**: `src/core/components/ui/Label.tsx`

**Features**:
- **Varianti semantiche** - default, required, disabled, error, info
- **Dimensioni** - xs, sm, md, lg
- **Indicatori automatici** - Asterisco required, badge opzionale

---

## 🎨 CSS System Extensions

### Nuove Variabili Underline
**Aggiunte in `globals.css`**:
```css
/* Light mode */
--underline-default: #e4e6e8;  /* Campo vuoto */
--underline-primary: #6e56cf;  /* Campo valido */ 
--underline-focus: #a2a4a8;    /* Campo in focus */
--underline-error: #ef4444;    /* Campo con errore */

/* Dark mode */
--underline-default: #4b5563;
--underline-primary: #6e56cf;
--underline-focus: #c2c4c8;
--underline-error: #ef4444;
```

**Mapping in `index.css`**:
```css
--color-underline-default: var(--underline-default);
--color-underline-primary: var(--underline-primary);
--color-underline-focus: var(--underline-focus);
--color-underline-error: var(--underline-error);
```

### Autofill Override CSS
**Aggiunto in `globals.css`**:
```css
/* Disable browser autofill background */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: inset 0 0 0px 1000px var(--bg-primary) !important;
  box-shadow: inset 0 0 0px 1000px var(--bg-primary) !important;
  -webkit-text-fill-color: var(--text-primary) !important;
}
```

---

## 📦 Dipendenze Radix UI Aggiunte

```bash
npm install @radix-ui/react-select @radix-ui/react-checkbox @radix-ui/react-switch @radix-ui/react-radio-group
```

**Motivazione uso Radix UI**:
- ✅ **Select**: Keyboard navigation complessa, accessibility, portal rendering
- ✅ **Checkbox**: Stati indeterminate, focus management avanzato
- ✅ **Switch**: Animazioni smooth built-in, touch-friendly
- ✅ **RadioGroup**: Group management, keyboard navigation

**Componenti custom** (No Radix):
- ✅ **Input/TextArea**: Maggiore controllo su floating labels e styling
- ✅ **Label**: Troppo semplice per giustificare dipendenza
- ✅ **FormField**: Wrapper specifico per le nostre esigenze

---

## 🗂️ File Structure Updates

### Barrel File ui/index.ts ✅
```typescript
// Existing exports
export { default as Button } from "./Button";
export type { ButtonVariant, ButtonSize } from "./Button";

// Form components exports
export { Input } from "./Input";
export { Label } from "./Label";
export { TextArea } from "./TextArea";
export { Select } from "./Select";
export { Checkbox } from "./Checkbox";
export { Switch } from "./Switch";
export { RadioGroup } from "./RadioGroup";
export { FormField } from "./FormField";
```

### ShowForms Component Completo ✅
**Location**: `src/features/shared/components/ShowForms.tsx`

**Sezioni implementate**:
1. **Input Components** - Stati base e speciali + Form Demo funzionale
2. **TextArea Components** - Auto-resize e character count
3. **Select Components** - Base e speciali con placeholder fix
4. **Checkbox & Switch Components** - Tutti gli stati e dimensioni
5. **RadioGroup Components** - Vertical/horizontal + descrizioni
6. **FormField Wrapper Examples** - Pattern hideLabel e label esterna
7. **Label Components** - Showcase varianti standalone
8. **Debug Panel** - Stati completi di tutti i componenti

**Import pattern**:
```typescript
// Barrel file import (preferito)
import { Label, Input, Button, TextArea, Select, Checkbox, Switch, RadioGroup, FormField } from "../../../core/components/ui";
```

---

## 🎯 Design Patterns Stabiliti

### Floating Label System
**Logica uniforme** per Input, TextArea, Select:
```typescript
const isFloating = isFocused || hasValue || Boolean(placeholder);
```

**Fix importante per Select**: Label flotta anche con placeholder per evitare sovrapposizioni.

### Underline States Pattern
**4 stati semantici** per tutti i componenti con underline:
1. **Empty** (`bg-underline-default`) - Campo vuoto
2. **Valid** (`bg-underline-primary`) - Campo con valore
3. **Focus** (`bg-underline-focus`) - Campo attivo
4. **Error** (`bg-underline-error`) - Campo con errore

### Error Handling Pattern
**Hierarchy consistente**:
1. **Error** sovrascrive sempre helper text
2. **Label** rimane sempre del colore normale (non rossa)
3. **Error positioning** sotto la label, non sotto il controllo

### FormField Patterns
**Due modalità principali**:
1. **hideLabel** - Per Input, Select, TextArea (hanno floating label interna)
2. **label esterna** - Per RadioGroup, Checkbox groups, Switch groups

---

## 🚀 Button Component Enhanced

### loadingText Feature ✅
**Enhancement applicato**:
```typescript
interface ButtonProps {
  loadingText?: string; // ✨ Nuova prop
}

// Logica render:
<span>{isLoading && loadingText ? loadingText : children}</span>
```

**Utilizzo nei form**:
```typescript
<Button 
  type="submit" 
  variant="primary" 
  isLoading={isSubmitting}
  loadingText="Invio in corso..."
>
  Invia Form
</Button>
```

---

## 🎨 TitledSurface Theming

### Background Variants Supportate ✅
Il componente `TitledSurface` supporta tutte le varianti del theme system:

```typescript
variant="primary"    → bg-bg-primary    (bianco/grigio scuro)
variant="secondary"  → bg-bg-secondary  (grigio chiaro/grigio)  
variant="modal"      → bg-bg-modal      (bianco sporco/grigio modale)
variant="info"       → bg-bg-info       (azzurro chiaro/blu scuro)
variant="contrast"   → bg-bg-contrast   (nero/bianco)
variant="hover"      → bg-bg-hover      (grigio hover)
variant="selected"   → bg-bg-selected   (azzurro/blu selezione)
```

**Utilizzo negli showcase**:
```typescript
<TitledSurface title="Form Demo" variant="modal" padding="md">
<TitledSurface title="Debug Panel" variant="info" padding="lg">
```

---

## 📊 Stato Completo Form System

### ✅ Componenti Base (8/8)
- **Input** - Floating label + validation + autofill fix
- **TextArea** - Auto-resize + character count
- **Select** - Radix + floating label fix
- **Checkbox** - Stati avanzati + error positioning fix
- **Switch** - iOS-style + disabled opacity
- **RadioGroup** - Orientazioni + descriptions
- **FormField** - Universal wrapper + TypeScript fix
- **Label** - Standalone + semantic variants

### ✅ Sistema CSS (4/4)
- **Underline variables** - 4 stati semantici
- **Autofill override** - Browser consistency
- **Theme integration** - Light/dark automatic
- **TitledSurface variants** - Background theming

### ✅ Showcase Completo (7/7)
- **Input showcase** - Stati base e speciali
- **TextArea showcase** - Auto-resize e counter
- **Select showcase** - Dropdown e placeholder
- **Checkbox/Switch showcase** - Stati e dimensioni
- **RadioGroup showcase** - Orientazioni e descriptions
- **FormField showcase** - Pattern hideLabel e esterni
- **Label showcase** - Varianti standalone

### ✅ Dependencies & Architecture (4/4)
- **Radix UI integration** - 4 componenti strategici
- **Barrel file exports** - Import consistenti
- **TypeScript rigoroso** - Zero `any` types
- **Forward refs** - Form library compatibility

---

## 🔧 Fix Tecnici Applicati

### Select Placeholder Fix
**Problema**: Label si sovrapponeva al placeholder  
**Soluzione**: `const isFloating = open || hasValue || Boolean(placeholder);`

### Checkbox Error Positioning
**Problema**: Error sotto checkbox, label rossa  
**Soluzione**: Error dentro container label, label sempre primary

### Switch Disabled Styling
**Soluzione**: `opacity-50` + `cursor-not-allowed` + no hover effects

### FormField TypeScript
**Problema**: `any` type in cloneElement  
**Soluzione**: `React.HTMLAttributes<HTMLElement> & { [key: string]: unknown }`

### Autofill Browser Override
**Problema**: Colori browser su autofill  
**Soluzione**: CSS `box-shadow` trick con variabili tema

---

## 🎯 Metodologia Applicata

### Sviluppo Iterativo
- ✅ **Step-by-step** - Un componente alla volta
- ✅ **Feedback bidirezionale** - Analisi e correzione continua
- ✅ **Divide et impera** - Problemi scomposti e risolti
- ✅ **Testing immediato** - Showcase per validazione visiva

### Design Consistency
- ✅ **Pattern uniformi** - Floating labels e underline per tutti
- ✅ **CSS custom properties** - Theme system centralizzato
- ✅ **TypeScript rigoroso** - Props tipizzate senza `any`
- ✅ **Accessibility first** - ARIA e keyboard navigation

### Code Quality
- ✅ **Barrel exports** - Import puliti e centralizzati
- ✅ **Forward refs** - Compatibilità con librerie esterne
- ✅ **Error boundaries** - Gestione errori consistente
- ✅ **Performance** - useMemo e ottimizazioni

---

## 🚀 Prossimi Sviluppi Potenziali

### Componenti Aggiuntivi
- **DatePicker** - Selezione date con calendario
- **FileUpload** - Upload con drag & drop
- **Slider/Range** - Input numerici con slider
- **ColorPicker** - Selezione colori

### Form Utilities
- **useFormValidation** - Hook custom validation
- **FormProvider** - Context per form complessi
- **useFormPersistence** - Auto-save form data
- **FormWizard** - Multi-step forms

### Advanced Features
- **Conditional fields** - Campi che appaiono/scompaiono
- **Field arrays** - Liste dinamiche di campi
- **Real-time validation** - Validation server-side
- **Form analytics** - Tracking interazioni

---

## 📈 Risultato Finale

### Sistema Form Professionale Completo
- **8 componenti** base + wrapper universale
- **100% TypeScript** tipizzato senza compromessi
- **Accessibility completa** con Radix UI
- **Theme system** integrato light/dark
- **Performance ottimizzata** con best practices React
- **Showcase completo** per testing e documentazione

### Architettura Scalabile
- **Modular design** - Ogni componente indipendente
- **Consistent API** - Pattern uniformi tra componenti
- **Easy maintenance** - CSS centralizzato, logic separata
- **Future-proof** - Pronto per estensioni future

### Developer Experience
- **Import puliti** - Barrel file centralizzato
- **Props intuitive** - API coerenti e prevedibili
- **Error handling** - Feedback chiari e posizionati correttamente
- **Documentation** - Showcase completo con esempi reali

---


## Ultimo componenti aggiunti ma non ancora documentati
- Table.tsx
- TableLink.tsx
- InfoCard.tsx
- ActionMenu.tsx
- CreateAction.tsx
- DeleteAction.tsx
- EditActione.tsx

### Modificato ShowCase.tsx per visualizzare esempi di Badge, Table e TableLink
### Aggiunto ComponentExplorer per documentazione online sui componenti

*Documentazione completata: 7 Luglio 2025*  

*Sistema Form pronto per sviluppi futuri e utilizzo in produzione*

**Memoria Tecnica**: Tutti i pattern e fix documentati per continuità sviluppo collaborativo. 
**Repository**: `https://github.com/LarisPigasse/edg-frontend-template`