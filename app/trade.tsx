import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Modal,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useBalance, useTransactionHistory } from '@/hooks/useApi';
import { getPrice } from '@/services/paymentService';
import { sendTransaction } from '@/services/transactionService';
import * as Clipboard from 'expo-clipboard';

// Supported tokens configuration
const TOKENS: Record<string, { name: string; icon: string; color: string; decimals: number; chain: string }> = {
  USDT: { name: 'Tether USD', icon: 'ellipse', color: '#26A17B', decimals: 6, chain: 'bnb' },
  USDC: { name: 'USD Coin', icon: 'ellipse', color: '#2775CA', decimals: 6, chain: 'eth' },
  ETH: { name: 'Ethereum', icon: 'logo-ethereum', color: '#627EEA', decimals: 18, chain: 'eth' },
  BNB: { name: 'BNB', icon: 'cube', color: '#F3BA2F', decimals: 18, chain: 'bnb' },
  BTC: { name: 'Bitcoin', icon: 'logo-bitcoin', color: '#F7931A', decimals: 8, chain: 'btc' },
  TRX: { name: 'TRON', icon: 'logo-tux', color: '#FF060A', decimals: 6, chain: 'tron' },
  SOL: { name: 'Solana', icon: 'ellipse', color: '#14F195', decimals: 9, chain: 'sol' },
  XRP: { name: 'Ripple', icon: 'close', color: '#00AAE4', decimals: 6, chain: 'xrp' },
};

