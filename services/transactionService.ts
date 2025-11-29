import { api } from '@/utils/apiClient';
import { API_ENDPOINTS } from '@/constants/api';

export interface SendTransactionParams {
  to: string;
  amount: string;
  currency: string;
  chain: string;
  memo?: string;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive';
  from: string;
  to: string;
  amount: string;
  currency: string;
  chain: string;
  hash: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  fee?: string;
  memo?: string;
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  transactionHash?: string;
  transactionId?: string;
}

/**
 * Send a cryptocurrency transaction
 */
export const sendTransaction = async (params: SendTransactionParams): Promise<TransactionResponse> => {
  try {
    const response = await api.post<TransactionResponse>(
      API_ENDPOINTS.TX.SEND,
      params
    );
    return response.data;
  } catch (error: any) {
    console.error('Failed to send transaction:', error);
    throw {
      message: error?.data?.message || error?.message || 'Transaction failed',
      error
    };
  }
};

/**
 * Get transaction history for the current user
 */
export const getTransactionHistory = async (params?: {
  limit?: number;
  offset?: number;
  currency?: string;
  chain?: string;
  type?: 'send' | 'receive' | 'all';
}): Promise<Transaction[]> => {
  try {
    const response = await api.get<Transaction[]>(
      API_ENDPOINTS.TX.HISTORY,
      { params }
    );
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch transaction history:', error);
    throw {
      message: error?.data?.message || error?.message || 'Failed to load transactions',
      error
    };
  }
};

/**
 * Get a specific transaction by ID
 */
export const getTransactionById = async (transactionId: string): Promise<Transaction> => {
  try {
    const response = await api.get<Transaction>(
      `${API_ENDPOINTS.TX.HISTORY}/${transactionId}`
    );
    return response.data;
  } catch (error: any) {
    console.error(`Failed to fetch transaction ${transactionId}:`, error);
    throw {
      message: error?.data?.message || error?.message || 'Transaction not found',
      error
    };
  }
};

/**
 * Calculate transaction fee
 */
export const calculateTransactionFee = async (params: {
  amount: string;
  currency: string;
  chain: string;
}): Promise<{ fee: string; total: string }> => {
  try {
    const response = await api.post<{ fee: string; total: string }>(
      `${API_ENDPOINTS.TX.SEND}/calculate-fee`,
      params
    );
    return response.data;
  } catch (error: any) {
    console.error('Failed to calculate fee:', error);
    throw {
      message: error?.data?.message || error?.message || 'Fee calculation failed',
      error
    };
  }
};

/**
 * Validate wallet address
 */
export const validateAddress = async (address: string, chain: string): Promise<{ valid: boolean; message?: string }> => {
  try {
    const response = await api.post<{ valid: boolean; message?: string }>(
      `${API_ENDPOINTS.TX.SEND}/validate-address`,
      { address, chain }
    );
    return response.data;
  } catch (error: any) {
    console.error('Failed to validate address:', error);
    return { valid: false, message: 'Address validation failed' };
  }
};