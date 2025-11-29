import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function KycSuccess() {
  const router = useRouter();
  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={s.backButton}>
          <Ionicons name="close" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Submitted</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={{ paddingHorizontal: 16, alignItems: 'center', marginTop: 24 }}>
        <Ionicons name="checkmark-circle" size={64} color="#10B981" />
        <Text style={s.title}>Verification submitted</Text>
        <Text style={s.subtitle}>We’re reviewing your information. This may take up to 24 hours. You’ll be notified once done.</Text>

        <TouchableOpacity style={s.primaryBtn} onPress={() => router.replace('/(tabs)' as any)}>
          <Text style={s.primaryText}>Done</Text>
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
  title: { marginTop: 12, fontSize: 20, fontWeight: '800', color: '#111827' },
  subtitle: { marginTop: 8, color: '#6B7280', textAlign: 'center' },
  primaryBtn: { marginTop: 18, backgroundColor: '#111827', height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch' },
  primaryText: { color: '#FFFFFF', fontWeight: '700' },
});
