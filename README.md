# Monadisk

## Small implementation of monad in js.

Guide coming soon...!

```typescript
import { Monad } from 'monadisk';

const testMonad = new Monad({
  string: (data: string) => typeof data === 'string',
  positive: (data: number) => typeof data === 'number' && data > 0,
  negative: (data: number) => typeof data === 'number' && data < 0,
  zero: (data: number) => typeof data === 'number' && data === 0,
  boolean: (data: boolean) => typeof data === 'boolean',
  date: (data: Date) => data instanceof Date,
});

it('works', () => {
  testMonad.current = 4;
  const transformed = testMonad.transform({
    positive: () => 'positif',
    negative: () => 'négatif',
    boolean: () => 'booléen',
    zero: () => 'nul',
    string: () => 'string',
    date: () => 'date',
    else: () => 'inconnu',
  });
  expect(transformed).toBe('positif');
});
```
