import { addTarball, cleanup } from '@bemedev/build-tests';
import { this1 } from '@bemedev/build-tests/constants';
import { t } from '@bemedev/types';
import { exec } from 'shelljs';
import { createCheck } from './createCheck';
import { checkNumber, checkString } from './createCheck.helpers';
import { createChecker, createCheckerSN } from './createChecker';
import {
  checkerBoolean,
  checkerDate,
  checkerNumber,
  checkerString,
} from './createChecker.helpers';
import { createMonad } from './monad';
import type {
  Checker_F,
  CreateCheck_F,
  ToObject_F,
  Transform_F,
} from './types';

// #region Parameters (monad)
export const monad1 = createMonad(
  checkerString,
  checkerNumber,
  createCheckerSN(45),
);
export const monad111 = createMonad(
  createCheckerSN(45),
  checkerNumber,
  checkerString,
);

export const monad14 = createMonad(
  ['string', checkString, checkString],
  ['number', checkNumber, checkString],
  [45, createCheck(data => data === 45), checkString],
);

export const monad11 = createMonad(
  [45, createCheck(data => data === 45)],
  checkerString,
  checkerNumber,
  checkerDate,
);

export const monad2 = createMonad(
  ['string', createCheck(data => typeof data === 'string')],
  ['number', createCheck(data => typeof data === 'number')],
).add(
  45,
  createCheck(data => data === 45),
);

export const monad3 = monad1.or(monad2);

export const monad4 = createMonad(
  checkerBoolean,
  createChecker('exist', data => data === 'exist'),
);

export const monad5 = monad2.mergeAnd(monad4);

export const monad6 = monad2.mergeOr([
  ['boolean', createCheck(data => typeof data === 'boolean')],
  ['exist', createCheck(data => data === 'exist')],
]);

export const monad7 = monad1.and(monad2);

export const monad8 = monad1.or([
  ['string', createCheck(data => typeof data === 'string')],
  ['number', createCheck(data => typeof data === 'number')],
  [45, createCheck(data => data === 45)],
]);

export const monad9 = createMonad(
  ['string', createCheck(data => typeof data === 'string')],
  ['number', createCheck(data => typeof data === 'number')],
  ['strict45', createCheck(data => data === 45)],
);

export const monad10 = monad11.mergeAnd([
  ['true', createCheck(data => data === true)],
  [64, createCheck(data => data === 64)],
  [45, createCheck(data => data === 45)],
  ['exist', createCheck(data => data === 'exist')],
]);

export const monad20 = monad1.concat(monad10);

export const monad21 = monad111.concat([
  ['strict45', createCheck(data => data === 45)],
  checkerNumber,
  ['string', createCheck(data => typeof data === 'string')],
]);

export const monad20Keys = [
  'string::45&&true',
  'string::45&&64',
  'string::45&&45',
  'string::45&&exist',
  'string::string&&true',
  'string::string&&64',
  'string::string&&45',
  'string::string&&exist',
  'string::number&&true',
  'string::number&&64',
  'string::number&&45',
  'string::number&&exist',
  'string::date&&true',
  'string::date&&64',
  'string::date&&45',
  'string::date&&exist',
  'number::45&&true',
  'number::45&&64',
  'number::45&&45',
  'number::45&&exist',
  'number::string&&true',
  'number::string&&64',
  'number::string&&45',
  'number::string&&exist',
  'number::number&&true',
  'number::number&&64',
  'number::number&&45',
  'number::number&&exist',
  'number::date&&true',
  'number::date&&64',
  'number::date&&45',
  'number::date&&exist',
  '45::45&&true',
  '45::45&&64',
  '45::45&&45',
  '45::45&&exist',
  '45::string&&true',
  '45::string&&64',
  '45::string&&45',
  '45::string&&exist',
  '45::number&&true',
  '45::number&&64',
  '45::number&&45',
  '45::number&&exist',
  '45::date&&true',
  '45::date&&64',
  '45::date&&45',
  '45::date&&exist',
] as const;

export const monad21Keys = [
  '45::strict45',
  '45::number',
  '45::string',
  'number::strict45',
  'number::number',
  'number::string',
  'string::strict45',
  'string::number',
  'string::string',
] as const;
// #endregion

export const date = new Date('2022-03-25');

// #region Built Functions
export const funcT = <T>() => t.anify<Checker_F<T>>();
type BuildTransform_F = () => Promise<Transform_F>;
export const buildTransform: BuildTransform_F = () =>
  import(`${this1}/transform`).then(({ transform }) => transform);

type BuildCreateCheck_F = () => Promise<CreateCheck_F>;
export const buildCreateCheck: BuildCreateCheck_F = () =>
  import(`${this1}/createCheck`).then(({ createCheck }) => createCheck);

type BuildToObject_F = () => Promise<ToObject_F>;
export const buildToObject: BuildToObject_F = () =>
  import(`${this1}/toObject`).then(({ toObject }) => toObject);
// #endregion

// #region Hooks
export const useBuild = () => {
  beforeAll(async () => {
    exec('pnpm run build');
    await addTarball();
  });
  afterAll(cleanup);
};
// #endregion
