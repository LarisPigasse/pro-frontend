# Logs Module

## 📋 Overview

Il modulo **Logs** fornisce un'interfaccia completa per la visualizzazione, filtro e analisi degli eventi di sistema registrati dal **log-service**. Accessibile esclusivamente agli utenti con ruolo `root`, permette di monitorare tutte le attività della piattaforma EDG in tempo reale.

**Responsabilità principali:**
- Visualizzazione eventi log paginati (server-side pagination)
- Filtri dinamici per categoria, severità, esito, range temporale
- Statistiche aggregate (totale eventi, tasso successo, trend 30gg)
- Dettaglio evento in modale con tutti i metadati
- Esportazione dati (future implementation)

---

## 🏗 Architettura

**Pattern:** Type-First (types → api → hooks → components → pages)
```
types → api → hooks (stato locale React) → components → pages
```

**Stato:**
- **Locale React hooks** (NO Redux) — il modulo è isolato e non serve stato globale
- Paginazione server-side: `page`, `limit`, `hasMore`
- Filtri in query string per bookmarkability

**Dipendenze esterne:**
- Backend: `log-service` porta 4001 (esposta direttamente al browser)
- MongoDB: database `edg_logs` con collection `azionelogs`

---

## 📂 Struttura File

```
features/logs/
├── types/
│   └── index.ts                    # LogEvent, LogFilters, LogStats, ecc.
├── api/
│   └── logsApi.ts                  # Chiamate API log-service
├── hooks/
│   └── useLogs.ts                  # Gestione stato logs + paginazione
├── components/
│   ├── LogStatsCards.tsx           # Card statistiche overview
│   ├── LogsTable.tsx               # Tabella paginata con sorting
│   ├── LogDetailModal.tsx          # Modale dettaglio evento
│   ├── LogFilters.tsx              # Barra filtri dinamici
│   └── index.ts
├── pages/
│   ├── LogsListPage.tsx            # Pagina principale modulo
│   └── index.ts
├── utils/
│   └── logFormatters.ts            # Helper formattazione dati
├── index.ts                        # Barrel export pubblico
└── README.md                       # Questo file
```

---

## 🔌 API Integration

**Base URL:** `http://localhost:4001` (log-service diretto)

### Endpoint utilizzati

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| `GET` | `/api/log` | Lista eventi log paginati |
| `GET` | `/api/log/statistiche` | Statistiche aggregate (trend 30gg) |
| `GET` | `/api/log/:id` | Dettaglio singolo evento |

### Query Parameters (`GET /api/log`)

```typescript
{
  page:             number;    // 0-indexed (default: 0)
  limit:            number;    // eventi per pagina (default: 50)
  categoria?:       string;    // AUTH | SYSTEM | BUSINESS | API | LEGACY
  criticita?:       string;    // info | warning | error | critical
  esito?:           string;    // successo | fallito | parziale
  origineId?:       string;    // es. "user-123", "auth-service"
  dataInizio?:      string;    // ISO date
  dataFine?:        string;    // ISO date
  sort?:            string;    // campo di ordinamento (default: "-timestamp")
}
```

### Esempio Request/Response

**Lista log con filtri:**
```typescript
// Request
GET /api/log?page=0&limit=20&categoria=AUTH&criticita=error

// Response 200
{
  "success": true,
  "data": {
    "logs": [
      {
        "_id": "65f8a1b2c3d4e5f6a7b8c9d0",
        "timestamp": "2026-02-17T10:30:45.123Z",
        "categoria": "AUTH",
        "sottoCategoria": "login_failed",
        "criticita": "error",
        "messaggio": "Tentativo login fallito per user@example.com",
        "esito": "fallito",
        "origineId": "user-456",
        "metadata": {
          "ip": "192.168.1.100",
          "userAgent": "Mozilla/5.0...",
          "tentativi": 3
        }
      },
      // ... altri eventi
    ],
    "pagination": {
      "total": 245,
      "page": 0,
      "limit": 20,
      "totalPages": 13,
      "hasMore": true
    }
  }
}
```

**Statistiche:**
```typescript
// Request
GET /api/log/statistiche

// Response 200
{
  "success": true,
  "data": {
    "total": 12450,
    "criticalEvents": 8,
    "bySeverity": {
      "INFO": 10200,
      "WARNING": 2100,
      "ERROR": 142,
      "CRITICAL": 8
    },
    "successRate": {
      "overall": 97.2,
      "last30Days": 98.5,
      "trend": 1.3          // +1.3% vs media
    }
  }
}
```

---

## 📊 Data Models

