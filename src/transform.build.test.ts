import { createTests } from '@bemedev/vitest-extended';
import { buildTransform, date, monad11, useBuild } from './fixtures';

useBuild();

describe('#1 => Simple right sort', () => {
  //@ts-expect-error For test
  const transformer2: (arg: unknown) => string = undefined;

  const { success, fails } = createTests.withImplementation(transformer2, {
    name: 'transformer2',
    async instanciation() {
      const transform = await buildTransform();

      return transform(monad11, {
        45: data => `Builded with right "${data}"`,
        string: data => `Builded with "${data}"`,
        number: data => `Builded with "${data}"`,
        date: data => `Builded with "${data.getUTCFullYear()}"`,
      });
    },
  });

  describe(
    '#1 => Errors',
    fails(
      {
        invite: 'Boolean - true',
        parameters: true,
        error: `Case for "true" is not handled`,
      },
      {
        invite: 'Boolean - false',
        parameters: false,
        error: `Case for "false" is not handled`,
      },
    ),
  );

  describe(
    '#2 => Success',
    success(
      {
        invite: 'string',
        parameters: 'string',
        expected: 'Builded with "string"',
      },
      {
        invite: '64',
        parameters: 64,
        expected: 'Builded with "64"',
      },
      {
        invite: '45',
        parameters: 45,
        expected: 'Builded with right "45"',
      },
      {
        invite: 'date',
        parameters: date,
        expected: 'Builded with "2022"',
      },
    ),
  );
});
