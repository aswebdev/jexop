---
"@jexop/core": minor
---

- `if`, `switch`, `and`/`&&`, `or`/`||`, `nand` and `nor` are now lazy: they only evaluate the branches/values they need (`and`/`or` short-circuit).
- Add `lazy()` to create custom lazy operators, which receive unevaluated properties and an `evaluate` function.
- `switch` only matches the options object's own keys (no longer returns inherited properties such as `constructor`), evaluates the matching option, and returns `null` when nothing matches and there is no `fallback`.
- `divide` returns `null` when either value is not numeric (it used to treat them as `1`).
- `evaluate` returns `null` instead of `undefined` for unsupported values (functions, symbols, bigints) and for operators that return `undefined`.
- `get` and `context` return `default` when the value is `null` as well as when it is missing, as documented.
- Export `Registry` and `evaluateRegistry`.
- Remove the `lodash` dependency.
