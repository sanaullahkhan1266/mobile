import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Theme, { useTheme } from '@/constants/Theme';

export default function NetworkDiagnosticsPage() {
  const router = useRouter();
  const T = useTheme();
  const [running, setRunning] = React.useState(false);
  const [results, setResults] = React.useState<{name: string; ok: boolean; ms?: number; message?: string;}[]>([]);

  const test = async (name: string, url: string) => {
    const started = Date.now();
    try {
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), 5000);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(to);
      const ok = res.ok;
      const ms = Date.now() - started;
      setResults(prev => [...prev, { name, ok, ms }]);
    } catch (e: any) {
      const ms = Date.now() - started;
      setResults(prev => [...prev, { name, ok: false, ms, message: String(e?.message || e) }]);
    }
  };

  const runDiagnostics = async () => {
    setRunning(true);
    setResults([]);
    // Generic connectivity check
    await test('Internet connectivity', 'https://www.google.com/generate_204');
    // Try public crypto API if configured
    if (process.env.EXPO_PUBLIC_CRYPTO_API_BASE_URL) {
      await test('API reachability', `${process.env.EXPO_PUBLIC_CRYPTO_API_BASE_URL}`);
    }
    setRunning(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: T.bg }]}> 
      <StatusBar barStyle={T.text === '#F9FAFB' ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { borderBottomColor: T.border }]}> 
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={T.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: T.text }]}>Network Diagnostics</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.body}> 
        <TouchableOpacity style={[styles.runBtn, { backgroundColor: T.text }]} onPress={runDiagnostics} disabled={running}>
          <Text style={styles.runBtnText}>{running ? 'Running...' : 'Run diagnostics'}</Text>
        </TouchableOpacity>

        {results.map((r, idx) => (
          <View key={idx} style={[styles.resultRow, { borderColor: T.border, backgroundColor: T.card }]}> 
            <View style={styles.resultLeft}>
              <Ionicons name={r.ok ? 'checkmark-circle' : 'close-circle'} size={18} color={r.ok ? '#10B981' : '#EF4444'} />
              <Text style={[styles.resultName, { color: T.text }]}>{r.name}</Text>
            </View>
            <Text style={[styles.resultMs, { color: T.muted }]}>{typeof r.ms === 'number' ? `${r.ms} ms` : ''}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1 },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  body: { flex: 1, padding: 16, gap: 12 },
  runBtn: { borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  runBtnText: { color: '#FFFFFF', fontWeight: '700' },
  resultRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, padding: 12, borderRadius: 10 },
  resultLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  resultName: { fontSize: 14, fontWeight: '700' },
  resultMs: { fontSize: 12 },
});
