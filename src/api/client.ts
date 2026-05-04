import axios from 'axios';
import { getAuthToken, removeAuthToken } from './authTokenStorage';

export { TOKEN_KEY } from './authTokenStorage';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeAuthToken();
    }
    return Promise.reject(error);
  },
);
