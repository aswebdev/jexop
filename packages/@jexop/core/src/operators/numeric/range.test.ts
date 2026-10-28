import { describe, expect, test } from 'vitest';
import { clampOperator } from './clamp.js';
import { divideOperator } from './divide.js';
import { normalizeOperator } from './normalize.js';

describe('numeric', () => {
  describe('divide', () => {
    test('divides a by b', () => {
      expect(divideOperator({ a: 10, b: 2 })).toBe(5);
      expect(divideOperator({ a: '9', b: '3' })).toBe(3);
      expect(divideOperator({ a: 0, b: 5 })).toBe(0);
    });

    test('returns null when dividing by zero', () => {
      expect(divideOperator({ a: 10, b: 0 })).toBeNull();
    });

    test('returns null for non-numeric input', () => {
      expect(divideOperator({ a: 'x', b: 4 })).toBeNull();
      expect(divideOperator({ a: 4, b: 'x' })).toBeNull();
      expect(divideOperator({ a: 4 })).toBeNull();
      expect(divideOperator({ b: 4 })).toBeNull();
      expect(divideOperator({ a: null, b: 4 })).toBeNull();
    });
  });

  describe('clamp', () => {
    test('clamps the value to the range', () => {
      expect(clampOperator({ min: 0, max: 10, value: -5 })).toBe(0);
      expect(clampOperator({ min: 0, max: 10, value: 15 })).toBe(10);
      expect(clampOperator({ min: 0, max: 10, value: 5 })).toBe(5);
    });

    test('ignores a missing bound', () => {
      expect(clampOperator({ max: 10, value: -5 })).toBe(-5);
      expect(clampOperator({ min: 0, value: 15 })).toBe(15);
    });

    test('returns null for a non-numeric value', () => {
      expect(clampOperator({ min: 0, max: 10, value: 'x' })).toBeNull();
    });
  });

  describe('normalize', () => {
    test('maps the value to 0..1', () => {
      expect(normalizeOperator({ min: 0, max: 10, value: 5 })).toBe(0.5);
      expect(normalizeOperator({ min: 10, max: 20, value: 12 })).toBeCloseTo(
        0.2,
      );
    });

    test('clamps values outside the range', () => {
      expect(normalizeOperator({ min: 0, max: 10, value: -1 })).toBe(0);
      expect(normalizeOperator({ min: 0, max: 10, value: 11 })).toBe(1);
    });

    test('returns null when min equals max and the value is in range', () => {
      expect(normalizeOperator({ min: 5, max: 5, value: 5 })).toBeNull();
      expect(normalizeOperator({ min: 5, max: 5, value: 4 })).toBe(0);
      expect(normalizeOperator({ min: 5, max: 5, value: 6 })).toBe(1);
    });

    test('returns null for non-numeric input', () => {
      expect(normalizeOperator({ min: 0, max: 'x', value: 1 })).toBeNull();
    });
  });
});
