import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HelpPage() {
  const router = useRouter();

  const sections = [
    { title: 'Currency Account FAQ', count: 26, route: '/help/collection' },
    { title: 'Currency Account', count: 13, route: '/help/currency-account' },
    { title: 'Deposit', count: 6, route: '/help/collection' },
    { title: 'Fees', count: 2, route: '/help/collection' },
    { title: 'Refunds', count: 2, route: '/help/collection' },
    { title: 'Withdraw', count: 1, route: '/help/collection' },
    { title: 'Others', count: 2, route: '/help/collection' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help</Text>
        <TouchableOpacity onPress={() => router.push('/help/search')}>
          <Ionicons name="search" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 6 }}>
        {sections.map((s, idx) => (
          <TouchableOpacity key={idx} style={styles.sectionRow} activeOpacity={0.8} onPress={() => router.push(s.route as any)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>{s.title}</Text>
              <Text style={styles.sectionCount}>{s.count} {s.count === 1 ? 'article' : 'articles'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F3F4F6' },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#000000' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F3F4F6' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  sectionCount: { marginTop: 4, fontSize: 13, color: '#6B7280' },
});
