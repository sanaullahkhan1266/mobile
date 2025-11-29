import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Theme from '@/constants/Theme';

const FiatPayoutScreen = () => {
  const router = useRouter();
  const [sendAmount, setSendAmount] = useState('0.00');
  const [receiveAmount, setReceiveAmount] = useState('0.00');
  const [fromCurrency, setFromCurrency] = useState('USDT');
  const [toCurrency, setToCurrency] = useState('USD');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.historyButton}>
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
            <Text style={styles.bannerText}>New 2 fiat currencies launch</Text>
            <View style={styles.flagContainer}>
              <Text style={styles.flag}>🇵🇰</Text>
              <View style={styles.euFlag}>
                <Text style={styles.flag}>🇪🇺</Text>
              </View>
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
            />
            <TouchableOpacity style={styles.currencySelector}>
              <View style={styles.currencyIcon}>
                <Text style={styles.currencyIconText}>₮</Text>
              </View>
              <Text style={styles.currencyText}>{fromCurrency}</Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <Text style={styles.availableText}>Available 0 {fromCurrency}</Text>
        </View>

        {/* Recipient Gets Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Recipient gets</Text>
          <View style={styles.amountContainer}>
            <TextInput
              style={styles.amountInput}
              value={receiveAmount}
              onChangeText={setReceiveAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
            />
            <TouchableOpacity style={styles.currencySelector}>
              <View style={styles.currencyIcon}>
                <Text style={styles.flagEmoji}>🇺🇸</Text>
              </View>
              <Text style={styles.currencyText}>{toCurrency}</Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Exchange Rate */}
        <View style={styles.exchangeRate}>
          <Ionicons name="trending-up" size={16} color="#6B7280" />
          <Text style={styles.exchangeText}>1.00 {fromCurrency} ≈ 0.9894 {toCurrency}</Text>
        </View>

        {/* Receive with Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Receive with</Text>
          
          <TouchableOpacity style={styles.recipientSelector}>
            <View style={styles.addButton}>
              <Ionicons name="add" size={20} color="#6B7280" />
            </View>
            <Text style={styles.recipientText}>Select/add a recipient</Text>
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
            <Text style={styles.detailValue}>45.00 {fromCurrency}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimated Arrival</Text>
            <Text style={styles.detailValue}>Select recipient to check</Text>
          </View>
        </View>

        {/* Send Button */}
        <TouchableOpacity style={styles.sendButton} disabled={true}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
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
  euFlag: {
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Theme.muted,
    marginBottom: 12,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '600',
    color: Theme.text,
    padding: 0,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  currencyIcon: {
    width: 24,
    height: 24,
    backgroundColor: Theme.success,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyIconText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  flagEmoji: {
    fontSize: 16,
  },
  currencyText: {
    fontSize: 14,
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
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  exchangeText: {
    fontSize: 14,
    color: Theme.muted,
  },
  recipientSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: Theme.border,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipientText: {
    flex: 1,
    fontSize: 16,
    color: Theme.muted,
  },
  bankIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionDetails: {
    marginBottom: 32,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: Theme.muted,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.text,
  },
  sendButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
  },
});

export default FiatPayoutScreen;