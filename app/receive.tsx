import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Theme from '@/constants/Theme';
import * as Clipboard from 'expo-clipboard';
import { getWalletAddresses, getRecipients } from '@/services/paymentService';

const { width, height } = Dimensions.get('window');

const ReceiveScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Receive');
  const [sendMethod, setSendMethod] = useState('Phone');
  const [recipientInput, setRecipientInput] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [recipients, setRecipients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = ['Receive', 'Send'];
  const sendMethods = ['UID', 'Email', 'Phone'];

  // Fetch wallet address and recipients
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const addresses = await getWalletAddresses();
      // Default to BNB chain address
      setWalletAddress(addresses.bnb || '');
      
      const recipientsList = await getRecipients();
      setRecipients(recipientsList || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAddress = async () => {
    if (walletAddress) {
      await Clipboard.setStringAsync(walletAddress);
    }
  };

  // QR Code pattern - simplified representation
  const renderQRCode = () => (
    <View style={styles.qrContainer}>
      {/* QR Code pattern */}
      <View style={styles.qrCode}>
        {/* Top-left corner */}
        <View style={[styles.qrCorner, styles.topLeft]}>
          <View style={styles.qrCornerInner} />
        </View>
        
        {/* Top-right corner */}
        <View style={[styles.qrCorner, styles.topRight]}>
          <View style={styles.qrCornerInner} />
        </View>
        
        {/* Bottom-left corner */}
        <View style={[styles.qrCorner, styles.bottomLeft]}>
          <View style={styles.qrCornerInner} />
        </View>
        
        {/* Center logo */}
        <View style={styles.centerLogo}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>En</Text>
          </View>
        </View>
        
        {/* Random QR pattern */}
        <View style={styles.qrPattern}>
          {Array.from({ length: 300 }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.qrDot,
                {
                  left: `${(index % 20) * 5}%`,
                  top: `${Math.floor(index / 20) * 6.67}%`,
                  opacity: Math.random() > 0.5 ? 1 : 0,
                },
              ]}
            />
          ))}
        </View>
      </View>
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
        <View style={styles.headerTabs}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.headerTab,
                activeTab === tab && styles.activeHeaderTab
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.headerTabText,
                activeTab === tab && styles.activeHeaderTabText
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.historyButton}>
          <Ionicons name="time-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'Receive' ? (
          <>
            {/* Title and Description */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>Receive</Text>
              <Text style={styles.description}>
                Receive crypto from Cardtick users in your wallet
              </Text>
            </View>

            {/* Instructions */}
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsText}>
                Scan with the Cardtick app to pay
              </Text>
            </View>

            {/* QR Code */}
            {renderQRCode()}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                <Text style={styles.actionButtonText}>Set Amount</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                <Text style={styles.actionButtonText}>Share QR Code</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Title */}
            <View style={styles.sendTitleSection}>
              <Text style={styles.sendTitle}>Send</Text>
            </View>
            
            {/* Send Screen */}
            {renderSendScreen()}
          </>
        )}
      </View>
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
  headerTabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    padding: 4,
  },
  headerTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeHeaderTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Theme.muted,
  },
  activeHeaderTabText: {
    color: Theme.text,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Theme.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Theme.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  instructionsContainer: {
    marginBottom: 40,
  },
  instructionsText: {
    fontSize: 16,
    color: Theme.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  qrCode: {
    width: 240,
    height: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  qrCorner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderWidth: 4,
    borderColor: '#1F2937',
  },
  topLeft: {
    top: 20,
    left: 20,
  },
  topRight: {
    top: 20,
    right: 20,
  },
  bottomLeft: {
    bottom: 20,
    left: 20,
  },
  qrCornerInner: {
    flex: 1,
    margin: 8,
    backgroundColor: '#1F2937',
  },
  centerLogo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  qrPattern: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
  },
  qrDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#1F2937',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.text,
  },
  // Send Screen Styles
  sendTitleSection: {
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 24,
  },
  sendTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
  },
  sendContent: {
    flex: 1,
    width: '100%',
  },
  recipientSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  recentSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  scanButton: {
    padding: 4,
  },
  methodTabs: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  methodTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  activeMethodTab: {
    backgroundColor: '#1F2937',
  },
  methodTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Theme.muted,
  },
  activeMethodTabText: {
    color: '#FFFFFF',
  },
  inputContainer: {
    marginBottom: 16,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    height: 56,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  flagEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginRight: 4,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: Theme.text,
  },
  contactsButton: {
    padding: 4,
  },
  textInput: {
    backgroundColor: Theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.border,
    paddingHorizontal: 16,
    height: 56,
    fontSize: 16,
    color: Theme.text,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    position: 'relative',
    marginBottom: 16,
  },
  paperPlaneIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    transform: [{ rotate: '45deg' }],
  },
  emptyStateText: {
    fontSize: 16,
    color: Theme.muted,
    textAlign: 'center',
  },
});

export default ReceiveScreen;