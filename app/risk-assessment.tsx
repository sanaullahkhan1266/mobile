import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import riskService from '@/services/RiskService';

const QUESTIONS = [
  { id: 'experience', title: 'How experienced are you with investing?', options: ['Beginner', 'Intermediate', 'Expert'] },
  { id: 'horizon', title: 'What is your typical investment horizon?', options: ['< 1 year', '1-3 years', '3+ years'] },
  { id: 'tolerance', title: 'How do you feel about risk?', options: ['Low', 'Medium', 'High'] },
];

export default function RiskAssessment() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attemptsInfo, setAttemptsInfo] = useState<{ attempts: number; max: number }>({ attempts: 0, max: 5 });

  useEffect(() => {
    (async () => {
      const s = await riskService.getState();
      setAttemptsInfo({ attempts: s.attempts, max: s.maxAttempts });
      setAnswers(s.answers || {});
    })();
  }, []);

  const complete = useMemo(() => QUESTIONS.every(q => !!answers[q.id]), [answers]);

  const choose = (id: string, value: string) => setAnswers((a) => ({ ...a, [id]: value }));

  const submit = async () => {
    if (!complete) return;
    await riskService.submitAnswers(answers);
    router.replace('/account-opening-requirements' as any);
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Risk assessment</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <Text style={s.helper}>Attempt {attemptsInfo.attempts}/{attemptsInfo.max}. Please answer all questions.</Text>

        {QUESTIONS.map((q) => (
          <View key={q.id} style={s.card}>
            <Text style={s.qTitle}>{q.title}</Text>
            {q.options.map((opt) => (
              <TouchableOpacity key={opt} style={s.optionRow} onPress={() => choose(q.id, opt)}>
                <Text style={s.optionText}>{opt}</Text>
                {answers[q.id] === opt && <Ionicons name="checkmark" size={18} color="#111827" />}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <TouchableOpacity style={[s.primaryBtn, !complete && s.btnDisabled]} disabled={!complete} onPress={submit}>
          <Text style={s.primaryText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 12 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  helper: { color: '#6B7280', marginBottom: 12 },
  card: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, backgroundColor: '#FFFFFF', padding: 12, marginBottom: 12 },
  qTitle: { fontWeight: '700', marginBottom: 8, color: '#111827' },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#F3F4F6' },
  optionText: { color: '#111827' },
  primaryBtn: { marginTop: 6, backgroundColor: '#111827', height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { backgroundColor: '#E5E7EB' },
  primaryText: { color: '#FFFFFF', fontWeight: '700' },
});
