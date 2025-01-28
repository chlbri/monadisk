# Monadisk

Une bibliothèque TypeScript pour la gestion de monades avec des
transformations et des vérifications de types.

<br/>

## Installation

```bash
pnpm install monadisk
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
const transformer = transform(monad, {
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
console.log(transformer('hello')); // "Texte: hello"
console.log(transformer(42)); // "Nombre: 42"
console.log(transformer(45)); // "Nombre spécial: 45"
console.log(transformer(true)); // "Type inconnu"
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
