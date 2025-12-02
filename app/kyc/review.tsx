import AppHeader from '@/components/AppHeader';
import kycApiService from '@/services/KycApiService';
import kycService from '@/services/KycService';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function KycReview() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const state = await kycService.getState();
      setSummary(state);
      const progress = kycService.computeProgress(state);
      setReady(progress === 100);
    })();
  }, []);

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const state = await kycService.getState();
      const payload = {
        country: state.country,
        countryCode: state.countryCode,
        dialCode: state.dialCode,
        personal: state.personal,
        document: state.document,
        selfieUri: state.selfieUri,
      };

      console.log('📝 Submitting KYC with payload:', payload);
      const res = await kycApiService.submitKyc(payload);

      if (res.success) {
        await kycService.incrementAttempts();
        await kycService.save({ status: 'submitted' });
        router.replace('/kyc/success' as any);
      } else {
        alert(res.message || 'Submission failed');
      }
    } catch (error: any) {
      console.error('KYC submission error:', error);

      // Check if it's a file error
      if (error.message && (error.message.includes('file') || error.message.includes('Code=260'))) {
        Alert.alert(
          'File Error! 📁',
          'Your uploaded images are no longer available in cache.\n\nTap "Clear KYC & Start Over" below to upload fresh images.',
          [{ text: 'OK' }]
        );
      } else {
        alert('Error: ' + (error.message || 'Failed to submit KYC'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const clearKycAndRestart = async () => {
    Alert.alert(
      'Clear KYC Data? 🗑️',
      'This will delete all your KYC progress and you can start fresh with new images.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear & Restart',
          style: 'destructive',
          onPress: async () => {
            await kycService.clear();
            Alert.alert('Cleared! ✅', 'KYC data cleared successfully!\n\nYou can now start fresh with new images.');
            router.replace('/kyc/country' as any);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AppHeader title="Review & Submit" />

      <View style={{ paddingHorizontal: 16 }}>
        <Text style={s.helper}>Confirm your details before submission.</Text>

        <View style={s.card}>
          <Text style={s.cardTitle}>Country</Text>
          <Text style={s.cardText}>{summary?.country || '-'}</Text>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Personal</Text>
          <Text style={s.cardText}>{summary?.personal?.firstName || '-'} {summary?.personal?.lastName || ''}</Text>
          <Text style={s.cardSub}>{summary?.personal?.dob || ''}</Text>
          <Text style={s.cardSub}>Phone: {summary?.personal?.phoneCountryCode || ''} {summary?.personal?.phoneNumber || ''}</Text>
          <Text style={s.cardSub}>{summary?.personal?.address || ''}</Text>
          <Text style={s.cardSub}>{summary?.personal?.city || ''} {summary?.personal?.postalCode || ''}</Text>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Document</Text>
          <Text style={s.cardText}>{summary?.document?.type || '-'}</Text>
          <Text style={s.cardSub}>Front: {summary?.document?.frontUploaded ? 'Yes' : 'No'} | Back: {summary?.document?.backUploaded ? 'Yes' : 'No'}</Text>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Selfie</Text>
          <Text style={s.cardText}>{summary?.selfieDone ? 'Captured' : 'Pending'}</Text>
        </View>

        <TouchableOpacity
          style={[s.primaryBtn, (!ready || submitting) && s.btnDisabled]}
          disabled={!ready || submitting}
          onPress={submit}
        >
          <Text style={s.primaryText}>
            {submitting ? 'Submitting...' : ready ? 'Submit' : 'Complete all steps first'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.clearBtn}
          onPress={clearKycAndRestart}
        >
          <Text style={s.clearText}>🗑️ Clear KYC & Start Over</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  helper: { color: '#6B7280', marginBottom: 12 },
  card: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, marginBottom: 12 },
  cardTitle: { fontWeight: '700', color: '#111827', marginBottom: 4 },
  cardText: { color: '#111827' },
  cardSub: { color: '#6B7280', fontSize: 12 },
  primaryBtn: { marginTop: 8, backgroundColor: '#000000', height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { backgroundColor: '#E5E7EB' },
  primaryText: { color: '#FFFFFF', fontWeight: '700' },
  clearBtn: { marginTop: 12, backgroundColor: '#FEE2E2', height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FCA5A5' },
  clearText: { color: '#DC2626', fontWeight: '600' },
});