import Theme from '@/constants/Theme';
import { getBalance, getRecipients } from '@/services/paymentService';
import { calculateTransactionFee, sendTransaction } from '@/services/transactionService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const FiatPayoutScreen = () => {
  const router = useRouter();
  const [sendAmount, setSendAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USDT');
  const [toCurrency, setToCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(0.9894);
  const [fee, setFee] = useState('0');
  const [balance, setBalance] = useState<any>(null);
  const [recipients, setRecipients] = useState<any[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showFromCurrencyModal, setShowFromCurrencyModal] = useState(false);
  const [showToCurrencyModal, setShowToCurrencyModal] = useState(false);

  // Available cryptocurrencies
  const cryptoCurrencies = [
    { symbol: 'USDT', name: 'Tether', icon: '₮', color: '#26A17B' },
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: '#F7931A' },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', color: '#627EEA' },
    { symbol: 'BNB', name: 'BNB', icon: 'B', color: '#F3BA2F' },
  ];

  // Available fiat currencies
  const fiatCurrencies = [
    { symbol: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { symbol: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { symbol: 'PKR', name: 'Pakistani Rupee', flag: '🇵🇰' },
    { symbol: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (sendAmount && parseFloat(sendAmount) > 0) {
      const amount = parseFloat(sendAmount);
      const received = (amount * exchangeRate).toFixed(2);
      setReceiveAmount(received);
      calculateFee();
    } else {
      setReceiveAmount('');
      setFee('0');
    }
  }, [sendAmount, exchangeRate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const balanceData = await getBalance();
      setBalance(balanceData);

      const recipientsList = await getRecipients();
      setRecipients(recipientsList || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      Alert.alert('Error', 'Failed to load balance and recipients');
    } finally {
      setLoading(false);
    }
  };

  const calculateFee = async () => {
    if (!sendAmount || parseFloat(sendAmount) <= 0) {
      setFee('0');
      return;
    }

    try {
      const feeData = await calculateTransactionFee({
        amount: sendAmount,
        currency: fromCurrency,
        chain: 'bnb',
      });
      setFee(feeData.fee || '0');
    } catch (error) {
      // Fallback to 1% fee
      const calculatedFee = (parseFloat(sendAmount) * 0.01).toFixed(2);
      setFee(calculatedFee);
    }
  };

  const selectFromCurrency = (currency: any) => {
    setFromCurrency(currency.symbol);
    setShowFromCurrencyModal(false);
    if (sendAmount) {
      calculateFee();
    }
  };

  const selectToCurrency = (currency: any) => {
    setToCurrency(currency.symbol);
    setShowToCurrencyModal(false);
  };

  const getCurrentCrypto = () => {
    return cryptoCurrencies.find(c => c.symbol === fromCurrency) || cryptoCurrencies[0];
  };

  const getCurrentFiat = () => {
    return fiatCurrencies.find(f => f.symbol === toCurrency) || fiatCurrencies[0];
  };

  const handleSend = async () => {
    if (!sendAmount || parseFloat(sendAmount) <= 0) {
      Alert.alert('Error', 'Please enter an amount to send');
      return;
    }

    if (!selectedRecipient) {
      Alert.alert('Error', 'Please select a recipient');
      return;
    }

    const currentBalance = balance?.[fromCurrency]?.balance || '0';
    const totalAmount = parseFloat(sendAmount) + parseFloat(fee);

    if (parseFloat(currentBalance) < totalAmount) {
      Alert.alert(
        'Insufficient Balance',
        `You need ${totalAmount} ${fromCurrency} (${sendAmount} + ${fee} fee) but only have ${currentBalance} ${fromCurrency}`
      );
      return;
    }

    Alert.alert(
      'Confirm Fiat Payout',
      `Send ${sendAmount} ${fromCurrency} to ${selectedRecipient.name}?\n\nRecipient gets: ${receiveAmount} ${toCurrency}\nFee: ${fee} ${fromCurrency}\nTotal: ${totalAmount} ${fromCurrency}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: executePayout },
      ]
    );
  };

  const executePayout = async () => {
    setSending(true);
    try {
      const result = await sendTransaction({
        toAddress: selectedRecipient?.address || selectedRecipient?.walletAddress || selectedRecipient?.id || '',
        amount: sendAmount,
        currency: fromCurrency,
        chain: 'bnb',
        memo: `Fiat payout to ${selectedRecipient?.name || 'recipient'}`,
      });

      Alert.alert(
        'Payout Successful!',
        `Sent ${sendAmount} ${fromCurrency}\nRecipient gets: ${receiveAmount} ${toCurrency}\n\nTransaction ID: ${result.transactionId || 'N/A'}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setSendAmount('');
              setReceiveAmount('');
              setSelectedRecipient(null);
              fetchData();
              router.back();
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Payout Failed', error.message || 'Failed to send payout');
    } finally {
      setSending(false);
    }
  };

  const selectRecipient = () => {
    if (recipients.length === 0) {
      Alert.alert('No Recipients', 'You have no saved recipients. Add one first.');
      return;
    }

    const recipient = recipients[0];
    setSelectedRecipient(recipient);
    Alert.alert('Recipient Selected', `Selected: ${recipient.name || recipient.address}`);
  };

  const getUserBalance = () => {
    return balance?.[fromCurrency]?.balance || '0';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.success} />
          <Text style={styles.loadingText}>Loading payout data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentCrypto = getCurrentCrypto();
  const currentFiat = getCurrentFiat();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.historyButton} onPress={() => router.push('/records')}>
          <Ionicons name="time-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.title}>Fiat Payout</Text>

        {/* Announcement Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerIcon}>🔥</Text>
            <Text style={styles.bannerText}>Select from multiple currencies</Text>
            <View style={styles.flagContainer}>
              <Text style={styles.flag}>💰</Text>
            </View>
          </View>
        </View>

        {/* Amount to Send Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Amount to Send</Text>
          <View style={styles.amountContainer}>
            <TextInput
              style={styles.amountInput}
              value={sendAmount}
              onChangeText={setSendAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={Theme.muted}
            />
            <TouchableOpacity
              style={styles.currencySelector}
              onPress={() => setShowFromCurrencyModal(true)}
            >
              <View style={[styles.currencyIcon, { backgroundColor: currentCrypto.color }]}>
                <Text style={styles.currencyIconText}>{currentCrypto.icon}</Text>
              </View>
              <Text style={styles.currencyText}>{fromCurrency}</Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <Text style={styles.availableText}>
            Available {parseFloat(getUserBalance()).toFixed(2)} {fromCurrency}
          </Text>
        </View>

        {/* Recipient Gets Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Recipient gets</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.amountInput}>
              {receiveAmount || '0.00'}
            </Text>
            <TouchableOpacity
              style={styles.currencySelector}
              onPress={() => setShowToCurrencyModal(true)}
            >
              <View style={styles.currencyIcon}>
                <Text style={styles.flagEmoji}>{currentFiat.flag}</Text>
              </View>
              <Text style={styles.currencyText}>{toCurrency}</Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Exchange Rate */}
        <View style={styles.exchangeRate}>
          <Ionicons name="trending-up" size={16} color="#6B7280" />
          <Text style={styles.exchangeText}>
            1.00 {fromCurrency} ≈ {exchangeRate.toFixed(4)} {toCurrency}
          </Text>
        </View>

        {/* Receive with Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Receive with</Text>

          <TouchableOpacity
            style={styles.recipientSelector}
            onPress={selectRecipient}
          >
            <View style={styles.addButton}>
              <Ionicons name={selectedRecipient ? "checkmark" : "add"} size={20} color={selectedRecipient ? Theme.success : "#6B7280"} />
            </View>
            <Text style={styles.recipientText}>
              {selectedRecipient ? selectedRecipient.name || selectedRecipient.address?.substring(0, 20) + '...' : 'Select/add a recipient'}
            </Text>
            <View style={styles.bankIcon}>
              <Ionicons name="business" size={20} color="#EF4444" />
            </View>
            <Ionicons name="chevron-forward" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Transaction Details */}
        <View style={styles.transactionDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fee</Text>
            <Text style={styles.detailValue}>{fee} {fromCurrency}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total</Text>
            <Text style={styles.detailValue}>
              {(parseFloat(sendAmount || '0') + parseFloat(fee)).toFixed(2)} {fromCurrency}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimated Arrival</Text>
            <Text style={styles.detailValue}>
              {selectedRecipient ? '1-3 business days' : 'Select recipient to check'}
            </Text>
          </View>
        </View>

        {/* Send Button */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!sendAmount || !selectedRecipient || sending) && styles.sendButtonDisabled
          ]}
          disabled={!sendAmount || !selectedRecipient || sending}
          onPress={handleSend}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.sendButtonText}>
              Send {sendAmount || '0'} {fromCurrency}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* From Currency Selection Modal */}
      <Modal
        visible={showFromCurrencyModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFromCurrencyModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFromCurrencyModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Cryptocurrency</Text>
            {cryptoCurrencies.map((currency) => (
              <TouchableOpacity
                key={currency.symbol}
                style={styles.currencyOption}
                onPress={() => selectFromCurrency(currency)}
              >
                <View style={[styles.currencyIconSmall, { backgroundColor: currency.color }]}>
                  <Text style={styles.currencyIconText}>{currency.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.currencyName}>{currency.name}</Text>
                  <Text style={styles.currencySymbolText}>{currency.symbol}</Text>
                </View>
                {fromCurrency === currency.symbol && (
                  <Ionicons name="checkmark-circle" size={24} color={Theme.success} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowFromCurrencyModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* To Currency Selection Modal */}
      <Modal
        visible={showToCurrencyModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowToCurrencyModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowToCurrencyModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Fiat Currency</Text>
            {fiatCurrencies.map((currency) => (
              <TouchableOpacity
                key={currency.symbol}
                style={styles.currencyOption}
                onPress={() => selectToCurrency(currency)}
              >
                <Text style={styles.currencyFlag}>{currency.flag}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.currencyName}>{currency.name}</Text>
                  <Text style={styles.currencySymbolText}>{currency.symbol}</Text>
                </View>
                {toCurrency === currency.symbol && (
                  <Ionicons name="checkmark-circle" size={24} color={Theme.success} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowToCurrencyModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  historyButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Theme.text,
    marginVertical: 24,
  },
  banner: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  bannerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#92400E',
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 16,
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.muted,
    marginBottom: 12,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: Theme.card,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: Theme.text,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#26A17B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyIconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  flagEmoji: {
    fontSize: 20,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.text,
  },
  availableText: {
    fontSize: 14,
    color: Theme.muted,
    marginTop: 8,
  },
  exchangeRate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    marginBottom: 24,
  },
  exchangeText: {
    fontSize: 14,
    color: Theme.muted,
  },
  recipientSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: Theme.card,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recipientText: {
    flex: 1,
    fontSize: 16,
    color: Theme.text,
  },
  bankIcon: {
    marginRight: 8,
  },
  transactionDetails: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: Theme.muted,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.text,
  },
  sendButton: {
    backgroundColor: Theme.success,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  sendButtonDisabled: {
    backgroundColor: Theme.border,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Theme.bg,
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.text,
    marginBottom: 20,
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },
  currencyIconSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  currencyFlag: {
    fontSize: 32,
    marginRight: 12,
  },
  currencyName: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.text,
  },
  currencySymbolText: {
    fontSize: 14,
    color: Theme.muted,
    marginTop: 2,
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.text,
  },
});

export default FiatPayoutScreen;