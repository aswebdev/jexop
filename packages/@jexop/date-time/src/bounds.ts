import type { Operator } from '@jexop/core';
import { DateTime, type DateTimeUnit } from 'luxon';
import { toDateTime } from './utils.js';

const allowedUnits = new Set<DateTimeUnit>([
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
  'quarter',
  'year',
]);

const normalizeUnit = (value: unknown): DateTimeUnit | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return null;

  const singular = trimmed.endsWith('s') ? trimmed.slice(0, -1) : trimmed;
  if (!allowedUnits.has(singular as DateTimeUnit)) return null;

  return singular as DateTimeUnit;
};

const boundaryOperator =
  (mode: 'start' | 'end'): Operator<DateTime> =>
  ({ unit, date }) => {
    const normalizedUnit = normalizeUnit(unit);
    if (!normalizedUnit) return null;

    // defaults to now when no `date` is given
    const base =
      date === undefined || date === null ? DateTime.now() : toDateTime(date);
    if (!base) return null;

    return mode === 'start'
      ? base.startOf(normalizedUnit)
      : base.endOf(normalizedUnit);
  };

export const startOfNowOperator = boundaryOperator('start');
export const endOfNowOperator = boundaryOperator('end');
