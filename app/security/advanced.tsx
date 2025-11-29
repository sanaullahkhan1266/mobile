import React, { useState } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Switch,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  Clipboard,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '@/components/AppHeader';
import { useTheme } from '@/constants/Theme';

const { width, height } = Dimensions.get('window');

export default function SecurityAdvancedPage() {
  const T = useTheme();
  
  // 2FA States
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [authenticatorEnabled, setAuthenticatorEnabled] = useState(false);
  
  // Setup Modal States
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [setupType, setSetupType] = useState<'sms' | 'email' | 'authenticator'>('sms');
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  
  // Mock data for demonstration
  const secretKey = 'JBSWY3DPEHPK3PXP';
  const qrCodeUrl = `otpauth://totp/EnPaying:user@example.com?secret=${secretKey}&issuer=EnPaying`;
  
  const handle2FAToggle = (value: boolean) => {
    if (value && !smsEnabled && !emailEnabled && !authenticatorEnabled) {
      Alert.alert(
        'Setup Required',
        'Please setup at least one 2FA method before enabling.',
        [{ text: 'OK' }]
      );
      return;
    }
    setTwoFactorEnabled(value);
  };
  
  const setupMethod = (type: 'sms' | 'email' | 'authenticator') => {
    setSetupType(type);
    setSetupStep(1);
    setVerificationCode('');
    setShowSetupModal(true);
  };
  
  const handleVerification = () => {
    if (verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code.');
      return;
    }
    
    // Mock verification success
    if (setupType === 'sms') setSmsEnabled(true);
    if (setupType === 'email') setEmailEnabled(true);
    if (setupType === 'authenticator') setAuthenticatorEnabled(true);
    
    setShowSetupModal(false);
    Alert.alert('Success', `${setupType.toUpperCase()} 2FA has been enabled successfully!`);
  };
  
  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied', 'Secret key copied to clipboard');
  };
  
  const disableMethod = (type: 'sms' | 'email' | 'authenticator') => {
    Alert.alert(
      'Disable 2FA Method',
      `Are you sure you want to disable ${type.toUpperCase()} authentication?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disable',
          style: 'destructive',
          onPress: () => {
            if (type === 'sms') setSmsEnabled(false);
            if (type === 'email') setEmailEnabled(false);
            if (type === 'authenticator') setAuthenticatorEnabled(false);
            
            // Disable main 2FA if no methods are enabled
            if (!smsEnabled && !emailEnabled && !authenticatorEnabled) {
              setTwoFactorEnabled(false);
            }
          }
        }
      ]
    );
  };
  
  const renderSetupModal = () => {
    return (
      <Modal
        visible={showSetupModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSetupModal(false)}
      >
        <View style={s.modalOverlay}>
          <View style={[s.modalContent, { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }]}>
            <View style={s.modalHeader}>
              <Text style={[s.modalTitle, { color: '#000000' }]}>
                Setup {setupType.toUpperCase()} 2FA
              </Text>
              <TouchableOpacity onPress={() => setShowSetupModal(false)}>
                <Ionicons name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>
            
            {setupStep === 1 && (
              <View style={s.modalBody}>
                {setupType === 'sms' && (
                  <>
                    <Text style={[s.modalDescription, { color: '#374151' }]}>
                      Enter your phone number to receive SMS codes
                    </Text>
                    <TextInput
                      style={[s.input, { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', color: '#000000' }]}
                      placeholder="+1 (555) 123-4567"
                      placeholderTextColor="#6B7280"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                    />
                  </>
                )}
                
                {setupType === 'email' && (
                  <>
                    <Text style={[s.modalDescription, { color: '#374151' }]}>
                      Enter your email address to receive verification codes
                    </Text>
                    <TextInput
                      style={[s.input, { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', color: '#000000' }]}
                      placeholder="your.email@example.com"
                      placeholderTextColor="#6B7280"
                      value={emailAddress}
                      onChangeText={setEmailAddress}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </>
                )}
                
                {setupType === 'authenticator' && (
                  <>
                    <Text style={[s.modalDescription, { color: '#374151' }]}>
                      Scan the QR code with your authenticator app or manually enter the secret key
                    </Text>
                    <View style={[s.qrContainer, { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }]}>
                      <Ionicons name="qr-code" size={120} color="#6B7280" />
                      <Text style={[s.qrText, { color: '#6B7280' }]}>QR Code</Text>
                    </View>
                    <View style={s.secretKeyContainer}>
                      <Text style={[s.secretKeyLabel, { color: '#000000' }]}>Manual Entry Key:</Text>
                      <View style={s.secretKeyRow}>
                        <Text style={[s.secretKey, { color: '#6B7280' }]}>{secretKey}</Text>
                        <TouchableOpacity onPress={() => copyToClipboard(secretKey)}>
                          <Ionicons name="copy" size={20} color="#000000" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                )}
                
                <TouchableOpacity
                  style={[s.continueButton, { backgroundColor: '#000000' }]}
                  onPress={() => {
                    if (setupType === 'sms' && !phoneNumber) {
                      Alert.alert('Error', 'Please enter your phone number');
                      return;
                    }
                    if (setupType === 'email' && !emailAddress) {
                      Alert.alert('Error', 'Please enter your email address');
                      return;
                    }
                    setSetupStep(2);
                  }}
                >
                  <Text style={[s.continueButtonText, { color: '#FFFFFF' }]}>Continue</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {setupStep === 2 && (
              <View style={s.modalBody}>
                <Text style={[s.modalDescription, { color: '#374151' }]}>
                  {setupType === 'sms' && `We've sent a verification code to ${phoneNumber}`}
                  {setupType === 'email' && `We've sent a verification code to ${emailAddress}`}
                  {setupType === 'authenticator' && 'Enter the 6-digit code from your authenticator app'}
                </Text>
                
                <TextInput
                  style={[s.codeInput, { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', color: '#000000' }]}
                  placeholder="000000"
                  placeholderTextColor="#6B7280"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  keyboardType="number-pad"
                  maxLength={6}
                  textAlign="center"
                />
                
                <TouchableOpacity
                  style={[s.verifyButton, { backgroundColor: '#000000' }]}
                  onPress={handleVerification}
                >
                  <Text style={[s.verifyButtonText, { color: '#FFFFFF' }]}>Verify & Enable</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  };
  
  return (
    <SafeAreaView style={[s.container, { backgroundColor: T.bg }]}> 
      <StatusBar barStyle={T.text === '#F9FAFB' ? 'light-content' : 'dark-content'} />
      <AppHeader title="Security - Advanced" />
      
      <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
        {/* Main 2FA Toggle */}
        <View style={[s.card, { borderColor: T.border, backgroundColor: T.card }]}>
          <View style={s.cardHeader}>
            <View style={s.cardTitleContainer}>
              <Ionicons name="shield-checkmark" size={24} color={T.text} />
              <View style={s.cardTitleText}>
                <Text style={[s.title, { color: T.text }]}>Two-Factor Authentication</Text>
                <Text style={[s.subtitle, { color: T.muted }]}>Add an extra layer of security</Text>
              </View>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={handle2FAToggle}
              trackColor={{ false: T.border, true: '#34D399' }}
              thumbColor={twoFactorEnabled ? '#10B981' : '#9CA3AF'}
            />
          </View>
          
          {twoFactorEnabled && (
            <View style={s.statusContainer}>
              <View style={s.statusBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={s.statusText}>2FA Enabled</Text>
              </View>
            </View>
          )}
        </View>
        
        {/* 2FA Methods */}
        <Text style={[s.sectionTitle, { color: T.text }]}>Authentication Methods</Text>
        
        {/* SMS Authentication */}
        <View style={[s.methodCard, { borderColor: T.border, backgroundColor: T.card }]}>
          <View style={s.methodHeader}>
            <View style={s.methodInfo}>
              <Ionicons name="phone-portrait" size={20} color={T.text} />
              <View style={s.methodText}>
                <Text style={[s.methodTitle, { color: T.text }]}>SMS Authentication</Text>
                <Text style={[s.methodDescription, { color: T.muted }]}>Receive codes via text message</Text>
              </View>
            </View>
            <View style={s.methodActions}>
              {smsEnabled ? (
                <>
                  <View style={s.enabledBadge}>
                    <Ionicons name="checkmark" size={12} color="#10B981" />
                  </View>
                  <TouchableOpacity onPress={() => disableMethod('sms')}>
                    <Text style={[s.disableText, { color: '#EF4444' }]}>Disable</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={() => setupMethod('sms')}>
                  <Text style={[s.setupText, { color: T.text }]}>Setup</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        
        {/* Email Authentication */}
        <View style={[s.methodCard, { borderColor: T.border, backgroundColor: T.card }]}>
          <View style={s.methodHeader}>
            <View style={s.methodInfo}>
              <Ionicons name="mail" size={20} color={T.text} />
              <View style={s.methodText}>
                <Text style={[s.methodTitle, { color: T.text }]}>Email Authentication</Text>
                <Text style={[s.methodDescription, { color: T.muted }]}>Receive codes via email</Text>
              </View>
            </View>
            <View style={s.methodActions}>
              {emailEnabled ? (
                <>
                  <View style={s.enabledBadge}>
                    <Ionicons name="checkmark" size={12} color="#10B981" />
                  </View>
                  <TouchableOpacity onPress={() => disableMethod('email')}>
                    <Text style={[s.disableText, { color: '#EF4444' }]}>Disable</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={() => setupMethod('email')}>
                  <Text style={[s.setupText, { color: T.text }]}>Setup</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        
        {/* Authenticator App */}
        <View style={[s.methodCard, { borderColor: T.border, backgroundColor: T.card }]}>
          <View style={s.methodHeader}>
            <View style={s.methodInfo}>
              <Ionicons name="key" size={20} color={T.text} />
              <View style={s.methodText}>
                <Text style={[s.methodTitle, { color: T.text }]}>Authenticator App</Text>
                <Text style={[s.methodDescription, { color: T.muted }]}>Use Google Authenticator or similar</Text>
              </View>
            </View>
            <View style={s.methodActions}>
              {authenticatorEnabled ? (
                <>
                  <View style={s.enabledBadge}>
                    <Ionicons name="checkmark" size={12} color="#10B981" />
                  </View>
                  <TouchableOpacity onPress={() => disableMethod('authenticator')}>
                    <Text style={[s.disableText, { color: '#EF4444' }]}>Disable</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={() => setupMethod('authenticator')}>
                  <Text style={[s.setupText, { color: T.text }]}>Setup</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        
        {/* Security Tips */}
        <View style={[s.tipsCard, { borderColor: T.border, backgroundColor: T.card }]}>
          <View style={s.tipsHeader}>
            <Ionicons name="bulb" size={20} color="#F59E0B" />
            <Text style={[s.tipsTitle, { color: T.text }]}>Security Tips</Text>
          </View>
          <View style={s.tipsList}>
            <Text style={[s.tipItem, { color: T.muted }]}>• Enable multiple 2FA methods for better security</Text>
            <Text style={[s.tipItem, { color: T.muted }]}>• Keep backup codes in a safe place</Text>
            <Text style={[s.tipItem, { color: T.muted }]}>• Use authenticator apps for the highest security</Text>
            <Text style={[s.tipItem, { color: T.muted }]}>• Never share your 2FA codes with anyone</Text>
          </View>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
      
      {renderSetupModal()}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { 
    flex: 1, 
    padding: 16 
  },
  
  // Main Card Styles
  card: { 
    borderWidth: 1, 
    borderRadius: 12, 
    padding: 16,
    marginBottom: 16
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardTitleText: {
    marginLeft: 12,
    flex: 1,
  },
  title: { 
    fontSize: 18,
    fontWeight: '700' 
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  statusContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 4,
  },
  
  // Section Title
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 8,
  },
  
  // Method Cards
  methodCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodText: {
    marginLeft: 12,
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  methodDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  methodActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  enabledBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setupText: {
    fontSize: 14,
    fontWeight: '600',
  },
  disableText: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Tips Card
  tipsCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    lineHeight: 20,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalBody: {
    padding: 20,
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  
  // Input Styles
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  codeInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 4,
    marginBottom: 20,
  },
  
  // QR Code Styles
  qrContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  qrText: {
    fontSize: 14,
    marginTop: 8,
  },
  secretKeyContainer: {
    marginBottom: 20,
  },
  secretKeyLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  secretKeyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secretKey: {
    fontSize: 14,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  
  // Button Styles
  continueButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  verifyButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
