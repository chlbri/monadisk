import { monad1, monad2, monad3 } from './fixtures';
import { _interpret, interpret } from './interpret';

describe('#1 => Existence', () => {
  it('#1 => "_interpret" exists', () => {
    expect(_interpret).toBeInstanceOf(Function);
  });
  it('#2 => "interpret" exists', () => {
    expect(interpret).toBeInstanceOf(Function);
  });
});

describe('#2 => If History', () => {
  describe('#1 => is not kept', () => {
    it('It will keep history', () => {
      const [fn, { history }] = _interpret(monad1);
      fn('Lévi');

      expect(history).toHaveLength(0);
    });
  });

  describe('#2 => is kept', () => {
    const [fn, { history }] = _interpret(monad1, {
      keepHistory: true,
    });
    it('It will keep history length', () => {
      fn('Lévi');

      expect(history).toHaveLength(1);
    });

    it('It will keep the array', () => {
      expect(history).toEqual([{ input: 'Lévi', output: 'Hello Lévi' }]);
    });
  });
});

describe('#3 => Functionnement', () => {
  describe('#1 => Without subscribers', () => {
    it('#1 =>', () => {
      const fn = interpret(monad2);
      const actual = fn(true);

      expect(actual).toBe(false);
    });

    it('#2', () => {
      const fn = interpret(monad3);
      const actual = fn({ name: 'Google' });

      expect(actual).toBe('Google');
    });
  });

  describe('#2 => With subscribers', () => {
    it.todo('#1 =>');
    it.todo('#2 =>');
  });
});
