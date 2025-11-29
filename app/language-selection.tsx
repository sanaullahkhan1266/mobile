import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/constants/Theme';
import AppHeader from '@/components/AppHeader';

type Lang = { code: string; name: string; native: string; flag: string };

const LANGUAGES: Lang[] = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
];

const STORAGE_KEY = 'settings.language';

export default function LanguageSelectionPage() {
  const router = useRouter();
  const T = useTheme();
  const [selected, setSelected] = useState<string>('en');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      if (s) setSelected(s);
    })();
  }, []);

  const save = async (code: string) => {
    setSaving(true);
    await AsyncStorage.setItem(STORAGE_KEY, code);
    setSaving(false);
    router.back();
  };

  const renderItem = ({ item }: { item: Lang }) => {
    const isActive = item.code === selected;
    return (
      <TouchableOpacity style={[s.row, { borderColor: T.border, backgroundColor: T.card }]} activeOpacity={0.7} onPress={() => setSelected(item.code)}>
        <View style={s.rowLeft}>
          <Text style={s.flag}>{item.flag}</Text>
          <View>
            <Text style={[s.rowTitle, { color: T.text }]}>{item.name}</Text>
            <Text style={[s.rowHint, { color: T.muted }]}>{item.native}</Text>
          </View>
        </View>
        {isActive ? (
          <Ionicons name="radio-button-on" size={20} color={T.text} />
        ) : (
          <Ionicons name="radio-button-off" size={20} color={T.muted} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: T.bg }]}> 
      <StatusBar barStyle={T.text === '#F9FAFB' ? 'light-content' : 'dark-content'} />
      <AppHeader title="Select Language" />

      <FlatList
        data={LANGUAGES}
        keyExtractor={(it) => it.code}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, gap: 10 }}
      />

      <View style={{ padding: 16 }}>
        <TouchableOpacity
          style={[s.saveBtn, { backgroundColor: T.text }]}
          activeOpacity={0.8}
          onPress={() => save(selected)}
          disabled={saving}
        >
          <Text style={s.saveText}>{saving ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, padding: 14, borderRadius: 12 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flag: { fontSize: 20 },
  rowTitle: { fontSize: 16, fontWeight: '700' },
  rowHint: { fontSize: 12 },
  saveBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  saveText: { color: '#FFFFFF', fontWeight: '800' },
});
