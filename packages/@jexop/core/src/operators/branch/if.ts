import { lazy } from '../../utils.js';

// only the branch that is taken gets evaluated
export const ifOperator = lazy(
  (
    { condition, then, else: fallback },
    _context,
    evaluate = (value) => value,
  ) => evaluate(evaluate(condition) ? then : fallback) ?? null,
);
