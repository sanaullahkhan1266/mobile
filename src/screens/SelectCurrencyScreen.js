import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SectionList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';
import currencyService from '../services/currencyService';
import { useCurrency } from '../contexts/CurrencyContext';

const SelectCurrencyScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  // Use currency context
  const { selectedCurrency, setSelectedCurrency: setGlobalSelectedCurrency } = useCurrency();

  // Fetch currencies using the currency service
  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await currencyService.fetchCurrencies();
      
      setCurrencies(result.data);
      setIsOfflineMode(result.isOffline);
      
    } catch (err) {
      console.error('Failed to load currencies:', err);
      setError('Unable to load currency data');
      Alert.alert(
        'Error',
        'Unable to load currency data. Please try again later.',
        [
          { text: 'Retry', onPress: fetchCurrencies },
          { text: 'Cancel', onPress: () => navigation.goBack() },
        ]
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCurrencies();
  }, []);

  // Filter and group currencies
  const filteredCurrencies = useMemo(() => {
    const filtered = currencies.filter(currency =>
      currency.code.toLowerCase().includes(searchText.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchText.toLowerCase())
    );

    // Group by first letter
    const grouped = {};
    filtered.forEach(currency => {
      const firstLetter = currency.code[0].toUpperCase();
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(currency);
    });

    // Convert to section list format
    return Object.keys(grouped)
      .sort()
      .map(letter => ({
        title: letter,
        data: grouped[letter],
      }));
  }, [searchText]);

  // Generate alphabet for quick navigation
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');

  const handleCurrencySelect = (currency) => {
    // Handle currency selection using context
    setGlobalSelectedCurrency(currency);
    console.log('Selected currency:', currency);
    
    // Navigate back after a brief moment to show selection
    setTimeout(() => {
      navigation.goBack();
    }, 200);
  };

  const renderCurrencyItem = ({ item }) => {
    const isSelected = selectedCurrency?.code === item.code;
    
    return (
      <TouchableOpacity
        style={[
          styles.currencyItem,
          isSelected && styles.selectedCurrencyItem
        ]}
        onPress={() => handleCurrencySelect(item)}
        activeOpacity={0.7}
      >
        <View style={styles.currencyLeft}>
          <View style={styles.flagContainer}>
            <Text style={styles.flag}>{item.flag}</Text>
          </View>
          <View style={styles.currencyInfo}>
            <View style={styles.currencyCodeRow}>
              <Text style={styles.currencyCode}>{item.code}</Text>
              {item.symbol && (
                <Text style={styles.currencySymbol}>{item.symbol}</Text>
              )}
            </View>
            <Text style={styles.currencyName}>{item.name}</Text>
          </View>
        </View>
        
        {/* Selection Indicator */}
        {isSelected && (
          <View style={styles.selectionIndicator}>
            <Icon name="check-circle" size={24} color={theme.colors.success} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Currency</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color={theme.colors.text.secondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Currency"
            placeholderTextColor={theme.colors.text.secondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        
        {/* Offline Mode Banner */}
        {isOfflineMode && (
          <View style={styles.offlineBanner}>
            <Icon name="cloud-off" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.offlineBannerText}>
              Using offline currency data
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        {loading ? (
          /* Loading State */
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading currencies...</Text>
          </View>
        ) : error ? (
          /* Error State */
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={48} color={theme.colors.error} />
            <Text style={styles.errorText}>Failed to load currencies</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchCurrencies}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Currency List */
          <>
            <SectionList
              sections={filteredCurrencies}
              keyExtractor={(item) => item.code}
              renderItem={renderCurrencyItem}
              renderSectionHeader={renderSectionHeader}
              showsVerticalScrollIndicator={false}
              style={styles.currencyList}
            />

            {/* Alphabet Navigation */}
            <View style={styles.alphabetContainer}>
              {alphabet.map((letter) => (
                <TouchableOpacity
                  key={letter}
                  style={styles.alphabetItem}
                  onPress={() => {
                    // Scroll to section - in a real app you'd implement this
                    console.log('Navigate to', letter);
                  }}
                >
                  <Text style={styles.alphabetText}>{letter}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[100],
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  offlineBannerText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginLeft: 6,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  currencyList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    paddingVertical: 8,
    marginTop: 16,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  selectedCurrencyItem: {
    backgroundColor: theme.colors.gray[50],
  },
  currencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  flag: {
    fontSize: 20,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  currencySymbol: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    marginLeft: 8,
    backgroundColor: theme.colors.gray[100],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currencyName: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  alphabetContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: theme.colors.gray[50],
  },
  alphabetItem: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  alphabetText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  selectionIndicator: {
    marginLeft: 12,
  },
});

export default SelectCurrencyScreen;