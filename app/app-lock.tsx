import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar, Switch, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

const PIN_KEY = 'applock.pin';
const ENABLED_KEY = 'applock.enabled';
const BIO_KEY = 'applock.bio';
const GRACE_KEY = 'applock.graceMs';

export default function AppLockPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ unlock?: string }>();
  const unlocking = params?.unlock === '1';
  const [enabled, setEnabled] = useState(false);
  const [hasPin, setHasPin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinStep, setPinStep] = useState<'set' | 'confirm' | 'unlock'>(unlocking ? 'unlock' : 'set');
  const [pinInput, setPinInput] = useState('');
  const [tempPin, setTempPin] = useState('');
  const [bioEnabled, setBioEnabled] = useState(false);
  const [graceMs, setGraceMs] = useState(0);
  const graceOptions = [0, 60_000, 5 * 60_000];

  useEffect(() => {
    (async () => {
      const en = await AsyncStorage.getItem(ENABLED_KEY);
      setEnabled(en === 'true');
      const savedPin = await SecureStore.getItemAsync(PIN_KEY);
      setHasPin(!!savedPin);
      const bio = await AsyncStorage.getItem(BIO_KEY);
      setBioEnabled(bio === 'true');
      const gm = await AsyncStorage.getItem(GRACE_KEY);
      setGraceMs(Number(gm || '0'));
      if (unlocking) {
        // Try biometric first if available and enabled
        if (bio === 'true' && (await LocalAuthentication.hasHardwareAsync()) && (await LocalAuthentication.isEnrolledAsync())) {
          const res = await LocalAuthentication.authenticateAsync({ promptMessage: 'Unlock with biometrics' });
          if (res.success) {
            router.replace('/(tabs)');
            return;
          }
        }
        setShowPinModal(true);
      }
    })();
  }, [unlocking]);

  const toggleEnabled = async (value: boolean) => {
    setEnabled(value);
    await AsyncStorage.setItem(ENABLED_KEY, String(value));
    if (value && !hasPin) {
      // Prompt to set PIN
      setPinStep('set');
      setPinInput('');
      setTempPin('');
      setShowPinModal(true);
    }
  };

  const openSetPin = () => {
    setPinStep('set');
    setPinInput('');
    setTempPin('');
    setShowPinModal(true);
  };

  const openUnlock = () => {
    setPinStep('unlock');
    setPinInput('');
    setShowPinModal(true);
  };

  const handlePinSubmit = async () => {
    if (pinInput.length < 4) {
      Alert.alert('PIN', 'Please enter a 4-digit PIN');
      return;
    }

    if (pinStep === 'set') {
      setTempPin(pinInput);
      setPinInput('');
      setPinStep('confirm');
      return;
    }

    if (pinStep === 'confirm') {
      if (pinInput !== tempPin) {
        Alert.alert('PIN', 'PINs do not match. Try again.');
        setPinStep('set');
        setPinInput('');
        setTempPin('');
        return;
      }
      await SecureStore.setItemAsync(PIN_KEY, pinInput);
      setHasPin(true);
      setShowPinModal(false);
      Alert.alert('PIN set', 'Your app lock PIN is saved.');
      return;
    }

    if (pinStep === 'unlock') {
      const saved = await SecureStore.getItemAsync(PIN_KEY);
      if (saved && saved === pinInput) {
        setShowPinModal(false);
        if (unlocking) {
          router.replace('/(tabs)');
        } else {
          Alert.alert('Unlocked', 'PIN verified successfully');
        }
      } else {
        Alert.alert('Incorrect PIN', 'Please try again.');
      }
    }
  };

  const toggleBio = async (value: boolean) => {
    setBioEnabled(value);
    await AsyncStorage.setItem(BIO_KEY, String(value));
  };

  const cycleGrace = async () => {
    const idx = graceOptions.indexOf(graceMs);
    const next = graceOptions[(idx + 1) % graceOptions.length];
    setGraceMs(next);
    await AsyncStorage.setItem(GRACE_KEY, String(next));
  };

  const clearPin = async () => {
    await SecureStore.deleteItemAsync(PIN_KEY);
    setHasPin(false);
    Alert.alert('PIN removed', 'Your PIN has been cleared.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Lock</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="lock-closed-outline" size={18} color="#1F2937" />
            <View>
              <Text style={styles.rowTitle}>Enable App Lock</Text>
              <Text style={styles.rowHint}>Require a 4‑digit PIN when opening the app.</Text>
            </View>
          </View>
          <Switch value={enabled} onValueChange={toggleEnabled} />
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="key-outline" size={18} color="#1F2937" />
            <View>
              <Text style={styles.rowTitle}>{hasPin ? 'Change PIN' : 'Set PIN'}</Text>
              <Text style={styles.rowHint}>{hasPin ? 'Update your existing PIN' : 'Create a new PIN'}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={openSetPin}>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="finger-print-outline" size={18} color="#1F2937" />
            <View>
              <Text style={styles.rowTitle}>Biometric unlock</Text>
              <Text style={styles.rowHint}>Use Face/Touch ID if available</Text>
            </View>
          </View>
          <Switch value={bioEnabled} onValueChange={toggleBio} />
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="time-outline" size={18} color="#1F2937" />
            <View>
              <Text style={styles.rowTitle}>Lock after</Text>
              <Text style={styles.rowHint}>{graceMs === 0 ? 'Immediately' : graceMs === 60000 ? 'After 1 minute' : 'After 5 minutes'}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={cycleGrace}>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="play-circle-outline" size={18} color="#1F2937" />
            <View>
              <Text style={styles.rowTitle}>Test Unlock</Text>
              <Text style={styles.rowHint}>Try entering your PIN</Text>
            </View>
          </View>
          <TouchableOpacity onPress={openUnlock}>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {hasPin && (
          <TouchableOpacity style={styles.destructiveBtn} onPress={clearPin}>
            <Text style={styles.destructiveText}>Remove PIN</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* PIN Modal */}
      <Modal visible={showPinModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {pinStep === 'set' && 'Enter new 4-digit PIN'}
              {pinStep === 'confirm' && 'Confirm PIN'}
              {pinStep === 'unlock' && 'Enter PIN to unlock'}
            </Text>

            {/* PIN Dots */}
            <View style={styles.pinDotsRow}>
              {[0,1,2,3].map((i) => (
                <View key={i} style={[styles.pinDot, pinInput.length > i && styles.pinDotFilled]} />
              ))}
            </View>

            {/* Hidden input to capture digits */}
            <TextInput
              value={pinInput}
              onChangeText={(t) => setPinInput(t.replace(/[^0-9]/g, '').slice(0, 4))}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
              style={styles.pinHiddenInput}
              autoFocus
            />

            <TouchableOpacity style={styles.modalBtn} onPress={handlePinSubmit}>
              <Text style={styles.modalBtnText}>Continue</Text>
            </TouchableOpacity>
            {bioEnabled && (
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#374151', marginTop: 8 }]} onPress={async () => {
                const ok = await LocalAuthentication.hasHardwareAsync();
                const enrolled = await LocalAuthentication.isEnrolledAsync();
                if (!ok || !enrolled) { Alert.alert('Biometrics', 'Biometric authentication not available.'); return; }
                const res = await LocalAuthentication.authenticateAsync({ promptMessage: 'Unlock with biometrics' });
                if (res.success) {
                  if (unlocking) router.replace('/(tabs)'); else setShowPinModal(false);
                }
              }}>
                <Text style={styles.modalBtnText}>Use biometrics</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowPinModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 44, paddingBottom: 10 },
  backButton: { padding: 6 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },

  section: { paddingHorizontal: 16, paddingTop: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowTitle: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  rowHint: { fontSize: 12, color: '#6B7280' },

  destructiveBtn: { alignSelf: 'flex-start', marginTop: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  destructiveText: { color: '#EF4444', fontWeight: '700' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalCard: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12, textAlign: 'center' },
  pinHiddenInput: { position: 'absolute', opacity: 0, height: 0, width: 0 },
  pinDotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 12 },
  pinDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#111827' },
  pinDotFilled: { backgroundColor: '#111827' },
  modalBtn: { marginTop: 12, backgroundColor: '#111827', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  modalBtnText: { color: '#FFFFFF', fontWeight: '700' },
  modalCancel: { marginTop: 8, alignItems: 'center' },
  modalCancelText: { color: '#6B7280' },
});
