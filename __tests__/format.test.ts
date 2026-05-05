import {
  formatAmount,
  formatDate,
  formatRelativeDate,
  shortenHash,
  capitalise,
} from '../src/utils/format';

describe('formatAmount', () => {
  it('formats USDC with 2 decimal places', () => {
    expect(formatAmount('49.000000000000000000', 'USDC')).toBe('49.00 USDC');
  });

  it('formats EUR with € symbol', () => {
    expect(formatAmount('41.8', 'EUR')).toBe('€41.80');
  });

  it('formats USD with $ symbol', () => {
    expect(formatAmount('1850', 'USD')).toBe('$1,850.00');
  });

  it('handles NaN gracefully', () => {
    expect(formatAmount('not-a-number', 'EUR')).toBe('— EUR');
  });

  it('accepts numeric input', () => {
    expect(formatAmount(100, 'USD')).toBe('$100.00');
  });
});

describe('formatDate', () => {
  it('formats a valid ISO date string', () => {
    const result = formatDate('2026-04-09T08:07:17.922Z');
    expect(result).toMatch(/Apr 9, 2026/);
  });
});

describe('formatRelativeDate', () => {
  it('returns "Today" for today\'s date', () => {
    const now = new Date().toISOString();
    expect(formatRelativeDate(now)).toBe('Today');
  });

  it('returns "Yesterday" for yesterday', () => {
    const yesterday = new Date(Date.now() - 86_400_000).toISOString();
    expect(formatRelativeDate(yesterday)).toBe('Yesterday');
  });

  it('returns formatted date for old dates', () => {
    const old = '2024-01-01T00:00:00.000Z';
    expect(formatRelativeDate(old)).toBe(formatDate(old));
  });
});

describe('shortenHash', () => {
  it('returns — for null', () => {
    expect(shortenHash(null)).toBe('—');
  });

  it('returns — for undefined', () => {
    expect(shortenHash(undefined)).toBe('—');
  });

  it('shortens a long hash', () => {
    const hash = '0xcbd950d26c8625f744b34a4da087f3addabed48905723ec1154f03e151625335';
    const result = shortenHash(hash);
    expect(result).toContain('…');
    expect(result.length).toBeLessThan(hash.length);
  });

  it('returns the full hash if short enough', () => {
    const short = '0x1234';
    expect(shortenHash(short)).toBe(short);
  });

  it('returns — for non-string values (API shape drift)', () => {
    expect(shortenHash({ foo: 'bar' })).toBe('—');
    expect(shortenHash(['a'])).toBe('—');
  });

  it('stringifies numbers', () => {
    expect(shortenHash(12345)).toBe('12345');
  });
});

describe('capitalise', () => {
  it('capitalises COMPLETED → Completed', () => {
    expect(capitalise('COMPLETED')).toBe('Completed');
  });

  it('handles empty string', () => {
    expect(capitalise('')).toBe('');
  });

  it('lowercases everything after first char', () => {
    expect(capitalise('SEPA')).toBe('Sepa');
  });
});
