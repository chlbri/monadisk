import { addTarball, cleanup } from '@bemedev/build-tests';
import { this1 } from '@bemedev/build-tests/constants';
import { monad11 } from './fixtures';
import type { transform as _transform } from './transform';

beforeAll(addTarball);
afterAll(cleanup);

let transform = undefined as unknown as typeof _transform;

beforeAll(async () => {
  transform = await import(this1).then(({ transform }) => transform);
});

describe('#1 => Simple Right sort', () => {
  test('#1 => Simple Right sort', async () => {
    const transformer2 = transform(monad11, {
      45: data => `Builded with right "${data}"`,
      string: data => `Builded with "${data}"`,
      number: data => `Builded with "${data}"`,
      else: () => 'Make it else',
    });

    expect(transformer2('string')).toBe('Builded with "string"');
    expect(transformer2(64)).toBe('Builded with "64"');
    expect(transformer2(45)).toBe('Builded with right "45"');
    expect(transformer2(true)).toBeUndefined();
    expect(transformer2(new Date())).toBe('Make it else');
  });
});
