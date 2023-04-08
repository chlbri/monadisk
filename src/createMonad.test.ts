import {
  createMonad,
  DEFAULT_GUARD,
  DEFAULT_TRANSFORM,
} from './createMonad';
import { Monad } from './Monad';

test('#1 => The Function exists', () => {
  expect(createMonad).toBeInstanceOf(Function);
});

test('#2 => It creates the monad', () => {
  const monad1 = createMonad({
    options: {
      string: {
        check: 'isString',
        transform: 'toString',
      },
      number: {
        check: 'isNumber',
        transform: 'toNumber',
      },
    },
    else: 'toString',
    types: {} as {
      string: [string, number];
      number: [number, number];
    },
    default: {} as unknown as null,
  });

  expect(monad1).toBeDefined();
  expect(monad1).toBeInstanceOf(Monad);
});

describe('#3 => Strict mode', () => {
  test('It returns errors if no guards', () => {
    const monad1 = () =>
      createMonad({
        options: {
          string: {
            check: 'isString',
            transform: 'toString',
          },
          number: {
            check: 'isNumber',
            transform: 'toNumber',
          },
        },
        else: 'toString',
        types: {} as {
          string: [string, number];
          number: [number, number];
        },
        default: {} as unknown as null,
        strict: true,
      });

    expect(monad1).toThrowError('No guards');
  });

  test('It returns errors if no transforms', () => {
    const monad = () =>
      createMonad(
        {
          options: {
            string: {
              check: 'isString',
              transform: 'toString',
            },
            number: {
              check: 'isNumber',
              transform: 'toNumber',
            },
          },
          else: 'toString',
          types: {} as {
            string: [string, number];
            number: [number, number];
          },
          default: {} as unknown as null,
          strict: true,
        },
        {
          guards: {
            isString: () => true,
            isNumber: () => true,
          },
        } as any,
      );

    expect(monad).toThrowError('No transforms');
  });

  test('It returns error when one guard is not found', () => {
    const monad = () =>
      createMonad(
        {
          options: {
            string: {
              check: 'isString',
              transform: 'toString',
            },
            number: {
              check: 'isNumber',
              transform: 'toNumber',
            },
          },
          else: 'toString',
          types: {} as {
            string: [string, number];
            number: [number, number];
          },
          default: {} as unknown as null,
          strict: true,
        },
        {
          guards: {
            isString: () => true,
          } as any,
          transforms: {
            toString: () => 4,
            toNumber: data => data,
          } as any,
        },
      );
    expect(monad).toThrowError('Guard "isNumber" not found');
  });
});

describe('#4 => Relax Mode', () => {
  let monad: Monad;

  beforeAll(() => {
    monad = createMonad({
      options: {
        string: {
          check: 'isString',
          transform: 'toString',
        },
        number: {
          check: 'isNumber',
          transform: 'toNumber',
        },
      },
      else: 'toString',
      types: {} as {
        string: [string, number];
        number: [number, number];
      },
      default: {} as unknown as null,
    });
  });

  test('#1 => Default guard', () => {
    const guard = monad.plan.options.string.check;

    expect(guard).toBe(DEFAULT_GUARD);
  });

  test('#2 => Default transform', () => {
    const transform = monad.plan.options.string.transform;

    expect(transform).toBe(DEFAULT_TRANSFORM);
  });
});
