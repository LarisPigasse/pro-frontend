import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 1000,
    },
    // HMR: lascia che Vite usi l'host della richiesta automaticamente
    // Funzionerà sia con localhost:5173 che con pro.edg.local:5173
    hmr: true,
    // Consenti richieste da host e gateway
    allowedHosts: ['pro.edg.local', 'pro-frontend', 'localhost', '.localhost', 'api-gateway', 'host.docker.internal'],
    // Header utili in dev per evitare caching
    headers: {
      'Cache-Control': 'no-cache',
    },
    // Proxy per API - inoltra /auth all'API Gateway
    proxy: {
      '/auth': {
        target: 'http://api-gateway-1:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
  },

  preview: {
    port: 5173,
    strictPort: true,
  },
});
