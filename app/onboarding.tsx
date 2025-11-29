import React from 'react';
import { OnboardingScreen } from '../components/OnboardingScreen';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnboardingPage = () => {
  const router = useRouter();

  const handleGetStarted = async () => {
    // Mark onboarding as complete and navigate to home screen
    try {
      await AsyncStorage.setItem('onboardingComplete', 'true');
      console.log('Onboarding completed, navigating to tabs...');
      router.replace('/(tabs)'); // Use replace to prevent going back to onboarding
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.push('/(tabs)');
    }
  };

  const handleSkip = () => {
    // Skip onboarding and go directly to login/signup
    Alert.alert(
      'Skip Onboarding?',
      'Are you sure you want to skip the introduction?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Skip',
          onPress: () => {
            console.log('Skipping onboarding...');
            router.push('/(tabs)');
          },
        },
      ]
    );
  };

  return (
    <OnboardingScreen
      onGetStarted={handleGetStarted}
      onSkip={handleSkip}
    />
  );
};

export default OnboardingPage;