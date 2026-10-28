import { isObject, isString, lazy } from '../../utils.js';

// only the matching option (or the fallback) gets evaluated
export const switchOperator = lazy(
  ({ expr, options, fallback }, _context, evaluate = (value) => value) => {
    const key = evaluate(expr);
    // `options` may itself be an expression that returns the options object
    // (its values are then already evaluated)
    const isExpression = isObject(options) && isString(options.op);
    const opts = isExpression ? evaluate(options) : options;

    if (isString(key) && isObject(opts) && Object.hasOwn(opts, key)) {
      return (isExpression ? opts[key] : evaluate(opts[key])) ?? null;
    }
    return evaluate(fallback) ?? null;
  },
);
