import { createTests } from '@bemedev/vitest-extended';
import { createCheck } from './createCheck';

describe('#1 => For string', () => {
  const funcS = (arg: unknown) => typeof arg === 'string';
  const { success, acceptation } = createTests(createCheck(funcS));

  describe('#0 => Acceptation', acceptation);

  describe(
    '#1 => Success',
    success(
      {
        invite: 'For boolean',
        parameters: false,
        expected: false,
      },
      {
        invite: 'For number',
        parameters: 45,
        expected: false,
      },
      {
        invite: 'For string',
        parameters: 'str',
        expected: { check: true, value: 'str' },
      },
    ),
  );
});

describe('#2 => For boolean', () => {
  const funcB = (arg: unknown) => typeof arg === 'boolean';
  const { success, acceptation } = createTests(createCheck(funcB));

  describe('#0 => Acceptation', acceptation);

  describe(
    '#1 => Success',
    success(
      {
        invite: 'For boolean',
        parameters: false,
        expected: { check: true, value: false },
      },
      {
        invite: 'For number',
        parameters: 45,
        expected: false,
      },
      {
        invite: 'For string',
        parameters: 'str',
        expected: false,
      },
    ),
  );
});

describe('#3 => For number', () => {
  const funcN = (arg: unknown) => typeof arg === 'number';
  const { success, acceptation } = createTests(createCheck(funcN));

  describe('#0 => Acceptation', acceptation);

  describe(
    '#1 => Success',
    success(
      {
        invite: 'For boolean',
        parameters: false,
        expected: false,
      },
      {
        invite: 'For number',
        parameters: 45,
        expected: {
          check: true,
          value: 45,
        },
      },
      {
        invite: 'For string',
        parameters: 'str',
        expected: false,
      },
    ),
  );
});
