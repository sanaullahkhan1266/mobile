import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Theme from '@/constants/Theme';

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
  const [fromAmount, setFromAmount] = useState('0.00');
  const [toAmount, setToAmount] = useState('0.00');
  const [exchangeRate, setExchangeRate] = useState(111924.7272);

  const currencies: Currency[] = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      icon: '₿',
      color: '#F7931A',
      balance: 0.00008935,
    },
    {
      symbol: 'USDT',
      name: 'Tether',
      icon: '₮',
      color: '#26A17B',
      balance: 1000000.00,
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      icon: 'Ξ',
      color: '#627EEA',
      balance: 0,
    },
  ];

  const [fromCurrency, setFromCurrency] = useState<Currency>(currencies[0]);
  const [toCurrency, setToCurrency] = useState<Currency>(currencies[1]);

  const onChangeFromAmount = (val: string) => {
    // allow only digits and a single dot
    const cleaned = val.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    const normalized = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned;
    setFromAmount(normalized);
    const f = parseFloat(normalized || '0');
    if (!isNaN(f)) {
      setToAmount((f * exchangeRate).toFixed(2));
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

  const renderCurrencySelector = (currency: Currency, type: 'from' | 'to', balance?: number) => (
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
          <Text style={styles.availableLabel}>Available: {balance?.toFixed(8) || '0.00'}</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={16} color="#1F2937" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderKeypadButton = (value: string) => (
    <TouchableOpacity
      key={value}
      style={styles.keypadButton}
      onPress={() => handleKeypadPress(value)}
      activeOpacity={0.7}
    >
      {value === 'delete' ? (
        <Ionicons name="backspace-outline" size={24} color="#1F2937" />
      ) : (
        <Text style={styles.keypadButtonText}>{value}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.bg} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Swap</Text>
        <TouchableOpacity style={styles.historyButton}>
          <Ionicons name="time-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* From Section */}
        <View style={styles.swapSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>From</Text>
          </View>
          {renderCurrencySelector(fromCurrency, 'from', fromCurrency.balance)}
          <View style={styles.amountContainer}>
            <TextInput
              style={styles.amountInput}
              value={fromAmount}
              onChangeText={onChangeFromAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={Theme.muted}
            />
            <Text style={styles.usdValue}>≈ $ {(parseFloat(fromAmount || '0') * 65000).toFixed(2)}</Text>
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
            <TextInput
              style={styles.amountInput}
              value={toAmount}
              editable={false}
            />
            <Text style={styles.usdValue}>≈ {(parseFloat(toAmount || '0') * 1).toFixed(2)} {toCurrency.symbol}</Text>
          </View>
        </View>

        {/* Exchange Rate */}
        <View style={styles.exchangeRateContainer}>
          <View style={styles.exchangeRate}>
            <Text style={styles.exchangeRateText}>
              1 {fromCurrency.symbol} ≈ {exchangeRate} {toCurrency.symbol}
            </Text>
            <TouchableOpacity>
              <Ionicons name="refresh" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

      {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} activeOpacity={0.8}>
          <Text style={styles.continueButtonText}>Continue</Text>
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
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
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
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default SwapScreen;