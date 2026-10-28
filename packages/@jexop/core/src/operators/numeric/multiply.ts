import type { Operator } from '../../types.js';
import { toNumber } from '../../utils.js';

export const multiplyOperator: Operator<number> = ({ a, b }) =>
  (toNumber(a) ?? 1) * (toNumber(b) ?? 1);
