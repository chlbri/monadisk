import { createTests } from '@bemedev/vitest-extended';
import { createCheck } from './createCheck';
import { createMonad } from './monad';

// #region Parameters
const monad1 = createMonad({
  string: createCheck(data => typeof data === 'string'),
  number: createCheck(data => typeof data === 'number'),
  45: createCheck(data => data === 45),
});

const monad2 = createMonad({
  string: createCheck(data => typeof data === 'string'),
  number: createCheck(data => typeof data === 'number'),
}).add(
  '45',
  createCheck(data => data === 45),
);

const monad3 = monad1.or(monad2).or({
  string: createCheck(data => typeof data === 'string'),
  number: createCheck(data => typeof data === 'number'),
  45: createCheck(data => data === 45),
});

const monad4 = createMonad({
  boolean: createCheck(data => typeof data === 'boolean'),
  exist: createCheck(data => data === 'exist'),
});

const monad5 = monad2.mergeAnd(monad4);
const monad6 = monad2.mergeOr({
  boolean: createCheck(data => typeof data === 'boolean'),
  exist: createCheck(data => data === 'exist'),
});

const monad7 = monad1.and(monad2);
// #endregion

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
      createTests(monad2.checkers.number).acceptation,
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
