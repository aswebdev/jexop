import type { Operator } from '../../types.js';
import { getPath, isObject, isPath } from '../../utils.js';

export const keysOperator: Operator = ({ path, object }) => {
  const value = isPath(path) ? getPath(object, path) : object;

  if (!isObject(value)) return null;
  return Object.keys(value);
};
