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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
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

export default function UnifiedWalletScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const symbol = (params.symbol as string)?.toUpperCase() || 'USDT';
  
  const tokenConfig = TOKENS[symbol] || TOKENS.USDT;
  
  // Backend data hooks
  const { balance: allBalances, loading: balanceLoading, refresh: refreshBalance } = useBalance();
  const { transactions, loading: txLoading, fetchHistory } = useTransactionHistory();
  
  // Local state
  const [tokenBalance, setTokenBalance] = useState('0.00');
  const [usdValue, setUsdValue] = useState('0.00');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sending, setSending] = useState(false);

  // Fetch token price and balance
  useEffect(() => {
    fetchTokenData();
  }, [symbol, allBalances]);

  const fetchTokenData = async () => {
    try {
      // Get price
      const priceData = await getPrice(symbol);
      setCurrentPrice(priceData.price);

      // Get balance from backend
      if (allBalances && allBalances[symbol]) {
        const balance = allBalances[symbol].balance || '0';
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
      fetchHistory({ currency: symbol }),
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
      `Send ${sendAmount} ${symbol} to ${sendAddress.substring(0, 10)}...?`,
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
                currency: symbol,
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
    // Get wallet address for this chain from backend
    if (allBalances && allBalances[symbol]) {
      const address = allBalances[symbol].address || '';
      await Clipboard.setStringAsync(address);
      Alert.alert('Copied', 'Wallet address copied to clipboard');
    }
  };

  const filteredTransactions = transactions?.filter(tx => 
    tx.currency.toUpperCase() === symbol
  ) || [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.cryptoSelector}>
          <View style={[styles.cryptoIcon, { backgroundColor: tokenConfig.color }]}>
            <Ionicons name={tokenConfig.icon as any} size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.cryptoSymbol}>{symbol}</Text>
        </View>
        
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
              <Text style={styles.balanceAmount}>{tokenBalance} {symbol}</Text>
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
            <View style={[styles.actionIcon, { backgroundColor: '#E8E8E8' }]}>
              <Ionicons name="arrow-up" size={24} color="#000000" />
            </View>
            <Text style={styles.actionTitle}>Send</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/swap')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E8E8E8' }]}>
              <Ionicons name="swap-horizontal" size={24} color="#000000" />
            </View>
            <Text style={styles.actionTitle}>Swap</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Recent Transactions</Text>
          
          {txLoading ? (
            <ActivityIndicator size="small" style={styles.loader} />
          ) : filteredTransactions.length === 0 ? (
            <Text style={styles.noTransactions}>No transactions yet</Text>
          ) : (
            filteredTransactions.map((tx) => (
              <View key={tx.id} style={styles.transactionItem}>
                <View style={styles.txIcon}>
                  <Ionicons
                    name={tx.type === 'send' ? 'arrow-up' : 'arrow-down'}
                    size={20}
                    color={tx.type === 'send' ? '#FF6B6B' : '#4CAF50'}
                  />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txType}>
                    {tx.type === 'send' ? 'Sent' : 'Received'}
                  </Text>
                  <Text style={styles.txDate}>
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.txAmountContainer}>
                  <Text style={[styles.txAmount, {
                    color: tx.type === 'send' ? '#FF6B6B' : '#4CAF50'
                  }]}>
                    {tx.type === 'send' ? '-' : '+'}{tx.amount} {symbol}
                  </Text>
                  <Text style={styles.txStatus}>{tx.status}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Send Modal */}
      <Modal
        visible={sendModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSendModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send {symbol}</Text>
              <TouchableOpacity onPress={() => setSendModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Recipient Address"
              value={sendAddress}
              onChangeText={setSendAddress}
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={sendAmount}
              onChangeText={setSendAmount}
              keyboardType="decimal-pad"
            />

            <Text style={styles.balanceInfo}>
              Available: {tokenBalance} {symbol}
            </Text>

            <TouchableOpacity
              style={[styles.sendButton, sending && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={sending}
            >
              {sending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.sendButtonText}>Send</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  cryptoSelector: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  balanceSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#F8F9FA',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  balanceUsd: {
    fontSize: 16,
    color: '#666',
  },
  priceInfo: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 12,
    color: '#333',
  },
  historySection: {
    padding: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  loader: {
    marginVertical: 20,
  },
  noTransactions: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 32,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txInfo: {
    flex: 1,
  },
  txType: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  txDate: {
    fontSize: 12,
    color: '#999',
  },
  txAmountContainer: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  txStatus: {
    fontSize: 11,
    color: '#999',
    textTransform: 'capitalize',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  balanceInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  sendButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
