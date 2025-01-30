import { addTarball, cleanup } from '@bemedev/build-tests';
import { this1 } from '@bemedev/build-tests/constants';
import { t } from '@bemedev/types';
import { exec } from 'shelljs';
import { createCheck } from './createCheck';
import { createMonad } from './monad';
import type {
  Checker_F,
  CreateCheck_F,
  ToObject_F,
  ToSimple_F,
  Transform_F,
} from './types';

// #region Parameters (monad)
export const monad1 = createMonad(
  ['string', createCheck(data => typeof data === 'string')],
  ['number', createCheck(data => typeof data === 'number')],
  [45, createCheck(data => data === 45)],
);
export const monad14 = createMonad(
  [
    'string',
    createCheck(data => typeof data === 'string'),
    createCheck(data => typeof data === 'string'),
  ],
  [
    'number',
    createCheck(data => typeof data === 'number'),
    createCheck(data => typeof data === 'string'),
  ],
  [
    45,
    createCheck(data => data === 45),
    createCheck(data => typeof data === 'string'),
  ],
);

export const monad11 = createMonad(
  [45, createCheck(data => data === 45)],
  ['string', createCheck(data => typeof data === 'string')],
  ['number', createCheck(data => typeof data === 'number')],
  ['date', createCheck(data => data instanceof Date)],
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
  ['boolean', createCheck(data => typeof data === 'boolean')],
  ['exist', createCheck(data => data === 'exist')],
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

type BuildToSimple_F = () => Promise<ToSimple_F>;
export const buildToSimple: BuildToSimple_F = () =>
  import(`${this1}/toSimple`).then(({ toSimple }) => toSimple);

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
