import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      external: ['node:*'],
    },
    optimizeDeps: {
      include: ['axios']
    }
  },
  server: {
    port: 3000,
  },
});