import { aliasTs } from '@bemedev/vitest-alias';
import { exclude } from '@bemedev/vitest-exclude';
import { defineConfig } from 'vitest/config';

import tsconfig from './tsconfig.json';

export default defineConfig({
  plugins: [
    aliasTs(tsconfig as any),
    exclude({
      ignoreCoverageFiles: ['**/index.ts', '**/types.ts', '**/*.types.ts'],
    }),
  ],

  test: {
    environment: 'node',
    passWithNoTests: true,
    bail: 10,
    maxConcurrency: 10,
    logHeapUsage: true,
    globals: true,
    coverage: {
      enabled: true,
      extension: 'ts',
      all: true,
      provider: 'v8',
    },
    typecheck: {
      enabled: true,
      ignoreSourceErrors: true,
    },
  },
});
