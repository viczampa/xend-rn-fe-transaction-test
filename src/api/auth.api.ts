import { apiClient } from './client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginCustomer {
  id: string;
  customerType: string;
  displayName?: string;
  status?: string;
  accessToken: string;
  expiresAt?: number;
  providers?: { custodial?: boolean; web3?: boolean };
}

/** Matches `POST /user/login` on dev.xendora.com — token is per-customer. */
export interface LoginResponse {
  userId: string;
  lang?: string;
  roles?: string[];
  customers: LoginCustomer[];
}

function extractAccessToken(data: LoginResponse): string | undefined {
  const fromCustomer = data.customers?.[0]?.accessToken;
  if (fromCustomer) return fromCustomer;
  const legacy = data as LoginResponse & {
    access_token?: string;
    accessToken?: string;
    token?: string;
  };
  return legacy.access_token ?? legacy.accessToken ?? legacy.token;
}

export async function login(payload: LoginPayload): Promise<string> {
  const { data } = await apiClient.post<LoginResponse>('/user/login', payload);
  const token = extractAccessToken(data);
  if (!token) {
    throw new Error(
      data.customers?.length === 0
        ? 'Login succeeded but no customer profile was returned'
        : 'No access token in login response',
    );
  }
  return token;
}
