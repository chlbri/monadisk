import {
  checkBigInt,
  checkBoolean,
  checkDate,
  checkFunction,
  checkNull,
  checkNumber,
  checkObject,
  checkString,
  checkSymbol,
  checkUndefined,
} from './createCheck.constants';
import type { Checker } from './types';

export const checkerBigInt = [
  'bigint',
  checkBigInt,
] as const satisfies Checker;

export const checkerBoolean = [
  'boolean',
  checkBoolean,
] as const satisfies Checker;

export const checkerFunction = [
  'function',
  checkFunction,
] as const satisfies Checker;

export const checkerNumber = [
  'number',
  checkNumber,
] as const satisfies Checker;

export const checkerObject = [
  'object',
  checkObject,
] as const satisfies Checker;

export const checkerString = [
  'string',
  checkString,
] as const satisfies Checker;

export const checkerSymbol = [
  'symbol',
  checkSymbol,
] as const satisfies Checker;

export const checkerUndefined = [
  'undefined',
  checkUndefined,
] as const satisfies Checker;

export const checkerNull = ['null', checkNull] as const satisfies Checker;

export const checkerDate = ['date', checkDate] as const satisfies Checker;
