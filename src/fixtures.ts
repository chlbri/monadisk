const plans1 = {
  options: {
    string: {
      check: data => typeof data === 'string',
      transform: (data: string) => `Hello ${data}`,
    },
    number: {
      check: data => typeof data === 'number',
      transform: (data: number) => data * 2,
    },
  },
  else: data => data,
};

const plans12 = {
  options: {
    string: {
      check: data => typeof data === 'string',
      transform: (data: string) => `Hello ${data} !!`,
    },
    number: {
      check: data => data > 10,
      transform: (data: number) => data * 4,
    },
  },
  else: data => data,
};

const plans13 = {
  options: {
    string: {
      check: data => typeof data === 'string' && data.length > 5,
      transform: (data: string) => `${data} is good`,
    },
    number: {
      check: data => typeof data === 'number' && data < 10,
      transform: (data: number) => data * 2,
    },
  },
  else: data => data,
};

const plans2 = {
  options: {
    boolean: {
      check: data => typeof data === 'boolean',
      transform: (data: boolean) => !data,
    },
  },
  else: data => data,
};

const plans3 = {
  options: {
    googObject: {
      check: data => typeof data === 'object' && data?.name === 'Google',
      transform: (data: { name: string }) => data.name,
    },
  },
  else: data => data,
};

//Write tests for Monad2 class

import { Monad } from './Monad2';

export const monad1 = new Monad(plans1);
export const monad2 = new Monad(plans2);
export const monad3 = new Monad(plans3);
export const monad12 = new Monad(plans12);
export const monad13 = new Monad(plans13);
