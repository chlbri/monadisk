import type { CheckerB_F, Merge, ToSimple } from './types';

type TTM1 = Merge<
  [['ert1', any], ['ert2', any], ['ert3', any]],
  [['ert1', any], ['ert2', any], ['ert3', any]]
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
