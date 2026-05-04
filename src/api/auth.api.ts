import { apiClient } from './client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token?: string;
  accessToken?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    customerId?: string;
  };
}

export async function login(payload: LoginPayload): Promise<string> {
  const { data } = await apiClient.post<LoginResponse>('/users/login', payload);
  const token = data.access_token ?? data.accessToken ?? data.token;
  if (!token) throw new Error('No token in login response');
  return token;
}
