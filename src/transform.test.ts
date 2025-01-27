import { createTests } from '@bemedev/vitest-extended';
import {
  monad1,
  monad10,
  monad2,
  monad6,
  monad8,
  monad9,
} from './fixtures';
import { transform } from './transform';

describe('#1 => Simple Right sort', () => {
  const transformer2 = transform(monad2, {
    45: data => `Builded with right "${data}"`,
    string: data => `Builded with "${data}"`,
    number: data => `Builded with "${data}"`,
  });

  test('fdfd', () => {
    console.log(monad1.parse(45));
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
  )();
});

describe('#2 => Simple Wrong sort', () => {
  const transformer2 = transform(monad9, {
    strict45: data => `Builded with right "${data}"`,
    string: data => `Builded with "${data}"`,
    number: data => `Builded with "${data}"`,
  });

  test('fdfd', () => {
    console.log(monad1.parse(45));
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

    test('#0 => Console.log', () => {
      console.log('monad10', '=>', JSON.stringify(monad10.order, null, 2));
      console.log();
      console.log('monad8', '=>', JSON.stringify(monad8.order, null, 2));
      console.log();
      console.log('monad9', '=>', JSON.stringify(monad9.order, null, 2));
      console.log();
      console.log('monad6', '=>', JSON.stringify(monad6.order, null, 2));
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
        invite: 'number&45',
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
