import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Theme from '@/constants/Theme';
import { useTransactionHistory } from '@/hooks/useApi';

const { width, height } = Dimensions.get('window');

const RecordsScreen = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('All Types');
  const [selectedCurrency, setSelectedCurrency] = useState('All Currencies');
  const [selectedDate, setSelectedDate] = useState('Date');
  const [refreshing, setRefreshing] = useState(false);

  const filters = ['Send', 'Receive', 'Swap', 'All Types'];
  const currencies = ['All Currencies', 'USD', 'BTC', 'USDT', 'USDC', 'ETH', 'BNB'];
  const dateOptions = ['Date', 'Today', 'This Week', 'This Month'];

  // Backend data
  const { transactions: allTransactions, loading, fetchHistory } = useTransactionHistory();

  // Fetch transactions on mount
  useEffect(() => {
    fetchHistory({ limit: 100 });
  }, []);

  // Filter transactions based on selected filters
  const filteredTransactions = allTransactions?.filter(tx => {
    // Filter by type
    if (selectedFilter === 'Send' && tx.type !== 'send') return false;
    if (selectedFilter === 'Receive' && tx.type !== 'receive') return false;
    if (selectedFilter === 'Swap') return false; // No swap type yet

    // Filter by currency
    if (selectedCurrency !== 'All Currencies' && tx.currency !== selectedCurrency) return false;

    // Filter by date (simplified)
    if (selectedDate === 'Today') {
      const today = new Date().toDateString();
      const txDate = new Date(tx.timestamp).toDateString();
      if (today !== txDate) return false;
    }
    // Add more date filters as needed

    return true;
  }) || [];

  const renderFilterButton = (title: string, isSelected: boolean, onPress: () => void) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        isSelected && styles.selectedFilterButton
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.filterButtonText,
        isSelected && styles.selectedFilterButtonText
      ]}>
        {title}
      </Text>
      {(title === selectedCurrency || title === selectedDate) && (
        <Ionicons 
          name="chevron-down" 
          size={16} 
          color={isSelected ? '#374151' : '#6B7280'} 
          style={styles.filterIcon}
        />
      )}
    </TouchableOpacity>
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchHistory({ limit: 100 });
    setRefreshing(false);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIcon}>
        <View style={styles.folderIcon}>
          <View style={styles.folderBody} />
          <View style={styles.folderTab} />
          <View style={styles.folderHandle} />
        </View>
        <View style={styles.paperPlane}>
          <Ionicons name="paper-plane" size={20} color="#EF4444" />
        </View>
        <View style={styles.dashedLine} />
      </View>
      <Text style={styles.emptyStateTitle}>No history found</Text>
      <Text style={styles.emptyStateSubtitle}>Make your first transaction to see it here</Text>
    </View>
  );

  const renderTransaction = (tx: any) => (
    <TouchableOpacity key={tx.id} style={styles.transactionItem} activeOpacity={0.7}>
      <View style={[styles.txIcon, { 
        backgroundColor: tx.type === 'receive' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' 
      }]}>
        <Ionicons 
          name={tx.type === 'receive' ? 'arrow-down' : 'arrow-up'} 
          size={20} 
          color={tx.type === 'receive' ? '#10B981' : '#EF4444'} 
        />
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txType}>{tx.type === 'receive' ? 'Received' : 'Sent'}</Text>
        <Text style={styles.txDate}>{new Date(tx.timestamp).toLocaleString()}</Text>
        <Text style={styles.txHash} numberOfLines={1}>
          {tx.hash?.substring(0, 20)}...
        </Text>
      </View>
      <View style={styles.txAmountContainer}>
        <Text style={[styles.txAmount, { 
          color: tx.type === 'receive' ? '#10B981' : '#EF4444' 
        }]}>
          {tx.type === 'receive' ? '+' : '-'}{tx.amount}
        </Text>
        <Text style={styles.txCurrency}>{tx.currency}</Text>
        <Text style={[styles.txStatus, {
          color: tx.status === 'completed' ? '#10B981' : tx.status === 'pending' ? '#F59E0B' : '#EF4444'
        }]}>
          {tx.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Records</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <View key={filter}>
            {renderFilterButton(
              filter,
              selectedFilter === filter,
              () => setSelectedFilter(filter)
            )}
          </View>
        ))}
        {renderFilterButton(
          selectedCurrency,
          false,
          () => console.log('Currency filter pressed')
        )}
        {renderFilterButton(
          selectedDate,
          false,
          () => console.log('Date filter pressed')
        )}
      </ScrollView>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Theme.text} />
          </View>
        ) : filteredTransactions.length === 0 ? (
          renderEmptyState()
        ) : (
          filteredTransactions.map(renderTransaction)
        )}
      </ScrollView>
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
  headerRight: {
    width: 40,
  },
  filtersContainer: {
    paddingVertical: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Theme.border,
    backgroundColor: Theme.card,
  },
  selectedFilterButton: {
    backgroundColor: Theme.text,
    borderColor: Theme.text,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Theme.muted,
  },
  selectedFilterButtonText: {
    color: '#FFFFFF',
  },
  filterIcon: {
    marginLeft: 6,
  },
  content: {
    flex: 1,
  },
  transactionsList: {
    flex: 1,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  folderIcon: {
    position: 'relative',
  },
  folderBody: {
    width: 80,
    height: 60,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  folderTab: {
    position: 'absolute',
    top: -8,
    left: 8,
    width: 24,
    height: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  folderHandle: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  paperPlane: {
    position: 'absolute',
    top: -10,
    right: -20,
    width: 32,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dashedLine: {
    position: 'absolute',
    top: 5,
    right: -10,
    width: 30,
    height: 1,
    backgroundColor: '#EF4444',
    opacity: 0.5,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
    backgroundColor: Theme.card,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txInfo: {
    flex: 1,
  },
  txType: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.text,
    marginBottom: 4,
  },
  txDate: {
    fontSize: 12,
    color: Theme.muted,
    marginBottom: 2,
  },
  txHash: {
    fontSize: 11,
    color: Theme.muted,
    fontFamily: 'monospace',
  },
  txAmountContainer: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  txCurrency: {
    fontSize: 12,
    color: Theme.muted,
    marginBottom: 2,
  },
  txStatus: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

export default RecordsScreen;