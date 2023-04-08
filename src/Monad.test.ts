import { monad1, monad12, monad13, monad2, monad3 } from './fixtures';
import { Monad } from './Monad';

describe('Merge', () => {
  it('monad1 => monad2', () => {
    const monad = monad1.merge(monad2);
    expect(monad).toBeInstanceOf(Monad);
    expect(monad.plan).toStrictEqual(monad2.plan);
    expect(monad.previous).toEqual(monad1);
  });

  it('monad1 => monad3', () => {
    const monad = monad1.merge(monad3);
    expect(monad.plan).toStrictEqual(monad3.plan);
    expect(monad.previous).toEqual(monad1);
  });

  it('monad2 => monad3', () => {
    const monad = monad2.merge(monad3);
    expect(monad.plan).toStrictEqual(monad3.plan);
    expect(monad.previous).toEqual(monad2);
  });
});

describe('Unmerge', () => {
  it('monad1 => monad2 => unmerge', () => {
    const monad = monad1.merge(monad2).unMerge;
    expect(monad.plan).toStrictEqual(monad2.plan);
    expect(monad.previous).toBeUndefined();
  });

  it('monad1 => monad3 => unmerge', () => {
    const monad = monad1.merge(monad3).unMerge;
    expect(monad.plan).toStrictEqual(monad3.plan);
    expect(monad.previous).toBeUndefined();
  });

  it('monad3 => monad2 => unmerge', () => {
    const monad = monad3.merge(monad2).unMerge;
    expect(monad.plan).toStrictEqual(monad2.plan);
    expect(monad.previous).toBeUndefined();
  });
});

describe('And', () => {
  it('monad1 & monad12', () => {
    const monad = monad1.and(monad12);
    expect(monad.previous).toEqual(undefined);

    const expect1 = monad.plan.options.number.check(20);
    const expect2 = monad.plan.options.number.check(5);
    expect(expect1).toEqual(true);
    expect(expect2).toEqual(false);
  });

  it('monad1 & monad13', () => {
    const monad = monad1.and(monad13);
    expect(monad.previous).toEqual(undefined);

    const expect1 = monad.plan.options.string.check("It's good");
    const expect2 = monad.plan.options.number.check(5);
    const expect3 = monad.plan.options.number.check(20);
    const expect4 = monad.plan.options.string.check('bad');
    expect(expect1).toEqual(true);
    expect(expect2).toEqual(true);
    expect(expect3).toEqual(false);
    expect(expect4).toEqual(false);
  });
});

describe('Or', () => {
  it('monad1 & monad12', () => {
    const monad = monad1.or(monad12);
    expect(monad.previous).toEqual(undefined);

    const expect1 = monad.plan.options.number.check(20);
    const expect2 = monad.plan.options.number.check(5);
    expect(expect1).toEqual(true);
    expect(expect2).toEqual(true);
  });

  it('monad1 & monad13', () => {
    const monad = monad1.or(monad13);
    expect(monad.previous).toEqual(undefined);

    const expect1 = monad.plan.options.string.check("It's good");
    const transform1 = monad.plan.options.string.transform('It');
    const expect2 = monad.plan.options.number.check(5);
    const expect3 = monad.plan.options.number.check(20);
    const expect4 = monad.plan.options.string.check('bad');
    expect(expect1).toEqual(true);
    expect(expect2).toEqual(true);
    expect(expect3).toEqual(true);
    expect(expect4).toEqual(true);
    expect(transform1).toEqual('It is good');
  });
});
