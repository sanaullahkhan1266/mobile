import React from 'react';
import { LoginScreen } from '../components/LoginScreen';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGoogleOAuth } from '../utils/oauth';
import { loginWithBackend, AuthResponse, TwoFactorResponse } from '@/services/authService';
import { connectMetamaskWeb } from '../utils/metamask';
import { Platform, Alert as RNAlert } from 'react-native';

const LoginPage = () => {
  const router = useRouter();

  const handleLogin = async (credentials: { email: string; password: string }) => {
    const { email, password } = credentials;
    try {
      const result = await loginWithBackend({ email, password });

      if ('requiresTwoFactor' in result) {
        const twoFa = result as TwoFactorResponse;
        Alert.alert(
          'Two-Factor Required',
          `2FA is enabled for ${twoFa.email || email}. This app does not yet implement the 2FA screen.`,
        );
        return;
      }

      // Normal login success: mark onboarding complete and go to main tabs
      try {
        await AsyncStorage.setItem('onboardingComplete', 'true');
      } catch (storageError) {
        console.warn('Failed to update onboarding status:', storageError);
      }

      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Login error:', error);
      const rawMessage: string = error?.message || '';

      let friendlyMessage = 'An error occurred during login. Please try again.';
      if (rawMessage.toLowerCase().includes('invalid credentials')) {
        friendlyMessage = 'Incorrect email or password.';
      } else if (rawMessage.toLowerCase().includes('not found')) {
        friendlyMessage = "We couldn't find an account for that email. Please sign up first.";
      } else if (rawMessage.toLowerCase().includes('too many')) {
        friendlyMessage = 'Too many attempts. Please wait a bit and try again.';
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
    // Navigate to sign up screen
    router.push('/signup');
  };

  // Google OAuth
  const onGoogle = useGoogleOAuth();

  // MetaMask connect (web only). This is not linked to Clerk; it only connects wallet.
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
