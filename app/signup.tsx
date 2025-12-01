import { signupWithBackend } from '@/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Platform, Alert as RNAlert } from 'react-native';
import { SignUpScreen } from '../components/SignUpScreen';
import { connectMetamaskWeb } from '../utils/metamask';
import { useGoogleOAuth } from '../utils/oauth';

const SignUpPage = () => {
  const router = useRouter();

  const handleSignUp = async (userData: { name: string; email: string; password: string; referralCode?: string }) => {
    try {
      const { name, email, password } = userData;
      if (!email || !password) {
        Alert.alert('Sign up failed', 'Please enter a valid email and password');
        return;
      }

      // Signup - backend sends OTP to email
      await signupWithBackend({ name, email, password });

      // Mark onboarding as complete since user is signing up
      try {
        await AsyncStorage.setItem('onboardingComplete', 'true');
      } catch (storageError) {
        console.warn('Failed to update onboarding status:', storageError);
      }

      Alert.alert(
        'OTP Sent! 📧',
        `We've sent a verification code to ${email}.\n\nPlease check your email and enter the code on the next screen.`,
        [
          {
            text: 'Continue',
            onPress: () => {
              // Navigate to verify screen with user data
              router.push({
                pathname: '/verify',
                params: {
                  email,
                  password,
                  name,
                },
              });
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Sign up error:', error);

      // Handle specific errors
      if (error.details) {
        // Password validation failed
        const feedbackMessage = error.details.join('\n\n');
        Alert.alert('Weak Password', feedbackMessage);
        return;
      }

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
