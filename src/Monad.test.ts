import { Monad } from './Monad';

describe('Typing monad ', () => {
  // const datas = [
  //   undefined,
  //   1,
  //   -1,
  //   0,
  //   'empty',
  //   'another string',
  //   true,
  //   45,
  //   new Date(),
  //   new Set(),
  // ];

  const testMonad = new Monad({
    string: (data: string) => typeof data === 'string',
    positive: (data: number) => typeof data === 'number' && data > 0,
    negative: (data: number) => typeof data === 'number' && data < 0,
    zero: (data: number) => typeof data === 'number' && data === 0,
    boolean: (data: boolean) => typeof data === 'boolean',
    date: (data: Date) => data instanceof Date,
  });

  const expecteds: string[] = [];

  beforeAll(() => {
    testMonad.subscribe((input, output) => {
      expecteds.push(`${input} => ${output}`);
    });
    const mapper = testMonad.createMap({
      positive: () => 'positif',
      negative: () => 'négatif',
      boolean: () => 'booléen',
      zero: () => 'nul',
      string: () => 'string',
      date: () => 'date',
      else: () => 'inconnu',
    });
    testMonad.setMapper(mapper);
  });

  type Helper = {
    invite: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
    _mapped: string;
    expected: string;
    length: number;
  };

  function helperTest({
    invite,
    value,
    _mapped,
    expected,
    length,
  }: Helper) {
    describe(invite, () => {
      beforeAll(() => {
        testMonad.next(value);
      });
      test('It should map the right message', () => {
        expect(testMonad._mapped).toEqual(_mapped);
      });
      test('History should have the right length', () => {
        expect(testMonad.history).toHaveLength(length);
      });
      describe('The subscription :', () => {
        it('Has the right length', () => {
          expect(expecteds).toHaveLength(length);
        });
        test('Has the right message', () => {
          expect(expecteds).toContain(expected);
        });
      });
    });
  }

  helperTest({
    invite: 'Undefined Value',
    value: undefined,
    _mapped: 'inconnu',
    expected: 'undefined => inconnu',
    length: 1,
  });

  helperTest({
    invite: 'Boolean Value',
    value: true,
    _mapped: 'booléen',
    expected: 'true => booléen',
    length: 2,
  });

  helperTest({
    invite: 'Positive Number Value',
    value: 2,
    _mapped: 'positif',
    expected: '2 => positif',
    length: 3,
  });

  helperTest({
    invite: 'Negative Number Value',
    value: -2,
    _mapped: 'négatif',
    expected: '-2 => négatif',
    length: 4,
  });

  helperTest({
    invite: 'String Litteral Value',
    value: 'I believe I can fly',
    _mapped: 'string',
    expected: 'I believe I can fly => string',
    length: 5,
  });

  helperTest({
    invite: 'Date Value',
    value: new Date(2022, 8, 15, 0, 0, 0, 0),
    _mapped: 'date',
    expected:
      'Thu Sep 15 2022 00:00:00 GMT+0000 (heure moyenne de Greenwich) => date',
    length: 6,
  });
});
