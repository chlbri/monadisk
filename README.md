# Monadisk

Une bibliothèque TypeScript pour la gestion de monades avec des
transformations et des vérifications de types.

<br/>

## Installation

```bash
pnpm add monadisk
```

<br/>

## Caractéristiques

- Création de monades avec vérifications de types
- Transformations de données typées
- Combinaison de monades (AND/OR)
- Fonctions de vérification personnalisables
- Support TypeScript complet

<br/>

## API

### `createMonad`

Crée une nouvelle monade avec des vérificateurs.

```typescript
const monad = createMonad(
  ['string', createCheck(data => typeof data === 'string')],
  ['number', createCheck(data => typeof data === 'number')],
);
```

### `createCheck`

Crée une fonction de vérification pour la monade.

```typescript
const stringCheck = createCheck</* string, it's inferred */>(
  data => typeof data === 'string',
);
```

### `transform`

Transforme les données selon les règles définies.

```typescript
const transform1 = transform(monad, {
  string: data => `String: ${data}`,
  number: data => `Number: ${data}`,
  else: () => 'Unknown type',
});
```

<br/>

### Méthodes d'un Monad

#### `add`

Ajoute un nouveau vérificateur à la monade.

```typescript
const newMonad = monad.add(
  45,
  createCheck(data => data === 45),
);
```

#### `and`

Combine deux monades avec une opération AND.

```typescript
const combinedMonad = monad1.and(monad2);
```

#### `or`

Combine deux monades avec une opération OR.

```typescript
const combinedMonad = monad1.or(monad2);
```

#### `mergeAnd`

Fusionne deux monades avec des clés combinées (AND).

```typescript
const mergedMonad = monad1.mergeAnd(monad2);
```

#### `mergeOr`

Fusionne deux monades avec des clés combinées (OR).

```typescript
const mergedMonad = monad1.mergeOr(monad2);
```

#### `parse`

Analyse une valeur et retourne la clé correspondante.

```typescript
const result = monad.parse(value);
```

<br/>

## Exemple d'utilisation

```typescript
import { createMonad, createCheck, transform } from 'monadisk';

// Création d'une monade
const monad = createMonad(
  ['string', createCheck(data => typeof data === 'string')],
  ['number', createCheck(data => typeof data === 'number')],
  [45, createCheck(data => data === 45)],
);

// Création d'un transformateur
const transformer = transform(monad, {
  string: data => `Texte: ${data}`,
  number: data => `Nombre: ${data}`,
  45: data => `Nombre spécial: ${data}`,
  else: () => 'Type inconnu',
});

// Utilisation
console.log(transform('hello')); // "Texte: hello"
console.log(transform(42)); // "Nombre: 42"
console.log(transform(45)); // "Nombre spécial: 45"
console.log(transform(true)); // "Type inconnu"
```

<br/>

### Concat (very powerfull)

Concatène deux monades en combinant leurs vérificateurs avec le séparateur
`::`. Cette méthode crée une nouvelle monade où l'on combine les
vérificateurs des deux monades.

```typescript
// Exemple d'utilisation de concat
const monad1 = createMonad(
  ['string', createCheck(data => typeof data === 'string')],
  ['number', createCheck(data => typeof data === 'number')],
);

const monad2 = createMonad(
  [45, createCheck(data => data === 45)],
  ['bool', createCheck(data => typeof data === 'boolean')],
);

// Crée une nouvelle monade avec les clés combinées:
// 'string::45', 'string::bool', 'number::45', 'number::bool'
const concatenated = monad1.concat(monad2);

// Utilisation avec transform
const transformer = transform(concatenated, {
  // Ici, on a deux arguments
  'string::45': (str, num) => `String ${str} avec nombre ${num}`,
  'number::bool': (num, bool) => `Nombre ${num} avec booléen ${bool}`,
  else: () => 'Combinaison non gérée',
});

// Cette méthode est utile quand vous voulez créer une monade qui vérifie plusieurs conditions indépendantes sur différents arguments.
```

<br/>

### NB: transform retourne une erreur si le cas n'est pas pris en charge

```typescript
import { createMonad, createCheck, transform } from 'monadisk';

// Création d'une monade
const monad = createMonad(
  ['string', createCheck(data => typeof data === 'string')],
  ['number', createCheck(data => typeof data === 'number')],
  [45, createCheck(data => data === 45)],
);

// Création d'un transformateur
const transformer = transform(monad, {
  string: data => `Texte: ${data}`,
  number: data => `Nombre: ${data}`,
  45: data => `Nombre spécial: ${data}`,
  // no else case
});

// Utilisation
console.log(transform('hello')); // "Texte: hello"
console.log(transform(42)); // "Nombre: 42"
console.log(transform(45)); // "Nombre spécial: 45"
console.log(transform(true)); // Will throws error `Case for "true" is not handled`
```

<br/>

## Licence

MIT

<br/>

## CHANGE_LOG

<details>

<summary>
...
</summary>

### Version [0.0.7] --> _2025/02/01 21:00_

- Add helpers to simplify usage

<br/>

### Version [0.0.6] --> _2025/01/30 16/00_

- Add option to concat monad

<br/>

### Version [0.0.5] --> _2025/01/28 13:10_

- Upgrade deps
- Better testing (100% coverage)

<br/>

### Version [0.0.4] --> _2025/01/28 11:10_

- La fonction `transform` génère une erreur si le cas n'est pas pris en
  charge

<br/>

### Version [0.0.3] --> _2025/01/28 11:10_

- 🐛 Correction des fautes de frappe dans les exemples
  - Correction de `tarnsform` en `transform` dans les exemples de code
  - Amélioration de la lisibilité des exemples
- 📝 Restructuration du CHANGELOG
  - Ajout des dates de version
  - Utilisation de balises `<details>` pour le contenu
- Better testing : 100% coverage

<br/>

### Version [0.0.1] --> _2025/01/28 02:02_

- ✨ Première version de la bibliothèque
- 🎉 Implémentation des fonctionnalités de base :
  - Création de monades avec `createMonad`
  - Création de vérificateurs avec `createCheck`
  - Transformations avec `transform`
  - Méthodes de combinaison (`and`, `or`, `mergeAnd`, `mergeOr`)
  - Support complet de TypeScript
- 📝 Documentation initiale
- ⚡️ Tests unitaires de base
- 🔄 Ajout des méthodes de fusion avancées pour une meilleure gestion des
  monades complexes
  - Amélioration de la documentation des méthodes `mergeAnd` et `mergeOr`
  - Optimisation des performances pour les opérations de fusion

</details>

<br/>
<br/>

## Auteur

chlbri (bri_lvi@icloud.com)

[My github](https://github.com/chlbri?tab=repositories)

[<svg width="98" height="96" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f"/></svg>](https://github.com/chlbri?tab=repositories)

<br/>

## Liens

- [Documentation](https://github.com/chlbri/monadisk)
