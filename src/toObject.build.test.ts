import { t } from '@bemedev/types';
import { createTests } from '@bemedev/vitest-extended';
import {
  buildToObject,
  monad1,
  monad11,
  monad20,
  monad21,
  useBuild,
} from './fixtures';
import type { Monad } from './monad';

useBuild();

describe('toObject', () => {
  type Fn1 = (arg: Monad<any>) => number;
  const func = t.anify<Fn1>();

  const { acceptation, success } = createTests.withImplementation(func, {
    name: 'toObject',
    instanciation: async () => {
      const toObject = await buildToObject();

      const out = (arg: Monad) => {
        const raw = arg.rawCheckers;
        const object = toObject(...raw);
        return Object.keys(object).length;
      };

      return out;
    },
  });

  describe('#0 => Acceptation', acceptation);

  describe(
    '#1 => Success',
    success(
      {
        invite: 'monad1',
        parameters: monad1,
        expected: 3,
      },
      {
        invite: 'monad11',
        parameters: monad11,
        expected: 4,
      },
      {
        invite: 'monad20',
        parameters: monad20,
        expected: 48,
      },
      {
        invite: 'monad21',
        parameters: monad21,
        expected: 9,
      },
    ),
  );
});
