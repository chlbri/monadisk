import { createTests } from '@bemedev/vitest-extended';
import { buildCreateCheck, funcT, useBuild } from './fixtures';

useBuild();

describe('#1 => For string', () => {
  const funcS = (arg: unknown) => typeof arg === 'string';

  const { success, acceptation } = createTests.withImplementation(
    funcT(),
    {
      name: 'funcS',
      instanciation: async () => {
        const createCheck = await buildCreateCheck();
        return createCheck(funcS);
      },
    },
  );

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

  const { success, acceptation } = createTests.withImplementation(
    funcT(),
    {
      name: 'funcB',
      instanciation: async () => {
        const createCheck = await buildCreateCheck();
        return createCheck(funcB);
      },
    },
  );

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

describe('#1 => For number', () => {
  const funcN = (arg: unknown) => typeof arg === 'number';

  const { success, acceptation } = createTests.withImplementation(
    funcT(),
    {
      name: 'funcN',
      instanciation: async () => {
        const createCheck = await buildCreateCheck();
        return createCheck(funcN);
      },
    },
  );

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
