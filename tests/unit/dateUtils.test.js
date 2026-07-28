import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  addMonthsUTC,
  addYearsUTC,
  getBrowserTimeZone,
  getISOWeekStartUTC,
  getISOWeeksInYearUTC,
  getLocalDateUTC,
  startOfISOWeekUTC,
} from '../../js/dateUtils.js';

const TEST_TIMEZONES = [
  ['UTC', '2025-01-01T00:30:00Z', '2025-01-01'],
  ['America/Los_Angeles', '2025-01-01T00:30:00Z', '2024-12-31'],
  ['Europe/London', '2025-01-01T00:30:00Z', '2025-01-01'],
  ['Asia/Tokyo', '2024-12-31T16:00:00Z', '2025-01-01'],
  ['Pacific/Auckland', '2024-12-31T11:30:00Z', '2025-01-01'],
];

describe('dateUtils', () => {
  let originalTimezone;

  beforeEach(() => {
    originalTimezone = process.env.TZ;
  });

  afterEach(() => {
    if (originalTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimezone;
    vi.restoreAllMocks();
  });

  it.each(TEST_TIMEZONES)(
    'encodes the local calendar date in %s',
    (timezone, instant, expectedDate) => {
      process.env.TZ = timezone;
      expect(getLocalDateUTC(new Date(instant)).toISOString().slice(0, 10)).toBe(expectedDate);
    },
  );

  it('keeps the local date stable across a daylight-saving transition', () => {
    process.env.TZ = 'America/Los_Angeles';
    expect(getLocalDateUTC(new Date('2025-03-09T09:59:59Z')).toISOString().slice(0, 10))
      .toBe('2025-03-09');
    expect(getLocalDateUTC(new Date('2025-03-09T10:00:00Z')).toISOString().slice(0, 10))
      .toBe('2025-03-09');
  });

  it('reports the resolved IANA timezone and falls back to UTC', () => {
    process.env.TZ = 'Asia/Tokyo';
    expect(getBrowserTimeZone()).toBe('Asia/Tokyo');

    vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => {
      throw new Error('unsupported');
    });
    expect(getBrowserTimeZone()).toBe('UTC');
  });

  it('clamps month-end and leap-day calendar arithmetic', () => {
    expect(addMonthsUTC(new Date('2025-01-31T00:00:00Z'), 1).toISOString().slice(0, 10))
      .toBe('2025-02-28');
    expect(addYearsUTC(new Date('2024-02-29T00:00:00Z'), 1).toISOString().slice(0, 10))
      .toBe('2025-02-28');
  });

  it('adds months across years in both directions', () => {
    expect(addMonthsUTC(new Date('2025-01-31T00:00:00Z'), -1).toISOString().slice(0, 10))
      .toBe('2024-12-31');
    expect(addMonthsUTC(new Date('2025-10-31T00:00:00Z'), 15).toISOString().slice(0, 10))
      .toBe('2027-01-31');
  });

  it('adds fractional and negative years with month precision', () => {
    expect(addYearsUTC(new Date('2024-02-29T00:00:00Z'), -1).toISOString().slice(0, 10))
      .toBe('2023-02-28');
    expect(addYearsUTC(new Date('2024-02-29T00:00:00Z'), 1.5).toISOString().slice(0, 10))
      .toBe('2025-08-29');
  });

  it('calculates ISO week boundaries including 53-week years', () => {
    expect(startOfISOWeekUTC(new Date('2025-01-05T00:00:00Z')).toISOString().slice(0, 10))
      .toBe('2024-12-30');
    expect(getISOWeekStartUTC(2026).toISOString().slice(0, 10)).toBe('2025-12-29');
    expect(getISOWeeksInYearUTC(2025)).toBe(52);
    expect(getISOWeeksInYearUTC(2026)).toBe(53);
  });
});
