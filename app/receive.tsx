import Theme from '@/constants/Theme';
import { getRecipients, getWalletAddresses } from '@/services/paymentService';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const { width, height } = Dimensions.get('window');

const ReceiveScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Receive');
  const [sendMethod, setSendMethod] = useState('Phone');
  const [recipientInput, setRecipientInput] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('bnb');
  const [recipients, setRecipients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletAddresses, setWalletAddresses] = useState<any>({});

  const tabs = ['Receive', 'Send'];
  const sendMethods = ['UID', 'Email', 'Phone'];

  // Available networks
  const networks = [
    { id: 'bnb', name: 'BNB Smart Chain', symbol: 'BNB', icon: '🟡' },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: '💎' },
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
  ];

  // Fetch wallet address and recipients
  useEffect(() => {
    fetchData();
  }, []);

  // Update wallet address when network changes
  useEffect(() => {
    if (walletAddresses[selectedNetwork]) {
      setWalletAddress(walletAddresses[selectedNetwork]);
    }
  }, [selectedNetwork, walletAddresses]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const addresses = await getWalletAddresses();
      setWalletAddresses(addresses);
      // Default to BNB chain address
      setWalletAddress(addresses.bnb || addresses.eth || addresses.btc || '');

      const recipientsList = await getRecipients();
      setRecipients(recipientsList || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      Alert.alert('Error', 'Failed to load wallet address');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAddress = async () => {
    if (walletAddress) {
      await Clipboard.setStringAsync(walletAddress);
      Alert.alert('Copied!', 'Wallet address copied to clipboard');
    }
  };

  const handleShare = async () => {
    if (walletAddress) {
      try {
        await Share.share({
          message: `Send crypto to my wallet:\n\nNetwork: ${networks.find(n => n.id === selectedNetwork)?.name}\nAddress: ${walletAddress}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const renderReceiveScreen = () => (
    <View style={styles.receiveContent}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.success} />
          <Text style={styles.loadingText}>Loading wallet address...</Text>
        </View>
      ) : (
        <>
          {/* Network Selector */}
          <View style={styles.networkSection}>
            <Text style={styles.sectionTitle}>Select Network</Text>
            <View style={styles.networkButtons}>
              {networks.map((network) => (
                <TouchableOpacity
                  key={network.id}
                  style={[
                    styles.networkButton,
                    selectedNetwork === network.id && styles.networkButtonActive,
                  ]}
                  onPress={() => setSelectedNetwork(network.id)}
                >
                  <Text style={styles.networkIcon}>{network.icon}</Text>
                  <Text
                    style={[
                      styles.networkText,
                      selectedNetwork === network.id && styles.networkTextActive,
                    ]}
                  >
                    {network.symbol}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* QR Code Section */}
          <View style={styles.qrSection}>
            <Text style={styles.qrTitle}>Scan to Pay</Text>
            <View style={styles.qrContainer}>
              {walletAddress ? (
                <QRCode
                  value={walletAddress}
                  size={220}
                  backgroundColor="white"
                  color="black"
                />
              ) : (
                <View style={styles.qrPlaceholder}>
                  <Ionicons name="qr-code-outline" size={100} color={Theme.muted} />
                  <Text style={styles.qrPlaceholderText}>No address available</Text>
                </View>
              )}
            </View>
            <Text style={styles.qrSubtext}>
              Scan this QR code to send {networks.find(n => n.id === selectedNetwork)?.symbol} to this wallet
            </Text>
          </View>

          {/* Wallet Address */}
          <View style={styles.addressSection}>
            <Text style={styles.addressLabel}>Wallet Address</Text>
            <View style={styles.addressContainer}>
              <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">
                {walletAddress || 'No address available'}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleCopyAddress}
                disabled={!walletAddress}
              >
                <Ionicons name="copy-outline" size={20} color={Theme.success} />
                <Text style={styles.actionButtonText}>Copy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
                disabled={!walletAddress}
              >
                <Ionicons name="share-outline" size={20} color={Theme.success} />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Warning */}
          <View style={styles.warningBox}>
            <Ionicons name="warning-outline" size={20} color="#F59E0B" />
            <Text style={styles.warningText}>
              Only send {networks.find(n => n.id === selectedNetwork)?.name} assets to this address.
              Sending other assets may result in permanent loss.
            </Text>
          </View>
        </>
      )}
    </View>
  );

  const renderSendScreen = () => (
    <View style={styles.sendContent}>
      {/* New Recipient Section */}
      <View style={styles.recipientSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>New Recipient</Text>
          <TouchableOpacity style={styles.scanButton}>
            <Ionicons name="scan-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Method Selection */}
        <View style={styles.methodTabs}>
          {sendMethods.map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.methodTab,
                sendMethod === method && styles.activeMethodTab
              ]}
              onPress={() => setSendMethod(method)}
            >
              <Text style={[
                styles.methodTabText,
                sendMethod === method && styles.activeMethodTabText
              ]}>
                {method}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input Field */}
        <View style={styles.inputContainer}>
          {sendMethod === 'Phone' && (
            <View style={styles.phoneInputContainer}>
              <View style={styles.countryCode}>
                <Text style={styles.flagEmoji}>🇵🇰</Text>
                <Text style={styles.countryCodeText}>+92</Text>
                <Ionicons name="chevron-down" size={16} color="#6B7280" />
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="Phone Number"
                placeholderTextColor="#9CA3AF"
                value={recipientInput}
                onChangeText={setRecipientInput}
                keyboardType="phone-pad"
              />
              <TouchableOpacity style={styles.contactsButton}>
                <Ionicons name="people-outline" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          )}

          {sendMethod === 'Email' && (
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={recipientInput}
              onChangeText={setRecipientInput}
              keyboardType="email-address"
            />
          )}

          {sendMethod === 'UID' && (
            <TextInput
              style={styles.textInput}
              placeholder="UID"
              placeholderTextColor="#9CA3AF"
              value={recipientInput}
              onChangeText={setRecipientInput}
            />
          )}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            !recipientInput && styles.nextButtonDisabled
          ]}
          disabled={!recipientInput}
          onPress={() => router.push('/fiat-payout')}
        >
          <Text style={[
            styles.nextButtonText,
            !recipientInput && styles.nextButtonTextDisabled
          ]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>

      {/* Recent Recipients Section */}
      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Recipients</Text>
          <TouchableOpacity>
            <Ionicons name="time-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Empty State */}
        <View style={styles.emptyState}>
          <View style={styles.emptyStateIcon}>
            <Ionicons name="folder-outline" size={48} color="#9CA3AF" />
            <View style={styles.paperPlaneIcon}>
              <Ionicons name="paper-plane" size={20} color="#EF4444" />
            </View>
          </View>
          <Text style={styles.emptyStateText}>No records found</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.historyButton} onPress={() => router.push('/records')}>
          <Ionicons name="time-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'Receive' ? renderReceiveScreen() : renderSendScreen()}
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
    paddingVertical: 60,
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#1F2937',
  },
  receiveContent: {
    flex: 1,
    padding: 20,
  },
  networkSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.text,
    marginBottom: 12,
  },
  networkButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  networkButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: Theme.border,
    borderRadius: 12,
    backgroundColor: Theme.card,
    gap: 8,
  },
  networkButtonActive: {
    borderColor: Theme.success,
    backgroundColor: '#ECFDF5',
  },
  networkIcon: {
    fontSize: 20,
  },
  networkText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.muted,
  },
  networkTextActive: {
    color: Theme.success,
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.text,
    marginBottom: 20,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  qrPlaceholder: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  qrPlaceholderText: {
    marginTop: 12,
    fontSize: 14,
    color: Theme.muted,
  },
  qrSubtext: {
    marginTop: 16,
    fontSize: 14,
    color: Theme.muted,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  addressSection: {
    marginBottom: 24,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.muted,
    marginBottom: 8,
  },
  addressContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: Theme.text,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.success,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  sendContent: {
    flex: 1,
    padding: 20,
  },
  recipientSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  scanButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodTabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  methodTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeMethodTab: {
    backgroundColor: '#FFFFFF',
  },
  methodTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeMethodTabText: {
    color: '#1F2937',
  },
  inputContainer: {
    marginBottom: 16,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: 12,
    backgroundColor: Theme.card,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: Theme.border,
    gap: 4,
  },
  flagEmoji: {
    fontSize: 20,
  },
  countryCodeText: {
    fontSize: 16,
    color: Theme.text,
    marginLeft: 4,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    color: Theme.text,
  },
  contactsButton: {
    padding: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: Theme.text,
    backgroundColor: Theme.card,
  },
  nextButton: {
    backgroundColor: Theme.success,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: Theme.border,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  nextButtonTextDisabled: {
    color: '#9CA3AF',
  },
  recentSection: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    position: 'relative',
    marginBottom: 16,
  },
  paperPlaneIcon: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
  },
  emptyStateText: {
    fontSize: 16,
    color: Theme.muted,
  },
});

export default ReceiveScreen;