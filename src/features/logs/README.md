# Modulo Logs - Sistema di Monitoraggio Centralizzato

## 📚 Panoramica

Il modulo Logs fornisce un'interfaccia web completa per visualizzare, filtrare ed esportare gli eventi del sistema EDG Platform. È integrato nel `pro-frontend` e accessibile solo agli utenti con permesso `sistema.logs` (tipicamente solo root).

## 🎯 Features

- ✅ **Dashboard statistiche** - KPI cards con totali, errori, eventi critici
- ✅ **Tabella eventi** - Lista paginata con tutte le informazioni principali
- ✅ **Filtri avanzati** - Per categoria, severità, utente, data, esito
- ✅ **Dettaglio evento** - Modal con visualizzazione completa JSON
- ✅ **Export dati** - CSV e JSON per analisi offline
- ✅ **Refresh manuale** - Aggiornamento on-demand
- ✅ **Paginazione** - Navigazione efficiente tra migliaia di eventi
- ✅ **Responsive** - Ottimizzato per desktop e tablet

## 📁 Struttura Files

```
src/features/logs/
├── index.ts                    # Entry point - exports pubblici
├── types/
│   └── index.ts                # TypeScript types
├── api/
│   └── logsApi.ts              # HTTP client per log-service
├── hooks/
│   ├── useLogsList.ts          # Hook lista logs + filtri
│   ├── useLogsStats.ts         # Hook statistiche
│   └── index.ts
├── components/
│   ├── LogStatsCards.tsx       # Cards overview statistiche
│   ├── LogFilters.tsx          # Pannello filtri
│   ├── LogsTable.tsx           # Tabella principale
│   ├── LogDetailModal.tsx      # Modal dettaglio evento
│   └── index.ts
├── pages/
│   ├── LogsListPage.tsx        # Pagina principale
│   └── index.ts
└── utils/
    └── logFormatters.ts        # Utilities formattazione
```

## 🔗 Integrazione

### Routes Configurate

```typescript
// src/config/routes.config.ts
SISTEMA_LOGS: '/sistema/logs'
```

### Navigation Menu

```typescript
// src/config/navigation.config.ts
{
  id: 'sistema',
  label: 'SISTEMA',
  children: [
    // ... altri submenu
    { id: 'logs', label: 'Logs', href: ROUTES.SISTEMA_LOGS },
  ],
}
```

### Route Protection

```typescript
// src/App.tsx
<Route
  path={ROUTES.SISTEMA_LOGS}
  element={
    <PrivateRoute requiredPermission="sistema.logs">
      <LogsListPage />
    </PrivateRoute>
  }
/>
```

## 🔐 Permessi

**Accesso richiesto:** `sistema.logs`

Solo gli utenti con questo permesso possono:
- Visualizzare la pagina logs
- Vedere tutti gli eventi del sistema
- Esportare dati in CSV/JSON
- Accedere ai dettagli completi

## 🌐 API Integration

### Backend Endpoint

Il modulo si collega al `log-service` tramite:

```
Base URL: http://log-service:4000
```

**Endpoints utilizzati:**
- `GET /api/logs` - Lista eventi con filtri
- `GET /api/logs/:id` - Dettaglio singolo evento
- `GET /api/logs/stats` - Statistiche aggregate

### Environment Variables

```bash
# Development
VITE_LOG_SERVICE_URL=http://localhost:4000

# Production
VITE_LOG_SERVICE_URL=http://log-service:4000
```

## 🎨 UI Components

### LogStatsCards

Cards panoramica con metriche principali:
- **Eventi Totali** - Count totale eventi
- **Eventi Critici** - Eventi con severità CRITICAL
- **Errori** - Eventi con severità ERROR
- **Tasso Successo** - Percentuale eventi con esito=successo

### LogFiltersPanel

Sidebar dropdown con filtri:
- Categoria (AUTH, DATA, EMAIL, SYSTEM, AUDIT, SECURITY)
- Severità (INFO, WARNING, ERROR, CRITICAL)
- Esito (successo, fallito, parziale)
- ID Utente (search)
- Data Inizio/Fine (datetime picker)

### LogsTable

Tabella principale con colonne:
- Timestamp (formattato DD/MM/YYYY HH:mm)
- Categoria (badge colorato)
- Severità (badge colorato)
- Utente (origine.id)
- Messaggio (risultato.messaggio)
- Esito (text colorato)
- Azioni (icona Eye per dettaglio)

