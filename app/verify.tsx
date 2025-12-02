import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const VerifyPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Get email and password from navigation params
  const email = params.email as string;
  const password = params.password as string;
  const name = params.name as string;

  const [otp, setOTP] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit code from your email');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔵 Verifying OTP for:', email);
      console.log('🔵 OTP:', otp);

      // Try OTP verification 
      const otpResponse = await fetch('http://23.22.178.240/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
        }),
      });

      const otpData = await otpResponse.json();
      console.log('✅ OTP Response:', otpData);

      if (!otpResponse.ok && !otpData.success) {
        throw new Error(otpData.message || 'Invalid OTP');
      }

      // Now login
      console.log('🔄 Logging in...');
      const loginResponse = await fetch('http://23.22.178.240/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      const loginData = await loginResponse.json();
      console.log('✅ Login Response:', loginData);

      // Check if login was successful - handle different response formats
      const isLoginSuccess = loginResponse.ok ||
        loginData.success ||
        loginData.message?.toLowerCase().includes('success') ||
        loginData.token;

      if (!isLoginSuccess) {
        throw new Error(loginData.message || 'Login failed');
      }

      console.log('✅✅ Login successful! Redirecting to home...');

      // Save auth token to secure store - backend returns 'jwtToken' field
      const token = loginData.jwtToken || loginData.token; // Support both field names
      if (token) {
        try {
          const SecureStore = await import('expo-secure-store');
          await SecureStore.setItemAsync('authToken', token);
          console.log('✅ Auth token saved to secure store:', token.substring(0, 30) + '...');
        } catch (tokenError) {
          console.error('❌ Failed to save auth token:', tokenError);
        }
      } else {
        console.warn('⚠️ No auth token in login response!');
      }

      // Success!
      Alert.alert(
        'Welcome! 🎉',
        `Account created successfully!\n\nWelcome, ${loginData.user?.name || name}!`,
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ Error:', error);

      Alert.alert(
        'Verification Failed',
        `${error.message}\n\nOTP entered: ${otp}\nEmail: ${email}`,
        [
          { text: 'Try Again', style: 'cancel' },
          { text: 'Resend OTP', onPress: handleResendOTP },
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await fetch('http://23.22.178.240/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (response.ok || data.success) {
        Alert.alert('OTP Resent', 'A new verification code has been sent to your email');
        setOTP('');
      } else {
        throw new Error(data.message || 'Failed to resend OTP');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend OTP');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.content}>
        <Text style={styles.title}>Verify Email</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to{'\n'}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="000000"
            placeholderTextColor="#9CA3AF"
            value={otp}
            onChangeText={(text) => setOTP(text.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            maxLength={6}
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, (otp.length !== 6 || isLoading) && styles.buttonDisabled]}
          onPress={handleVerifyOTP}
          disabled={otp.length !== 6 || isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Verify and Continue</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleResendOTP}
          disabled={isLoading}
        >
          <Text style={styles.secondaryText}>Resend OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.back()}
          disabled={isLoading}
        >
          <Text style={styles.secondaryText}>Change Email</Text>
        </TouchableOpacity>

        <Text style={styles.helpText}>
          Didn't receive the code? Check your spam folder or tap Resend OTP
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.08,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 32,
    lineHeight: 20,
  },
  emailText: {
    fontWeight: '600',
    color: '#1F2937',
  },
  inputWrapper: {
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: Math.max(64, height * 0.08),
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
  },
  input: {
    fontSize: 24,
    letterSpacing: 10,
    textAlign: 'center',
    color: '#1F2937',
    fontWeight: '600',
  },
  button: {
    height: Math.max(52, height * 0.065),
    borderRadius: Math.max(26, height * 0.032),
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  helpText: {
    marginTop: 24,
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 18,
  },
});

export default VerifyPage;