```typescript
// Evento log principale
interface LogEvent {
  _id:             string;
  timestamp:       string;           // ISO 8601
  categoria:       EventCategory;
  sottoCategoria?: string;           // es. "login_failed", "startup"
  criticita:       EventSeverity;
  messaggio:       string;
  esito:           EsitoType;
  origineId?:      string;           // ID utente/servizio
  metadata?:       Record<string, any>;
  createdAt:       string;
  updatedAt:       string;
}

// Categorie supportate
enum EventCategory {
  AUTH     = 'AUTH',
  SYSTEM   = 'SYSTEM',
  BUSINESS = 'BUSINESS',
  API      = 'API',
  LEGACY   = 'LEGACY',
}

// Livelli severità (lowercase nel DB)
type EventSeverity = 'info' | 'warning' | 'error' | 'critical';

// Esito operazione
type EsitoType = 'successo' | 'fallito' | 'parziale';

// Filtri query
interface LogFilters {
  categoria?:   EventCategory;
  criticita?:   EventSeverity;
  esito?:       EsitoType;
  origineId?:   string;
  dataInizio?:  string;
  dataFine?:    string;
}

// Paginazione
interface LogPagination {
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
  hasMore:    boolean;
}

// Statistiche aggregate
interface LogStats {
  total:          number;
  criticalEvents: number;
  bySeverity: {
    INFO:     number;
    WARNING:  number;
    ERROR:    number;
    CRITICAL: number;
  };
  successRate: {
    overall:     number;  // %
    last30Days:  number;  // %
    trend:       number;  // delta %
  };
}
```

---

## 🧩 Componenti

### `LogStatsCards`
Card overview con statistiche principali.

**Props:**
```typescript
interface LogStatsCardsProps {
  stats:    LogStats | null;
  loading?: boolean;
}
```

**Visualizza:**
- Totale eventi
- Eventi critici (badge rosso se > 0)
- Errori
- Tasso successo overall
- Trend 30 giorni con icona freccia (↑ verde, ↓ arancio, — grigio)

---

### `LogsTable`
Tabella paginata eventi log con sorting client-side sulle colonne.

**Props:**
```typescript
interface LogsTableProps {
  logs:       LogEvent[];
  loading?:   boolean;
  page:       number;
  limit:      number;
  hasMore:    boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
}
```

**Colonne:**
- Timestamp (sortable, formato locale `DD/MM/YYYY HH:mm:ss`)
- Categoria (badge colorato)
- Severità (badge con icona + colore)
- Messaggio (truncato, click per dettaglio)
- Utente/Origine
- Azioni (bottone "Dettagli" → apre modale)

**Sorting:**
- Click su header colonna per ordinamento ASC → DESC → reset
- Icone: `ArrowUpDown` (default), `ArrowUp` (ASC), `ArrowDown` (DESC)

---

### `LogDetailModal`
Modale full-screen per dettaglio completo evento.

**Props:**
```typescript
interface LogDetailModalProps {
  log:     LogEvent | null;
  onClose: () => void;
}
```

**Sezioni:**
- **Header:** timestamp + categoria + severità + esito
- **Messaggio:** testo completo (può essere lungo)
- **Origine:** origineId (es. "auth-service", "user-123")
- **Metadata:** JSON pretty-printed (con syntax highlight se disponibile)
- **Footer:** bottoni "Chiudi" + "Esporta" (future)

---

### `LogFilters`
Barra filtri con form dinamico.

**Props:**
```typescript
interface LogFiltersProps {
  filters:  LogFilters;
  onChange: (filters: LogFilters) => void;
}
```

**Campi:**
- Select Categoria (tutti + opzioni enum)
- Select Severità (tutti + info/warning/error/critical)
- Select Esito (tutti + successo/fallito/parziale)
- Input Origine ID (text search)
- Date picker "Dal" / "Al"
- Bottone "Reset" (pulisce tutti i filtri)

**Comportamento:**
- Ogni cambio filtro resetta la paginazione a `page=0`
- Filtri vuoti = ricerca senza filtri (tutti gli eventi)

---

## 🎣 Hooks

### `useLogs(initialFilters?: LogFilters)`

Hook principale per gestione stato logs + paginazione.

**Parametri:**
```typescript
initialFilters?: LogFilters;  // filtri iniziali (opzionale)
```

**Ritorna:**
```typescript
{
  logs:       LogEvent[];
  stats:      LogStats | null;
  loading:    boolean;
  error:      string | null;
  filters:    LogFilters;
  pagination: LogPagination;
  setFilters: (filters: LogFilters) => void;
  nextPage:   () => void;
  prevPage:   () => void;
  refetch:    () => Promise<void>;
}
```

**Comportamento:**
- Fetch iniziale di logs + stats in parallelo
- Aggiornamento automatico alla modifica filtri
- Debounce su filtri testuali (300ms)
- Gestione errori con retry automatico

