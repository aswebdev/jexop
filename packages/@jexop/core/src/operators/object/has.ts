import type { Operator } from '../../types.js';
import { hasPath, isPath } from '../../utils.js';

export const hasOperator: Operator<boolean> = ({ path, object }) => {
  if (!isPath(path)) return false;

  return hasPath(object, path);
};
