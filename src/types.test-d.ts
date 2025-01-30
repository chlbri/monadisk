import { monad1, monad11, monad14 } from './fixtures';
import type { Checker_F, CheckerB_F, Merge, ToSimple } from './types';

type TTM1 = Merge<
  [['ert1', Checker_F], ['ert2', Checker_F], ['ert3', Checker_F]],
  [['ert1', Checker_F], ['ert2', Checker_F], ['ert3', Checker_F]]
>[number][0];

expectTypeOf<TTM1>().toEqualTypeOf<
  | 'ert1&ert1'
  | 'ert1&ert2'
  | 'ert1&ert3'
  | 'ert2&ert1'
  | 'ert2&ert2'
  | 'ert2&ert3'
  | 'ert3&ert1'
  | 'ert3&ert2'
  | 'ert3&ert3'
>();

type TS1 = ToSimple<[['ert1', any], ['ert2', any], ['ert3', any]]>;
expectTypeOf<TS1>().toEqualTypeOf<
  [['ert1', CheckerB_F], ['ert2', CheckerB_F], ['ert3', CheckerB_F]]
>();

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
