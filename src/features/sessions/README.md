# Sessions Module

## 📋 Overview

Il modulo **Sessions** fornisce una dashboard completa per il monitoraggio e la gestione delle sessioni attive e degli utenti bloccati sulla piattaforma EDG. Accessibile esclusivamente agli utenti con ruolo `root`, permette di visualizzare tutte le sessioni autenticate, revocare accessi non autorizzati, bloccare/sbloccare utenti e tracciare informazioni dettagliate su dispositivi e geolocalizzazione.

**Responsabilità principali:**
- Visualizzazione sessioni attive con auto-refresh (30 secondi)
- Device detection (OS, browser, tipo dispositivo)
- Geolocalizzazione IP con cache
- Revoca sessioni individuali
- Blocco/sblocco utenti con durata e motivo
- Gestione utenti bloccati (anche senza sessioni attive)
- Identificazione sessione corrente tramite accountId

---

## 🏗 Architettura

**Pattern:** Type-First (types → api → hooks → components → pages)
```
types → api → hooks (stato locale React) → components → pages
```

**Stato:**
- **Locale React hooks** (NO Redux per dati sessioni)
- **Redux** per `accountId` utente loggato (identificazione sessione corrente)
- Auto-refresh ogni 30 secondi tramite `setInterval`
- Gestione dual-table: sessioni attive + utenti bloccati

**Dipendenze esterne:**
- Backend: `auth-service` porta 3001 via API Gateway porta 8080
- Database: MySQL `edg_auth` con tabelle `sessions`, `accounts`
- Librerie: `ua-parser-js` (device detection), `node-fetch` (geolocation)

---

## 📂 Struttura File

```
features/sessions/
├── types/
│   └── index.ts                    # Session, BlockedUser, BlockUserRequest, ecc.
├── api/
│   └── sessionsApi.ts              # Chiamate API auth-service via gateway
├── hooks/
│   └── useSessions.ts              # Gestione stato sessions + auto-refresh
├── components/
│   └── index.ts
├── pages/
│   ├── SessionsPage.tsx            # Pagina principale dual-table layout
│   ├── components/
│   │   ├── SessionsTable.tsx       # Tabella sessioni attive
│   │   ├── BlockedUsersTable.tsx   # Tabella utenti bloccati
│   │   ├── BlockUserModal.tsx      # Modal blocco utente
│   │   ├── UnblockConfirmModal.tsx # Modal conferma sblocco
│   │   └── index.ts
│   └── index.ts
├── index.ts                        # Barrel export pubblico
└── README.md                       # Questo file
```

---

## 🔌 API Integration

**Base URL:** `http://localhost:8080/auth` (API Gateway → auth-service)

### Endpoint utilizzati

| Metodo | Endpoint | Descrizione | Permesso |
|--------|----------|-------------|----------|
| `GET` | `/sessions` | Lista sessioni attive | `sistema.sessions` |
| `GET` | `/blocked-users` | Lista utenti bloccati | `sistema.sessions` |
| `DELETE` | `/sessions/:sessionId` | Revoca sessione specifica | `sistema.sessions` |
| `POST` | `/users/:userId/block` | Blocca utente (+ revoca sessioni) | `sistema.sessions` |
| `DELETE` | `/users/:userId/unblock` | Sblocca utente | `sistema.sessions` |

### Headers richiesti

```typescript
{
  'Authorization': 'Bearer {accessToken}',
  'Content-Type': 'application/json',
  'x-gateway-secret': '{GATEWAY_SECRET}',    // Iniettato dal gateway
  'x-user-data': '{userData}',               // Iniettato dal gateway
  'x-forwarded-for': '{clientIP}',           // IP reale client
  'x-real-ip': '{clientIP}'                  // IP reale client
}
```

### Esempio Request/Response

**Lista sessioni attive:**
```typescript
// Request
GET /auth/sessions
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Response 200
{
  "success": true,
  "data": [
    {
      "id": 60,
      "user": {
        "id": 1,
        "email": "admin@example.com",
        "role": "root"
      },
      "device": {
        "ip": "85.43.43.97",
        "device": "Desktop",
        "os": "Windows 10/11",
        "browser": "Chrome 120.0"
      },
      "geo": {
        "country": "Italy",
        "region": "Abruzzo",
        "city": "Pescara",
        "timezone": "Europe/Rome"
      },
      "createdAt": "2026-02-24T10:30:00.000Z",
      "lastActivityAt": "2026-02-24T11:45:23.000Z",
      "expiresAt": "2026-03-03T10:30:00.000Z"
    }
  ],
  "total": 3
}
```

