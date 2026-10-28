# JSON Expression Operators

The JSON Expression Operators library allows you to evaluate expressions with operators that are represented purely as JSON objects. It is completely extensible, giving you the ability to add or remove operators as required.

## Basic Usage

To use the library, first import the `evaluate` and `registry` functions from the `@jexop/core` package, then add the operators that you wish to use to the registry:

```typescript
import { evaluate, registry } from '@jexop/core';

// register all default operators
registry.addDefaults();
```

> **Note:** the shared `registry` starts **empty**. Until you call `registry.addDefaults()` (or add operators with `registry.add(...)` / `registry.set(...)`), no operators are registered, and every expression is returned unchanged, as an implicit literal. For example, `evaluate({ op: 'add', a: 1, b: 2 }, {})` returns the expression object itself rather than `3`.
>
> `Registry.from()` creates a separate registry that already includes the default operators.

Now you can construct an expression as a JSON object. Here's an example:

```typescript
const expression = {
  op: 'if',
  condition: {
    op: '>',
    left: {
      op: 'context',
      path: 'x',
    },
    right: {
      op: 'context',
      path: 'y',
    },
  },
  then: {
    op: 'context',
    path: 'foo',
  },
  else: 'something else',
};
```

In this example, the expression is checking if the value of `x` is greater than the value of `y`. If the condition is true, it returns the value of `foo` that is in the given context, otherwise it returns the string `'something else'`.

Finally, you can evaluate the expression by calling the `evaluate` function and providing the context required:

```typescript
const context = {
  foo: 'bar',
  x: 19,
  y: 7,
};

const result = evaluate(expression, context);
```

The `result` variable will contain the result of the expression evaluation.

### Adding Custom Operators

In addition to the default operators provided by `@jexop/core`, you can also add custom operators. To add a custom operator, use the `set` or `add` functions on the `registry`.

Here's an example of adding a custom operator called 'is' that checks if two values are equal:

```typescript
registry.set('is', ({ a, b }, ctx) => a === b);
```

You can also add multiple custom operators at once using the `add` function:

```typescript
registry.add({
  is: ({ a, b }, ctx) => a === b,
  "isn't": ({ a, b }, ctx) => a !== b,
});
```

Now you can use the custom operators in expressions. For example:

```typescript
const expression = {
  op: 'is',
  a: 45,
  b: 17,
};
const result = evaluate(expression, {}); // result will be false
```

### Non-singleton Usage

If you need isolated registries — for example, in tests or when running multiple independent configurations — you can instantiate `Registry` directly instead of using the shared singleton:

```typescript
import { Registry } from '@jexop/core';

const registry = new Registry();
registry.addDefaults();

// optionally add custom operators
registry.set('is', ({ a, b }) => a === b);

const result = registry.evaluate(expression, context);
```

`Registry.from(operators?, { addDefaults? })` is a shorthand that creates a registry with the default operators (unless `addDefaults` is `false`) plus any extra operators you pass in:

```typescript
const registry = Registry.from({ is: ({ a, b }) => a === b });
```

### Lazy Operators

Normally every property of an operator is evaluated before the operator is called. A _lazy_ operator receives its properties **unevaluated**, along with an `evaluate` function, so it can choose which properties to evaluate. The built-in `if`, `switch`, `and`, `or`, `nand` and `nor` operators work this way, so they only evaluate the branches or values they need.

```typescript
import { lazy } from '@jexop/core';

registry.set(
  'first-defined',
  lazy(({ values }, context, evaluate = (value) => value) => {
    if (!Array.isArray(values)) return null;
    for (const value of values) {
      const result = evaluate(value);
      if (result !== null && result !== undefined) return result;
    }
    return null;
  }),
);
```

`evaluate(expression, context?)` evaluates a sub-expression in the current context, or in the context you pass. Use the `evaluate = (value) => value` default shown above so the operator still works when it is called directly with values that are already evaluated.

### Return Values

Operators return `null` when their input is invalid or nothing matches. `evaluate` also returns `null` (never `undefined`) when an operator returns `undefined`, or when the expression is a value that can't be represented in JSON (a function, symbol or bigint).

## Operators

The `@jexop/core` package provides many basic operators by default. These operators cover common use cases and provide a good starting point for most applications.

Additionally, there are more operators available in the following packages:

- **[@jexop/color](https://www.npmjs.com/package/@jexop/color):** This package provides color-related operators using the dependency of [chroma-js](https://www.npmjs.com/package/chroma-js).
- **[@jexop/date-time](https://www.npmjs.com/package/@jexop/date-time):** This package provides date and time-related operators using the dependency of [luxon](https://www.npmjs.com/package/luxon).

You can install and use these packages to access a wider range of operators for your expressions.

## Literal properties and operator

Any property value that is not an object will be considered a literal value. Arrays will have each item evaluated.

Objects that have no `op` property will also be considered literal. Further to that there is a `literal` operator to ensure that the value is passed as-is. This may be useful
for returning objects that have an `op` property that are not intended to be evaluated.

### `literal`

Returns `value` as-it, without evaluation.

| Property           | Description                  |
| ------------------ | ---------------------------- |
| `value` (optional) | Literal value to be returned |

Examples

```jsonc
{
  "op": "literal",
  "value": {
    "op": "anything",
    "foo": "bar"
  }
}
```

```jsonc
{
  "op": "literal",
  "value": 17
}
```

```jsonc
{
  "op": "literal",
  "value": "could be anything"
}
```
