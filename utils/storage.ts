import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  ONBOARDING_COMPLETE: 'onboardingComplete',
};

export const resetOnboarding = async () => {
  try {
    await AsyncStorage.removeItem(StorageKeys.ONBOARDING_COMPLETE);
    console.log('Onboarding status reset');
  } catch (error) {
    console.error('Error resetting onboarding status:', error);
  }
};

export const markOnboardingComplete = async () => {
  try {
    await AsyncStorage.setItem(StorageKeys.ONBOARDING_COMPLETE, 'true');
    console.log('Onboarding marked as complete');
  } catch (error) {
    console.error('Error marking onboarding complete:', error);
  }
};

export const hasCompletedOnboarding = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(StorageKeys.ONBOARDING_COMPLETE);
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};