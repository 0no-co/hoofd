import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  test: {
    globals: false,
    setupFiles: [],
    clearMocks: true,
    coverage: {
      provider: 'istanbul', // or 'c8'
    },
  },
});
