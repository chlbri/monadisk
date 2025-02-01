import { createCheck } from './createCheck';

export const checkBigInt = createCheck(arg => typeof arg === 'bigint');

export const checkBoolean = createCheck(arg => typeof arg === 'boolean');

export const checkFunction = createCheck(arg => typeof arg === 'function');

export const checkNumber = createCheck(arg => typeof arg === 'number');

export const checkObject = createCheck(
  arg => typeof arg === 'object' && arg !== null && arg !== undefined,
);

export const checkString = createCheck(arg => typeof arg === 'string');

export const checkSymbol = createCheck(arg => typeof arg === 'symbol');

export const checkUndefined = createCheck(
  (arg): arg is undefined => typeof arg === 'undefined',
);

export const checkNull = createCheck((arg): arg is null => arg === null);

export const checkDate = createCheck(
  (arg): arg is Date => arg instanceof Date,
);
