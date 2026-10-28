import type { Operator } from '../../types.js';
import { toNumber } from '../../utils.js';

export const divideOperator: Operator<number> = ({ a, b }) => {
  const dividend = toNumber(a);
  const divisor = toNumber(b);
  if (dividend === null || divisor === null || divisor === 0) return null;

  return dividend / divisor;
};