export default function UnifiedTradeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Selected coin state
  const [selectedCoin, setSelectedCoin] = useState((params.symbol as string)?.toUpperCase() || 'BTC');
  const [coinSelectorVisible, setCoinSelectorVisible] = useState(false);
  
  const tokenConfig = TOKENS[selectedCoin] || TOKENS.BTC;
  
  // Backend data hooks
  const { balance: allBalances, loading: balanceLoading, refresh: refreshBalance } = useBalance();
  const { transactions, loading: txLoading, fetchHistory } = useTransactionHistory();
  
  // Local state
  const [tokenBalance, setTokenBalance] = useState('0.00');
  const [usdValue, setUsdValue] = useState('0.00');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  
  // Send modal state
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sending, setSending] = useState(false);

  // Fetch token data
  useEffect(() => {
    fetchTokenData();
  }, [selectedCoin, allBalances]);

  const fetchTokenData = async () => {
    try {
      // Get price
      const priceData = await getPrice(selectedCoin);
      setCurrentPrice(priceData.price);

      // Get balance from backend
      if (allBalances && allBalances[selectedCoin]) {
        const balance = allBalances[selectedCoin].balance || '0';
        setTokenBalance(balance);
        const usd = (parseFloat(balance) * priceData.price).toFixed(2);
        setUsdValue(usd);
      }
    } catch (error) {
      console.error('Failed to fetch token data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refreshBalance(),
      fetchHistory({ currency: selectedCoin }),
      fetchTokenData(),
    ]);
    setRefreshing(false);
  };

  const handleSend = async () => {
    if (!sendAddress || !sendAmount) {
      Alert.alert('Error', 'Please enter address and amount');
      return;
    }

    if (parseFloat(sendAmount) > parseFloat(tokenBalance)) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    Alert.alert(
      'Confirm Transaction',
      `Send ${sendAmount} ${selectedCoin} to ${sendAddress.substring(0, 10)}...?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            setSending(true);
            try {
              const result = await sendTransaction({
                to: sendAddress,
                amount: sendAmount,
                currency: selectedCoin,
                chain: tokenConfig.chain,
              });

              Alert.alert('Success', `Transaction sent! Hash: ${result.transactionHash?.substring(0, 10)}...`);
              setSendModalVisible(false);
              setSendAddress('');
              setSendAmount('');
              handleRefresh();
            } catch (error: any) {
              Alert.alert('Error', error?.message || 'Transaction failed');
            } finally {
              setSending(false);
            }
          },
        },
      ]
    );
  };

  const handleCopyAddress = async () => {
    if (allBalances && allBalances[selectedCoin]) {
      const address = allBalances[selectedCoin].address || '';
      await Clipboard.setStringAsync(address);
      Alert.alert('Copied', 'Wallet address copied to clipboard');
    }
  };

  const filteredTransactions = transactions?.filter(tx => 
    tx.currency.toUpperCase() === selectedCoin
  ) || [];

  const renderCoinSelector = () => (
    <Modal
      visible={coinSelectorVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setCoinSelectorVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Cryptocurrency</Text>
            <TouchableOpacity onPress={() => setCoinSelectorVisible(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={Object.keys(TOKENS)}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const coin = TOKENS[item];
              return (
                <TouchableOpacity
                  style={[
                    styles.coinOption,
                    selectedCoin === item && styles.coinOptionSelected
                  ]}
                  onPress={() => {
                    setSelectedCoin(item);
                    setCoinSelectorVisible(false);
                  }}
                >
                  <View style={[styles.coinIcon, { backgroundColor: coin.color }]}>
                    <Ionicons name={coin.icon as any} size={20} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.coinSymbol}>{item}</Text>
                    <Text style={styles.coinName}>{coin.name}</Text>
                  </View>
                  {selectedCoin === item && (
                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );

  const renderSendModal = () => (
    <Modal
      visible={sendModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setSendModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Send {selectedCoin}</Text>
            <TouchableOpacity onPress={() => setSendModalVisible(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Recipient Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter wallet address"
              value={sendAddress}
              onChangeText={setSendAddress}
              editable={!sending}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={sendAmount}
              onChangeText={setSendAmount}
              editable={!sending}
            />
            <Text style={styles.inputHelper}>
              Available: {tokenBalance} {selectedCoin}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.sendButton, sending && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={sending}
          >
            {sending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.sendButtonText}>Send {selectedCoin}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cryptoSelector}
          onPress={() => setCoinSelectorVisible(true)}
        >
          <View style={[styles.cryptoIcon, { backgroundColor: tokenConfig.color }]}>
            <Ionicons name={tokenConfig.icon as any} size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.cryptoSymbol}>{selectedCoin}</Text>
          <Ionicons name="chevron-down" size={20} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleCopyAddress}>
          <Ionicons name="copy-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Balance Section */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>Balance</Text>
          {balanceLoading ? (
            <ActivityIndicator size="large" color={tokenConfig.color} />
          ) : (
            <>
              <Text style={styles.balanceAmount}>{tokenBalance} {selectedCoin}</Text>
              <Text style={styles.balanceUsd}>≈ ${usdValue} USD</Text>
              <Text style={styles.priceInfo}>
                Current Price: ${currentPrice.toFixed(2)}
              </Text>
            </>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/receive')}
          >
            <View style={[styles.actionIcon, { backgroundColor: tokenConfig.color }]}>
              <Ionicons name="arrow-down" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.actionTitle}>Receive</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setSendModalVisible(true)}
          >
            <View style={[styles.actionIcon, { backgroundColor: tokenConfig.color }]}>
              <Ionicons name="arrow-up" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.actionTitle}>Send</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/swap')}
          >
            <View style={[styles.actionIcon, { backgroundColor: tokenConfig.color }]}>
              <Ionicons name="swap-horizontal" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.actionTitle}>Swap</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/records')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {txLoading ? (
            <ActivityIndicator style={{ marginTop: 20 }} />
          ) : filteredTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="time-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          ) : (
            filteredTransactions.slice(0, 5).map((tx) => (
              <TouchableOpacity key={tx.id} style={styles.txItem}>
                <View style={[styles.txIcon, {
                  backgroundColor: tx.type === 'receive' ? '#D1FAE5' : '#FEE2E2'
                }]}>
                  <Ionicons
                    name={tx.type === 'receive' ? 'arrow-down' : 'arrow-up'}
                    size={20}
                    color={tx.type === 'receive' ? '#10B981' : '#EF4444'}
                  />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txType}>
                    {tx.type === 'receive' ? 'Received' : 'Sent'}
                  </Text>
                  <Text style={styles.txDate}>
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={[styles.txAmount, {
                  color: tx.type === 'receive' ? '#10B981' : '#EF4444'
                }]}>
                  {tx.type === 'receive' ? '+' : '-'}{tx.amount}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {renderCoinSelector()}
      {renderSendModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  cryptoSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  cryptoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cryptoSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  balanceSection: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  balanceUsd: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 8,
  },
  priceInfo: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  historySection: {
    padding: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  viewAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9CA3AF',
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
    color: '#000',
    marginBottom: 2,
  },
  txDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  coinOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  coinOptionSelected: {
    backgroundColor: '#F9FAFB',
  },
  coinIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  coinSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  coinName: {
    fontSize: 12,
    color: '#6B7280',
  },
  inputContainer: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  inputHelper: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  sendButton: {
    backgroundColor: '#000',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
