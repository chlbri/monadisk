import { monad1, monad12, monad13, monad2, monad3 } from './fixtures';
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

    it('#2 =>', () => {
      const fn = interpret(monad3);
      const actual = fn({ name: 'Google' });

      expect(actual).toBe('Google');
    });

    it('#3 - Else =>', () => {
      const fn = interpret(monad3);
      const actual = fn(true);

      expect(actual).toBe(true);
    });
  });

  describe('#2 => With subscribers', () => {
    const obj = { num: 1 };

    const fn = interpret(monad13, (_, transformed) => {
      if (typeof transformed === 'number') {
        obj.num += transformed;
      }
    });

    it('#1 =>', () => {
      fn(5);
      expect(obj.num).toBe(11);
    });

    it('#2 =>', () => {
      fn('Not subscribe');
      expect(obj.num).toBe(11);
    });

    it('#3 =>', () => {
      fn(6);
      expect(obj.num).toBe(23);
    });
  });

  describe('#3 => With previous', () => {
    const monad = monad1.merge(monad12);

    const service = interpret(monad);

    it('#1 => Number', () => {
      const actual = service(6);
      expect(actual).toBe(48);
    });

    it('#2 => String', () => {
      const actual = service('Lévi');
      expect(actual).toBe("Hello Lévi, you're a nice human !!");
    });
  });
});
