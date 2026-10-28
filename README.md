# jexop — JSON Expression Operators

Evaluate expressions written as plain JSON objects. An expression is an object with an `op` property naming the operator, plus whatever properties that operator takes. Property values can be literals or nested expressions, so expressions can be stored, sent over the wire, and evaluated anywhere.

```typescript
import { Registry } from '@jexop/core';

const registry = Registry.from(); // includes the default operators

const expression = {
  op: 'if',
  condition: { op: '>', left: { op: 'context', path: 'score' }, right: 50 },
  then: 'pass',
  else: 'fail',
};

registry.evaluate(expression, { score: 72 }); // => 'pass'
```

## Packages

| Package                                           | Description                                                                                                |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [`@jexop/core`](./packages/@jexop/core)           | The evaluator, the registry, and the default operators (boolean, branch, equality, numeric, object, array) |
| [`@jexop/color`](./packages/@jexop/color)         | Color operators, powered by [chroma-js](https://www.npmjs.com/package/chroma-js)                           |
| [`@jexop/date-time`](./packages/@jexop/date-time) | Date and time operators, powered by [luxon](https://www.npmjs.com/package/luxon)                           |

```bash
pnpm add @jexop/core
# optional operator packages
pnpm add @jexop/color
pnpm add @jexop/date-time luxon
```

Each package ships ESM and CommonJS builds with TypeScript declarations.

### Documentation

- [Getting started, custom and lazy operators](./packages/@jexop/core/INTRO.md)
- Core operators: [array](./packages/@jexop/core/src/operators/array/README.md), [boolean](./packages/@jexop/core/src/operators/boolean/README.md), [branch](./packages/@jexop/core/src/operators/branch/README.md), [equality](./packages/@jexop/core/src/operators/equality/README.md), [numeric](./packages/@jexop/core/src/operators/numeric/README.md), [object](./packages/@jexop/core/src/operators/object/README.md)
- [Color operators](./packages/@jexop/color/src/README.md)
- [Date-time operators](./packages/@jexop/date-time/src/README.md)

> The shared `registry` exported by `@jexop/core` starts **empty**. Call `registry.addDefaults()` before using `evaluate`, or use `Registry.from()` to create a registry that already has the default operators.

## Development

This is a [pnpm](https://pnpm.io) workspace. It needs Node.js 22.12 or later, and the pnpm version set in `packageManager` (run `corepack enable` to use it automatically).

```bash
pnpm install        # install dependencies
pnpm build          # build all packages (ESM, CJS and type declarations into dist/)
pnpm test           # run all tests (vitest)
pnpm test:watch     # run tests in watch mode
pnpm lint           # biome, type checks and unused-code checks (knip)
pnpm lint:biome:fix # format and apply safe lint fixes
pnpm build:docs     # generate each package's README.md from its docs
```

Tests and type checks run against the workspace sources, so you don't need to build first.

### Releasing

Releases use [changesets](https://github.com/changesets/changesets). For any user-facing change, add a changeset describing it:

```bash
pnpm changeset
```

When changes are merged to `master`, the release workflow opens (or updates) a "publish update" pull request. Merging that pull request publishes the new versions to npm.

## License

[MIT](./LICENSE)
