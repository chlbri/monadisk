import { createTests } from '@bemedev/vitest-extended';
import { monad10, monad11, monad9 } from './fixtures';
import { transform } from './transform';

describe('#1 => Simple Right sort', () => {
  const transformer2 = transform(monad11, {
    45: data => `Builded with right "${data}"`,
    string: data => `Builded with "${data}"`,
    number: data => `Builded with "${data}"`,
    else: () => 'Make it else',
  });

  const { success } = createTests(transformer2);

  success(
    {
      invite: 'string',
      parameters: 'string',
      expected: 'Builded with "string"',
    },
    {
      invite: 'number',
      parameters: 64,
      expected: 'Builded with "64"',
    },
    {
      invite: '45',
      parameters: 45,
      expected: 'Builded with right "45"',
    },
    {
      invite: 'boolean',
      parameters: true,
      expected: undefined,
    },
    {
      invite: 'Date',
      parameters: new Date(),
      expected: 'Make it else',
    },
  )();
});

describe('#2 => Simple Wrong sort', () => {
  const transformer2 = transform(monad9, {
    strict45: data => `Builded with right "${data}"`,
    string: data => `Builded with "${data}"`,
    number: data => `Builded with "${data}"`,
  });

  const { success } = createTests(transformer2);

  success(
    {
      invite: 'string',
      parameters: 'string',
      expected: 'Builded with "string"',
    },
    {
      invite: 'number',
      parameters: 64,
      expected: 'Builded with "64"',
    },
    {
      invite: '45',
      parameters: 45,
      expected: 'Builded with "45"',
    },
  )();
});

describe('#3 => Merge', () => {
  describe('#1 => And', () => {
    const transformer5 = transform(monad10, {
      'string&exist': data => `Builded with string&exist "${data}"`,
      'number&64': data => `Builded with number&64 "${data}"`,
      '45&45': data => `Builded with 45&45 "${data}"`,
      'number&45': data => `Builded with number&45 "${data}"`,
      else: () => 'Not found',
    });

    const { success } = createTests(transformer5);

    success(
      {
        invite: 'string&exist',
        parameters: 'exist',
        expected: 'Builded with string&exist "exist"',
      },
      {
        invite: '45&45',
        parameters: 45,
        expected: `Builded with 45&45 "45"`,
      },
      {
        invite: 'number&64',
        parameters: 64,
        expected: `Builded with number&64 "64"`,
      },
      {
        invite: 'other',
        parameters: 34,
        expected: undefined,
      },
    )();
  });
});
