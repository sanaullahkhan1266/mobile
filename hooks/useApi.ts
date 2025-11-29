import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';

// Import all services
import * as authService from '@/services/authService';
import * as paymentService from '@/services/paymentService';
import * as cardService from '@/services/cardService';
import * as transactionService from '@/services/transactionService';
import * as twoFactorService from '@/services/twoFactorService';

// Generic hook for API calls with loading and error states
export function useApiCall<T>(
  apiFunction: (...args: any[]) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: any[]) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || err?.data?.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return { data, loading, error, execute };
}

// Auth Hooks
export const useLogin = () => {
  return useApiCall(authService.loginWithBackend);
};

export const useSignup = () => {
  return useApiCall(authService.signupWithBackend);
};

export const useLogout = () => {
  return useApiCall(authService.logoutFromBackend);
};

export const useForgotPassword = () => {
  return useApiCall(authService.forgotPassword);
};

export const useResetPassword = () => {
  return useApiCall(authService.resetPassword);
};

// Payment Hooks
export const useWalletAddresses = () => {
  const [addresses, setAddresses] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await paymentService.getWalletAddresses();
        setAddresses(data);
      } catch (err: any) {
        setError(err?.message || 'Failed to load wallet addresses');
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  return { addresses, loading, error };
};

export const useBalance = () => {
  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await paymentService.getBalance();
      setBalance(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to load balance');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, []);

  return { balance, loading, error, refresh };
};

export const useRecentTransactions = (limit: number = 10) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await paymentService.getRecentReceived(limit);
      setTransactions(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    refresh();
  }, [limit]);

  return { transactions, loading, error, refresh };
};

// Card Hooks
export const useCards = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await cardService.getCards();
      setCards(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to load cards');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, []);

  const createCard = useCallback(async (params: any) => {
    try {
      const newCard = await cardService.createCard(params);
      await refresh(); // Refresh the list
      return newCard;
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to create card');
      throw err;
    }
  }, [refresh]);

  const freezeCard = useCallback(async (cardId: string, freeze: boolean) => {
    try {
      await cardService.toggleCardFreeze(cardId, freeze);
      await refresh();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to update card');
      throw err;
    }
  }, [refresh]);

  return { cards, loading, error, refresh, createCard, freezeCard };
};

// Transaction Hooks
export const useTransactionHistory = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const data = await transactionService.getTransactionHistory(params);
      setTransactions(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, []);

  return { transactions, loading, error, refresh: fetchHistory };
};

export const useSendTransaction = () => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (params: any) => {
    setSending(true);
    setError(null);
    try {
      const result = await transactionService.sendTransaction(params);
      Alert.alert('Success', 'Transaction sent successfully!');
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to send transaction';
      setError(errorMessage);
      Alert.alert('Transaction Failed', errorMessage);
      throw err;
    } finally {
      setSending(false);
    }
  }, []);

  return { send, sending, error };
};

// 2FA Hooks
export const use2FAStatus = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await twoFactorService.get2FAStatus();
        setStatus(data);
      } catch (err) {
        setStatus({ enabled: false });
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, []);

  return { status, loading };
};

export const useEnable2FA = () => {
  const [enabling, setEnabling] = useState(false);
  const [setupData, setSetupData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const enable = useCallback(async () => {
    setEnabling(true);
    setError(null);
    try {
      const data = await twoFactorService.enable2FA();
      setSetupData(data);
      return data;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to enable 2FA';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      throw err;
    } finally {
      setEnabling(false);
    }
  }, []);

  return { enable, enabling, setupData, error };
};

export const useDisable2FA = () => {
  return useApiCall(twoFactorService.disable2FA);
};

// Price Hooks
export const useCryptoPrices = (symbols: string[]) => {
  const [prices, setPrices] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await paymentService.getPrices(symbols);
      const priceMap = data.reduce((acc: any, item: any) => {
        acc[item.symbol] = item;
        return acc;
      }, {});
      setPrices(priceMap);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to load prices');
    } finally {
      setLoading(false);
    }
  }, [symbols.join(',')]);

  useEffect(() => {
    if (symbols.length > 0) {
      fetchPrices();
      // Refresh prices every 30 seconds
      const interval = setInterval(fetchPrices, 30000);
      return () => clearInterval(interval);
    }
  }, [symbols.join(',')]);

  return { prices, loading, error, refresh: fetchPrices };
};