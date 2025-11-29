import React, { useEffect, useState } from 'react';
import { WelcomeScreen } from '../index';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const APPLOCK_ENABLED_KEY = 'applock.enabled';
const APPLOCK_PIN_KEY = 'applock.pin';

const Page = () => {
  const router = useRouter();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [hasCheckedOnce, setHasCheckedOnce] = useState(false);

  useEffect(() => {
    if (!hasCheckedOnce) {
      setHasCheckedOnce(true);
      (async () => {
        try {
          const token = await SecureStore.getItemAsync('authToken');
          if (token) {
            // If we have a JWT, treat user as signed in and check app lock first
            await checkAppLockAndRoute();
          } else {
            // Only check onboarding status if user is not signed in
            await checkOnboardingStatus();
          }
        } catch (e) {
          console.warn('Auth check failed, routing to onboarding:', e);
          await checkOnboardingStatus();
        }
      })();
    }
  }, [hasCheckedOnce]);

  const checkAppLockAndRoute = async () => {
    try {
      const enabled = await AsyncStorage.getItem(APPLOCK_ENABLED_KEY);
      const pin = await SecureStore.getItemAsync(APPLOCK_PIN_KEY);
      if (enabled === 'true' && pin) {
        // route to unlock screen first
        router.replace('/app-lock/unlock');
      } else {
        router.replace('/(tabs)');
      }
    } catch (e) {
      console.warn('App lock check failed, routing to tabs:', e);
      router.replace('/(tabs)');
    }
  };

  const checkOnboardingStatus = async () => {
    try {
      const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
      setHasCompletedOnboarding(onboardingComplete === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setHasCompletedOnboarding(false);
    }
  };

  const handleAutoRedirect = () => {
    // Only redirect once, and only for new app launches
    if (hasCompletedOnboarding) {
      console.log('Auto redirecting to home screen');
      router.replace('/home'); // Use replace to prevent going back to splash
    } else {
      console.log('Auto redirecting to onboarding');
      router.replace('/onboarding'); // Use replace to prevent going back to splash
    }
  };

  // Show splash screen while checking onboarding/auth state
  if (!hasCheckedOnce || hasCompletedOnboarding === null) {
    return (
      <WelcomeScreen 
        onAutoRedirect={() => {}} // Do nothing while loading
      />
    );
  }

  // If signed in, this component won't render (redirected above)
  // If not signed in, show normal onboarding flow
  return (
    <WelcomeScreen 
      onAutoRedirect={handleAutoRedirect}
    />
  );
};

export default Page;
