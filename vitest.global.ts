import { addTarball, cleanup } from '@bemedev/build-tests';
import sh from 'shelljs';
import { isExtension } from './src/fixtures.constants';
import { env } from './vitest.env';

export const setup = async () => {
  if (!isExtension) {
    if (env.onlySetup) {
      sh.exec('pnpm run build');
      await addTarball();
    }

    env.onlySetup = false;
  }
};

export const teardown = () => {
  if (!isExtension) {
    if (env.onlyTeardown) cleanup();
    env.onlyTeardown = false;
  }
};
