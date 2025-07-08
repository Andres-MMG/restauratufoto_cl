import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
  resolve: {
    alias: {
      '@': '/src',
      '@/features': '/src/features',
      '@/shared': '/src/shared',
      '@/lib': '/src/lib',
      '@/hooks': '/src/hooks',
      '@/types': '/src/shared/domain/types',
      '@/domain': '/src/shared/domain',
    },
  },
});
