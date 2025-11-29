import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import AppHeader from '@/components/AppHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/constants/Theme';

const MODE_KEY = 'settings.themeMode'; // system | light | dark
const ACCENT_KEY = 'settings.accentColor'; // blue | green | red

export default function AppearancePage() {
  const T = useTheme();
  const [mode, setMode] = useState<'system'|'light'|'dark'>('system');
  const [accent, setAccent] = useState<'blue'|'green'|'red'>('blue');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const m = (await AsyncStorage.getItem(MODE_KEY)) as any;
      const a = (await AsyncStorage.getItem(ACCENT_KEY)) as any;
      if (m) setMode(m);
      if (a) setAccent(a);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    await AsyncStorage.multiSet([[MODE_KEY, mode], [ACCENT_KEY, accent]]);
    setSaving(false);
  };

  const ModeOption = ({ val, label }: any) => (
    <TouchableOpacity style={[s.row, { borderColor: T.border, backgroundColor: T.card }]} onPress={() => setMode(val)}>
      <Text style={[s.rowTitle, { color: T.text }]}>{label}</Text>
      <Text style={{ color: mode === val ? '#10B981' : T.muted }}>{mode === val ? 'Selected' : ''}</Text>
    </TouchableOpacity>
  );

  const AccentOption = ({ val, label, color }: any) => (
    <TouchableOpacity style={[s.row, { borderColor: T.border, backgroundColor: T.card }]} onPress={() => setAccent(val)}>
      <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: color, marginRight: 8 }} />
      <Text style={[s.rowTitle, { color: T.text }]}>{label}</Text>
      <View style={{ flex: 1 }} />
      <Text style={{ color: accent === val ? '#10B981' : T.muted }}>{accent === val ? 'Selected' : ''}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[s.container, { backgroundColor: T.bg }]}> 
      <StatusBar barStyle={T.text === '#F9FAFB' ? 'light-content' : 'dark-content'} />
      <AppHeader title="Appearance" />

      <View style={{ padding: 16 }}>
        <Text style={[s.sectionTitle, { color: T.muted }]}>Theme</Text>
        <ModeOption val="system" label="Use system setting" />
        <ModeOption val="light" label="Light" />
        <ModeOption val="dark" label="Dark" />

        <Text style={[s.sectionTitle, { color: T.muted, marginTop: 16 }]}>Accent color</Text>
        <AccentOption val="blue" label="Blue" color="#3B82F6" />
        <AccentOption val="green" label="Green" color="#10B981" />
        <AccentOption val="red" label="Red" color="#EF4444" />

        <TouchableOpacity style={s.saveBtn} onPress={save} disabled={saving}>
          <Text style={s.saveText}>{saving ? 'Saving…' : 'Save'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 10 },
  rowTitle: { fontWeight: '700' },
  saveBtn: { marginTop: 18, backgroundColor: '#111827', height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  saveText: { color: '#FFFFFF', fontWeight: '800' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#000000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  placeholder: { color: '#6B7280', fontSize: 16, textAlign: 'center' },
});