**Blocca utente:**
```typescript
// Request
POST /auth/users/2/block
Content-Type: application/json

{
  "duration": "24h",           // '1h' | '24h' | '7d' | 'permanent'
  "reason": "Violazione policy aziendale"
}

// Response 200
{
  "success": true,
  "message": "Utente bloccato fino a 2026-02-25T12:00:00.000Z"
}
```

**Lista utenti bloccati:**
```typescript
// Request
GET /auth/blocked-users

// Response 200
{
  "success": true,
  "data": [
    {
      "id": 2,
      "email": "demo@expressdeliverygroup.com",
      "role": "admin",
      "blockedUntil": "2026-02-25T12:00:00.000Z",
      "blockReason": "Violazione policy aziendale",
      "blockedAt": "2026-02-24T12:00:00.000Z"
    }
  ],
  "total": 1
}
```

---

## 📊 Data Models

```typescript
// Sessione attiva
interface Session {
  id:             number;
  user: {
    id:           number;
    email:        string;
    role:         string;
  };
  device: {
    ip:           string;
    device:       string | null;  // 'Desktop' | 'Mobile' | 'Tablet'
    os:           string | null;  // 'Windows 10/11' | 'iOS 17.2' | ecc.
    browser:      string | null;  // 'Chrome 120.0' | 'Safari 17.1' | ecc.
  };
  geo: {
    country:      string | null;
    region:       string | null;
    city:         string | null;
    timezone:     string | null;
  };
  createdAt:      string;         // ISO 8601
  lastActivityAt: string;         // ISO 8601
  expiresAt:      string;         // ISO 8601
}

// Utente bloccato
interface BlockedUser {
  id:            number;
  email:         string;
  role:          string;
  blockedUntil:  string | null;   // ISO 8601 o null se permanente
  blockReason:   string | null;
  blockedAt:     string;          // ISO 8601
}

// Durata blocco
type BlockDuration = '1h' | '24h' | '7d' | 'permanent';

// Request blocco utente
interface BlockUserRequest {
  duration: BlockDuration;
  reason:   string;
}

// Response paginata sessioni
interface SessionsResponse {
  success: boolean;
  data:    Session[];
  total:   number;
}

// Response utenti bloccati
interface BlockedUsersResponse {
  success: boolean;
  data:    BlockedUser[];
  total:   number;
}

// Response generica azioni
interface ActionResponse {
  success: boolean;
  message: string;
}
```

---

## 🧩 Componenti

### `SessionsPage`
Pagina principale con dual-table layout e auto-refresh.

**Features:**
- Header con bottone refresh manuale + indicatore auto-refresh
- Alert errori con variant `danger`
- Dual-section layout: "Sessioni Attive" + "Utenti Bloccati"
- Gestione modals (BlockUserModal, UnblockConfirmModal)
- Loading state con Spinner

**Struttura:**
```tsx
<div>
  <Header>
    <h1>Sessioni Attive</h1>
    <Button onClick={refresh}>Aggiorna</Button>
    <span>Auto-refresh: 30s</span>
  </Header>

  {error && <Alert variant="danger">{error}</Alert>}

  <section>
    <h2>Sessioni Attive</h2>
    <SessionsTable ... />
  </section>

  <section>
    <h2>Utenti Bloccati</h2>
    <BlockedUsersTable ... />
  </section>

  <BlockUserModal ... />
  <UnblockConfirmModal ... />
</div>
```

---

### `SessionsTable`
Tabella responsive sessioni attive con badge "Current".

**Props:**
```typescript
interface SessionsTableProps {
  sessions:        Session[];
  currentSessionId: number | null;
  onRevokeSession: (sessionId: number) => void;
  onBlockUser:     (userId: number) => void;
  onUnblockUser:   (userId: number) => void;
  actionLoading:   boolean;
}
```

**Colonne:**
- **Utente:** Email + ruolo + badge "Current" (bg-blue-50)
- **Dispositivo:** Icona (Monitor/Smartphone/Tablet) + OS + browser + IP
  - IP interni: "Docker bridge: 172.21.0.1"
- **Posizione:** Città, Regione, Paese
  - IP localhost: "Localhost (development)"
- **Ultima Attività:** "5 min fa", "2h fa", "3g fa" (passato)
- **Scadenza:** "Tra 6g", "03 mar 2026, 10:30" (futuro)
- **Azioni:** 
  - Bottone Revoke (🗑️ Trash2) - nascosto per sessione corrente
  - Bottone Block (🚫 Ban) - solo per utenti non-root

