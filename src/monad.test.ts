import { createTests } from '@bemedev/vitest-extended';
import { writeFile } from 'node:fs/promises';
import { PARSE_ERROR } from './constants';
import {
  monad1,
  monad11,
  monad2,
  monad20,
  monad20Keys,
  monad21,
  monad21Keys,
  monad3,
  monad5,
  monad6,
  monad7,
  monad8,
} from './fixtures';
import { PRIMITIVE_MONAD } from './monad.constants';
import { createMonadSN, createPrimeMonad } from './monad.helpers';
import { AND_LITERAL, OR_LITERAL } from './types';

describe('#1 => Acceptation', () => {
  test('#1 => Monad1 exist', () => {
    expect(monad1).toBeDefined();
  });

  describe('#2 => All functions exists', () => {
    describe(
      '#1 => string',
      createTests(monad1.checkers.string).acceptation,
    );
    describe(
      '#2 => number',
      createTests(monad8.checkers.number).acceptation,
    );
    describe('#1 => 45', createTests(monad3.checkers[45]).acceptation);
  });
});

describe('#2 => Checkers', () => {
  describe('#1 => String', () => {
    const { success } = createTests(monad2.checkers.string.bind(monad2));

    success(
      { invite: 'Real string', parameters: 'real', expected: true },
      { invite: 'number', parameters: 18, expected: false },
      { invite: 'boolean - false', parameters: false, expected: false },
      { invite: 'boolean - true', parameters: true, expected: false },
    )();
  });

  describe('#2 => number', () => {
    const { success } = createTests(monad3.checkers.number.bind(monad3));

    success(
      { invite: 'Real string', parameters: 'real', expected: false },
      { invite: 'number', parameters: 18, expected: true },
      { invite: 'boolean - false', parameters: false, expected: false },
      { invite: 'boolean - true', parameters: true, expected: false },
    )();
  });

  describe('#3 => 45', () => {
    const { success } = createTests(monad7.checkers[45].bind(monad7));

    success(
      { invite: 'Real string', parameters: 'real', expected: false },
      { invite: 'number', parameters: 18, expected: false },
      { invite: 'number - 45', parameters: 45, expected: true },
      { invite: 'boolean - false', parameters: false, expected: false },
      { invite: 'boolean - true', parameters: true, expected: false },
    )();
  });
});

describe('#3 => Merge', () => {
  describe('#1 => And', () => {
    const checkers = monad5.checkers;
    const entries = Object.entries(checkers);
    const _actual = 'exist';

    entries.forEach(([key, func], index) => {
      const expected = key === `string${AND_LITERAL}exist`;

      test(`#${index} => ${key}`, () => {
        const actual = func(_actual);
        expect(actual).toBe(expected);
      });
    });
  });

  describe('#2 => Or', () => {
    const checkers = monad6.checkers;
    const entries = Object.entries(checkers);
    const _actual = 'exist';

    entries.forEach(([key, func], index) => {
      const expected = !(
        key === `45${OR_LITERAL}boolean` ||
        key === `number${OR_LITERAL}boolean`
      );

      test(`#${index} => ${key}`, () => {
        const actual = func(_actual);
        expect(actual).toBe(expected);
      });
    });
  });
});

describe('#4 => Miscellaneous', () => {
  describe('#1 => Order', () => {
    test('#1 => monad1', () => {
      const order = monad1.order;

      const order2 = monad1.rawCheckers.map(([key]) => key);
      expect(order).toStrictEqual(['string', 'number', 45]);
      expect(order).toStrictEqual(order2);
    });

    test('#2 => monad11', () => {
      const order = monad11.order;

      expect(order).toStrictEqual([45, 'string', 'number', 'date']);
    });

    test('#3 => monad20', () => {
      const order = monad20.order;

      expect(order).toStrictEqual(monad20Keys);
    });

    test('#3 => monad21', () => {
      const order = monad21.order;

      expect(order).toStrictEqual(monad21Keys);
    });
  });
});

describe('#5 => PRIMITIVE_MONAD', () => {
  const { acceptation, success } = createTests(
    PRIMITIVE_MONAD.safeParse.bind(PRIMITIVE_MONAD),
  );

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

describe('#6 => SN', () => {
  describe(`#1 => Case : ['Lévi', 45, 'Charles']`, () => {
    const monad = createMonadSN('Lévi', 45, 'Charles');
    const func = monad.parse.bind(monad);

    const { acceptation, success, fails } = createTests(func, toError);

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

  describe(`#2 => Case : [56, 100]`, () => {
    const monad = createMonadSN(56, 100);
    const func = monad.parse.bind(monad);

    const { acceptation, success, fails } = createTests(
      func,
      () => PARSE_ERROR,
    );

    describe('#0 => Acceptation', acceptation);

    describe(
      '#1 => Success',
      success(
        {
          invite: '56',
          parameters: 56,
          expected: 56,
        },
        {
          invite: '100',
          parameters: 100,
          expected: 100,
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
          invite: 'string - "test"',
          parameters: 'test',
        },
        {
          invite: 'number - 200',
          parameters: 200,
        },
      ),
    );
  });

  describe(`#3 => Case : ['Charles', 'Lévi']`, () => {
    const monad = createMonadSN('Charles', 'Lévi');
    const func = monad.parse.bind(monad);

    const { acceptation, success, fails } = createTests(
      func,
      () => PARSE_ERROR,
    );

    describe('#0 => Acceptation', acceptation);

    describe(
      '#1 => Success',
      success(
        {
          invite: "'Charles'",
          parameters: 'Charles',
          expected: 'Charles',
        },
        {
          invite: "'Lévi'",
          parameters: 'Lévi',
          expected: 'Lévi',
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
          invite: 'number - 45',
          parameters: 45,
        },
        {
          invite: 'string - "test"',
          parameters: 'test',
        },
      ),
    );
  });
});

describe('#7 => Other Primes', () => {
  describe('#1 => Null', () => {
    const monad = createPrimeMonad(null, 'Lévi');

    const { acceptation, success, fails } = createTests(
      monad.parse.bind(monad),
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

  describe('#2 => undefined', () => {
    const monad = createPrimeMonad(undefined, 'Lévi');

    const { acceptation, success, fails } = createTests(
      monad.parse.bind(monad),
      toError,
    );

    describe('#0 => Acceptation', acceptation);

    describe(
      '#1 => Success',
      success(
        {
          invite: 'undefined',
          parameters: [undefined],
          expected: 'undefined',
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
          invite: 'null',
          parameters: [null],
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

  describe('#3 => boolean', () => {
    const monad = createPrimeMonad(true, false);

    const { acceptation, success, fails } = createTests(
      monad.parse.bind(monad),
      toError,
    );

    describe('#0 => Acceptation', acceptation);

    describe(
      '#1 => Success',
      success(
        {
          invite: 'boolean - true',
          parameters: true,
          expected: 'true',
        },
        {
          invite: 'boolean - false',
          parameters: false,
          expected: 'false',
        },
      ),
    );

    describe(
      '#2 => Errors',
      fails(
        {
          invite: 'null',
          parameters: [null],
        },
        {
          invite: 'undefined',
          parameters: [undefined],
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
});
