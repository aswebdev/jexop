---
"@jexop/core": minor
"@jexop/color": minor
"@jexop/date-time": minor
---

Fix packaging: the CommonJS build is now real CommonJS, type declarations are published from `dist/types` (instead of pointing at the TypeScript sources), only `dist` is published, and `main` points to the CommonJS build. AMD and UMD builds have been removed. `@jexop/color` now uses `chroma-js` v3.
