# @jexop/core

## 1.2.0

### Minor Changes

- a807f00: Fix packaging: the CommonJS build is now real CommonJS, type declarations are published from `dist/types` (instead of pointing at the TypeScript sources), only `dist` is published, and `main` points to the CommonJS build. AMD and UMD builds have been removed. `@jexop/color` now uses `chroma-js` v3.
- a807f00: - `if`, `switch`, `and`/`&&`, `or`/`||`, `nand` and `nor` are now lazy: they only evaluate the branches/values they need (`and`/`or` short-circuit).
  - Add `lazy()` to create custom lazy operators, which receive unevaluated properties and an `evaluate` function.
  - `switch` only matches the options object's own keys (no longer returns inherited properties such as `constructor`), evaluates the matching option, and returns `null` when nothing matches and there is no `fallback`.
  - `divide` returns `null` when either value is not numeric (it used to treat them as `1`).
  - `evaluate` returns `null` instead of `undefined` for unsupported values (functions, symbols, bigints) and for operators that return `undefined`.
  - `get` and `context` return `default` when the value is `null` as well as when it is missing, as documented.
  - Export `Registry` and `evaluateRegistry`.
  - Remove the `lodash` dependency.

## 1.1.3

### Patch Changes

- 1211bcf: Non-singleton use

## 1.1.2

### Patch Changes

- ebc15f4: Publishing

## 1.1.1

### Patch Changes

- fe433ed: Docs and repo information

## 1.1.0

### Minor Changes

- a07bdfc: Addition of new 'object:transform' operator and 'to-duration' operator

## 1.0.12

### Patch Changes

- 0f94137: Add types to dependencies

## 1.0.11

### Patch Changes

- 325a903: Evaluate child of array:map

## 1.0.10

### Patch Changes

- 583513c: Added not, nand and nor operators

## 1.0.9

### Patch Changes

- b296844: Included array operators in docs
- 25a6add: Added `and` and `or` operators; Fixed doco

## 1.0.8

### Patch Changes

- fe4f31e: Added operators array:map and object:keys; aliases has to object:has

## 1.0.7

### Patch Changes

- 3e62010: Run tests as part of build
- 8773b1c: Fix packages

## 1.0.6

### Patch Changes

- 5673400: Docs

## 1.0.5

### Patch Changes

- 29bb4f5: Docs
- 411a1ca: Readme

## 1.0.4

### Patch Changes

- 0eb7a19: Changed registry to Map based class

## 1.0.3

### Patch Changes

- 572bfed: Tweaking build

## 1.0.2

### Patch Changes

- 9ebaf54: Tweaking build

## 1.0.1

### Patch Changes

- 3cfbe6a: Changed dist build
