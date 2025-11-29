import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import currencyService from '../services/currencyService';

const CurrencyContext = createContext({
  selectedCurrency: null,
  setSelectedCurrency: () => {},
  currencies: [],
  isLoading: false,
});

const SELECTED_CURRENCY_KEY = '@app_selected_currency';

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrencyState] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved currency and currency list on mount
  useEffect(() => {
    loadSavedCurrency();
    loadCurrencies();
  }, []);

  const loadSavedCurrency = async () => {
    try {
      const savedCurrency = await AsyncStorage.getItem(SELECTED_CURRENCY_KEY);
      if (savedCurrency) {
        const currencyData = JSON.parse(savedCurrency);
        setSelectedCurrencyState(currencyData);
      } else {
        // Set default currency (USD)
        const defaultCurrency = {
          code: 'USD',
          name: 'US Dollar',
          flag: '🇺🇸',
          symbol: '$'
        };
        setSelectedCurrencyState(defaultCurrency);
      }
    } catch (error) {
      console.error('Failed to load saved currency:', error);
      // Fallback to USD
      setSelectedCurrencyState({
        code: 'USD',
        name: 'US Dollar',
        flag: '🇺🇸',
        symbol: '$'
      });
    }
  };

  const loadCurrencies = async () => {
    try {
      setIsLoading(true);
      const result = await currencyService.fetchCurrencies();
      setCurrencies(result.data);
    } catch (error) {
      console.error('Failed to load currencies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setSelectedCurrency = async (currency) => {
    try {
      setSelectedCurrencyState(currency);
      await AsyncStorage.setItem(SELECTED_CURRENCY_KEY, JSON.stringify(currency));
      console.log('Currency saved:', currency);
    } catch (error) {
      console.error('Failed to save selected currency:', error);
    }
  };

  const getCurrencyByCode = (code) => {
    return currencies.find(currency => currency.code === code);
  };

  const getFormattedCurrency = (amount, currencyCode = selectedCurrency?.code) => {
    const currency = getCurrencyByCode(currencyCode);
    if (!currency) return `${amount}`;
    
    return `${currency.symbol || currency.code} ${amount}`;
  };

  const value = {
    selectedCurrency,
    setSelectedCurrency,
    currencies,
    isLoading,
    getCurrencyByCode,
    getFormattedCurrency,
    refreshCurrencies: loadCurrencies,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyContext;