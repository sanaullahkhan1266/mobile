import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ScanPage() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.center}>
        <View style={styles.scanIconWrap}>
          <Ionicons name="qr-code-outline" size={52} color="#1F2937" />
        </View>
        <Text style={styles.title}>Scan a QR code</Text>
        <Text style={styles.subtitle}>This feature is coming soon.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 44, paddingBottom: 10 },
  backButton: { padding: 6 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  scanIconWrap: { width: 96, height: 96, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  subtitle: { marginTop: 6, fontSize: 13, color: '#6B7280' },
});
