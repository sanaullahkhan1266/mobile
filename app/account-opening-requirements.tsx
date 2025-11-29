import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import kycService from '@/services/KycService';
import riskService from '@/services/RiskService';

const { width } = Dimensions.get('window');

export default function AccountOpeningRequirements() {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code?: string }>();

  const [showVerify, setShowVerify] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [showFunds, setShowFunds] = useState(false);

  const [kycAttempts, setKycAttempts] = useState<{ used: number; max: number }>({ used: 0, max: 3 });
  const [risk, setRisk] = useState<{ attempts: number; max: number; completed: boolean }>({ attempts: 0, max: 5, completed: false });

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const k = await kycService.getState();
        setKycAttempts({ used: k.attempts ?? 0, max: k.maxAttempts ?? 3 });
        const r = await riskService.getState();
        setRisk({ attempts: r.attempts, max: r.maxAttempts, completed: r.completed });
      })();
      return () => {};
    }, [])
  );

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={s.title}>Account Opening
Requirements{code ? ` • ${String(code).toUpperCase()}` : ''}</Text>
        <TouchableOpacity onPress={() => router.push('/help')}>
          <Ionicons name="help-circle-outline" size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        {/* KYC item */}
        <TouchableOpacity activeOpacity={0.8} style={s.card} onPress={() => setShowVerify(true)}>
          <View style={[s.icon, { backgroundColor: '#FFF7ED' }] }>
            <Ionicons name="person-circle-outline" size={20} color="#EA580C" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.cardTitle}>Complete identity verification first.</Text>
            <Text style={s.cardMeta}>{kycAttempts.used}/{kycAttempts.max} attempts</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Risk item */}
        <TouchableOpacity style={s.card} activeOpacity={0.8} onPress={() => router.push('/risk-assessment' as any)}>
          <View style={[s.icon, { backgroundColor: '#ECFEFF' }] }>
            <Ionicons name="document-text-outline" size={18} color="#0891B2" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.cardTitle}>Risk assessment questionnaire must be completed. <Text onPress={() => setShowWhy(true)} style={{ textDecorationLine: 'underline' }}>Why?</Text></Text>
            <Text style={s.cardMeta}>{risk.attempts}/{risk.max} attempts • {risk.completed ? 'Completed' : 'Not completed'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={[s.continueBtn, !(kycAttempts.used>0 && risk.completed) && s.btnDisabled]} activeOpacity={0.9} disabled={!(kycAttempts.used>0 && risk.completed)}>
          <Text style={s.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Verify your identity modal */}
      <Modal visible={showVerify} animationType="fade" transparent onRequestClose={() => setShowVerify(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.sheet}>
            <TouchableOpacity style={s.sheetClose} onPress={() => setShowVerify(false)}>
              <Ionicons name="close" size={20} color="#111827" />
            </TouchableOpacity>
            <View style={s.illustration} />
            <Text style={s.sheetTitle}>Verify your identity</Text>
            <Text style={s.sheetBody}>To comply with local laws and regulations, and to help prevent identity theft and fraud, you need to complete identity verification to continue using our services.</Text>
            <TouchableOpacity onPress={() => { setShowVerify(false); router.push('/kyc'); }} style={s.primaryBtn} activeOpacity={0.9}>
              <Text style={s.primaryText}>Verify now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Why is it necessary modal */}
      <Modal visible={showWhy} animationType="fade" transparent onRequestClose={() => setShowWhy(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.dialog}>
            <Text style={s.dialogTitle}>Why is it necessary?</Text>
            <Text style={s.dialogBody}>To comply with regulations, please complete a short risk assessment for your currency account. It helps us understand your risk tolerance and offer services that suit you better.</Text>
            <TouchableOpacity onPress={() => setShowWhy(false)} style={s.dialogBtn}>
              <Text style={s.dialogBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Funds flexible modal */}
      <Modal visible={showFunds} animationType="fade" transparent onRequestClose={() => setShowFunds(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.dialog}>
            <Text style={s.dialogTitle}>Your Funds Stay Flexible</Text>
            <Text style={s.dialogBody}>1. To open a currency account, you need at least 100.00 USD in your account.{"\n"}2. You can withdraw or transfer the funds anytime, even if the EUR/GBP account isn't activated.</Text>
            <View style={s.fakeBalanceCard}>
              <Text style={{ color: '#6B7280', fontSize: 12 }}>Est. Total Value (USD)</Text>
              <Text style={{ fontWeight: '800', fontSize: 24, color: '#111827', marginTop: 6 }}>$100.00</Text>
            </View>
            <TouchableOpacity onPress={() => setShowFunds(false)} style={s.dialogBtn}>
              <Text style={s.dialogBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 12 },
  backButton: { padding: 8 },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '800', color: '#111827', flex: 1, marginHorizontal: 8 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12, marginTop: 14, backgroundColor: '#FFFFFF' },
  icon: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 15, color: '#111827' },
  cardMeta: { marginTop: 4, color: '#6B7280', fontSize: 12 },
  continueBtn: { marginTop: 24, backgroundColor: '#111827', borderRadius: 26, height: 52, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { backgroundColor: '#E5E7EB' },
  continueText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  sheet: { width: '100%', borderRadius: 18, backgroundColor: '#FFFFFF', padding: 20 },
  sheetClose: { position: 'absolute', right: 10, top: 10, padding: 8 },
  illustration: { height: 120, borderRadius: 12, backgroundColor: '#F3F4F6', marginTop: 8, marginBottom: 12 },
  sheetTitle: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 8 },
  sheetBody: { color: '#6B7280', fontSize: 14, lineHeight: 20, marginBottom: 14 },
  primaryBtn: { height: 48, borderRadius: 24, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#FFFFFF', fontWeight: '700' },

  dialog: { width: Math.min(width - 40, 360), borderRadius: 18, backgroundColor: '#FFFFFF', padding: 18 },
  dialogTitle: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 8 },
  dialogBody: { color: '#6B7280', fontSize: 14, lineHeight: 20, marginBottom: 12 },
  dialogBtn: { height: 44, borderRadius: 22, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  dialogBtnText: { color: '#FFFFFF', fontWeight: '700' },

  fakeBalanceCard: { marginVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', padding: 12 },
});