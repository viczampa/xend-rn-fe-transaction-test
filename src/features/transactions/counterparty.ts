import type { Transaction } from './types';

export function getCounterpartyLabel(t: Transaction): string {
  if (t.type === 'WITHDRAWAL') return t.destination.name || 'Unknown';
  if (t.type === 'DEPOSIT') return t.source.name || 'Unknown';
  return `${t.source.amount.currency.toUpperCase()} → ${t.destination.amount.currency.toUpperCase()}`;
}
