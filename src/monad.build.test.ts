import { this1 } from '@bemedev/build-tests/constants';
import { t } from '@bemedev/types';
import { createTests } from '@bemedev/vitest-extended';
import { writeFile } from 'node:fs/promises';
import { PARSE_ERROR } from './constants';
import { useBuild } from './fixtures';
import { PRIMITIVE_MONAD } from './monad.constants';

useBuild();

type Fn1 = (typeof PRIMITIVE_MONAD)['safeParse'];
const func = t.unknown<Fn1>();

describe('#1 => PRIMITIVE_MONAD', () => {
  const { acceptation, success } = createTests.withImplementation(func, {
    name: 'safeParse',
    instanciation: async () => {
      const PRIME = await import(`${this1}`).then(
        ({ PRIMITIVE_MONAD }) => PRIMITIVE_MONAD,
      );
      return PRIME.safeParse.bind(PRIME);
    },
  });

  describe('#0 => Acceptation', acceptation);

  describe(
    '#1 => Success',
    success(
      {
        invite: 'string - real',
        parameters: 'real',
        expected: 'string',
      },
      { invite: 'number - 18', parameters: 18, expected: 'number' },
      {
        invite: 'boolean - false',
        parameters: false,
        expected: 'boolean',
      },
      {
        invite: 'boolean - true',
        parameters: true,
        expected: 'boolean',
      },
      { invite: 'number - 45', parameters: 45, expected: 'number' },
      {
        invite: 'bigint - 10n',
        parameters: 10n,
        expected: 'bigint',
      },
      {
        invite: 'symbol - Symbol()',
        parameters: Symbol(),
        expected: 'symbol',
      },
      {
        invite: 'undefined - undefined',
        expected: 'undefined',
      },
      {
        invite: 'function - () => {}',
        parameters: () => {},
        expected: 'function',
      },
      {
        invite: 'function - fs.write',
        parameters: writeFile,
        expected: 'function',
      },
      {
        invite: 'object - {}',
        parameters: {},
        expected: 'object',
      },
      {
        invite: 'date - new Date()',
        parameters: new Date(),
        expected: 'date',
      },
      {
        invite: 'null - null',
        parameters: [null],
        expected: 'null',
      },
    ),
  );
});

const toError = () => PARSE_ERROR;

describe('#2 => SN', () => {
  const { acceptation, success, fails } = createTests.withImplementation(
    func,
    {
      name: 'createMonadSN',
      instanciation: async () => {
        const createMonadSN = await import(`${this1}/monad.helpers`).then(
          ({ createMonadSN }) => createMonadSN,
        );
        const monad = createMonadSN('Lévi', 45, 'Charles');

        return monad.parse.bind(monad);
      },
    },
    toError,
  );

  describe('#0 => Acceptation', acceptation);

  describe(
    '#1 => Success',
    success(
      {
        invite: "'Lévi'",
        parameters: 'Lévi',
        expected: 'Lévi',
      },
      {
        invite: '45',
        parameters: 45,
        expected: 45,
      },
      {
        invite: "'Charles'",
        parameters: 'Charles',
        expected: 'Charles',
      },

      {
        invite: "'Charles'",
        parameters: 'Charles',
        expected: 'Charles',
      },
    ),
  );

  describe(
    '#2 => Errors',
    fails(
      {
        invite: 'boolean - true',
        parameters: true,
      },
      {
        invite: 'boolean - false',
        parameters: false,
      },
      {
        invite: 'null',
        parameters: [null],
      },
      {
        invite: 'undefined',
        parameters: [undefined],
      },
      {
        invite: 'number - 100',
        parameters: 100,
      },
      {
        invite: 'string - "test"',
        parameters: 'test',
      },
    ),
  );
});

describe('#3 => Other Primes', () => {
  const { acceptation, success, fails } = createTests.withImplementation(
    func,
    {
      name: 'createMonadSN',
      instanciation: async () => {
        const createPrimeMonad = await import(
          `${this1}/monad.helpers`
        ).then(({ createPrimeMonad }) => createPrimeMonad);
        const monad = createPrimeMonad(null, 'Lévi');

        return monad.parse.bind(monad);
      },
    },
    toError,
  );

  describe('#0 => Acceptation', acceptation);

  describe(
    '#1 => Success',
    success(
      {
        invite: 'null',
        parameters: [null],
        expected: 'null',
      },
      {
        invite: "String -> 'Lévi'",
        parameters: 'Lévi',
        expected: 'Lévi',
      },
    ),
  );

  describe(
    '#2 => Errors',
    fails(
      {
        invite: 'undefined',
        parameters: [undefined],
      },
      {
        invite: 'boolean - true',
        parameters: true,
      },
      {
        invite: 'boolean - false',
        parameters: false,
      },
      {
        invite: 'number - 45',
        parameters: 45,
      },
      {
        invite: 'string - "test"',
        parameters: 'test',
      },
      {
        invite: 'object - {}',
        parameters: {},
      },
      {
        invite: 'object - { key: "value" }',
        parameters: { key: 'value' },
      },
    ),
  );
});