Paginazione:
- Prev/Next buttons
- Indicatore pagina corrente
- Count eventi per pagina

### LogDetailModal

Modal full-screen con sezioni:
- Overview (timestamp, ID, categoria, severità, utente, esito)
- Messaggio principale
- Azione (tipo, entità, idEntità, operazione)
- Contesto (JSON formattato)
- Metadata (JSON formattato)
- Cambiamenti Stato (precedente/nuovo side-by-side)
- Tags (badges)
- JSON Completo (collapsible code block)

## 🛠️ Utilities

### formatTimestamp

Converte ISO string in formato leggibile:
```typescript
formatTimestamp('2026-02-09T10:30:00Z') // "09/02/2026 10:30"
```

### formatRelativeTime

Converte in tempo relativo:
```typescript
formatRelativeTime('2026-02-09T10:28:00Z') // "2 minuti fa"
```

### getCategoryLabel / getCategoryColor

Traduzione e styling categoria:
```typescript
getCategoryLabel('AUTH') // "Autenticazione"
getCategoryColor('AUTH') // "bg-blue-100 text-blue-800"
```

### getSeverityLabel / getSeverityColor

Traduzione e styling severità:
```typescript
getSeverityLabel('ERROR') // "Errore"
getSeverityColor('ERROR') // "bg-red-100 text-red-800"
```

### Export Helpers

```typescript
downloadFile(blob, 'logs-export-20260209.csv')
generateExportFilename('csv') // "logs-export-20260209-1030.csv"
```

## 📊 Hooks Custom

### useLogsList

Hook per gestire lista logs con paginazione:

```typescript
const {
  logs,           // LogEvent[]
  loading,        // boolean
  error,          // string | null
  page,           // number
  limit,          // number
  hasMore,        // boolean
  refetch,        // () => Promise<void>
  nextPage,       // () => void
  prevPage,       // () => void
  setFilters,     // (filters) => void
} = useLogsList({ limit: 50 });
```

### useLogsStats

Hook per statistiche aggregate:

```typescript
const {
  stats,    // LogStats | null
  loading,  // boolean
  error,    // string | null
  refetch,  // () => Promise<void>
} = useLogsStats(filters);
```

## 🚀 Usage Example

```typescript
import { LogsListPage } from '@/features/logs';

// In App.tsx
<Route
  path="/sistema/logs"
  element={
    <PrivateRoute requiredPermission="sistema.logs">
      <LogsListPage />
    </PrivateRoute>
  }
/>
```

## 🎯 User Flow

1. **Accesso** - Utente root naviga su SISTEMA > Logs
2. **Overview** - Visualizza stats cards con panoramica
3. **Filtri** - (Opzionale) Applica filtri avanzati
4. **Browse** - Scorre la tabella eventi
5. **Dettaglio** - Click su Eye icon per vedere evento completo
6. **Export** - (Opzionale) Esporta dati in CSV/JSON
7. **Refresh** - Aggiorna per vedere nuovi eventi

## 🐛 Troubleshooting

### Log Service non raggiungibile

**Errore:** "Errore nel caricamento logs"

**Soluzione:**
1. Verifica che log-service sia running: `docker ps | grep log-service`
2. Verifica porta 4000 esposta: `docker port log-service`
3. Controlla `VITE_LOG_SERVICE_URL` in `.env`

### Nessun log visualizzato

**Possibili cause:**
- Filtri troppo restrittivi (reset filtri)
- Database vuoto (genera eventi di test)
- MongoDB offline (verifica log-mongo container)

### Permesso negato

**Errore:** Redirect a homepage

**Soluzione:**
- Verifica che l'utente abbia permesso `sistema.logs`
- Controlla `account.permissions` in Redux DevTools
- Per test, assegna il permesso al tuo utente via database

## 📝 TODO Future

- [ ] Real-time updates (WebSocket/polling)
- [ ] Grafici trend temporali (Recharts)
- [ ] Ricerca full-text
- [ ] Bulk actions (delete multipli)
- [ ] Saved filters presets
- [ ] Alert configuration UI
- [ ] Integration con Slack notifications

## 🤝 Contributing

Per modificare il modulo:
1. Crea feature branch: `git checkout -b logs/feature-xyz`
2. Modifica files in `src/features/logs/`
3. Test locale con `npm run dev`
4. Commit: `git commit -m "feat(logs): add xyz"`
5. Push e PR

---

**Maintainer:** Mormegil @ EDG Development Team  
**Last Updated:** 9 Febbraio 2026  
**Version:** 1.0.0
