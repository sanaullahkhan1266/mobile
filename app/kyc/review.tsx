import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import kycService from '@/services/KycService';
import kycApiService from '@/services/KycApiService';
import AppHeader from '@/components/AppHeader';

export default function KycReview() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const s = await kycService.getState();
      setSummary(s);
      const progress = kycService.computeProgress(s);
      setReady(progress === 100);
    })();
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    const state = await kycService.getState();
    const payload = {
      country: state.country,
      countryCode: state.countryCode,
      dialCode: state.dialCode,
      personal: state.personal,
      document: state.document,
      selfieUri: state.selfieUri,
    };
    const res = await kycApiService.submitKyc(payload);
    if (res.status === 'ok') {
      await kycService.incrementAttempts();
      await kycService.save({ status: 'submitted' });
      router.replace('/kyc/success' as any);
    } else {
      alert(res.message || 'Submission failed');
    }
    setSubmitting(false);
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

        <TouchableOpacity style={[s.primaryBtn, (!ready || submitting) && s.btnDisabled]} disabled={!ready || submitting} onPress={submit}>
          <Text style={s.primaryText}>{submitting ? 'Submitting...' : ready ? 'Submit' : 'Complete all steps first'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F3F4F6' },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  helper: { color: '#6B7280', marginBottom: 12 },
  card: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, marginBottom: 12 },
  cardTitle: { fontWeight: '700', color: '#111827', marginBottom: 4 },
  cardText: { color: '#111827' },
  cardSub: { color: '#6B7280', fontSize: 12 },
  primaryBtn: { marginTop: 8, backgroundColor: '#000000', height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { backgroundColor: '#E5E7EB' },
  primaryText: { color: '#FFFFFF', fontWeight: '700' },
});