import React from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  View as RNView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { TokenScreenProps, CryptoAction } from '@/types/crypto';

export default function TokenWallet({
  token,
  rewards,
  transactions = [],
  showBinancePay = false,
  showDepositCode = false,
}: TokenScreenProps) {
  const router = useRouter();

  const handleAction = (actionType: string) => {
    switch (actionType) {
      case 'deposit':
        Alert.alert('Deposit', `Deposit ${token.symbol} functionality would be implemented here`);
        break;
      case 'withdraw':
        Alert.alert('Withdraw', `Withdraw ${token.symbol} functionality would be implemented here`);
        break;
      case 'send':
        Alert.alert('Send', `Send ${token.symbol} functionality would be implemented here`);
        break;
      case 'swap':
        Alert.alert('Swap', `Swap ${token.symbol} functionality would be implemented here`);
        break;
    }
  };

  const handleBinancePay = () => {
    Alert.alert('Binance Pay', 'Binance Pay integration would be implemented here');
  };

  const handleDepositCode = () => {
    Alert.alert('Deposit Code', 'Deposit code functionality would be implemented here');
  };

  const actions: CryptoAction[] = [
    {
      id: 'deposit',
      title: 'Deposit',
      icon: 'add',
      backgroundColor: '#2C2C2E',
      textColor: '#FFFFFF',
      onPress: () => handleAction('deposit'),
    },
    {
      id: 'withdraw',
      title: 'Withdraw',
      icon: 'remove',
      backgroundColor: '#E8E8E8',
      textColor: '#000000',
      onPress: () => handleAction('withdraw'),
    },
    {
      id: 'send',
      title: 'Send',
      icon: 'arrow-forward',
      backgroundColor: '#E8E8E8',
      textColor: '#000000',
      onPress: () => handleAction('send'),
    },
    {
      id: 'swap',
      title: 'Swap',
      icon: 'swap-horizontal',
      backgroundColor: '#E8E8E8',
      textColor: '#000000',
      onPress: () => handleAction('swap'),
    },
  ];

  const getTokenIcon = () => {
    switch (token.symbol) {
      case 'ETH':
        return 'logo-ethereum';
      case 'USDC':
        return 'ellipse';
      case 'USDT':
        return 'ellipse';
      case 'USDS':
        return 'ellipse';
      case 'XRP':
        return 'close';
      case 'TON':
        return 'diamond';
      case 'S':
        return 'flash';
      case 'BNB':
        return 'cube';
      case 'SOL':
        return 'ellipse';
      default:
        return 'ellipse';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.cryptoSelector}>
          <View style={[styles.cryptoIcon, { backgroundColor: token.color }]}>
            <Ionicons name={getTokenIcon() as any} size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.cryptoSymbol}>{token.symbol}</Text>
          <Ionicons name="chevron-down" size={16} color="#000" />
        </View>
        
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balance Section */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceLabelContainer}>
            <Text style={styles.balanceLabel}>Est. Total Value</Text>
            {rewards && (
              <Ionicons name="eye-outline" size={20} color="#666666" style={styles.eyeIcon} />
            )}
          </View>
          <Text style={styles.balanceAmount}>{token.balance}</Text>
          <Text style={styles.balanceUsd}>≈{token.usdValue} USD</Text>
        </View>

        {/* Rewards Section */}
        {rewards && (
          <View style={styles.rewardsSection}>
            <View style={styles.rewardsRow}>
              <View>
                <Text style={styles.rewardLabel}>Reward</Text>
                <Text style={styles.rewardAmount}>{rewards.amount}</Text>
              </View>
              <View>
                <Text style={styles.rewardLabel}>General</Text>
                <Text style={styles.rewardAmount}>0.00</Text>
              </View>
            </View>
            
            <View style={styles.rewardNotice}>
              <Ionicons name="information-circle" size={20} color="#666" />
              <Text style={styles.rewardNoticeTitle}>Valid until {rewards.expiryDate}</Text>
            </View>
            <Text style={styles.rewardDescription}>{rewards.description}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {actions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionButton}
              onPress={action.onPress}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.backgroundColor }]}>
                <Ionicons 
                  name={action.icon as any} 
                  size={24} 
                  color={action.textColor}
                />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Binance Pay and Deposit Code Buttons */}
        {(showBinancePay || showDepositCode) && (
          <View style={styles.paymentButtonsContainer}>
            {showBinancePay && (
              <TouchableOpacity style={styles.binancePayButton} onPress={handleBinancePay}>
                <Ionicons name="card" size={20} color="#F0B90B" />
                <Text style={styles.binancePayText}>Binance Pay</Text>
              </TouchableOpacity>
            )}
            {showDepositCode && (
              <TouchableOpacity style={styles.depositCodeButton} onPress={handleDepositCode}>
                <Ionicons name="qr-code" size={20} color="#666" />
                <Text style={styles.depositCodeText}>Deposit code</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Transaction History */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>History</Text>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  <Text style={styles.transactionTime}>{transaction.time}</Text>
                </View>
                <Text style={styles.transactionAmount}>+{transaction.amount} {transaction.currency}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={48} color="#CCCCCC" />
              <Text style={styles.emptyStateText}>No transactions yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Your transaction history will appear here
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  cryptoSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  cryptoIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cryptoSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  balanceSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  balanceLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666666',
  },
  eyeIcon: {
    opacity: 0.7,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  balanceUsd: {
    fontSize: 18,
    color: '#666666',
  },
  rewardsSection: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  rewardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rewardLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  rewardAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  rewardNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  rewardNoticeTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  rewardDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  actionButton: {
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
  paymentButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  binancePayButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2C2C2E',
    borderRadius: 25,
    paddingVertical: 16,
  },
  binancePayText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#F0B90B',
  },
  depositCodeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E8E8E8',
    borderRadius: 25,
    paddingVertical: 16,
  },
  depositCodeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  historySection: {
    flex: 1,
    marginBottom: 40,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  transactionItem: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionDate: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  transactionTime: {
    fontSize: 14,
    color: '#666666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
});