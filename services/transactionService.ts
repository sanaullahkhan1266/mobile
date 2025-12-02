import { API_ENDPOINTS } from '@/constants/api';
import { api } from '@/utils/apiClient';

export interface SendTransactionParams {
  to: string;
  amount: string;
  currency: string;
  chain: string;
  memo?: string;
}

export interface P2PTransferParams {
  recipient: string;
  recipientType: 'uid' | 'email' | 'phone';
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
  data?: any;
}

/**
 * Send a cryptocurrency transaction to a wallet address
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
      message: error?.response?.data?.message || error?.message || 'Transaction failed',
      error
    };
  }
};

/**
 * Send a P2P transfer to another user via UID, email, or phone
 */
export const sendP2PTransfer = async (params: P2PTransferParams): Promise<TransactionResponse> => {
  try {
    const response = await api.post<TransactionResponse>(
      '/api/tx/p2p',
      params
    );
    return response.data;
  } catch (error: any) {
    console.error('Failed to send P2P transfer:', error);
    throw {
      message: error?.response?.data?.message || error?.message || 'P2P transfer failed',
      error
    };
  }
};

/**
 * Send to a recipient using their identifier (UID, email, or phone)
 * This function automatically detects the type and calls the appropriate endpoint
 */
export const sendToRecipient = async (params: {
  recipient: string;
  amount: string;
  currency: string;
  chain: string;
  memo?: string;
}): Promise<TransactionResponse> => {
  try {
    // Detect recipient type
    let recipientType: 'uid' | 'email' | 'phone' = 'uid';

    if (params.recipient.includes('@')) {
      recipientType = 'email';
    } else if (/^\+?[0-9]+$/.test(params.recipient.replace(/[\s\-()]/g, ''))) {
      recipientType = 'phone';
    }

    // Send P2P transfer
    return await sendP2PTransfer({
      ...params,
      recipientType
    });
  } catch (error: any) {
    console.error('Failed to send to recipient:', error);
    throw {
      message: error?.message || 'Failed to send transaction',
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
      message: error?.response?.data?.message || error?.message || 'Failed to load transactions',
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
      message: error?.response?.data?.message || error?.message || 'Transaction not found',
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
    // Return default fee if calculation fails
    const defaultFee = '0.001';
    const total = (parseFloat(params.amount) + parseFloat(defaultFee)).toFixed(6);
    return { fee: defaultFee, total };
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

/**
 * Get user info by UID, email, or phone for P2P transfers
 */
export const getUserByIdentifier = async (identifier: string): Promise<{
  found: boolean;
  user?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  message?: string;
}> => {
  try {
    const response = await api.post<{
      found: boolean;
      user?: {
        id: string;
        name: string;
        email?: string;
        phone?: string;
      };
      message?: string;
    }>(
      '/api/user/find',
      { identifier }
    );
    return response.data;
  } catch (error: any) {
    console.error('Failed to find user:', error);
    return {
      found: false,
      message: error?.response?.data?.message || 'User not found'
    };
  }
};