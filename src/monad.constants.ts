import {
  checkerBigInt,
  checkerBoolean,
  checkerDate,
  checkerFunction,
  checkerNull,
  checkerNumber,
  checkerObject,
  checkerString,
  checkerSymbol,
  checkerUndefined,
} from './createChecker.constants';
import { createMonad } from './monad';

export const PRIMITIVE_MONAD = Object.freeze(
  createMonad(
    checkerUndefined,
    checkerNull,
    checkerBoolean,
    checkerFunction,
    checkerNumber,
    checkerDate,
    checkerString,
    checkerSymbol,
    checkerBigInt,
    checkerObject,
  ),
);
