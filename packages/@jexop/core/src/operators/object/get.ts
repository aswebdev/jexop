import type { Operator } from '../../types.js';
import { getPath, isPath } from '../../utils.js';

export const getOperator: Operator = ({
  path,
  object,
  default: defaultValue,
}) => {
  if (!isPath(path)) return null;

  return getPath(object, path) ?? defaultValue ?? null;
};
