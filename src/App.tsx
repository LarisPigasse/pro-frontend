// src/App.tsx
import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import { initializeFromStorage } from './app/slices';
import MainLayout from './core/components/layout/custom/MainLayout';
import { UserMenu, MobileMenu } from './core/components/navigation';
import { ROUTES } from './config';
import { ToastProvider, ErrorBoundary } from './core/components/feedback';

// ✅ EAGER LOADING - Pagina principale, caricata subito
import { Dashboard } from './pages';

// ✅ LAZY LOADING - Pagine secondarie, caricate on-demand
// Explorer: caricato solo quando l'utente naviga su /explorer
// NotFound: caricato solo quando serve (404)
const Explorer = lazy(() => import('./pages/Explorer'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Componente per inizializzazione completa del tema e settings
const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Inizializza l'app con le impostazioni salvate
    // Lo store è già caricato con i dati del localStorage tramite createInitialState
    // Dobbiamo solo applicare il tema al DOM
    store.dispatch(initializeFromStorage());
  }, []);

  return <>{children}</>;
};

/**
 * Loading Fallback Component
 * Mostrato durante il caricamento lazy delle pagine
 */
const PageLoadingFallback: React.FC = () => (
  <div className='flex items-center justify-center min-h-[60vh]'>
    <div className='text-center space-y-4'>
      {/* Spinner */}
      <div className='inline-flex items-center justify-center'>
        <div className='w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin' />
      </div>
      {/* Loading text */}
      <p className='text-text-secondary text-sm'>Caricamento pagina...</p>
    </div>
  </div>
);

/**
 * Callback per logging errori (opzionale)
 * Può essere esteso per inviare errori a servizi di monitoring
 */
const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
  // In produzione, qui potresti inviare l'errore a un servizio di monitoring
  // es: Sentry, LogRocket, DataDog, ecc.
  console.error('Application error:', error.message);

  // Esempio di integrazione con servizio esterno:
  // if (process.env.NODE_ENV === 'production') {
  //   errorTrackingService.captureException(error, { extra: errorInfo });
  // }
};

const App: React.FC = () => {
  return (
    <ErrorBoundary onError={handleError}>
      <ToastProvider>
        <Provider store={store}>
          <AppInitializer>
            <Router>
              <div className='App'>
                {/* Layout principale con routing */}
                <MainLayout>
                  {/* Suspense wrapper per lazy loaded routes */}
                  <Suspense fallback={<PageLoadingFallback />}>
                    <Routes>
                      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.HOME} replace />} />

                      {/* ✅ Dashboard: Eager loading (caricata subito) */}
                      <Route path={ROUTES.HOME} element={<Dashboard />} />

                      {/* ✅ Explorer: Lazy loading (caricata solo quando necessario) */}
                      <Route path={ROUTES.EXPLORER} element={<Explorer />} />

                      {/* ✅ Settings: Placeholder NotFound (lazy) */}
                      <Route path={ROUTES.SETTINGS} element={<NotFound />} />

                      {/* ✅ 404: Lazy loading */}
                      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
                      <Route path='*' element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </MainLayout>

                {/* Menu components - renderizzati al root level per z-index corretto */}
                <UserMenu />
                <MobileMenu />
              </div>
            </Router>
          </AppInitializer>
        </Provider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
