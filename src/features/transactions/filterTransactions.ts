import type { Transaction, TransactionFilters } from './types';
import { getCounterpartyLabel } from './counterparty';

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
      const haystack = getCounterpartyLabel(t).toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    return true;
  });
}
