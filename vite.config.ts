import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    css: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
    },
    globals: true, // no need to import things like describe, it, expect
  },
});