**Logica sessione corrente:**
- Filtra sessioni per `accountId` utente loggato (da Redux)
- Ordina per `lastActivityAt` DESC
- Prima sessione = corrente

**Empty state:**
- Icona Monitor
- "Nessuna sessione attiva"

---

### `BlockedUsersTable`
Tabella utenti bloccati (anche senza sessioni attive).

**Props:**
```typescript
interface BlockedUsersTableProps {
  blockedUsers:  BlockedUser[];
  onUnblockUser: (userId: number) => void;
  actionLoading: boolean;
}
```

**Colonne:**
- **Utente:** Email + ruolo (icona 🚫 Ban)
- **Motivo Blocco:** Testo completo (max-w-xs)
- **Bloccato Da:** Data formattata "24 feb 2026, 12:00"
- **Scadenza:** 
  - "Permanente" (rosso 🚫)
  - "Scaduto" (arancione ⏰)
  - "25 feb 2026, 12:00" (grigio ⏰)
- **Azioni:** Bottone Unblock (✅ CheckCircle verde)

**Empty state:**
- Icona CheckCircle verde
- "Nessun utente bloccato"
- "Tutti gli utenti hanno accesso al sistema."

---

### `BlockUserModal`
Modal per blocco utente con form durata + motivo.

**Props:**
```typescript
interface BlockUserModalProps {
  isOpen:    boolean;
  onClose:   () => void;
  onConfirm: (blockData: BlockUserRequest) => Promise<void>;
  loading:   boolean;
  error:     string | null;
}
```

**Form fields:**
- **Select "Durata blocco":** 1 ora / 24 ore / 7 giorni / Permanente
- **TextArea "Motivo del blocco":** Required, 4-8 righe auto-resize
  - Helper text: "Il motivo verrà registrato e sarà visibile nei log di sistema."

**Alert warning:**
> "Bloccando questo utente, tutte le sue sessioni attive verranno revocate immediatamente e non potrà più accedere fino allo sblocco."

**Buttons:**
- Annulla (ghost)
- Blocca Utente (danger, icona Ban)

---

### `UnblockConfirmModal`
Modal conferma sblocco utente (ConfirmModal component).

**Props:**
```typescript
interface UnblockConfirmModalProps {
  isOpen:    boolean;
  onClose:   () => void;
  onConfirm: () => Promise<void>;
  loading:   boolean;
}
```

**Config:**
- Variant: `success` (icona CheckCircle verde automatica)
- Title: "Sblocca Utente"
- Message: "Sei sicuro di voler sbloccare questo utente? Potrà accedere nuovamente al sistema."
- Confirm button: "Sblocca"
- Loading text: "Sblocco in corso..."

---

## 🎣 Hooks

### `useSessions()`

Hook principale per gestione sessioni + utenti bloccati con auto-refresh.

**Ritorna:**
```typescript
{
  sessions:           Session[];
  blockedUsers:       BlockedUser[];
  loading:            boolean;
  error:              string | null;
  refreshSessions:    () => Promise<void>;
  handleRevokeSession: (sessionId: number) => Promise<void>;
  handleBlockUser:    (userId: number, blockData: BlockUserRequest) => Promise<void>;
  handleUnblockUser:  (userId: number) => Promise<void>;
  currentSessionId:   number | null;
}
```

**Comportamento:**
- **Auto-refresh:** `setInterval` 30 secondi, cleanup on unmount
- **Dual fetch:** Carica sessions + blockedUsers in parallelo
- **Current session detection:**
  1. Ottiene `accountId` da Redux (`selectAccount`)
  2. Filtra sessioni per `user.id === currentAccountId`
  3. Ordina per `lastActivityAt` DESC
  4. Prima sessione = corrente
- **Error handling:** Cattura errori e popola `error` state
- **Loading states:** `loading` per fetch iniziale, gestione separata per azioni

**Esempio utilizzo:**
```tsx
const SessionsPage = () => {
  const {
    sessions,
    blockedUsers,
    loading,
    error,
    refreshSessions,
    handleRevokeSession,
    handleBlockUser,
    handleUnblockUser,
    currentSessionId,
  } = useSessions();

  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  return (
    <div>
      <SessionsTable
        sessions={sessions}
        currentSessionId={currentSessionId}
        onRevokeSession={handleRevokeSession}
        onBlockUser={(userId) => {
          setSelectedUserId(userId);
          setBlockModalOpen(true);
        }}
      />
      <BlockedUsersTable
        blockedUsers={blockedUsers}
        onUnblockUser={handleUnblockUser}
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
  path="/sistema/sessions"
  element={
    <PrivateRoute requiredPermission="sistema.sessions">
      <SessionsPage />
    </PrivateRoute>
  }
/>
```

**Permesso richiesto:** `sistema.sessions` (solo utenti `root`)

**Navigation:**
- Menu: `Sistema → Sessioni`
- Icon: `Settings`

---

## 💡 Usage Examples

### Multi-sessione stesso utente

```tsx
// L'utente root ha 2 sessioni aperte:
// - PC ufficio (Chrome Windows)
// - Laptop casa (Safari macOS)

// Entrambe visibili in tabella, ma solo una ha badge "Current"
sessions = [
  { id: 60, user: { id: 1 }, device: { os: 'Windows 10/11' } },  // ← Current
  { id: 59, user: { id: 1 }, device: { os: 'macOS 14.2' } }
];
```

### Revoca sessione sospetta

```tsx
// Vedo una sessione dal Brasile che non riconosco
const suspiciousSession = sessions.find(s => s.geo.country === 'Brazil');

// Revoco la sessione
await handleRevokeSession(suspiciousSession.id);

// La sessione viene eliminata e l'utente disconnesso
```

### Blocco utente con cleanup automatico

```tsx
// Blocco utente per 24 ore
await handleBlockUser(demoUserId, {
  duration: '24h',
  reason: 'Tentativi login sospetti',
});

// Backend automaticamente:
// 1. Setta account.isActive = false
// 2. Setta account.blockedUntil = now + 24h
// 3. Setta account.blockReason = "Tentativi login sospetti"
// 4. Revoca TUTTE le sessioni attive (UPDATE sessions SET isRevoked = true)
```

### Identificazione sessione corrente

```tsx
// Hook usa Redux per accountId
const account = useSelector(selectAccount);
const currentAccountId = account?.id;  // es. 1

// Filtra sessioni utente corrente
const userSessions = sessions.filter(s => s.user.id === currentAccountId);

// Ordina per lastActivityAt DESC
const sorted = userSessions.sort((a, b) => 
  new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
);

// Prima = sessione corrente
const currentSessionId = sorted[0]?.id;
```

---

## 🧪 Testing Notes

### Scenari di test

**Sessioni:**
- ✅ Badge "Current" appare solo sulla sessione dell'utente loggato
- ✅ Auto-refresh ogni 30s aggiorna dati senza flickering
- ✅ Bottone "Aggiorna" forza refresh immediato
- ✅ Revoca sessione non-current funziona correttamente
- ✅ Impossibile revocare sessione corrente (bottone nascosto)

**Device Detection:**
- ✅ Windows 10/11 mostrato correttamente (workaround User-Agent)
- ✅ Icone dispositivo corrette: Monitor/Smartphone/Tablet
- ✅ IP localhost mostra "Docker bridge: 172.21.0.1"
- ✅ IP pubblici mostrano città/regione/paese

**Blocco/Sblocco:**
- ✅ Blocco utente revoca tutte le sessioni attive
- ✅ Utente bloccato appare in tabella "Utenti Bloccati"
- ✅ Utente bloccato NON può fare login
- ✅ Sblocco utente rimuove da tabella bloccati
- ✅ Utente sbloccato può fare login di nuovo
- ✅ Scadenza blocco formattata correttamente ("Tra 23h", "Permanente")

**Formatting:**
- ✅ Ultima attività: "5 min fa", "2h fa", "3g fa"
- ✅ Scadenza: "Tra 6g", "03 mar 2026, 10:30"
- ✅ Posizione: "Pescara, Abruzzo, Italy" o "Localhost (development)"

**Edge Cases:**
- ✅ Nessuna sessione attiva → Empty state con icona Monitor
- ✅ Nessun utente bloccato → Empty state con CheckCircle verde
- ✅ Errore API → Alert danger con messaggio errore
- ✅ Loading state → Spinner centralizzato

---

## 🔮 Future Improvements

### Funzionalità
- [ ] **Session history** — cronologia sessioni passate (ultimo mese)
- [ ] **IP whitelist** — lista IP fidati che bypassano geolocation
- [ ] **Auto-block rules** — blocco automatico dopo N tentativi falliti
- [ ] **Notification system** — notifica utente quando sessione revocata
- [ ] **Session details** — modale con tutti i metadata (headers, ecc.)
- [ ] **Export sessions** — CSV/JSON esportazione sessioni

