// src/pages/index.ts
// Barrel file ottimizzato per le pagine condivise
//
// ✅ BEST PRACTICE:
// - Usa solo named exports per componenti
// - Non usare `export type` per componenti React senza interfacce esplicite
// - Questo evita il caricamento forzato di tutti i moduli

export { default as Dashboard } from './Dashboard';
export { default as Explorer } from './Explorer';
export { default as NotFound } from './NotFound';

// 📝 NOTA: Se hai bisogno di tipizzare Props, esporta interfacce esplicite:
//
// In Dashboard.tsx:
// export interface DashboardProps { ... }
// export const Dashboard: React.FC<DashboardProps> = () => { ... }
//
// Qui nel barrel:
// export type { DashboardProps } from "./Dashboard";
