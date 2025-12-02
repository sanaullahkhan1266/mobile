import { API_ENDPOINTS } from '@/constants/api';
import { api } from '@/utils/apiClient';

export interface Card {
  _id?: string; // Backend uses _id
  id: string;
  userId?: string;
  cardNumber: string;
  cardNumberMasked?: string;
  lastFour: string;
  expiryDate: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv: string;
  cardholderName: string;
  cardType?: 'VIRTUAL' | 'PHYSICAL';
  brand?: string; // 'VISA', 'MASTERCARD', etc.
  status: 'ACTIVE' | 'INACTIVE' | 'FROZEN' | 'TERMINATED' | 'active' | 'inactive' | 'frozen' | 'terminated';
  balance: number | string;
  spendLimit?: number;
  dailySpendLimit?: number;
  monthlySpendLimit?: number;
  totalSpent?: number;
  currency: string;
  createdAt: string;
  updatedAt?: string;
  expiresAt?: string;
  billingAddress?: Object;
  metadata?: Object;
  transactions?: Array<any>;
  provider?: string; // 'marqeta' or 'galileo'
}

export interface CardTransaction {
  id: string;
  cardId: string;
  amount: string;
  currency: string;
  merchant: string;
  status: 'pending' | 'completed' | 'declined' | 'reversed';
  timestamp: string;
  type: 'debit' | 'credit';
}

export interface CreateCardParams {
  currency: string;
  fundingAmount?: string;
  cardType?: 'virtual' | 'physical';
}

export interface FundCardParams {
  amount: string;
  currency: string;
  source?: string; // wallet address or payment method
}

/**
 * Create a new virtual card
 */
export const createCard = async (params: CreateCardParams): Promise<Card> => {
  try {
    const response = await api.post<Card>(API_ENDPOINTS.CARD.CREATE, params);
    return response.data;
  } catch (error) {
    console.error('Failed to create card:', error);
    throw error;
  }
};

/**
 * Get all cards for the current user
 */
export const getCards = async (): Promise<Card[]> => {
  try {
    const response = await api.get<Card[]>(API_ENDPOINTS.CARD.LIST);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch cards:', error);
    throw error;
  }
};

/**
 * Get a specific card by ID
 */
export const getCard = async (cardId: string): Promise<Card> => {
  try {
    const url = API_ENDPOINTS.CARD.GET.replace(':cardId', cardId);
    const response = await api.get<Card>(url);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch card ${cardId}:`, error);
    throw error;
  }
};

/**
 * Freeze or unfreeze a card
 */
export const toggleCardFreeze = async (
  cardId: string,
  freeze: boolean
): Promise<Card> => {
  try {
    const url = API_ENDPOINTS.CARD.TOGGLE_FREEZE.replace(':cardId', cardId);
    const response = await api.post<Card>(url, { freeze });
    return response.data;
  } catch (error) {
    console.error(`Failed to toggle card freeze for ${cardId}:`, error);
    throw error;
  }
};

/**
 * Terminate (close) a card
 */
export const terminateCard = async (cardId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const url = API_ENDPOINTS.CARD.TERMINATE.replace(':cardId', cardId);
    const response = await api.delete<{ success: boolean; message: string }>(url);
    return response.data;
  } catch (error) {
    console.error(`Failed to terminate card ${cardId}:`, error);
    throw error;
  }
};

/**
 * Fund a card with crypto
 */
export const fundCard = async (
  cardId: string,
  params: FundCardParams
): Promise<{ transactionHash: string; amount: string }> => {
  try {
    const url = API_ENDPOINTS.CARD.FUND.replace(':cardId', cardId);
    const response = await api.post<{ transactionHash: string; amount: string }>(url, params);
    return response.data;
  } catch (error) {
    console.error(`Failed to fund card ${cardId}:`, error);
    throw error;
  }
};

/**
 * Get transactions for a specific card
 */
export const getCardTransactions = async (
  cardId: string,
  limit: number = 20,
  offset: number = 0
): Promise<CardTransaction[]> => {
  try {
    const url = API_ENDPOINTS.CARD.TRANSACTIONS.replace(':cardId', cardId);
    const response = await api.get<CardTransaction[]>(url, {
      params: { limit, offset },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch transactions for card ${cardId}:`, error);
    throw error;
  }
};

/**
 * Update card settings (spending limits, restrictions, etc.)
 */
export const updateCardSettings = async (
  cardId: string,
  settings: {
    dailySpendLimit?: string;
    monthlySpendLimit?: string;
    internationalTransactions?: boolean;
    onlineTransactions?: boolean;
    atmWithdrawals?: boolean;
  }
): Promise<Card> => {
  try {
    const url = API_ENDPOINTS.CARD.UPDATE_SETTINGS.replace(':cardId', cardId);
    const response = await api.put<Card>(url, settings);
    return response.data;
  } catch (error) {
    console.error(`Failed to update card settings for ${cardId}:`, error);
    throw error;
  }
};
