import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const VerifyPage = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.content}>
        <Text style={styles.title}>Verification Not Required</Text>
        <Text style={styles.subtitle}>
          This screen is no longer used because authentication is handled directly with JWT tokens
          against the backend API. You can safely ignore this route.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/home')}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, paddingHorizontal: width * 0.06, paddingTop: height * 0.08 },
  title: { fontSize: 28, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 24 },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 16,
    height: Math.max(52, height * 0.065),
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  input: { fontSize: 18, letterSpacing: 8, textAlign: 'center', color: '#1F2937' },
  button: {
    height: Math.max(52, height * 0.065),
    borderRadius: Math.max(26, height * 0.032),
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: { backgroundColor: '#E5E7EB' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  secondary: { textAlign: 'center', color: '#6B7280', fontSize: 14 },
});

export default VerifyPage;
