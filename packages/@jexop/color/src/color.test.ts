import { Registry } from '@jexop/core';
import { describe, expect, test } from 'vitest';
import { colorOperators } from './index.js';

const registry = Registry.from(colorOperators);

describe('color', () => {
  describe('color-range', () => {
    test('interpolates between two colors', () => {
      const range = { op: 'color-range', from: '#000000', to: '#ffffff' };
      expect(registry.evaluate({ ...range, value: 0 }, {})).toBe('#000000');
      expect(registry.evaluate({ ...range, value: 1 }, {})).toBe('#ffffff');
      expect(registry.evaluate({ ...range, value: 0.5 }, {})).toBe('#b4b4b4');
    });

    test('defaults to black and white', () => {
      expect(registry.evaluate({ op: 'color-range', value: 1 }, {})).toBe(
        '#ffffff',
      );
    });

    test('returns null for a non-numeric value', () => {
      expect(
        registry.evaluate({ op: 'color-range', value: 'x' }, {}),
      ).toBeNull();
    });
  });

  describe('color-alpha', () => {
    test('sets the opacity of a color', () => {
      expect(
        registry.evaluate(
          { op: 'color-alpha', color: 'red', opacity: 0.5 },
          {},
        ),
      ).toBe('#ff000080');
    });

    test('returns null for a non-numeric opacity', () => {
      expect(
        registry.evaluate(
          { op: 'color-alpha', color: 'red', opacity: 'x' },
          {},
        ),
      ).toBeNull();
    });
  });

  test('works with the default operators', () => {
    expect(
      registry.evaluate(
        {
          op: 'color-alpha',
          color: { op: 'context', path: 'color' },
          opacity: { op: '/', a: 1, b: 4 },
        },
        { color: '#0000ff' },
      ),
    ).toBe('#0000ff40');
  });
});
