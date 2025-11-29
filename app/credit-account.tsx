import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import ProfileButton from '@/components/ProfileButton';

const { width, height } = Dimensions.get('window');

interface CreditFeature {
  icon: string;
  title: string;
  description: string;
}

export default function CreditAccountScreen() {
  const router = useRouter();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const creditFeatures: CreditFeature[] = [
    {
      icon: 'trending-up',
      title: 'Fixed Daily Interest: 0.05%',
      description: 'Simple and transparent calculation. The 0.05% daily interest rate equates to an Annual Percentage Rate (APR) of approximately 18.25%.',
    },
    {
      icon: 'wallet',
      title: 'Deposit Crypto to Unlock Liquidity',
      description: 'Use your crypto assets as collateral',
    },
    {
      icon: 'calendar',
      title: 'Flexible Repayment Schedule',
      description: 'Repay at your convenience',
    },
    {
      icon: 'flash',
      title: 'Instant Spending Approval',
      description: 'Pay by default with your credit balance',
    },
  ];

  const handleAcceptTerms = () => {
    setAcceptedTerms(!acceptedTerms);
  };

  const handleActivateNow = () => {
    if (!acceptedTerms) {
      Alert.alert('Terms Required', 'Please accept the Credit Account Terms & Conditions to continue.');
      return;
    }

    Alert.alert(
      'Activate Credit Account',
      'Your credit account will be activated with 1% cashback!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Activate',
          onPress: () => {
            Alert.alert('Success!', 'Your credit account has been activated successfully!');
            setShowModal(false);
            router.back();
          },
        },
      ]
    );
  };

  const handleContinue = () => {
    if (!acceptedTerms) {
      Alert.alert('Terms Required', 'Please accept the Credit Account Terms & Conditions to continue.');
      return;
    }

    Alert.alert(
      'Continue Setup',
      'Proceeding with credit account setup...',
      [
        { text: 'OK', onPress: () => {
          setShowModal(false);
          router.back();
        }},
      ]
    );
  };

  const renderFeature = (feature: CreditFeature, index: number) => (
    <View key={index} style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <Ionicons name={feature.icon as any} size={20} color="#10B981" />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDescription}>{feature.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <ProfileButton size={32} showBorder={true} />
        </View>
        <Text style={styles.headerTitle}>Credit Account</Text>
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowModal(false);
                router.back();
              }}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Illustration */}
            <View style={styles.illustrationContainer}>
              <View style={styles.illustration}>
                {/* Money Stack */}
                <View style={styles.moneyStack}>
                  <View style={[styles.moneyBill, styles.moneyBill1]} />
                  <View style={[styles.moneyBill, styles.moneyBill2]} />
                  <View style={[styles.moneyBill, styles.moneyBill3]} />
                </View>

                {/* Phone with App */}
                <View style={styles.phoneContainer}>
                  <View style={styles.phone}>
                    <View style={styles.phoneScreen}>
                      <View style={styles.appIcon}>
                        <Ionicons name="logo-bitcoin" size={16} color="#FF9500" />
                      </View>
                      <View style={styles.paymentIndicator}>
                        <View style={styles.paymentWave} />
                        <View style={styles.paymentDot} />
                      </View>
                    </View>
                  </View>
                  
                  {/* Floating coins */}
                  <View style={[styles.floatingCoin, styles.coin1]}>
                    <Ionicons name="logo-bitcoin" size={12} color="#FF9500" />
                  </View>
                  <View style={[styles.floatingCoin, styles.coin2]}>
                    <Text style={styles.coinText}>$</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Title */}
            <View style={styles.titleSection}>
              <Text style={styles.mainTitle}>
                <Ionicons name="flash" size={24} color="#FFD60A" /> Activate Your Account for Instant Credit
              </Text>
            </View>

            {/* Features */}
            <View style={styles.featuresContainer}>
              {creditFeatures.map((feature, index) => renderFeature(feature, index))}
            </View>

            {/* Terms */}
            <View style={styles.termsSection}>
              <TouchableOpacity 
                style={styles.termsRow}
                onPress={handleAcceptTerms}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, acceptedTerms && styles.checkedBox]}>
                  {acceptedTerms && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.termsText}>
                  I accept the{' '}
                  <Text style={styles.termsLink}>Credit Account Terms & Conditions.</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {/* Activate Now Button */}
            <TouchableOpacity
              style={[styles.activateButton, !acceptedTerms && styles.disabledButton]}
              onPress={handleActivateNow}
              disabled={!acceptedTerms}
            >
              <LinearGradient
                colors={acceptedTerms ? ['#10B981', '#059669'] : ['#E5E5E5', '#D1D5DB']}
                style={styles.buttonGradient}
              >
                <Text style={[
                  styles.activateButtonText,
                  !acceptedTerms && styles.disabledButtonText
                ]}>
                  Activate now to enjoy 1% cashback!
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Continue Button */}
            <TouchableOpacity
              style={[styles.continueButton, !acceptedTerms && styles.disabledButton]}
              onPress={handleContinue}
              disabled={!acceptedTerms}
            >
              <Text style={[
                styles.continueButtonText,
                !acceptedTerms && styles.disabledButtonText
              ]}>
                Accept & Continue
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 2,
    textAlign: 'center',
  },
  helpButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  illustration: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  moneyStack: {
    position: 'relative',
  },
  moneyBill: {
    width: 80,
    height: 40,
    backgroundColor: '#10B981',
    borderRadius: 4,
    position: 'absolute',
  },
  moneyBill1: {
    top: 0,
    left: 0,
  },
  moneyBill2: {
    top: -4,
    left: 2,
    backgroundColor: '#059669',
  },
  moneyBill3: {
    top: -8,
    left: 4,
    backgroundColor: '#047857',
  },
  phoneContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  phone: {
    width: 120,
    height: 200,
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneScreen: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  appIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paymentWave: {
    width: 16,
    height: 2,
    backgroundColor: '#10B981',
    borderRadius: 1,
  },
  paymentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  floatingCoin: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  coin1: {
    top: 20,
    right: -10,
    backgroundColor: '#FFF7ED',
  },
  coin2: {
    bottom: 40,
    left: -10,
    backgroundColor: '#F0FDF4',
  },
  coinText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10B981',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 32,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  termsSection: {
    marginBottom: 32,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkedBox: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  termsLink: {
    color: '#10B981',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  actionButtons: {
    padding: 20,
    paddingBottom: 40,
    gap: 12,
  },
  activateButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  continueButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: '#6B7280',
  },
});