import Theme from '@/constants/Theme';
import { getBalance } from '@/services/paymentService';
import { executeSwap as executeSwapAPI, getExchangeRate } from '@/services/swapService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface Currency {
  symbol: string;
  name: string;
  icon: string;
  color: string;
  balance: number;
}

const SwapScreen = () => {
  const router = useRouter();
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swapping, setSwapping] = useState(false);
  const [balances, setBalances] = useState<any>(null);

  const currencies: Currency[] = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      icon: '₿',
      color: '#F7931A',
      balance: 0,
    },
    {
      symbol: 'USDT',
      name: 'Tether',
      icon: '₮',
      color: '#26A17B',
      balance: 0,
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      icon: 'Ξ',
      color: '#627EEA',
      balance: 0,
    },
  ];

  const [fromCurrency, setFromCurrency] = useState<Currency>(currencies[1]); // USDT
  const [toCurrency, setToCurrency] = useState<Currency>(currencies[0]); // BTC

  // Fetch balances and exchange rates on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Update exchange rate when currencies change
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetchExchangeRate();
    }
  }, [fromCurrency.symbol, toCurrency.symbol]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const balanceData = await getBalance();
      setBalances(balanceData);

      // Update currency balances from backend
      currencies.forEach(currency => {
        if (balanceData[currency.symbol]) {
          currency.balance = parseFloat(balanceData[currency.symbol].balance || '0');
        }
      });

      await fetchExchangeRate();
    } catch (error) {
      console.error('Failed to fetch data:', error);
      Alert.alert('Error', 'Failed to load balance and rates. Using defaults.');
    } finally {
      setLoading(false);
    }
  };

  const fetchExchangeRate = async () => {
    try {
      const rateData = await getExchangeRate(fromCurrency.symbol, toCurrency.symbol);
      setExchangeRate(rateData.rate);
    } catch (error) {
      console.log('Failed to fetch exchange rate, using fallback');
    }
  };

  const onChangeFromAmount = (val: string) => {
    const cleaned = val.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    const normalized = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned;
    setFromAmount(normalized);

    const f = parseFloat(normalized || '0');
    if (!isNaN(f) && exchangeRate > 0) {
      setToAmount((f * exchangeRate).toFixed(8));
    } else {
      setToAmount('0.00');
    }
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);

    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      Alert.alert('Error', 'Please enter an amount to swap');
      return;
    }

    const fromBalance = balances?.[fromCurrency.symbol]?.balance || '0';
    if (parseFloat(fromBalance) < parseFloat(fromAmount)) {
      Alert.alert(
        'Insufficient Balance',
        `You need ${fromAmount} ${fromCurrency.symbol} but only have ${fromBalance} ${fromCurrency.symbol}`
      );
      return;
    }

    Alert.alert(
      'Confirm Swap',
      `Swap ${fromAmount} ${fromCurrency.symbol} for ${toAmount} ${toCurrency.symbol}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: executeSwap,
        },
      ]
    );
  };

  const executeSwap = async () => {
    setSwapping(true);
    try {
      const result = await executeSwapAPI({
        fromCurrency: fromCurrency.symbol,
        toCurrency: toCurrency.symbol,
        amount: fromAmount,
        chain: 'bnb',
      });

      Alert.alert(
        'Swap Successful!',
        `Swapped ${fromAmount} ${fromCurrency.symbol} for ${result.data?.toAmount || toAmount} ${toCurrency.symbol}\n\nTransaction ID: ${result.data?.transactionId || 'N/A'}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setFromAmount('');
              setToAmount('');
              fetchData(); // Refresh balances
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Swap Failed', error.message || 'Failed to execute swap');
    } finally {
      setSwapping(false);
    }
  };

  const getUserBalance = (symbol: string) => {
    return balances?.[symbol]?.balance || '0';
  };

  const renderCurrencySelector = (currency: Currency, type: 'from' | 'to') => (
    <TouchableOpacity style={styles.currencySelector} activeOpacity={0.7}>
      <View style={styles.currencyInfo}>
        <View style={[styles.currencyIcon, { backgroundColor: currency.color }]}>
          <Text style={styles.currencyIconText}>{currency.icon}</Text>
        </View>
        <View style={styles.currencyDetails}>
          <Text style={styles.currencySymbol}>{currency.symbol}</Text>
          <Ionicons name="chevron-down" size={16} color="#6B7280" />
        </View>
      </View>
      {type === 'from' && (
        <View style={styles.availableContainer}>
          <Text style={styles.availableLabel}>
            Available: {parseFloat(getUserBalance(currency.symbol)).toFixed(8)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Theme.bg} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.success} />
          <Text style={styles.loadingText}>Loading swap data from backend...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.bg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Swap</Text>
        <TouchableOpacity style={styles.historyButton} onPress={() => router.push('/records')}>
          <Ionicons name="time-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* From Section */}
        <View style={styles.swapSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>From</Text>
          </View>
          {renderCurrencySelector(fromCurrency, 'from')}
          <View style={styles.amountContainer}>
            <TextInput
              style={styles.amountInput}
              value={fromAmount}
              onChangeText={onChangeFromAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={Theme.muted}
            />
            <Text style={styles.usdValue}>
              ≈ $ {(parseFloat(fromAmount || '0') * (fromCurrency.symbol === 'USDT' ? 1 : fromCurrency.symbol === 'BTC' ? 95000 : 3500)).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Swap Button */}
        <View style={styles.swapButtonContainer}>
          <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
            <Ionicons name="swap-vertical" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* To Section */}
        <View style={styles.swapSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>To</Text>
          </View>
          {renderCurrencySelector(toCurrency, 'to')}
          <View style={styles.amountContainer}>
            <Text style={styles.amountInput}>{toAmount || '0.00'}</Text>
            <Text style={styles.usdValue}>
              ≈ $ {(parseFloat(toAmount || '0') * (toCurrency.symbol === 'USDT' ? 1 : toCurrency.symbol === 'BTC' ? 95000 : 3500)).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Exchange Rate */}
        <View style={styles.exchangeRateContainer}>
          <View style={styles.exchangeRate}>
            <Text style={styles.exchangeRateText}>
              1 {fromCurrency.symbol} ≈ {exchangeRate.toFixed(8)} {toCurrency.symbol}
            </Text>
            <TouchableOpacity onPress={fetchExchangeRate}>
              <Ionicons name="refresh" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!fromAmount || parseFloat(fromAmount) <= 0 || swapping) && styles.continueButtonDisabled
          ]}
          activeOpacity={0.8}
          onPress={handleSwap}
          disabled={!fromAmount || parseFloat(fromAmount) <= 0 || swapping}
        >
          {swapping ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.continueButtonText}>
              Swap {fromAmount || '0'} {fromCurrency.symbol}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.bg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Theme.muted,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.text,
  },
  historyButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  swapSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Theme.muted,
  },
  currencySelector: {
    marginBottom: 16,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currencyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  currencyIconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  currencyDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: Theme.text,
  },
  availableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  availableLabel: {
    fontSize: 14,
    color: Theme.muted,
  },
  amountContainer: {
    alignItems: 'flex-start',
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '300',
    color: Theme.text,
    marginBottom: 4,
  },
  usdValue: {
    fontSize: 14,
    color: Theme.muted,
  },
  swapButtonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  swapButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exchangeRateContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  exchangeRate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exchangeRateText: {
    fontSize: 16,
    color: Theme.text,
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: Theme.success,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  continueButtonDisabled: {
    backgroundColor: Theme.border,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default SwapScreen;