import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const articles: Array<{ id: string; title: string }> = [
  { id: 'what-is-currency-account', title: 'What is a Currency Account?' },
  { id: 'difference-vs-bank-account', title: 'What is the difference between a currency account and a regular bank account?' },
  { id: 'are-funds-safe', title: 'Are my funds safe in a Currency Account?' },
  { id: 'requirements-to-apply', title: 'What do I need to apply for a Currency Account?' },
  { id: 'info-required', title: 'What information is required to open a Currency Account?' },
  { id: 'supported-regions', title: 'Which countries/regions can open a Currency Account?' },
  { id: 'compatible-currencies', title: 'Which currencies are compatible with the Currency Account?' },
  { id: 'risk-assessment-why', title: 'Why is a risk assessment questionnaire required?' },
  { id: 'additional-docs', title: 'Why might I need to submit additional documents to open an account?' },
  { id: 'apply-multi-currency', title: 'How do I apply for a Currency Account supporting multiple currencies?' },
  { id: 'how-to-deposit', title: 'How do I deposit funds to my Currency Account?' },
  { id: 'how-to-withdraw', title: 'How do I withdraw funds from my Currency Account?' },
  { id: 'limits-and-fees', title: 'Are there any limits or fees for the Currency Account?' },
];

export default function CurrencyAccountHelp() {
  const router = useRouter();
  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Currency Account</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
        <Text style={s.count}>13 articles</Text>

        {articles.map((a, i) => (
          <TouchableOpacity key={a.id} style={s.row} activeOpacity={0.8} onPress={() => router.push({ pathname: '/help/article/[slug]', params: { slug: a.id, title: a.title } } as any)}>
            <Text style={s.index}>{i + 1}.</Text>
            <Text style={s.title}>{a.title}</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 8 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  count: { color: '#6B7280', fontSize: 13, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F3F4F6' },
  index: { width: 22, textAlign: 'right', color: '#111827', fontWeight: '700' },
  title: { flex: 1, color: '#111827', fontSize: 15 },
});
