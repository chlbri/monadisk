import { createTests } from '@bemedev/vitest-extended';
import {
  monad1,
  monad2,
  monad3,
  monad5,
  monad6,
  monad7,
  monad8,
} from './fixtures';

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
      const expected = key === 'string&exist';

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
        key === '45||boolean' || key === 'number||boolean'
      );

      test(`#${index} => ${key}`, () => {
        const actual = func(_actual);
        expect(actual).toBe(expected);
      });
    });
  });
});

describe('#4 => Miscellaneous', () => {
  test('#1 => Order', () => {
    const order = monad1.order;

    expect(order).toStrictEqual(['string', 'number', 45]);
  });
});
