import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL, API_TIMEOUT, RETRY_CONFIG } from '@/constants/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  data?: any;
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store for token (can be from Clerk or backend JWT)
let authToken: string | null = null;

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Try to get token from secure store
      const token = await SecureStore.getItemAsync('authToken');
      if (token && token.trim() !== '') {
        authToken = token;
        config.headers.Authorization = `Bearer ${token}`;
      } else if (!authToken) {
        // No token in storage and no memory token - clear auth header
        delete config.headers.Authorization;
      } else if (authToken) {
        // Use memory token if available
        config.headers.Authorization = `Bearer ${authToken}`;
      }
    } catch (error) {
      console.warn('Failed to retrieve auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse>) => {
    const config = error.config;
    const statusCode = error.response?.status;

    // Handle 401 (Unauthorized) - token might be expired
    if (statusCode === 401) {
      console.warn('⚠️ 401 UNAUTHORIZED - token may be expired or invalid');
      console.warn('Request URL:', config?.url);
      console.warn('Auth header present:', !!config?.headers?.Authorization);
      // Clear auth token properly
      try {
        await SecureStore.deleteItemAsync('authToken');
      } catch (e) {
        console.error('Failed to delete auth token:', e);
      }
      authToken = null;
      // Optionally redirect to login
      // navigate('login');
    }

    // Retry logic for specific status codes
    if (
      config &&
      RETRY_CONFIG.retryableStatusCodes.includes(statusCode || 0) &&
      (!config as any).retryCount
    ) {
      (config as any).retryCount = 0;
    }

    if (
      config &&
      (config as any).retryCount !== undefined &&
      (config as any).retryCount < RETRY_CONFIG.maxRetries &&
      RETRY_CONFIG.retryableStatusCodes.includes(statusCode || 0)
    ) {
      (config as any).retryCount += 1;
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_CONFIG.retryDelay * (config as any).retryCount)
      );
      return apiClient(config);
    }

    return Promise.reject(error);
  }
);

// Utility functions
export const setAuthToken = async (token: string) => {
  authToken = token;
  try {
    await SecureStore.setItemAsync('authToken', token);
  } catch (error) {
    console.error('Failed to store auth token:', error);
  }
};

export const clearAuthToken = async () => {
  authToken = null;
  try {
    await SecureStore.deleteItemAsync('authToken');
  } catch (error) {
    console.error('Failed to clear auth token:', error);
  }
};

export const getAuthToken = (): string | null => authToken;

// Generic API call wrapper with better error handling
export const apiCall = async <T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  data?: any,
  config?: any
): Promise<{ data: T; status: number }> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient({
      method,
      url,
      data,
      ...config,
    });

    if (!response.data.success && response.status !== 200) {
      throw {
        message: response.data.message || 'API request failed',
        statusCode: response.status,
        data: response.data,
      };
    }

    return {
      data: response.data.data as T,
      status: response.status,
    };
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Unknown error',
      statusCode: error.response?.status,
      data: error.response?.data,
    };

    console.error('API Error:', {
      url,
      method,
      status: apiError.statusCode,
      message: apiError.message,
    });

    throw apiError;
  }
};

// Convenience methods
export const api = {
  get: <T = any>(url: string, config?: any) => apiCall<T>('GET', url, undefined, config),
  post: <T = any>(url: string, data?: any, config?: any) => apiCall<T>('POST', url, data, config),
  put: <T = any>(url: string, data?: any, config?: any) => apiCall<T>('PUT', url, data, config),
  delete: <T = any>(url: string, config?: any) => apiCall<T>('DELETE', url, undefined, config),
  patch: <T = any>(url: string, data?: any, config?: any) => apiCall<T>('PATCH', url, data, config),
};

export default apiClient;
