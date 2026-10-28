import { describe, expect, test, vi } from 'vitest';
import { evaluateRegistry, Registry } from '../../evaluate.js';

const setup = () => {
  const spy = vi.fn(() => true);
  return { registry: Registry.from({ spy }), spy };
};

describe('boolean short-circuit', () => {
  test.each(['and', '&&', 'nand'])(
    '%s stops at the first falsy value',
    (op) => {
      const { registry, spy } = setup();
      evaluateRegistry(registry, { op, values: [true, 0, { op: 'spy' }] }, {});
      expect(spy).not.toHaveBeenCalled();
    },
  );

  test.each(['or', '||', 'nor'])('%s stops at the first truthy value', (op) => {
    const { registry, spy } = setup();
    evaluateRegistry(registry, { op, values: [false, 'x', { op: 'spy' }] }, {});
    expect(spy).not.toHaveBeenCalled();
  });

  test('evaluates values until the result is known', () => {
    const { registry, spy } = setup();
    expect(
      evaluateRegistry(
        registry,
        { op: 'and', values: [true, { op: 'spy' }] },
        {},
      ),
    ).toBe(true);
    expect(spy).toHaveBeenCalledOnce();
  });

  test.each([
    ['and', [true, 1, 'a'], true],
    ['and', [true, null], false],
    ['nand', [true, 1], false],
    ['nand', [true, false], true],
    ['or', [0, '', null], false],
    ['or', [0, 1], true],
    ['nor', [0, null], true],
    ['nor', [0, true], false],
  ])('%s %j returns %s', (op, values, expected) => {
    expect(evaluateRegistry(Registry.from(), { op, values }, {})).toBe(
      expected,
    );
  });

  test('accepts values from an expression', () => {
    const registry = Registry.from();
    const context = { flags: [true, false] };
    const values = { op: 'context', path: 'flags' };
    expect(evaluateRegistry(registry, { op: 'and', values }, context)).toBe(
      false,
    );
    expect(evaluateRegistry(registry, { op: 'or', values }, context)).toBe(
      true,
    );
  });

  test('does not evaluate the results of a values expression again', () => {
    const registry = Registry.from();
    const context = { items: [{ op: 'literal', value: false }] };
    expect(
      evaluateRegistry(
        registry,
        { op: 'and', values: { op: 'context', path: 'items' } },
        context,
      ),
    ).toBe(true);
  });

  test('returns null when values is not an array, false when empty', () => {
    const registry = Registry.from();
    expect(
      evaluateRegistry(registry, { op: 'and', values: 'x' }, {}),
    ).toBeNull();
    expect(evaluateRegistry(registry, { op: 'or', values: [] }, {})).toBe(
      false,
    );
  });
});
