import { Monad } from './Monad';
import {
  CreateMonadOptions,
  CreateMonadParams,
  TransformParamsToPlans,
} from './types';

export const DEFAULT_GUARD = () => true;
export const DEFAULT_TRANSFORM = <T>(data: T) => data;

function getGuard<T extends CreateMonadParams>(
  value?: string,
  guards?: CreateMonadOptions<T>['guards'],
  strict = false,
) {
  const _guards = guards as any;
  if (strict) {
    if (!_guards) {
      throw new Error('No guards');
    }

    if (!value) throw new Error(`Guard "${value}" not exists`);

    const guard = _guards[value];
    if (!guard) throw new Error(`Guard "${value}" not found`);
    return guard;
  }
  if (!_guards || !value) {
    return DEFAULT_GUARD;
  }

  const guard = _guards[value] ?? DEFAULT_GUARD;
  return guard;
}

function getTransform<T extends CreateMonadParams>(
  value?: string,
  transforms?: CreateMonadOptions<T>['transforms'],
  strict = false,
) {
  const _transforms = transforms as any;
  if (strict) {
    if (!_transforms) {
      throw new Error('No transforms');
    }

    if (!value) throw new Error(`Transform "${value}" not exists`);

    const transform = _transforms[value];
    if (!transform) throw new Error(`Transform "${value}" not found`);
    return transform;
  }

  if (!_transforms || !value) {
    return DEFAULT_TRANSFORM;
  }

  const transform = _transforms[value] ?? DEFAULT_TRANSFORM;
  return transform;
}

export function getOptions<T extends CreateMonadParams>(
  params: T,
  optionsM?: CreateMonadOptions<T>,
) {
  const entries = Object.entries(params.options);
  const strict = params.strict ?? false;

  const mapper = entries.map(([key, { check, transform }]) => {
    return {
      [key]: {
        check: getGuard(check, optionsM?.guards, strict),
        transform: getTransform(transform, optionsM?.transforms, strict),
      },
    };
  });

  const _options = mapper.reduce((acc, current) => {
    return Object.assign(acc, current);
  });

  return _options;
}

export function createMonad<const T extends CreateMonadParams>(
  params: T,
  optionsM?: CreateMonadOptions<T>,
) {
  const keepHistory = optionsM?.keepHistory;
  const subscribable = optionsM?.subscribable;

  const options = getOptions(params, optionsM);

  const _else = optionsM?.else ?? DEFAULT_TRANSFORM;

  const plan = {
    options,
    else: _else,
  } as TransformParamsToPlans<T>;

  return new Monad(plan, { keepHistory, subscribable });
}
