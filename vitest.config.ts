import { defineConfig } from 'vitest/config';

import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    coverage: {
      provider: 'v8',
      exclude: ['**/node_modules/**', '**/test/**'],
      include: ['src/**/*.ts'],
    },

    globals: true,
    clearMocks: true,
    passWithNoTests: true,
  },
});
