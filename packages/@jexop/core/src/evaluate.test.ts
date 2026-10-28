import { describe, expect, test } from 'vitest';
import { evaluate, evaluateRegistry, Registry, registry } from './evaluate.js';

describe('evaluate', () => {
  test('the shared registry starts empty', () => {
    expect(registry.size).toBe(0);
    const expression = { op: 'add', a: 1, b: 2 };
    expect(evaluate(expression, {})).toBe(expression);
  });

  test('Registry.from adds the default operators', () => {
    expect(Registry.from().evaluate({ op: 'add', a: 1, b: 2 }, {})).toBe(3);
    expect(Registry.from({}, { addDefaults: false }).size).toBe(0);
  });

  test('returns primitives as-is', () => {
    const r = Registry.from();
    for (const value of [1, 'a', true, null, undefined]) {
      expect(evaluateRegistry(r, value, {})).toBe(value);
    }
  });

  test('returns null for unsupported value types', () => {
    const r = Registry.from();
    expect(evaluateRegistry(r, () => 1, {})).toBeNull();
    expect(evaluateRegistry(r, Symbol('x'), {})).toBeNull();
    expect(evaluateRegistry(r, 10n, {})).toBeNull();
  });

  test('returns null when an operator returns undefined', () => {
    const r = Registry.from({ nothing: () => undefined as unknown as null });
    expect(evaluateRegistry(r, { op: 'nothing' }, {})).toBeNull();
  });

  test('passes the context to operators', () => {
    const r = Registry.from({ who: (_props, ctx) => ctx.name });
    expect(r.evaluate({ op: 'who' }, { name: 'jexop' })).toBe('jexop');
  });

  describe('array:map', () => {
    test('maps over items from a context expression', () => {
      // `items` is evaluated in a nested context: `{ context }`
      const result = Registry.from().evaluate(
        {
          op: 'array:map',
          items: { op: 'context', path: 'context.xs' },
          to: { op: '*', a: { op: 'context', path: 'item' }, b: 2 },
        },
        { xs: [1, 2, 3] },
      );
      expect(result).toEqual([2, 4, 6]);
    });

    test('provides the index and the outer context', () => {
      const result = Registry.from().evaluate(
        {
          op: 'array:map',
          items: ['a', 'b'],
          to: {
            op: '+',
            a: { op: 'context', path: 'index' },
            b: { op: 'context', path: 'context.offset' },
          },
        },
        { offset: 10 },
      );
      expect(result).toEqual([10, 11]);
    });
  });
});
