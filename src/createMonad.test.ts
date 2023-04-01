import { createMonad } from './createMonad';
import { Monad } from './Monad2';

test('The Function exists', () => {
  expect(createMonad).toBeInstanceOf(Function);
});

test('It creates the monad', () => {
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

describe('Strict mode', () => {
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
            toString: data => 4,
            toNumber: data => data,
          },
          else: () => null,
        },
      );
    expect(monad).toThrowError('Guard "isNumber" not found');
  });
});
