import type { Operator } from '../../types.js';
import { getPath, isPath } from '../../utils.js';

export const contextOperator: Operator = (
  { path, default: defaultValue },
  context,
) => {
  if (!context || typeof context !== 'object') return null;

  if (!isPath(path)) return context;

  return getPath(context, path) ?? defaultValue ?? null;
};
