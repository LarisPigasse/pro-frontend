# Alerts Module

## 📋 Overview

Il modulo **Alerts** gestisce il sistema di notifiche automatiche della piattaforma EDG. Permette agli amministratori root di configurare regole di alerting basate su eventi log e monitorare lo storico degli alert inviati.

**Responsabilità principali:**
- Creazione, modifica, eliminazione regole di alerting
- Toggle enable/disable regole in tempo reale
- Visualizzazione storico alert inviati con stato (SENT/FAILED)
- Statistiche aggregate alerting (totale, successi, fallimenti, trend)
- Integrazione con email-service per invio notifiche

**Workflow automatico:**
1. Evento log viene registrato → `logController.creaLog()`
2. `AlertManager.evaluate()` verifica tutte le regole attive
3. Se condizioni soddisfatte → `email-service` invia alert
4. Risultato salvato in `alertHistory` (SENT o FAILED)
5. Frontend visualizza storico e statistiche

---

## 🏗 Architettura

**Pattern:** Type-First (types → api → hooks → components → pages)
```
types → api → hooks (stato locale React) → components → pages
```

**Stato:**
- **Locale React hooks** — modulo isolato, no Redux necessario
- Optimistic updates su toggle regole (UX immediato)
- Rollback automatico su errore API

**Dipendenze esterne:**
- Backend: `log-service` porta 4001 (endpoint `/api/alert/*`)
- Email: `email-service` porta 3002 (chiamato dal backend, non dal frontend)
- Database: MongoDB collection `alertrules` + `alerthistory`

---

## 📂 Struttura File

```
features/alerts/
├── types/
│   └── index.ts                    # AlertRule, AlertHistory, AlertStats
├── api/
│   └── alertsApi.ts                # CRUD regole + storico
├── hooks/
│   ├── useAlertRules.ts            # Gestione regole (CRUD + toggle)
│   ├── useAlertHistory.ts          # Storico paginato + stats
│   └── index.ts
├── components/
│   ├── AlertStatsCards.tsx         # Card stats overview
│   ├── AlertRulesTable.tsx         # Tabella regole con toggle
│   ├── AlertHistoryTable.tsx       # Tabella storico paginato
│   ├── AlertRuleForm.tsx           # Form modale crea/modifica
│   └── index.ts
├── pages/
│   ├── AlertsPage.tsx              # Pagina principale (2 tab)
│   └── index.ts
├── index.ts                        # Barrel export pubblico
└── README.md                       # Questo file
```

---

## 🔌 API Integration

**Base URL:** `http://localhost:4001` (log-service diretto)

### Endpoint utilizzati

| Metodo | Endpoint | Descrizione | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/alert/rules` | Lista regole | Pubblica |
| `GET` | `/api/alert/rules/:id` | Dettaglio regola | Pubblica |
| `POST` | `/api/alert/rules` | Crea regola | API Key |
| `PUT` | `/api/alert/rules/:id` | Modifica regola | API Key |
| `PATCH` | `/api/alert/rules/:id/toggle` | Toggle enabled | API Key |
| `DELETE` | `/api/alert/rules/:id` | Elimina regola | API Key |
| `GET` | `/api/alert/history` | Storico alert paginato | Pubblica |
| `GET` | `/api/alert/history/stats` | Statistiche aggregate | Pubblica |

**Protezione asimmetrica:**
- GET = pubblici (lettura senza API key)
- POST/PUT/PATCH/DELETE = protetti (richiede header `x-api-key`)

### Esempio Request/Response

**Crea regola:**
```typescript
// Request
POST /api/alert/rules
Headers: { "x-api-key": "..." }
{
  "name": "Errori critici auth-service",
  "description": "Alert immediato per errori CRITICAL dal servizio auth",
  "enabled": true,
  "conditions": {
    "categoria": "SYSTEM",
    "criticita": "critical",
    "origineId": "auth-service"
  },
  "threshold": {
    "count": 1,              // trigger immediato
    "windowMinutes": 0
  },
  "cooldownMinutes": 15
}

// Response 201
{
  "success": true,
  "data": {
    "_id": "65f8...",
    "name": "Errori critici auth-service",
    "enabled": true,
    "conditions": { ... },
    "threshold": { ... },
    "cooldownMinutes": 15,
    "lastTriggeredAt": null,
    "createdAt": "2026-02-17T12:00:00Z"
  }
}
```

**Toggle regola:**
```typescript
// Request
PATCH /api/alert/rules/65f8.../toggle
Headers: { "x-api-key": "..." }

// Response 200
{
  "success": true,
  "data": {
    "_id": "65f8...",
    "enabled": false,    // stato invertito
    // ... altri campi
  }
}
```

**Storico con filtri:**
```typescript
// Request
GET /api/alert/history?status=FAILED&startDate=2026-02-10&page=0&limit=20

