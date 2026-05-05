import type { Transaction, TransactionFilters } from './types';
import { getCounterpartyLabel } from './counterparty';

/** Fields matched client-side only — full payload is already in cache after prefetch. */
function partySearchSlice(party: Transaction['source']): string {
  const d = party.details;
  const bits = [
    party.name,
    d.bankName,
    d.accountOwnerName,
    d.firstName,
    d.lastName,
    d.iban,
    d.bic,
    d.address,
  ];
  return bits.filter((x): x is string => typeof x === 'string' && x.trim().length > 0).join(' ');
}

/** Lowercased blob for substring search (counterparty label + names + bank / rail details). */
export function buildTransactionSearchHaystack(t: Transaction): string {
  return [
    getCounterpartyLabel(t),
    partySearchSlice(t.source),
    partySearchSlice(t.destination),
    t.description ?? '',
  ]
    .join(' ')
    .toLowerCase();
}

export function filterTransactionsLocal(
  list: Transaction[],
  filters: Pick<TransactionFilters, 'search' | 'assetFilter' | 'typeFilter'>,
): Transaction[] {
  const term = filters.search.trim().toLowerCase();
  const asset = filters.assetFilter?.toUpperCase();
  const type = filters.typeFilter;

  return list.filter((t) => {
    if (type && t.type !== type) return false;
    if (asset) {
      const src = t.source.amount.currency.toUpperCase();
      const dst = t.destination.amount.currency.toUpperCase();
      if (src !== asset && dst !== asset) return false;
    }
    if (term) {
      const haystack = buildTransactionSearchHaystack(t);
      if (!haystack.includes(term)) return false;
    }
    return true;
  });
}
