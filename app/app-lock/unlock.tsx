import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

const PIN_KEY = 'applock.pin';
const BIO_KEY = 'applock.bio';

const { width, height } = Dimensions.get('window');

export default function UnlockScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [bioEnabled, setBioEnabled] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const bio = await AsyncStorage.getItem(BIO_KEY);
      setBioEnabled(bio === 'true');
      if (bio === 'true' && (await LocalAuthentication.hasHardwareAsync()) && (await LocalAuthentication.isEnrolledAsync())) {
        const res = await LocalAuthentication.authenticateAsync({ promptMessage: 'Unlock with biometrics' });
        if (res.success) {
          router.replace('/(tabs)');
        }
      }
    })();
  }, []);

  const onDigit = async (d: string) => {
    setError('');
    const next = (pin + d).slice(0, 4);
    setPin(next);
    if (next.length === 4) {
      const saved = await SecureStore.getItemAsync(PIN_KEY);
      if (saved && saved === next) {
        router.replace('/(tabs)');
      } else {
        setError('Incorrect PIN');
        setPin('');
      }
    }
  };

  const onBackspace = () => {
    setError('');
    setPin(pin.slice(0, -1));
  };

  const Key = ({ label, onPress }: { label: string; onPress?: () => void }) => (
    <TouchableOpacity style={styles.key} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.keyText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen content */}
      <View style={styles.screenContent}>
        <Text style={styles.title}>Enter Passcode</Text>
        <Text style={styles.subtitle}>Unlock to continue</Text>
        {bioEnabled && (
          <TouchableOpacity style={styles.faceBtn} onPress={async () => {
            const ok = await LocalAuthentication.hasHardwareAsync();
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            if (!ok || !enrolled) return;
            const res = await LocalAuthentication.authenticateAsync({ promptMessage: 'Unlock with biometrics' });
            if (res.success) router.replace('/(tabs)');
          }}>
            <Ionicons name="finger-print-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
        )}

        {/* PIN dots */}
        <View style={styles.dotsRow}>
          {[0,1,2,3].map(i => (
            <View key={i} style={[styles.dot, pin.length > i && styles.dotFilled]} />
          ))}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : <View style={{ height: 20 }} />}

        {/* Push keypad to bottom */}
        <View style={{ flex: 1 }} />

        {/* Keypad */}
        <View style={styles.pad}>
          <View style={styles.padRow}>
            <Key label="1" onPress={() => onDigit('1')} />
            <Key label="2" onPress={() => onDigit('2')} />
            <Key label="3" onPress={() => onDigit('3')} />
          </View>
          <View style={styles.padRow}>
            <Key label="4" onPress={() => onDigit('4')} />
            <Key label="5" onPress={() => onDigit('5')} />
            <Key label="6" onPress={() => onDigit('6')} />
          </View>
          <View style={styles.padRow}>
            <Key label="7" onPress={() => onDigit('7')} />
            <Key label="8" onPress={() => onDigit('8')} />
            <Key label="9" onPress={() => onDigit('9')} />
          </View>
          <View style={styles.padRow}>
            <View style={[styles.key, { backgroundColor: 'transparent', borderWidth: 0 }]} />
            <Key label="0" onPress={() => onDigit('0')} />
            <TouchableOpacity style={styles.key} onPress={onBackspace}>
              <Ionicons name="backspace-outline" size={20} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  screenContent: { flex: 1, paddingVertical: 24, paddingHorizontal: 16, backgroundColor: '#FFFFFF' },
  title: { fontSize: 24, fontWeight: '800', color: '#1F2937', textAlign: 'center' },
  subtitle: { marginTop: 8, fontSize: 15, color: '#6B7280', textAlign: 'center' },
  faceBtn: { alignSelf: 'center', marginTop: 12, width: 52, height: 52, borderRadius: 26, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 28 },
  dot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#111827' },
  dotFilled: { backgroundColor: '#111827' },
  error: { marginTop: 12, textAlign: 'center', color: '#EF4444', fontWeight: '700' },

  pad: { paddingHorizontal: 16, paddingBottom: 40 },
  padRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  key: { width: (width * 0.94 - 24 * 2 - 16 * 2) / 3, height: 80, borderRadius: 40, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  keyText: { fontSize: 28, fontWeight: '800', color: '#1F2937' },
});
