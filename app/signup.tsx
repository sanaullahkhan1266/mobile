import React from 'react';
import { SignUpScreen } from '../components/SignUpScreen';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useGoogleOAuth } from '../utils/oauth';
import { connectMetamaskWeb } from '../utils/metamask';
import { Platform, Alert as RNAlert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signupWithBackend, loginWithBackend } from '@/services/authService';

const SignUpPage = () => {
  const router = useRouter();

  const handleSignUp = async (userData: { name: string; email: string; password: string; referralCode?: string }) => {
    try {
      const { name, email, password } = userData;
      if (!email || !password) {
        Alert.alert('Sign up failed', 'Please enter a valid email and password');
        return;
      }

      await signupWithBackend({ name, email, password });

      // Optionally log the user in immediately after signup
      try {
        await loginWithBackend({ email, password });
      } catch (loginError) {
        console.warn('Auto-login after signup failed:', loginError);
      }

      // Mark onboarding as complete since user is signing up
      try {
        await AsyncStorage.setItem('onboardingComplete', 'true');
      } catch (storageError) {
        console.warn('Failed to update onboarding status:', storageError);
      }

      Alert.alert('Welcome', 'Your account has been created.');
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Sign up error:', error);
      const rawMessage: string = error?.message || '';

      let friendlyMessage = 'An error occurred during sign up. Please try again.';
      if (/already(.+)?(used|in use|registered)/i.test(rawMessage)) {
        friendlyMessage = 'This email is already registered. Try logging in instead.';
      } else if (rawMessage.toLowerCase().includes('too many')) {
        friendlyMessage = 'Too many attempts. Please wait a bit and try again.';
      } else if (rawMessage) {
        friendlyMessage = rawMessage;
      }

      Alert.alert('Sign up failed', friendlyMessage);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleLogin = () => {
    router.push('/login');
  };

  // Google OAuth
  const onGoogle = useGoogleOAuth();

  // MetaMask connect (web only). Not linked to Clerk; connects wallet for future linking.
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
    <SignUpScreen
      onSignUp={handleSignUp}
      onBack={handleBack}
      onLogin={handleLogin}
      onGoogle={onGoogle}
      onMetamask={onMetamask}
    />
  );
};

export default SignUpPage;
