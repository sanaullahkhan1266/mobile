import { api } from '@/utils/apiClient';
import { API_ENDPOINTS } from '@/constants/api';

export interface WalletAddresses {
  bnb: string;
  eth: string;
  arb: string;
  poly: string;
  tron: string;
  btc: string;
}

export interface BalanceInfo {
  [key: string]: {
    balance: string;
    symbol: string;
    chain: string;
  };
}

export interface PaymentRequest {
  id: string;
  from: string;
  amount: string;
  currency: string;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
}

export interface Recipient {
  id: string;
  address: string;
  name: string;
  chain: string;
  currency: string;
  lastTransactionDate: string;
}

export interface TransactionRecord {
  id: string;
  type: 'send' | 'receive';
  amount: string;
  currency: string;
  chain: string;
  fromAddress: string;
  toAddress: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  hash: string;
}

export interface PriceData {
  symbol: string;
  price: number;
  currency: string;
  change24h: number;
}

/**
 * Get all wallet addresses for the current user
 */
export const getWalletAddresses = async (): Promise<WalletAddresses> => {
  try {
    const response = await api.get<WalletAddresses>(API_ENDPOINTS.PAYMENT.WALLET_ADDRESSES);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch wallet addresses:', error);
    throw error;
  }
};

/**
 * Get balance for all wallets
 */
export const getBalance = async (): Promise<BalanceInfo> => {
  try {
    const response = await api.get<BalanceInfo>(API_ENDPOINTS.PAYMENT.GET_BALANCE);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch balance:', error);
    throw error;
  }
};

/**
 * Get recent received transactions
 */
export const getRecentReceived = async (limit: number = 10): Promise<TransactionRecord[]> => {
  try {
    const response = await api.get<TransactionRecord[]>(
      API_ENDPOINTS.PAYMENT.RECENT_RECEIVED,
      { params: { limit } }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch recent received transactions:', error);
    throw error;
  }
};

/**
 * Get pending payment requests
 */
export const getPaymentRequests = async (): Promise<PaymentRequest[]> => {
  try {
    const response = await api.get<PaymentRequest[]>(API_ENDPOINTS.PAYMENT.PAYMENT_REQUESTS);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch payment requests:', error);
    throw error;
  }
};

/**
 * Get saved recipients for quick payment
 */
export const getRecipients = async (): Promise<Recipient[]> => {
  try {
    const response = await api.get<Recipient[]>(API_ENDPOINTS.PAYMENT.RECIPIENTS);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch recipients:', error);
    throw error;
  }
};

/**
 * Get exchange history
 */
export const getExchangeHistory = async (limit: number = 20): Promise<TransactionRecord[]> => {
  try {
    const response = await api.get<TransactionRecord[]>(
      API_ENDPOINTS.PAYMENT.EXCHANGE_HISTORY,
      { params: { limit } }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch exchange history:', error);
    throw error;
  }
};

/**
 * Create a charge request for receiving crypto
 */
export const createCharge = async (params: {
  amount: string;
  currency: string;
  chain: string;
  description?: string;
}): Promise<{ chargeId: string; address: string; amount: string }> => {
  try {
    const response = await api.post<{ chargeId: string; address: string; amount: string }>(
      API_ENDPOINTS.PAYMENT.CREATE_CHARGE,
      params
    );
    return response.data;
  } catch (error) {
    console.error('Failed to create charge:', error);
    throw error;
  }
};

/**
 * Get charge details
 */
export const getCharge = async (chargeId: string) => {
  try {
    const url = API_ENDPOINTS.PAYMENT.GET_CHARGE.replace(':chargeId', chargeId);
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Failed to get charge:', error);
    throw error;
  }
};

/**
 * List all charges
 */
export const listCharges = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.PAYMENT.LIST_CHARGES);
    return response.data;
  } catch (error) {
    console.error('Failed to list charges:', error);
    throw error;
  }
};

/**
 * Cancel a charge request
 */
export const cancelCharge = async (chargeId: string) => {
  try {
    const url = API_ENDPOINTS.PAYMENT.CANCEL_CHARGE.replace(':chargeId', chargeId);
    const response = await api.post(url);
    return response.data;
  } catch (error) {
    console.error('Failed to cancel charge:', error);
    throw error;
  }
};

/**
 * Create a checkout for payment
 */
export const createCheckout = async (params: {
  amount: string;
  currency: string;
  chain: string;
  redirectUrl?: string;
}): Promise<{ checkoutId: string; checkoutUrl: string }> => {
  try {
    const response = await api.post<{ checkoutId: string; checkoutUrl: string }>(
      API_ENDPOINTS.PAYMENT.CREATE_CHECKOUT,
      params
    );
    return response.data;
  } catch (error) {
    console.error('Failed to create checkout:', error);
    throw error;
  }
};

/**
 * Get current price of a cryptocurrency
 */
export const getPrice = async (symbol: string): Promise<PriceData> => {
  try {
    const url = API_ENDPOINTS.PRICE.GET_PRICE.replace(':symbol', symbol);
    const response = await api.get<PriceData>(url);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch price for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Get prices for multiple cryptocurrencies
 */
export const getPrices = async (symbols: string[]): Promise<PriceData[]> => {
  try {
    const response = await api.get<PriceData[]>(API_ENDPOINTS.PRICE.GET_PRICES, {
      params: { symbols: symbols.join(',') },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch prices:', error);
    throw error;
  }
};
