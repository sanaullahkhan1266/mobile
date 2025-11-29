import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import Theme from '@/constants/Theme';
import cryptoService, { CryptoCurrency, FiatCurrency, CurrencyBalance } from '../services/CryptoService';

type TabType = 'all' | 'local' | 'crypto';

export default function SelectCurrencyScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('local');
  const [cryptocurrencies, setCryptocurrencies] = useState<CryptoCurrency[]>([]);
  const [fiatCurrencies, setFiatCurrencies] = useState<FiatCurrency[]>([]);
  const [userBalances, setUserBalances] = useState<CurrencyBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data concurrently
      const [cryptos, fiats, balances] = await Promise.all([
        cryptoService.getCryptocurrencies(),
        Promise.resolve(cryptoService.getFiatCurrencies()),
        cryptoService.getUserBalances(),
      ]);

      setCryptocurrencies(cryptos);
      setFiatCurrencies(fiats);
      setUserBalances(balances);
    } catch (err) {
      setError('Failed to load currency data. Please try again.');
      console.error('Error loading currency data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCurrency = (currency: FiatCurrency | CryptoCurrency) => {
    // Navigate to the right place instead of placeholder alerts
    // - Fiat: take users to account opening requirements
    // - Crypto: open the respective wallet screen, if supported
    if ((currency as any).code) {
      const code = (currency as any).code;
      router.push({ pathname: '/account-opening-requirements', params: { code } } as any);
      return;
    }

    const symbol = (currency as CryptoCurrency).symbol?.toUpperCase?.();
    const route = cryptoService.getWalletRouteForSymbol(symbol);
    if (route) {
      router.push(route as any);
      return;
    }

    Alert.alert('Unsupported', `${currency.name} is not yet supported.`);
  };

  const handleSelectCurrency = (currency: CryptoCurrency | FiatCurrency) => {
    if ((currency as any).code) {
      const code = (currency as any).code;
      router.push({ pathname: '/account-opening-requirements', params: { code } } as any);
      return;
    }

    const symbol = (currency as CryptoCurrency).symbol?.toUpperCase?.();
    const route = cryptoService.getWalletRouteForSymbol(symbol);
    if (route) {
      router.push(route as any);
    } else {
      Alert.alert('Unsupported', `${currency.name} is not yet supported.`);
    }
  };

  const renderTabButton = (tab: TabType, title: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTab]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {title}
      </Text>
      {activeTab === tab && <View style={styles.tabIndicator} />}
    </TouchableOpacity>
  );

  const renderCryptoItem = (crypto: CryptoCurrency) => {
    const balance = userBalances.find(b => b.currency === crypto.symbol);
    const hasBalance = balance && balance.balance > 0;

    return (
      <TouchableOpacity
        key={crypto.id}
        style={styles.currencyItem}
        onPress={() => handleSelectCurrency(crypto)}
        activeOpacity={0.7}
      >
        <View style={styles.currencyLeft}>
          <View style={styles.cryptoIconContainer}>
            <Text style={styles.cryptoIcon}>{crypto.image}</Text>
          </View>
          <View style={styles.currencyInfo}>
            <Text style={styles.currencySymbol}>{crypto.symbol}</Text>
            <Text style={styles.currencyName}>{crypto.name}</Text>
          </View>
        </View>
        <View style={styles.currencyRight}>
          {hasBalance ? (
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceAmount}>
                {balance.balance.toFixed(2)}
              </Text>
              <Text style={styles.balanceUsd}>
                ≈ {balance.usdValue.toFixed(2)} USD
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddCurrency(crypto)}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFiatItem = (fiat: FiatCurrency) => (
    <TouchableOpacity
      key={fiat.code}
      style={styles.currencyItem}
      onPress={() => handleSelectCurrency(fiat)}
      activeOpacity={0.7}
    >
      <View style={styles.currencyLeft}>
        <View style={styles.fiatIconContainer}>
          <Text style={styles.fiatFlag}>{fiat.flag}</Text>
        </View>
        <View style={styles.currencyInfo}>
          <Text style={styles.currencySymbol}>{fiat.code}</Text>
          <Text style={styles.currencyName}>{fiat.description || fiat.name}</Text>
        </View>
      </View>
      <View style={styles.currencyRight}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddCurrency(fiat)}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderInactiveSection = () => (
    <View style={styles.inactiveSection}>
      <Text style={styles.inactiveTitle}>Inactive</Text>
      {activeTab === 'local' && fiatCurrencies.map(renderFiatItem)}
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading currencies...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    switch (activeTab) {
      case 'all':
        return (
          <>
            {cryptocurrencies.map(renderCryptoItem)}
            {renderInactiveSection()}
          </>
        );
      case 'local':
        return renderInactiveSection();
      case 'crypto':
        return cryptocurrencies.map(renderCryptoItem);
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Currency</Text>
        <TouchableOpacity style={styles.historyButton} onPress={() => router.push('/records')}>
          <Ionicons name="time-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          <View style={styles.tabs}>
            {renderTabButton('all', 'All')}
            {renderTabButton('local', 'Local Currency')}
            {renderTabButton('crypto', 'Crypto')}
          </View>
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

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
  tabsContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabsScroll: {
    flexGrow: 0,
  },
  tabs: {
    flexDirection: 'row',
    gap: 32,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1F2937',
  },
  tabText: {
    fontSize: 16,
    color: Theme.muted,
    fontWeight: '500',
  },
  activeTabText: {
    color: Theme.text,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: '100%',
    backgroundColor: '#1F2937',
    borderRadius: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inactiveSection: {
    marginBottom: 24,
  },
  inactiveTitle: {
    fontSize: 16,
    color: '#999999',
    marginBottom: 16,
    fontWeight: '500',
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  currencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cryptoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cryptoIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  fiatIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fiatFlag: {
    fontSize: 20,
  },
  currencyInfo: {
    flex: 1,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.text,
    marginBottom: 2,
  },
  currencyName: {
    fontSize: 14,
    color: Theme.muted,
  },
  currencyRight: {
    alignItems: 'flex-end',
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.text,
    marginBottom: 2,
  },
  balanceUsd: {
    fontSize: 14,
    color: Theme.muted,
  },
  addButton: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  errorText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});