import type { Operator } from '../../types.js';
import { toNumber } from '../../utils.js';

export const addOperator: Operator<number> = ({ a, b }) =>
  (toNumber(a) ?? 0) + (toNumber(b) ?? 0);
