import { GetPlanFromMonad, Monad } from './Monad2';
import {
  CreateMonadOptions,
  CreateMonadParams,
  TransformParamsToPlans,
} from './types';

const DEFAULT_GUARD = () => true;
const DEFAULT_TRANSFORM = <T>(data: T) => data;

export function getGuard<T extends CreateMonadParams>(
  value: keyof CreateMonadOptions<T>['guards'],
  guards?: CreateMonadOptions<T>['guards'],
  strict = false,
) {
  if (strict) {
    if (!guards) {
      throw new Error('No guards');
    }

    const guard = guards[value];
    if (!guard) throw new Error(`Guard "${value}" not found`);
    return guard;
  }
  if (!guards) {
    return DEFAULT_GUARD;
  }
  const guard = guards[value] ?? DEFAULT_GUARD;
  return guard;
}

export function getTransform<T extends CreateMonadParams>(
  value: keyof CreateMonadOptions<T>['transforms'],
  transforms?: CreateMonadOptions<T>['transforms'],
  strict = false,
) {
  if (strict) {
    if (!transforms) {
      throw new Error('No transforms');
    }

    const transform = transforms[value];
    if (!transform) throw new Error(`Guard "${value}" not found`);
    return transform;
  }
  if (!transforms) {
    return DEFAULT_TRANSFORM;
  }
  const transform = transforms[value] ?? DEFAULT_TRANSFORM;
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

export function createMonad<T extends CreateMonadParams>(
  params: T,
  optionsM?: CreateMonadOptions<T>,
) {
  const strict = params?.strict ?? false;
  const keepHistory = optionsM?.keepHistory ?? false;
  const subscribable = optionsM?.subscribable ?? false;

  const options = getOptions(params, optionsM);

  const _else = getTransform('else', optionsM?.transforms, strict);

  const plan = {
    options,
    else: _else,
  } as TransformParamsToPlans<T>;

  return new Monad(plan, { keepHistory, subscribable });
}

const test2 = createMonad({
  options: {
    string: {
      check: 'isString',
      transform: 'toString',
    },
    number: {
      check: 'isNumber',
      transform: 'toNumber',
    },
  },
  else: 'toString',
  types: {} as {
    string: [string, number];
    number: [number, number];
  },
  default: {} as unknown as null,
});

type Test1 = GetPlanFromMonad<typeof test2>;
