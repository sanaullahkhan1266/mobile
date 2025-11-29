// Example usage of the Currency Service
// This file shows how to use currencyService in different scenarios

import currencyService from './currencyService';

// Example 1: Get all currencies with API fallback
export const getAllCurrenciesExample = async () => {
  try {
    const result = await currencyService.fetchCurrencies();
    
    if (result.isOffline) {
      console.log('⚠️ Using offline currency data');
      // Maybe show a toast notification to user
    } else {
      console.log('✅ Using live currency data from API');
    }
    
    return result.data;
  } catch (error) {
    console.error('Failed to get currencies:', error);
    return [];
  }
};

// Example 2: Get popular currencies only (works offline)
export const getPopularCurrenciesExample = () => {
  const popular = currencyService.getPopularCurrencies();
  console.log('Popular currencies:', popular);
  return popular;
};

// Example 3: Get offline currencies directly (no API call)
export const getOfflineCurrenciesExample = () => {
  const offline = currencyService.getOfflineCurrencies();
  console.log('Offline currencies count:', offline.length);
  return offline;
};

// Example 4: Get specific currency info
export const getCurrencyInfoExample = (currencyCode) => {
  const currencies = currencyService.getOfflineCurrencies();
  const currency = currencies.find(c => c.code === currencyCode);
  
  if (currency) {
    console.log(`${currencyCode} Info:`, {
      name: currency.name,
      symbol: currency.symbol,
      flag: currency.flag
    });
  }
  
  return currency;
};

// Example 5: Search currencies by name or code
export const searchCurrenciesExample = (query) => {
  const currencies = currencyService.getOfflineCurrencies();
  const filtered = currencies.filter(currency =>
    currency.code.toLowerCase().includes(query.toLowerCase()) ||
    currency.name.toLowerCase().includes(query.toLowerCase())
  );
  
  return filtered;
};

// Example 6: Usage in a React component
/*
import React, { useState, useEffect } from 'react';
import currencyService from '../services/currencyService';

const CurrencyDropdown = ({ onCurrencySelect }) => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const loadCurrencies = async () => {
      const result = await currencyService.fetchCurrencies();
      setCurrencies(result.data);
      setIsOffline(result.isOffline);
      setLoading(false);
    };

    loadCurrencies();
  }, []);

  if (loading) {
    return <Text>Loading currencies...</Text>;
  }

  return (
    <View>
      {isOffline && (
        <Text style={styles.offlineWarning}>
          Using offline currency data
        </Text>
      )}
      {currencies.map(currency => (
        <TouchableOpacity 
          key={currency.code}
          onPress={() => onCurrencySelect(currency)}
        >
          <Text>{currency.flag} {currency.code} - {currency.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
*/