// Response 200
{
  "success": true,
  "data": {
    "history": [
      {
        "_id": "65f9...",
        "ruleId": "65f8...",
        "ruleName": "Errori critici auth-service",
        "triggeringEvent": {
          "_id": "65fa...",
          "messaggio": "Database connection lost",
          "timestamp": "2026-02-17T11:30:00Z"
        },
        "sentTo": "system@edg.com",
        "status": "FAILED",
        "error": "Email service unreachable",
        "createdAt": "2026-02-17T11:30:05Z"
      }
    ],
    "pagination": {
      "total": 3,
      "page": 0,
      "limit": 20,
      "totalPages": 1
    }
  }
}
```

**Statistiche:**
```typescript
// Request
GET /api/alert/history/stats

// Response 200
{
  "success": true,
  "data": {
    "total": 127,
    "sent": 124,
    "failed": 3,
    "recentTotal": 8,       // ultimi 7gg
    "successRate": 97       // %
  }
}
```

---

## 📊 Data Models

```typescript
// Regola di alerting
interface AlertRule {
  _id:               string;
  name:              string;
  description?:      string;
  enabled:           boolean;
  conditions:        AlertConditions;
  threshold:         AlertThreshold;
  cooldownMinutes:   number;
  lastTriggeredAt?:  string;      // ISO timestamp
  createdAt:         string;
  updatedAt:         string;
}

// Condizioni matching evento
interface AlertConditions {
  categoria?:      EventCategory | null;    // null = qualsiasi
  sottoCategoria?: string | null;
  criticita?:      EventSeverity | null;
  esito?:          EsitoType | null;
  origineId?:      string | null;
}

// Soglia trigger
interface AlertThreshold {
  count:         number;      // es. 5 eventi
  windowMinutes: number;      // es. in 10 minuti
}
// count=1, windowMinutes=0 → trigger immediato

// Entry storico
interface AlertHistoryEntry {
  _id:              string;
  ruleId:           string;
  ruleName:         string;           // snapshot (regola può essere eliminata)
  triggeringEvent:  Partial<LogEvent>;
  sentTo:           string;           // email destinatario
  status:           'SENT' | 'FAILED';
  error?:           string;           // se FAILED
  createdAt:        string;
}

// Statistiche aggregate
interface AlertHistoryStats {
  total:       number;
  sent:        number;
  failed:      number;
  recentTotal: number;    // ultimi 7 giorni
  successRate: number;    // %
}

// Form data (valori vuoti come '' per compatibilità HTML)
interface AlertRuleFormData {
  name:        string;
  description: string;
  enabled:     boolean;
  conditions: {
    categoria:      EventCategory | '';
    sottoCategoria: string;
    criticita:      EventSeverity | '';
    esito:          EsitoType | '';
    origineId:      string;
  };
  threshold: {
    count:         number;
    windowMinutes: number;
  };
  cooldownMinutes: number;
}
```

---

## 🧩 Componenti

### `AlertStatsCards`
Card overview statistiche alerting.

**Props:**
```typescript
interface AlertStatsCardsProps {
  stats:    AlertHistoryStats | null;
  loading?: boolean;
}
```

**Card visualizzate:**
1. **Alert Totali** (icona Bell, colore sky)
2. **Inviati** (icona CheckCircle, colore emerald)
3. **Falliti** (icona XCircle, colore red se > 0, gray se = 0)
   - Subtitle: "Verificare email-service" se > 0
4. **Ultimi 7 giorni** (icona Clock, colore violet)
5. **Tasso Successo** (icona BarChart, colore dinamico)
   - Verde ≥90%, arancio ≥70%, rosso <70%

---

### `AlertRulesTable`
Tabella regole con toggle enable/disable in linea.

**Props:**
```typescript
interface AlertRulesTableProps {
  rules:       AlertRule[];
  loading?:    boolean;
  togglingId?: string | null;   // ID regola in corso di toggle
  onEdit:      (rule: AlertRule) => void;
  onDelete:    (rule: AlertRule) => void;
  onToggle:    (rule: AlertRule) => void;
}
```

**Colonne:**
- **Stato:** Toggle switch visuale (verde ON, grigio OFF)
- **Regola:** Nome + descrizione (truncata)
- **Condizioni:** Testo formattato (es. "CRITICAL in SYSTEM")
- **Soglia:** "5 eventi in 10 minuti" oppure "Immediato"
- **Cooldown:** "15 min" con icona Clock
- **Ultimo trigger:** Data/ora + icona AlertCircle (se mai scattata)
- **Azioni:** Bottoni Modifica (Pencil) + Elimina (Trash2)

**Comportamento toggle:**
- Click su switch → `onToggle()` chiamato
- Optimistic update: switch cambia immediatamente
- `togglingId` disabilita solo quello switch (non tutta la tabella)
- Rollback automatico se API fallisce

---

### `AlertHistoryTable`
Tabella storico alert paginata con filtri.

**Props:**
```typescript
interface AlertHistoryTableProps {
  history:    AlertHistoryEntry[];
  loading?:   boolean;
  pagination: {
    total:      number;
    page:       number;
    limit:      number;
    totalPages: number;
  };
  filters:    AlertHistoryFilters;
  onNextPage: () => void;
  onPrevPage: () => void;
  onFilters:  (filters: AlertHistoryFilters) => void;
}
```

**Filtri disponibili:**
- Stato (SENT / FAILED / Tutti)
- Data inizio (`<input type="date">`)
- Data fine (`<input type="date">`)
- Bottone "Reset filtri"

**Colonne:**
- Data (formato completo con secondi)
- Regola (nome della regola)
- Destinatario (icona Mail + email)
- Stato (badge colorato + icona CheckCircle/XCircle)
- Dettaglio (errore in rosso se FAILED, altrimenti "—")

---

### `AlertRuleForm`
Form modale per creazione/modifica regola.

**Props:**
```typescript
interface AlertRuleFormProps {
  rule?:     AlertRule | null;   // null = nuova, AlertRule = modifica
  onSubmit:  (data: AlertRuleFormData) => Promise<void>;
  onClose:   () => void;
  loading?:  boolean;
}
```

**Sezioni form:**

**1. Identificazione**
- Nome (required, max 100 chars)
- Descrizione (opzionale, max 300 chars)
- Toggle "Regola abilitata"

**2. Condizioni** (tutte opzionali, vuoto = qualsiasi)
- Select Categoria
- Select Criticità
- Select Esito
- Input Tipo evento (sottoCategoria)
- Input ID Origine

**3. Soglia e cooldown**
- Input Conteggio eventi (≥1)
- Input Finestra temporale (minuti, ≥0)
- Input Cooldown (minuti, ≥0)
- **Anteprima comportamento:** frase descrittiva dinamica

Esempio: "Alert inviato quando si verificano 5 eventi in 10 minuti. Successivi alert silenziati per 30 minuti."

**Validazione:**
- Nome obbligatorio
- Count ≥ 1
- Se count > 1 → windowMinutes deve essere > 0
- Cooldown ≥ 0

---

## 🎣 Hooks

### `useAlertRules()`

Gestione completa CRUD regole.

**Ritorna:**
```typescript
{
  rules:      AlertRule[];
  loading:    boolean;
  error:      string | null;
  total:      number;
  refetch:    () => Promise<void>;
  createRule: (data: AlertRuleFormData) => Promise<void>;
  updateRule: (id: string, data: AlertRuleFormData) => Promise<void>;
  toggleRule: (id: string) => Promise<void>;
  deleteRule: (id: string) => Promise<void>;
}
```

**Ottimizzazioni:**
- `toggleRule` → optimistic update + rollback su errore
- `createRule` → inserisce in testa (priorità alle più recenti)
- Tutti i metodi chiamano `refetch()` dopo successo

---

### `useAlertHistory(filters?: AlertHistoryFilters)`

Storico paginato + statistiche.

**Parametri:**
```typescript
filters?: {
  status?:    'SENT' | 'FAILED';
  startDate?: string;  // YYYY-MM-DD
  endDate?:   string;
}
```

**Ritorna:**
```typescript
{
  history:      AlertHistoryEntry[];
  stats:        AlertHistoryStats | null;
  loading:      boolean;
  statsLoading: boolean;   // loading separato per stats
  error:        string | null;
  pagination:   { total, page, limit, totalPages };
  nextPage:     () => void;
  prevPage:     () => void;
  setFilters:   (filters: AlertHistoryFilters) => void;
  refetch:      () => Promise<void>;
  refetchStats: () => Promise<void>;
}
```

**Comportamento:**
- Stats caricate separatamente (non bloccano lo storico)
- Cambio filtri resetta pagina a 0
- Limit fisso a 20 record per pagina

---

## 🗺 Routing & Permessi

**Route protetta:**
```tsx
<Route
  path="/sistema/alerts"
  element={
    <PrivateRoute requiredPermission="sistema.alerts">
      <AlertsPage />
    </PrivateRoute>
  }
