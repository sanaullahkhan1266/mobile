import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Development-only banner that helps diagnose "Authentication required. No token provided" errors.
 *
 * It shows when:
 * - we are in a dev build (__DEV__ === true)
 * - the user is signed in according to Clerk
 * - but there is no authToken stored in SecureStore
 */
// NOTE: This component is currently unused. It can be wired up later if you want
// a development-only banner about missing JWT tokens.
const AuthDebugBanner: React.FC = () => {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('authToken');
        if (mounted) {
          setHasToken(!!token);
        }
      } catch (err) {
        if (mounted) {
          setHasToken(false);
        }
      }
    };

    checkToken();

    return () => {
      mounted = false;
    };
  }, [isSignedIn]);

  if (!__DEV__ || hasToken !== false) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      <Text style={styles.text}>
        DEV: Signed in but no authToken stored. API calls to your backend will return 401 ("Authentication required. No token provided").
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(185, 28, 28, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    zIndex: 1000,
  },
  text: {
    color: '#F9FAFB',
    fontSize: 11,
    textAlign: 'center',
  },
});

export default AuthDebugBanner;
