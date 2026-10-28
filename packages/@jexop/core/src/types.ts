/** Evaluates a (sub-)expression. The context defaults to the current context. */
export type Evaluate = (expression: unknown, context?: object) => unknown;

export type Operator<T = unknown> = (
  props: Record<string, unknown>,
  // biome-ignore lint/suspicious/noExplicitAny: operators may receive any context shape
  context?: any,
  evaluate?: Evaluate,
) => T | null;

/**
 * An operator that receives its properties unevaluated, along with an `evaluate`
 * function, so it can decide which properties to evaluate (e.g. to short-circuit).
 */
export type LazyOperator<T = unknown> = Operator<T> & { lazy: true };