/>
```

**Permesso richiesto:** `sistema.alerts` (solo utenti `root`)

**Navigation:**
- Menu: `Sistema → Alerts`
- Icon: `Bell`

---

## 💡 Usage Examples

### Creazione regola "Errori ripetuti"

```tsx
const AlertsPage = () => {
  const { createRule } = useAlertRules();
  const [formOpen, setFormOpen] = useState(false);

  const handleCreate = async (data: AlertRuleFormData) => {
    await createRule(data);
    setFormOpen(false);
    // Toast di conferma (no toast per UX pulita)
  };

  return (
    <>
      <Button onClick={() => setFormOpen(true)}>Nuova regola</Button>
      {formOpen && (
        <AlertRuleForm
          onSubmit={handleCreate}
          onClose={() => setFormOpen(false)}
        />
      )}
    </>
  );
};
```

### Toggle regola con feedback visivo

```tsx
const AlertRulesTable = ({ rules, onToggle }) => {
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggle = async (rule: AlertRule) => {
    setTogglingId(rule._id);
    try {
      await onToggle(rule);
      // Nessun toast → cambio stato è già visivo
    } catch (err) {
      toast.danger({ title: 'Errore nel toggle' });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <table>
      {rules.map(rule => (
        <tr key={rule._id}>
          <td>
            <ToggleSwitch
              enabled={rule.enabled}
              loading={togglingId === rule._id}
              onChange={() => handleToggle(rule)}
            />
          </td>
          {/* altre celle */}
        </tr>
      ))}
    </table>
  );
};
```

### Filtro alert falliti

```tsx
const FailedAlertsWidget = () => {
  const { history, loading } = useAlertHistory({ status: 'FAILED' });

  if (loading) return <Spinner />;
  if (history.length === 0) return <p>✓ Nessun alert fallito</p>;

  return (
    <Alert variant="danger">
      <p>{history.length} alert falliti. Verificare email-service.</p>
      <ul>
        {history.map(h => (
          <li key={h._id}>{h.ruleName}: {h.error}</li>
        ))}
      </ul>
    </Alert>
  );
};
```

---

## 🧪 Testing Notes

### Scenari di test

**Creazione regola:**
- ✅ Nome univoco → regola creata, appare in cima
- ❌ Nome duplicato → errore backend
- ✅ Valori default corretti (enabled=true)
- ❌ Count=0 → validazione frontend blocca submit

**Toggle regola:**
- ✅ Click switch → cambio visivo immediato
- ✅ API success → stato confermato
- ❌ API fail → rollback automatico allo stato precedente
- ✅ Nessun toast → UX pulita (cambio già visivo)

**Modifica regola:**
- ✅ Form pre-popolato con valori correnti
- ✅ Modifica nome → salvataggio ok
- ✅ Cambio condizioni → regola aggiornata

**Eliminazione regola:**
- ✅ Confirm dialog → "Eliminare la regola X? Lo storico verrà mantenuto."
- ✅ Storico alert precedenti rimane accessibile
- ✅ Regola rimossa dalla lista

**Storico:**
- ✅ Filtro status=FAILED → solo alert falliti
- ✅ Filtro date range → alert nel range
- ✅ Paginazione → corretto next/prev

**Form validazione:**
- ❌ Nome vuoto → errore
- ❌ Count > 1 con windowMinutes = 0 → errore specifico
- ✅ Anteprima comportamento aggiornata in tempo reale

---

## 🔮 Future Improvements

### Funzionalità
- [ ] **Template regole** — libreria regole comuni pronte all'uso
- [ ] **Multi-destinatari** — alert a più email/Slack/Teams
- [ ] **Escalation** — alert progressivi (dopo N minuti → email manager)
- [ ] **Smart cooldown** — cooldown adattivo basato su frequenza
- [ ] **Alert grouping** — raggruppa alert simili in digest
- [ ] **Test regola** — dry-run su log passati per vedere se triggera

### UX
- [ ] **Drag & drop priorità** — ordina regole per importanza
- [ ] **Duplicate regola** — crea copia veloce
- [ ] **Disabilita temporaneamente** — snooze 1h/24h/1w
- [ ] **Preview regex** — test condizioni in tempo reale

### Monitoring
- [ ] **Dashboard health** — grafici trend alert nel tempo
- [ ] **Alert per alert** — notifica se troppe regole scattano (loop?)
- [ ] **Performance metrics** — tempo medio valutazione regole

### Integrations
- [ ] **Slack/Teams webhook** — invio a canali oltre email
- [ ] **PagerDuty** — integrazione on-call
- [ ] **Jira/GitHub Issues** — crea ticket automatici

---

## 📝 Notes

- **Protezione API:** GET pubblici, POST/PUT/PATCH/DELETE richiedono API key
- **Cooldown:** impedisce spam di alert (es. 100 login falliti → 1 solo alert)
- **Threshold window:** finestra temporale sliding (non bucket fissi)
- **Snapshot ruleName:** storico mantiene nome anche se regola eliminata
- **Fire-and-forget:** valutazione regole non blocca creazione log
- **Email service:** chiamato dal backend, non dal frontend

---

**Autore:** Mormegil  
**Ultima modifica:** 2026-02-17  
**Versione modulo:** 2.0
