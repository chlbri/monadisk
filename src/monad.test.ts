import { createTests } from '@bemedev/vitest-extended';
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
