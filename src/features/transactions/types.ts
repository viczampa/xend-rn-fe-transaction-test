export type TransactionType = 'WITHDRAWAL' | 'DEPOSIT' | 'EXCHANGE';
export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'PROCESSING' | 'RETURNED';
export type TransactionRail = 'SEPA' | 'ACH' | 'WIRE' | 'CRYPTO' | string;

export interface TransactionAddress {
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
}

export interface TransactionAmount {
  value: string;
  currency: string;
}

export interface TransactionPartyDetails {
  // Crypto rails
  address?: string | null;
  asset?: string | null;
  network?: string | null;
  walletId?: string | null;
  tag?: string | null;
  memo?: string | null;
  // Fiat rails (SEPA / ACH / WIRE)
  accountOwnerName?: string | null;
  accountOwnerType?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
  iban?: string | null;
  bic?: string | null;
  [key: string]: unknown;
}

export interface TransactionParty {
  name: string;
  amount: TransactionAmount;
  address: TransactionAddress;
  accountId: string | null;
  customerId: string | null;
  counterpartyId: string | null;
  rail: TransactionRail;
  details: TransactionPartyDetails;
}

export interface TransactionRaw {
  id: string;
  state: string;
  amount: string;
  currency: string;
  created_at: string;
  receipt_url: string | null;
  from_address: string | null;
  deposit_tx_hash: string | null;
  destination_tx_hash: string | null;
  destination_uetr: string | null;
  destination_currency: string | null;
  receipt_exchange_rate: string | null;
  receipt_initial_amount: string | null;
  receipt_outgoing_amount: string | null;
  receipt_converted_amount: string | null;
  destination_payment_rail: string | null;
  destination_sepa_reference: string | null;
  [key: string]: unknown;
}

export interface Transaction {
  id: string;
  createdAt: string;
  provider: string;
  providerId: string;
  providerEventId: string | null;
  type: TransactionType;
  status: TransactionStatus;
  rail: TransactionRail;
  rawStatus: string;
  description: string | null;
  accountId: string;
  customerId: string;
  counterpartyId: string | null;
  depositInstructionId: string | null;
  imad: string | null;
  references: unknown | null;
  date: string;
  completedAt: string | null;
  raw: TransactionRaw;
  source: TransactionParty;
  destination: TransactionParty;
}

export interface TransactionsMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages?: number;
}

export interface TransactionsResponse {
  data: Transaction[];
  meta?: TransactionsMeta;
}

export type SortField = 'date' | 'amount';
export type SortOrder = 'asc' | 'desc';

export interface TransactionFilters {
  search: string;
  assetFilter: string | undefined;
  typeFilter: TransactionType | undefined;
  sortBy: SortField;
  sortOrder: SortOrder;
}