**Esempio utilizzo:**
```tsx
const LogsListPage = () => {
  const {
    logs,
    stats,
    loading,
    filters,
    pagination,
    setFilters,
    nextPage,
    prevPage,
  } = useLogs();

  return (
    <div>
      <LogStatsCards stats={stats} loading={loading} />
      <LogFilters filters={filters} onChange={setFilters} />
      <LogsTable
        logs={logs}
        loading={loading}
        page={pagination.page}
        limit={pagination.limit}
        hasMore={pagination.hasMore}
        onNextPage={nextPage}
        onPrevPage={prevPage}
      />
    </div>
  );
};
```

---

## 🗺 Routing & Permessi

**Route protetta:**
```tsx
<Route
  path="/sistema/logs"
  element={
    <PrivateRoute requiredPermission="sistema.logs">
      <LogsListPage />
    </PrivateRoute>
  }
/>
```

**Permesso richiesto:** `sistema.logs` (solo utenti `root`)

**Navigation:**
- Menu: `Sistema → Logs`
- Icon: `FolderOpen`

---

## 💡 Usage Examples

### Filtro eventi critici ultimi 7 giorni

```tsx
const CriticalEventsWidget = () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { logs, loading } = useLogs({
    criticita: 'critical',
    dataInizio: sevenDaysAgo.toISOString(),
  });

  if (loading) return <Spinner />;
  if (logs.length === 0) return <p>Nessun evento critico</p>;

  return (
    <ul>
      {logs.map(log => (
        <li key={log._id}>
          {formatTimestamp(log.timestamp)}: {log.messaggio}
        </li>
      ))}
    </ul>
  );
};
```

### Export CSV (future implementation)

```tsx
const handleExport = async () => {
  const allLogs = await logsApi.getLogs({ limit: 10000, ...filters });
  const csv = convertToCSV(allLogs.logs);
  downloadFile(csv, 'logs-export.csv');
};
```

### Streaming real-time (WebSocket future)

```tsx
// Possibile evoluzione con WebSocket per log real-time
useEffect(() => {
  const ws = new WebSocket('ws://localhost:4001/logs/stream');
  ws.onmessage = (event) => {
    const newLog = JSON.parse(event.data);
    setLogs(prev => [newLog, ...prev]);
  };
  return () => ws.close();
}, []);
```

---

## 🧪 Testing Notes

### Scenari di test

**Paginazione:**
- ✅ Navigazione avanti/indietro correttamente
- ✅ Bottone "Avanti" disabilitato se `hasMore = false`
- ✅ Bottone "Indietro" disabilitato se `page = 0`
- ✅ Reset a pagina 0 quando cambiano i filtri

**Filtri:**
- ✅ Categoria filter → solo eventi di quella categoria
- ✅ Severità filter → solo eventi con quella severità
- ✅ Range date → eventi nel range specificato
- ✅ Reset filtri → torna a lista completa

**Sorting:**
- ✅ Click header timestamp → ordina per data
- ✅ Click header categoria → ordina alfabetico
- ✅ Terzo click → rimuove sorting

**Dettaglio:**
- ✅ Click su riga → apre modale dettaglio
- ✅ Metadata JSON formattato correttamente
- ✅ Chiudi modale con ESC o click fuori

**Performance:**
- ✅ Paginazione server-side evita caricamento migliaia di record
- ✅ Lazy load modale (React.lazy se pesante)
- ✅ Debounce su input testo filtri

---

## 🔮 Future Improvements

### Funzionalità
- [ ] **Export CSV/JSON** — esportazione dati filtrati
- [ ] **Real-time streaming** — WebSocket per log live
- [ ] **Grafici trend** — Recharts per visualizzazione temporale
- [ ] **Alert automation** — crea regola alert da log specifico
- [ ] **Search full-text** — ricerca testuale su messaggio
- [ ] **Bookmark filtri** — salva filtri preferiti

### UX
- [ ] **Colori personalizzati** — tema colori per categorie
- [ ] **Shortcuts keyboard** — `Ctrl+F` per filtri, `Esc` per chiudere
- [ ] **Infinite scroll** — alternativa a paginazione classica
- [ ] **Column resize** — larghezza colonne personalizzabile

### Performance
- [ ] **Virtual scrolling** — react-window per liste lunghissime
- [ ] **Cache query** — React Query per cache intelligente
- [ ] **Prefetch next page** — carica pagina N+1 in background

### DevOps
- [ ] **Log aggregation** — integrazione con ELK stack
- [ ] **Retention policy** — pulizia automatica log vecchi
- [ ] **Backup automatico** — snapshot giornalieri MongoDB

---

## 📝 Notes

- **Paginazione:** Server-side per scalabilità (milioni di eventi)
- **Sorting:** Client-side sulla pagina corrente (max 50 eventi)
- **Filtri:** Persistiti in URL query params per bookmarkability
- **Performance:** MongoDB indexed su `timestamp`, `categoria`, `criticita`
- **Security:** Endpoint protetto lato backend (middleware `apiKeyAuth` disabilitato per GET)

---

**Autore:** Mormegil  
**Ultima modifica:** 2026-02-17  
**Versione modulo:** 2.0
