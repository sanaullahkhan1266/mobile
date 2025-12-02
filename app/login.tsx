import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Platform, Alert as RNAlert } from 'react-native';
import { LoginScreen } from '../components/LoginScreen';
import { connectMetamaskWeb } from '../utils/metamask';
import { useGoogleOAuth } from '../utils/oauth';

const LoginPage = () => {
  const router = useRouter();

  const handleLogin = async (credentials: { email: string; password: string }) => {
    const { email, password } = credentials;
    try {
      console.log('🔵 Logging in with email:', email);

      const response = await fetch('http://23.22.178.240/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      const data = await response.json();
      console.log('✅ Login Response:', data);
      console.log('✅ Response Status:', response.status);
      console.log('✅ Response OK:', response.ok);

      // Check if login was successful
      const isSuccess = response.ok ||
        data.success ||
        data.message?.toLowerCase().includes('success') ||
        data.token;

      if (!isSuccess) {
        throw new Error(data.message || 'Login failed');
      }

      // Check for 2FA
      if (data.requiresTwoFactor) {
        Alert.alert(
          'Two-Factor Required',
          `2FA is enabled for ${email}. This app does not yet implement the 2FA screen.`,
        );
        return;
      }

      console.log('✅ Login successful! Navigating to home...');

      // Save auth token to secure store - backend returns 'jwtToken' field
      const token = data.jwtToken || data.token; // Support both field names
      if (token) {
        try {
          const SecureStore = await import('expo-secure-store');
          await SecureStore.setItemAsync('authToken', token);
          console.log('✅ Auth token saved to secure store:', token.substring(0, 30) + '...');
        } catch (tokenError) {
          console.error('❌ Failed to save auth token:', tokenError);
        }
      } else {
        console.warn('⚠️ No auth token in response! Login response:', data);
      }

      // Mark onboarding complete
      try {
        await AsyncStorage.setItem('onboardingComplete', 'true');
      } catch (storageError) {
        console.warn('Failed to update onboarding status:', storageError);
      }

      // Navigate to home
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('❌ Login error:', error);
      const rawMessage: string = error?.message || '';

      let friendlyMessage = 'An error occurred during login. Please try again.';

      if (rawMessage.toLowerCase().includes('invalid') ||
        rawMessage.toLowerCase().includes('authentication failed')) {
        friendlyMessage = 'Incorrect email or password.\n\nPlease check:\n• Email is correct\n• Password is correct\n• Account is verified (check OTP email)';
      } else if (rawMessage.toLowerCase().includes('not found')) {
        friendlyMessage = "We couldn't find an account for that email.\n\nPlease sign up first.";
      } else if (rawMessage.toLowerCase().includes('too many')) {
        friendlyMessage = 'Too many attempts. Please wait a bit and try again.';
      } else if (rawMessage.toLowerCase().includes('not verified')) {
        friendlyMessage = 'Please verify your email first.\n\nCheck your inbox for the OTP code.';
      } else if (rawMessage) {
        friendlyMessage = rawMessage;
      }

      Alert.alert('Login Failed', friendlyMessage);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const onGoogle = useGoogleOAuth();

  const onMetamask = async () => {
    if (Platform.OS !== 'web') {
      RNAlert.alert('MetaMask', 'MetaMask connect is available on web during development.');
      return;
    }
    const address = await connectMetamaskWeb();
    if (address) {
      RNAlert.alert('MetaMask Connected', `Address: ${address}`);
    } else {
      RNAlert.alert('MetaMask', 'Connection was cancelled or failed.');
    }
  };

  return (
    <LoginScreen
      onLogin={handleLogin}
      onBack={handleBack}
      onSignUp={handleSignUp}
      onGoogle={onGoogle}
      onMetamask={onMetamask}
    />
  );
};

export default LoginPage;
