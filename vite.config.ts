import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor split: framework + heavy third-party libs into their own chunks
          // so route-level chunks stay small and the framework chunk hits cache.
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'radix-ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
          ],
          'photoswipe': ['photoswipe'],
          'lucide': ['lucide-react'],
          'zod': ['zod'],
        },
        // Predictable chunk file names for cache + perf-budget script
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    // Warn if any single chunk exceeds budget
    chunkSizeWarningLimit: 250,
  },
});
