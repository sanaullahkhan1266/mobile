import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  useBalance, 
  useWalletAddresses, 
  useCards,
  useTransactionHistory,
  useSendTransaction,
  use2FAStatus,
  useEnable2FA,
} from '@/hooks/useApi';
import * as authService from '@/services/authService';
import * as paymentService from '@/services/paymentService';
import * as cardService from '@/services/cardService';
import * as transactionService from '@/services/transactionService';

export default function ApiTestScreen() {
  const router = useRouter();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);
  
  // Use hooks for real-time data
  const { balance, loading: balanceLoading, refresh: refreshBalance } = useBalance();
  const { addresses, loading: addressesLoading } = useWalletAddresses();
  const { cards, loading: cardsLoading, createCard } = useCards();
  const { transactions, loading: txLoading } = useTransactionHistory();
  const { status: twoFAStatus } = use2FAStatus();

  const addResult = (endpoint: string, success: boolean, message: string) => {
    setTestResults(prev => [...prev, {
      endpoint,
      success,
      message,
      timestamp: new Date().toISOString()
    }]);
  };

  const testAuthEndpoints = async () => {
    // Test signup
    try {
      const signupResult = await authService.signupWithBackend({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'Test123!@#'
      });
      addResult('/api/auth/signup', true, signupResult.message);
    } catch (error: any) {
      addResult('/api/auth/signup', false, error?.message || 'Failed');
    }

    // Test login
    try {
      const loginResult = await authService.loginWithBackend({
        email: 'test@example.com',
        password: 'Test123!'
      });
      addResult('/api/auth/login', true, 'Login successful');
    } catch (error: any) {
      addResult('/api/auth/login', false, error?.message || 'Failed');
    }

    // Test forgot password
    try {
      const forgotResult = await authService.forgotPassword('test@example.com');
      addResult('/api/auth/forgot-password', true, forgotResult.message);
    } catch (error: any) {
      addResult('/api/auth/forgot-password', false, error?.message || 'Failed');
    }
  };

  const testPaymentEndpoints = async () => {
    // Test wallet addresses
    try {
      const wallets = await paymentService.getWalletAddresses();
      addResult('/api/payment/wallet-addresses', true, 'Fetched wallet addresses');
    } catch (error: any) {
      addResult('/api/payment/wallet-addresses', false, error?.message || 'Failed');
    }

    // Test balance
    try {
      const balanceData = await paymentService.getBalance();
      addResult('/api/payment/balance', true, 'Fetched balance');
    } catch (error: any) {
      addResult('/api/payment/balance', false, error?.message || 'Failed');
    }

    // Test create charge
    try {
      const charge = await paymentService.createCharge({
        amount: '100',
        currency: 'USDT',
        chain: 'bnb',
        description: 'Test charge'
      });
      addResult('/api/payment/charge', true, `Created charge: ${charge.chargeId}`);
    } catch (error: any) {
      addResult('/api/payment/charge', false, error?.message || 'Failed');
    }

    // Test payment requests
    try {
      const requests = await paymentService.getPaymentRequests();
      addResult('/api/payment/requests', true, `Found ${requests.length} requests`);
    } catch (error: any) {
      addResult('/api/payment/requests', false, error?.message || 'Failed');
    }
  };

  const testCardEndpoints = async () => {
    // Test create card
    try {
      const card = await cardService.createCard({
        currency: 'USD',
        cardType: 'virtual',
        fundingAmount: '100'
      });
      addResult('/api/card/create', true, `Created card: ${card.lastFour}`);
    } catch (error: any) {
      addResult('/api/card/create', false, error?.message || 'Failed');
    }

    // Test list cards
    try {
      const cardList = await cardService.getCards();
      addResult('/api/card/list', true, `Found ${cardList.length} cards`);
    } catch (error: any) {
      addResult('/api/card/list', false, error?.message || 'Failed');
    }
  };

  const testTransactionEndpoints = async () => {
    // Test transaction history
    try {
      const history = await transactionService.getTransactionHistory({
        limit: 10
      });
      addResult('/api/tx/history', true, `Found ${history.length} transactions`);
    } catch (error: any) {
      addResult('/api/tx/history', false, error?.message || 'Failed');
    }

    // Test send transaction (will fail without proper setup)
    try {
      const result = await transactionService.sendTransaction({
        to: '0x1234567890123456789012345678901234567890',
        amount: '0.01',
        currency: 'USDT',
        chain: 'bnb'
      });
      addResult('/api/tx/send', true, 'Transaction sent');
    } catch (error: any) {
      addResult('/api/tx/send', false, error?.message || 'Failed');
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    setTestResults([]);

    await testAuthEndpoints();
    await testPaymentEndpoints();
    await testCardEndpoints();
    await testTransactionEndpoints();

    setTesting(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>API Integration Test</Text>
      </View>

      {/* Live Data Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Live Data (Using Hooks)</Text>
        
        <View style={styles.dataRow}>
          <Text style={styles.label}>Balance:</Text>
          {balanceLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={styles.value}>{JSON.stringify(balance) || 'N/A'}</Text>
          )}
        </View>

        <View style={styles.dataRow}>
          <Text style={styles.label}>Wallet Addresses:</Text>
          {addressesLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={styles.value}>{addresses ? 'Loaded' : 'N/A'}</Text>
          )}
        </View>

        <View style={styles.dataRow}>
          <Text style={styles.label}>Cards:</Text>
          {cardsLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={styles.value}>{cards?.length || 0} cards</Text>
          )}
        </View>

        <View style={styles.dataRow}>
          <Text style={styles.label}>Transactions:</Text>
          {txLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={styles.value}>{transactions?.length || 0} transactions</Text>
          )}
        </View>

        <View style={styles.dataRow}>
          <Text style={styles.label}>2FA Status:</Text>
          <Text style={styles.value}>
            {twoFAStatus?.enabled ? 'Enabled' : 'Disabled'}
          </Text>
        </View>
      </View>

      {/* Test Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Endpoint Tests</Text>
        
        <TouchableOpacity
          style={[styles.button, testing && styles.buttonDisabled]}
          onPress={runAllTests}
          disabled={testing}
        >
          {testing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Run All Tests</Text>
          )}
        </TouchableOpacity>

        {/* Test Results */}
        {testResults.length > 0 && (
          <View style={styles.results}>
            <Text style={styles.resultTitle}>Test Results:</Text>
            {testResults.map((result, index) => (
              <View key={index} style={styles.resultRow}>
                <Text style={[styles.resultStatus, result.success ? styles.success : styles.error]}>
                  {result.success ? '✓' : '✗'}
                </Text>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultEndpoint}>{result.endpoint}</Text>
                  <Text style={styles.resultMessage}>{result.message}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => refreshBalance()}
        >
          <Text style={styles.actionText}>Refresh Balance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={async () => {
            try {
              const card = await createCard({
                currency: 'USD',
                cardType: 'virtual'
              });
              Alert.alert('Success', 'Card created successfully!');
            } catch (error) {
              // Error handled by hook
            }
          }}
        >
          <Text style={styles.actionText}>Create Virtual Card</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/transaction-history')}
        >
          <Text style={styles.actionText}>View Transactions</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  results: {
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  resultStatus: {
    fontSize: 18,
    marginRight: 10,
    fontWeight: 'bold',
  },
  success: {
    color: '#4CAF50',
  },
  error: {
    color: '#F44336',
  },
  resultInfo: {
    flex: 1,
  },
  resultEndpoint: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  resultMessage: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  actionButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});