### UX
- [ ] **Search/Filter** — ricerca per email/IP/città
- [ ] **Sorting columns** — ordinamento client-side per colonna
- [ ] **Session map** — mappa geografica sessioni attive
- [ ] **Device icons** — icone specifiche (Windows/Mac/Android/iOS)
- [ ] **Activity timeline** — grafico attività ultime 24h

### Security
- [ ] **Suspicious IP detection** — flag IP da paesi non usuali
- [ ] **Concurrent sessions limit** — max N sessioni per utente
- [ ] **Session fingerprinting** — detect device change mid-session
- [ ] **Force password change** — richiedi cambio password dopo sblocco
- [ ] **2FA enforcement** — blocco se 2FA non abilitato

### Performance
- [ ] **Virtual scrolling** — react-window per migliaia di sessioni
- [ ] **Pagination** — server-side se sessioni > 100
- [ ] **WebSocket** — real-time updates invece di polling
- [ ] **Query cache** — React Query per cache intelligente

### DevOps
- [ ] **Session analytics** — dashboard statistiche (avg duration, peak hours)
- [ ] **Geo-IP database** — database locale invece di API esterna
- [ ] **Cleanup job** — auto-revoca sessioni inattive > 7gg
- [ ] **Audit log** — log tutte le azioni admin (revoca, blocco, ecc.)

---

## 📝 Notes

### Architettura Backend

**Device Detection:**
- Libreria: `ua-parser-js@1.0.39`
- Windows 11 detection: User-Agent identico a Windows 10 → mostra "Windows 10/11"
- Fields estratti: `device.type`, `os.name`, `os.version`, `browser.name`, `browser.version`

**Geolocalizzazione:**
- API: `https://ipapi.co/{ip}/json/`
- Cache: 24 ore in-memory per ridurre API calls
- Fallback: Se API fallisce, salva `null` nei campi geo
- Development: IP interni (172.x, 127.x) non geolocalizzabili

**Session Management:**
- Ogni login crea NUOVA sessione (multi-device support)
- Sessioni scadono dopo `JWT_REFRESH_EXPIRY` (default: 7d)
- Chiudere browser NON revoca sessione (rimane attiva)
- `lastActivityAt` aggiornato ad ogni refresh token

**Blocco Utente:**
- Setta `account.isActive = false`
- Setta `account.blockedUntil` (NULL se permanente)
- Revoca TUTTE le sessioni attive in transazione atomica
- Previene login futuri fino a sblocco manuale

### Architettura Frontend

**State Management:**
- Sessions/BlockedUsers: React hooks locali (feature isolata)
- Current accountId: Redux (`selectAccount` da authSlice)
- Auto-refresh: `setInterval` con cleanup on unmount

**IP Display:**
- IP interni (172.x, 127.x, ::1): "Docker bridge: {ip}"
- IP pubblici: Mostra IP nudo
- Posizione localhost: "Localhost (development)"

**Date Formatting:**
- Passato (`lastActivityAt`): `formatRelativeTime()` → "5 min fa"
- Futuro (`expiresAt`): `formatExpiryTime()` → "Tra 6g"
- Assoluto (`blockedAt`): `toLocaleDateString('it-IT')`

**Performance:**
- Auto-refresh: Solo se pagina visibile (future: `document.hidden` check)
- Dual fetch parallelo: `Promise.all([sessions, blockedUsers])`
- Component re-render: Minimizzato con memoization (future)

### Security Considerations

**Gateway Protection:**
- Tutti gli endpoint richiedono `x-gateway-secret` header
- Token JWT validato prima di inoltrare a auth-service
- User data iniettato in `x-user-data` header (trusted)

**Permission Enforcement:**
- Frontend: `PrivateRoute` con `requiredPermission='sistema.sessions'`
- Backend: Middleware `requireRoot()` su tutti gli endpoint admin
- Prevenzione: Utenti non-root ricevono 403 Forbidden

**Rate Limiting:**
- Auto-refresh: Max 1 richiesta ogni 30s (2/min)
- Manual refresh: No rate limit lato frontend (backend protetto)

**Data Privacy:**
- IP addresses visibili solo a root
- Geolocation approssimativa (città, non indirizzo esatto)
- User-Agent completo NON mostrato (solo device/OS/browser)

---

**Autore:** Mormegil  
**Ultima modifica:** 2026-02-25  
**Versione modulo:** 1.0
