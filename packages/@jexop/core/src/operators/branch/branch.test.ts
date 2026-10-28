import { describe, expect, test, vi } from 'vitest';
import { evaluateRegistry, Registry } from '../../evaluate.js';
import { ifOperator } from './if.js';
import { switchOperator } from './switch.js';

const registry = Registry.from();

const spyRegistry = () => {
  const spy = vi.fn(() => 'spied');
  return { registry: Registry.from({ spy }), spy };
};

describe('branch', () => {
  describe('if', () => {
    test('returns `then` when the condition is truthy', () => {
      const expression = { op: 'if', condition: true, then: 1, else: 2 };
      expect(evaluateRegistry(registry, expression, {})).toBe(1);
    });

    test('returns `else` when the condition is falsy', () => {
      const expression = {
        op: 'if',
        condition: { op: 'context', path: 'flag' },
        then: 1,
        else: { op: 'context', path: 'fallback' },
      };
      expect(
        evaluateRegistry(registry, expression, { flag: 0, fallback: 'no' }),
      ).toBe('no');
    });

    test('returns null when the taken branch is missing', () => {
      expect(
        evaluateRegistry(registry, { op: 'if', condition: false, then: 1 }, {}),
      ).toBeNull();
    });

    test('only evaluates the branch that is taken', () => {
      const { registry, spy } = spyRegistry();
      const expression = {
        op: 'if',
        condition: true,
        then: 'yes',
        else: { op: 'spy' },
      };
      expect(evaluateRegistry(registry, expression, {})).toBe('yes');
      expect(spy).not.toHaveBeenCalled();

      expect(
        evaluateRegistry(registry, { ...expression, condition: false }, {}),
      ).toBe('spied');
      expect(spy).toHaveBeenCalledOnce();
    });

    test('works when called directly with evaluated props', () => {
      expect(ifOperator({ condition: true, then: 'a', else: 'b' })).toBe('a');
      expect(ifOperator({ condition: false, then: 'a', else: 'b' })).toBe('b');
    });
  });

  describe('switch', () => {
    const expression = {
      op: 'switch',
      expr: { op: 'context', path: 'foo' },
      options: {
        bar: { one: 'thing' },
        another: { op: 'context', path: 'value' },
      },
      fallback: 'default case',
    };

    test('returns the matching option', () => {
      expect(evaluateRegistry(registry, expression, { foo: 'bar' })).toEqual({
        one: 'thing',
      });
    });

    test('evaluates the matching option', () => {
      expect(
        evaluateRegistry(registry, expression, { foo: 'another', value: 9 }),
      ).toBe(9);
    });

    test('returns the fallback when nothing matches', () => {
      expect(evaluateRegistry(registry, expression, { foo: 'other' })).toBe(
        'default case',
      );
    });

    test('returns null when nothing matches and there is no fallback', () => {
      const { fallback: _, ...noFallback } = expression;
      expect(
        evaluateRegistry(registry, noFallback, { foo: 'other' }),
      ).toBeNull();
    });

    test('ignores inherited properties of the options', () => {
      for (const foo of [
        'constructor',
        'toString',
        '__proto__',
        'hasOwnProperty',
      ]) {
        expect(evaluateRegistry(registry, expression, { foo })).toBe(
          'default case',
        );
      }
    });

    test('returns the fallback for a non-string expr or invalid options', () => {
      expect(
        evaluateRegistry(
          registry,
          { op: 'switch', expr: 1, options: { 1: 'one' }, fallback: 'fb' },
          {},
        ),
      ).toBe('fb');
      expect(
        evaluateRegistry(
          registry,
          { op: 'switch', expr: 'a', options: 'a', fallback: 'fb' },
          {},
        ),
      ).toBe('fb');
    });

    test('accepts options from an expression', () => {
      expect(
        evaluateRegistry(
          registry,
          {
            op: 'switch',
            expr: 'b',
            options: { op: 'context', path: 'options' },
          },
          { options: { a: 1, b: 2 } },
        ),
      ).toBe(2);
    });

    test('does not evaluate options from an expression again', () => {
      expect(
        evaluateRegistry(
          registry,
          { op: 'switch', expr: 'a', options: { op: 'context', path: 'opts' } },
          { opts: { a: { op: 'literal', value: 1 } } },
        ),
      ).toEqual({ op: 'literal', value: 1 });
    });

    test('only evaluates the matching option', () => {
      const { registry, spy } = spyRegistry();
      const lazyExpression = {
        op: 'switch',
        expr: 'a',
        options: { a: 'A', b: { op: 'spy' } },
        fallback: { op: 'spy' },
      };
      expect(evaluateRegistry(registry, lazyExpression, {})).toBe('A');
      expect(spy).not.toHaveBeenCalled();
    });

    test('works when called directly with evaluated props', () => {
      expect(switchOperator({ expr: 'a', options: { a: 1 } })).toBe(1);
      expect(switchOperator({ expr: 'b', options: { a: 1 } })).toBeNull();
    });
  });
});
