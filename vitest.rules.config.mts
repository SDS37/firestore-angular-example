import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['rules/**/*.spec.ts'],
    environment: 'node',
    fileParallelism: false,
    testTimeout: 20000,
    hookTimeout: 30000,
  },
});
