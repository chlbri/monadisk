import {
  monad1,
  monad11,
  monad14,
  monad20,
  monad20Keys,
} from './fixtures';
import type {
  Checker_F,
  CheckerB_F,
  Merge,
  RawCheckersFrom,
} from './types';

type TTM1 = Merge<
  [['ert1', Checker_F], ['ert2', Checker_F], ['ert3', Checker_F]],
  [['ert1', Checker_F], ['ert2', Checker_F], ['ert3', Checker_F]]
>[number][0];

expectTypeOf<TTM1>().toEqualTypeOf<
  | 'ert1&&ert1'
  | 'ert1&&ert2'
  | 'ert1&&ert3'
  | 'ert2&&ert1'
  | 'ert2&&ert2'
  | 'ert2&&ert3'
  | 'ert3&&ert1'
  | 'ert3&&ert2'
  | 'ert3&&ert3'
>();

type Raw20 = RawCheckersFrom<typeof monad20>;
type TTM20 = Raw20[number][0];
declare const numb: number;
expectTypeOf<TTM20>().toEqualTypeOf(monad20Keys[numb]);

expectTypeOf(monad1.rawCheckers).toEqualTypeOf<
  [
    ['string', Checker_F<string>],
    ['number', Checker_F<number>],
    [45, Checker_F<45>],
  ]
>();

expectTypeOf(monad14.rawCheckers).toEqualTypeOf<
  [
    ['string', Checker_F<string>, Checker_F<string>],
    ['number', Checker_F<number>, Checker_F<string>],
    [45, Checker_F<45>, Checker_F<string>],
  ]
>();

expectTypeOf(monad14.checkers).toMatchTypeOf<{
  string: [CheckerB_F, CheckerB_F];
  number: [CheckerB_F, CheckerB_F];
  45: [CheckerB_F, CheckerB_F];
}>();

expectTypeOf(monad11.checkers).toMatchTypeOf<{
  45: CheckerB_F | [CheckerB_F];
  string: CheckerB_F | [CheckerB_F];
  number: CheckerB_F | [CheckerB_F];
  date: CheckerB_F | [CheckerB_F];
}>();
