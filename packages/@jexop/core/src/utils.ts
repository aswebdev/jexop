import type { LazyOperator, Operator } from './types.js';

export type Path = string | (string | number)[];

export const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value);

export const isString = (value: unknown): value is string =>
  typeof value === 'string';

export const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== undefined && value !== null && typeof value === 'object';

export const isPath = (value: unknown): value is Path => {
  if (isString(value)) return true;
  if (!Array.isArray(value)) return false;

  return value.every((item) => isNumber(item) || isString(item));
};

export const toNumber = (value: unknown): number | null => {
  if (value === null) return null;
  if (Array.isArray(value)) return value.length;

  const num = typeof value === 'number' ? value : Number(value);
  return isNumber(num) ? num : null;
};

export const isPrimitive = (value: unknown): boolean =>
  value === null ||
  value === undefined ||
  ['number', 'string', 'boolean'].includes(typeof value);

/** Marks an operator as lazy: it receives unevaluated properties and an `evaluate` function. */
export const lazy = <T>(operator: Operator<T>): LazyOperator<T> =>
  Object.assign(operator, { lazy: true as const });

export const isLazy = (operator: Operator): operator is LazyOperator =>
  (operator as Partial<LazyOperator>).lazy === true;

// matches `["quoted key"]`, `[index]` or a plain `key` segment
const pathSegment = /\[(["'])(.*?)\1\]|\[([^\]]*)\]|([^.[\]]+)/g;

/** Splits a path such as `a.b[0]["c.d"]` into its segments. */
const toPath = (path: Path): (string | number)[] =>
  Array.isArray(path)
    ? path
    : Array.from(
        path.matchAll(pathSegment),
        ([, , quoted, bracket, plain]) => quoted ?? bracket ?? plain,
      );

// like lodash, a string path that is an existing key is used as-is (e.g. `"a.b"`)
const directKey = (object: unknown, path: Path): string | null =>
  isString(path) && isObject(object) && path in object ? path : null;

/** Gets the value at `path` of `object`, or `undefined` if it cannot be resolved. */
export const getPath = (object: unknown, path: Path): unknown => {
  const key = directKey(object, path);
  if (key !== null) return (object as Record<string, unknown>)[key];

  let current = object;
  for (const key of toPath(path)) {
    if (current === null || current === undefined) return undefined;
    current = (current as Record<string | number, unknown>)[key];
  }
  return current;
};

/** Checks whether `path` is a path of own properties of `object`. */
export const hasPath = (object: unknown, path: Path): boolean => {
  const key = directKey(object, path);
  if (key !== null && Object.hasOwn(object as object, key)) return true;

  const keys = toPath(path);
  if (!keys.length) return false;

  let current = object;
  for (const key of keys) {
    if (current === null || current === undefined) return false;
    if (!Object.hasOwn(Object(current), key)) return false;
    current = (current as Record<string | number, unknown>)[key];
  }
  return true;
};
