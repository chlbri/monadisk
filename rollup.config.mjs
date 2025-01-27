import { globSync } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'rollup';
import { circularDependencies } from 'rollup-plugin-circular-dependencies';
import { nodeExternals } from 'rollup-plugin-node-externals';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';
import typescript from 'rollup-plugin-typescript2';

const ignore = [
  '**/*.test.ts',
  '**/*.test-d.ts',
  './src/types.ts',
  '**/*.fixtures.ts',
  'src/config/**/*.ts',
  'src/fixtures/**/*.ts',
  'src/tests/**/*',
  'src/config/**/*',
];

const input = Object.fromEntries(
  globSync('src/**/*.ts', {
    ignore,
  }).map(file => [
    // This remove `src/` as well as the file extension from each
    // file, so e.g. src/nested/foo.js becomes nested/foo
    path.relative(
      'src',
      file.slice(0, file.length - path.extname(file).length),
    ),
    // This expands the relative paths to absolute paths, so e.g.
    // src/nested/foo becomes /project/src/nested/foo.js
    fileURLToPath(new URL(file, import.meta.url)),
  ]),
);

export default defineConfig({
  input,
  plugins: [
    tsConfigPaths(),
    typescript({ tsconfigOverride: { exclude: ignore } }),
    circularDependencies({
      exclude: [
        '**/types.ts',
        '**/type.ts',
        '**/*.types.ts',
        '**/*.type.ts',
      ],
    }),

    nodeExternals({
      optDeps: false,
      builtinsPrefix: 'strip',
    }),
  ],
  // external: ['vitest'],
  output: [
    {
      format: 'es',
      sourcemap: true,
      preserveModulesRoot: 'src',
      dir: `lib`,
      preserveModules: true,
      entryFileNames: '[name].js',
    },
    {
      format: 'cjs',
      sourcemap: true,
      preserveModulesRoot: 'src',
      dir: `lib`,
      preserveModules: true,
      entryFileNames: '[name].cjs',
    },
  ],
});
