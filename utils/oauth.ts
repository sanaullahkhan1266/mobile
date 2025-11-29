import { Alert } from 'react-native';

// Simple placeholder that can later be wired to a real Google OAuth
// implementation on your backend. For now it just shows an info alert.
export function useGoogleOAuth() {
  return async function onGooglePress() {
    Alert.alert(
      'Google Sign-in',
      'Google sign-in is not configured yet. Please log in with email and password.'
    );
  };
}
