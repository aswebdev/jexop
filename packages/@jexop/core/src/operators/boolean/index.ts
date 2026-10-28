import type { Evaluate, Operator } from '../../types.js';
import { lazy } from '../../utils.js';

const notOperator: Operator<boolean> = ({ value }) =>
  value === null || value === undefined ? null : !value;

const identity: Evaluate = (value) => value;

// `stopOn` is the value that short-circuits the operation (false for and, true for or)
const booleanOperator = (stopOn: boolean, not = false) =>
  lazy<boolean>(({ values }, _context, evaluate = identity) => {
    // a literal array is evaluated item by item, so evaluation can stop early
    const isLiteral = Array.isArray(values);
    const items = isLiteral ? values : evaluate(values);
    if (!Array.isArray(items)) return null;
    if (!items.length) return false;

    let reduction = !stopOn;
    for (const item of items) {
      if (!!(isLiteral ? evaluate(item) : item) === stopOn) {
        reduction = stopOn;
        break;
      }
    }
    return not !== reduction;
  });

export const booleanOperators = {
  not: notOperator,
  '!': notOperator,
  and: booleanOperator(false),
  '&&': booleanOperator(false),
  nand: booleanOperator(false, true),
  or: booleanOperator(true),
  '||': booleanOperator(true),
  nor: booleanOperator(true, true),
};
