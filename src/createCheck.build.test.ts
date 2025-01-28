import { addTarball, cleanup } from '@bemedev/build-tests';
import { this1 } from '@bemedev/build-tests/constants';
import sh from 'shelljs';
import type { CreateCheck_F } from './types';

const createCheck = vi.fn<CreateCheck_F>();

const funcS = (arg: unknown) => typeof arg === 'string';
const funcB = (arg: unknown) => typeof arg === 'boolean';
const funcN = (arg: unknown) => typeof arg === 'number';

beforeAll(async () => {
  sh.exec('pnpm run build');
  await addTarball();
});
afterAll(cleanup);

beforeAll(async () => {
  const funcToPass = await import(`${this1}/createCheck`).then(
    ({ createCheck }) => createCheck,
  );
  createCheck.mockImplementation(funcToPass);
});

describe('#1 => For string', () => {
  test('#1 => For boolean', () => {
    const func = createCheck(funcS);
    const actual = func(true);

    expect(actual).toBe(false);
  });

  test('#2 => For number', () => {
    const func = createCheck(funcS);
    const actual = func(54);

    expect(actual).toBe(false);
  });

  test('#3 => For string', () => {
    const func = createCheck(funcS);
    const str = 'str';
    const actual: any = func(str);

    expect(actual.check).toBe(true);
    expect(actual.value).toBe(str);
  });
});

describe('#2 => For boolean', () => {
  test('#1 => For string', () => {
    const func = createCheck(funcB);
    const actual = func('str');

    expect(actual).toBe(false);
  });

  test('#2 => For number', () => {
    const func = createCheck(funcB);
    const actual = func(54);

    expect(actual).toBe(false);
  });

  test('#3 => For boolean', () => {
    const func = createCheck(funcB);
    const bool = true;
    const actual: any = func(bool);

    expect(actual.check).toBe(true);
    expect(actual.value).toBe(bool);
  });
});

describe('#3 => For number', () => {
  test('#1 => For string', () => {
    const func = createCheck(funcN);
    const actual = func('str');

    expect(actual).toBe(false);
  });

  test('#2 => For boolean', () => {
    const func = createCheck(funcN);
    const actual = func(true);

    expect(actual).toBe(false);
  });

  test('#3 => For number', () => {
    const func = createCheck(funcN);
    const num = 54;
    const actual: any = func(num);

    expect(actual.check).toBe(true);
    expect(actual.value).toBe(num);
  });
});
