import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { ThemeProvider } from '@/constants/Theme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="share" />
        <Stack.Screen name="about" />
        <Stack.Screen name="crypto-wallet" />
        <Stack.Screen name="select-currency" />
        <Stack.Screen name="credit-account" />
        <Stack.Screen name="payment-priority" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="invite-friends" />
        <Stack.Screen name="messages" />
        <Stack.Screen name="my-rewards" />
        <Stack.Screen name="language-selection" />
        <Stack.Screen name="appearance" />
        <Stack.Screen name="app-lock" />
        <Stack.Screen name="app-lock/unlock" />
        <Stack.Screen name="permissions" />
        <Stack.Screen name="network-diagnostics" />
        <Stack.Screen name="low-balance-alert" />
        <Stack.Screen name="account-priority" />
        <Stack.Screen name="help" />
        <Stack.Screen name="help/search" />
        <Stack.Screen name="help/support" />
        <Stack.Screen name="help/collection" />
        <Stack.Screen name="security" />
        <Stack.Screen name="security/advanced" />
        <Stack.Screen name="records" />
        <Stack.Screen name="learn" />
        <Stack.Screen name="swap" />
        <Stack.Screen name="receive" />
        <Stack.Screen name="fiat-payout" />
      </Stack>
    </ThemeProvider>
  );
}
