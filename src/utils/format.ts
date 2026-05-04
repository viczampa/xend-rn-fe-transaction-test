const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  USDC: 'USDC',
  USDT: 'USDT',
  BTC: '₿',
  ETH: 'Ξ',
};

export function formatAmount(value: string | number, currency: string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(num)) return `— ${currency.toUpperCase()}`;

  const upper = currency.toUpperCase();
  const isFiat = ['USD', 'EUR', 'GBP', 'BRL'].includes(upper);
  const decimals = isFiat ? 2 : Math.min(6, countSignificantDecimals(num));
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const symbol = CURRENCY_SYMBOLS[upper];
  if (symbol && symbol.length === 1) return `${symbol}${formatted}`;
  return `${formatted} ${upper}`;
}

function countSignificantDecimals(n: number): number {
  const str = n.toString();
  const dot = str.indexOf('.');
  if (dot === -1) return 0;
  return Math.min(str.length - dot - 1, 6);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeDate(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(iso);
}

export function shortenHash(hash: string | null | undefined, chars = 8): string {
  if (!hash) return '—';
  if (hash.length <= chars * 2 + 2) return hash;
  return `${hash.slice(0, chars)}…${hash.slice(-chars)}`;
}

export function capitalise(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
