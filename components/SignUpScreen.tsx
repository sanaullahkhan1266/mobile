import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

interface SignUpScreenProps {
  onSignUp?: (userData: { name: string; email: string; password: string; referralCode?: string }) => void;
  onBack?: () => void;
  onLogin?: () => void;
  onGoogle?: () => void;
  onMetamask?: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onSignUp = (data) => console.log('Sign Up pressed with:', data.email),
  onBack = () => console.log('Back pressed'),
  onLogin = () => console.log('Login pressed'),
  onGoogle = () => console.log('Google pressed'),
  onMetamask = () => console.log('MetaMask pressed'),
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showReferralCode, setShowReferralCode] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSignUp = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please create a password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password should be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!acceptTerms) {
      Alert.alert('Error', 'Please accept the Terms of Service');
      return;
    }

    setIsLoading(true);
    try {
      await onSignUp?.({ name: name.trim(), email: email.trim(), password, referralCode });
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color="#1F2937" />
          </TouchableOpacity>
        </Animated.View>

        {/* Main Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Sign up</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder=""
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder=""
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder=""
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder=""
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Referral Code */}
            <TouchableOpacity 
              style={styles.referralToggle}
              onPress={() => setShowReferralCode(!showReferralCode)}
              activeOpacity={0.7}
            >
              <Text style={styles.referralToggleText}>
                Referral Code(Optional)
              </Text>
              <Ionicons 
                name={showReferralCode ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#6B7280" 
              />
            </TouchableOpacity>

            {showReferralCode && (
              <Animatable.View animation="fadeInDown" duration={300}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter referral code"
                    placeholderTextColor="#9CA3AF"
                    value={referralCode}
                    onChangeText={setReferralCode}
                    autoCapitalize="characters"
                    autoCorrect={false}
                  />
                </View>
              </Animatable.View>
            )}

            {/* Terms Checkbox */}
            <TouchableOpacity 
              style={styles.termsContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, acceptTerms && styles.checkedBox]}>
                {acceptTerms && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.termsText}>
                By creating an account, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
              </Text>
            </TouchableOpacity>

            {/* Next Button */}
            <TouchableOpacity 
              style={[
                styles.nextButton, 
                (!name || !email || !password || !confirmPassword || !acceptTerms || isLoading) && styles.disabledButton
              ]}
              onPress={handleSignUp}
              activeOpacity={0.85}
              disabled={!name || !email || !password || !confirmPassword || !acceptTerms || isLoading}
            >
              {isLoading ? (
                <Animatable.View animation="rotate" iterationCount="infinite" duration={1000}>
                  <Ionicons name="refresh" size={20} color="#9CA3AF" />
                </Animatable.View>
              ) : (
                <Text style={[
                  styles.nextButtonText,
                  (!email || !acceptTerms) && styles.disabledButtonText
                ]}>
                  Next
                </Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={onLogin} activeOpacity={0.7}>
                <Text style={styles.loginLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
          </Animated.View>
        </ScrollView>

        {/* Social Login */}
        <Animated.View 
          style={[
            styles.socialContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.socialTitle}>Or continue with</Text>
          
          <View style={styles.socialButtons}>
            <TouchableOpacity 
              style={styles.socialButton}
              activeOpacity={0.7}
              onPress={onGoogle}
            >
              <Text style={styles.socialButtonText}>G</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.socialButton}
              activeOpacity={0.7}
            >
              <Ionicons name="logo-apple" size={24} color="#1F2937" />
            </TouchableOpacity>

            {/* Web-only MetaMask connect */}
            <TouchableOpacity 
              style={styles.socialButton}
              activeOpacity={0.7}
              onPress={onMetamask}
            >
              <Ionicons name="logo-electron" size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    paddingHorizontal: width * 0.06, // 6% of screen width
    minHeight: height * 0.8, // Ensure minimum content height for ScrollView
  },
  titleSection: {
    marginBottom: height * 0.05, // Responsive margin
    paddingTop: height * 0.02,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: height * 0.03, // Responsive margin
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: width * 0.04, // Responsive padding
    height: Math.max(52, height * 0.065), // Responsive height with minimum
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    paddingVertical: 0,
  },
  referralToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginBottom: 8,
  },
  referralToggleText: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 24,
    marginBottom: 32,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  termsLink: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  nextButton: {
    height: Math.max(52, height * 0.065), // Responsive height
    borderRadius: Math.max(26, height * 0.032), // Responsive border radius
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.03,
    marginTop: height * 0.02,
  },
  disabledButton: {
    backgroundColor: '#F3F4F6',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  loginLink: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  socialContainer: {
    paddingHorizontal: width * 0.06,
    paddingBottom: Math.max(40, height * 0.05), // Responsive bottom padding
    marginTop: 'auto', // Push to bottom
  },
  socialTitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
});

export default SignUpScreen;