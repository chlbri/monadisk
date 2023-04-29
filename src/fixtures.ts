/* ignore file coverage */

import { createMonad } from './createMonad';

export const monad1 = createMonad(
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
    types: {} as {
      string: [string, string];
      number: [number, number];
    },
  },
  {
    guards: {
      isString: data => typeof data === 'string',
      isNumber: data => typeof data === 'number',
    },
    transforms: {
      toString: data => `Hello ${data}`,
      toNumber: data => data * 2,
    },
  },
);

export const monad2 = createMonad(
  {
    options: {
      boolean: {
        check: 'isBoolean',
        transform: 'toBoolean',
      },
    },
    types: {} as {
      boolean: [boolean, boolean];
    },
  },
  {
    guards: {
      isBoolean: data => typeof data === 'boolean',
    },
    transforms: {
      toBoolean: data => !data,
    },
  },
);

export const monad3 = createMonad(
  {
    options: {
      googObject: {
        check: 'isGoogObject',
        transform: 'toGoogObject',
      },
    },
    types: {} as {
      googObject: [{ name: string }, string];
    },
  },
  {
    guards: {
      isGoogObject: data =>
        typeof data === 'object' && (data as any)?.name === 'Google',
    },
    transforms: {
      toGoogObject: data => data.name,
    },
  },
);

export const monad12 = createMonad(
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
    types: {} as {
      string: [string, string];
      number: [number, number];
    },
  },
  {
    guards: {
      isString: data => typeof data === 'string',
      isNumber: data => data > 10,
    },
    transforms: {
      toString: data => `${data}, you're a nice human !!`,
      toNumber: data => data * 4,
    },
  },
);

export const monad13 = createMonad(
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
    types: {} as {
      string: [string, string];
      number: [number, number];
    },
  },
  {
    guards: {
      isString: data => typeof data === 'string' && data.length > 5,
      isNumber: data => typeof data === 'number' && data < 10,
    },
    transforms: {
      toString: data => `${data} is good`,
      toNumber: data => data * 2,
    },
    else: () => 'else',
  },
);
