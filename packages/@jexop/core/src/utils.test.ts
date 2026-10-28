import { describe, expect, test } from 'vitest';
import { getPath, hasPath } from './utils.js';

const object = {
  a: { b: [{ c: 1 }, { c: null }] },
  'x.y': 'direct',
  'with space': { v: 2 },
  zero: 0,
};

describe('utils', () => {
  describe('getPath', () => {
    test.each([
      ['a.b[0].c', 1],
      ['a.b.0.c', 1],
      ['a.b[1].c', null],
      ['a.b[2].c', undefined],
      ['x.y', 'direct'],
      ['["with space"].v', 2],
      ["['with space'].v", 2],
      ['zero', 0],
      ['missing.deep', undefined],
    ])('%s', (path, expected) => {
      expect(getPath(object, path)).toBe(expected);
    });

    test('accepts array paths', () => {
      expect(getPath(object, ['a', 'b', 0, 'c'])).toBe(1);
      expect(getPath(object, ['x.y'])).toBe('direct');
    });

    test('handles non-object input', () => {
      expect(getPath(null, 'a')).toBeUndefined();
      expect(getPath(undefined, 'a')).toBeUndefined();
      expect(getPath('abc', 'length')).toBe(3);
    });
  });

  describe('hasPath', () => {
    test.each([
      ['a.b[0].c', true],
      ['a.b[1].c', true],
      ['a.b[2].c', false],
      ['x.y', true],
      ['zero', true],
      ['missing', false],
      ['constructor', false],
      ['a.toString', false],
      ['', false],
    ])('%s', (path, expected) => {
      expect(hasPath(object, path)).toBe(expected);
    });

    test('handles non-object input', () => {
      expect(hasPath(null, 'a')).toBe(false);
      expect(hasPath([1, 2], '1')).toBe(true);
      expect(hasPath([1, 2], [2])).toBe(false);
    });
  });
});
