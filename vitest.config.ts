import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // test against the workspace sources rather than the built packages
    alias: {
      '@jexop/core': fileURLToPath(
        new URL('./packages/@jexop/core/src/index.ts', import.meta.url),
      ),
    },
  },
  test: {
    include: ['packages/**/src/**/*.test.ts'],
  },
});
