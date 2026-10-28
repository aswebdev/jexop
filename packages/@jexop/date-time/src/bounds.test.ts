import { DateTime, Settings } from 'luxon';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { endOfNowOperator, startOfNowOperator } from './bounds.js';

const fixedMillis = DateTime.fromISO('2023-08-10T13:10:40.655Z').toMillis();
let originalNow: typeof Settings.now;
let originalZone: typeof Settings.defaultZone;

beforeAll(() => {
  originalNow = Settings.now;
  originalZone = Settings.defaultZone;
  Settings.now = () => fixedMillis;
  Settings.defaultZone = 'UTC';
});

afterAll(() => {
  Settings.now = originalNow;
  Settings.defaultZone = originalZone;
});

describe('bounds', () => {
  test('startOfNowOperator returns the start of the provided unit', () => {
    const now = DateTime.now();
    const units = [
      'second',
      'minute',
      'hour',
      'day',
      'week',
      'month',
      'quarter',
      'year',
    ] as const;
    for (const unit of units) {
      expect(startOfNowOperator({ unit })?.toMillis()).toBe(
        now.startOf(unit).toMillis(),
      );
    }
  });

  test('endOfNowOperator returns the end of the provided unit', () => {
    const now = DateTime.now();
    const units = [
      'second',
      'minute',
      'hour',
      'day',
      'week',
      'month',
      'quarter',
      'year',
    ] as const;
    for (const unit of units) {
      expect(endOfNowOperator({ unit })?.toMillis()).toBe(
        now.endOf(unit).toMillis(),
      );
    }
  });

  test('operators accept plural units', () => {
    expect(startOfNowOperator({ unit: 'hours' })?.toMillis()).toBe(
      DateTime.now().startOf('hour').toMillis(),
    );
    expect(endOfNowOperator({ unit: 'months' })?.toMillis()).toBe(
      DateTime.now().endOf('month').toMillis(),
    );
  });

  test('operators return null for invalid units', () => {
    expect(startOfNowOperator({ unit: 'fortnight' })).toBeNull();
    expect(startOfNowOperator({ unit: '' })).toBeNull();
    expect(endOfNowOperator({ unit: 3 })).toBeNull();
    expect(endOfNowOperator({})).toBeNull();
  });

  test('operators use the given date instead of now', () => {
    expect(
      startOfNowOperator({
        unit: 'month',
        date: '2024-02-15T10:30:00Z',
      })?.toISO(),
    ).toBe('2024-02-01T00:00:00.000Z');
    expect(
      endOfNowOperator({
        unit: 'quarter',
        date: '2024-02-15T10:30:00Z',
      })?.toISO(),
    ).toBe('2024-03-31T23:59:59.999Z');
    expect(
      startOfNowOperator({
        unit: 'day',
        date: DateTime.fromISO('2024-02-15T10:30:00Z').toMillis(),
      })?.toISO(),
    ).toBe('2024-02-15T00:00:00.000Z');
  });

  test('operators accept unit names case-insensitively', () => {
    expect(startOfNowOperator({ unit: ' Day ' })?.toMillis()).toBe(
      DateTime.now().startOf('day').toMillis(),
    );
  });

  test('operators return null for an invalid date', () => {
    expect(startOfNowOperator({ unit: 'day', date: 'not a date' })).toBeNull();
    expect(endOfNowOperator({ unit: 'day', date: [] })).toBeNull();
  });
});
