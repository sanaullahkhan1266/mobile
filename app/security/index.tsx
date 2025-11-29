import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import AppHeader from '@/components/AppHeader';
import { useTheme } from '@/constants/Theme';

export default function SecurityPage() {
  const T = useTheme();
  const router = useRouter();
  return (
    <SafeAreaView style={[s.container, { backgroundColor: T.bg }]}> 
      <StatusBar barStyle={T.text === '#F9FAFB' ? 'light-content' : 'dark-content'} />
      <AppHeader title="Security" />
      <View style={{ padding: 16, gap: 10 }}>
        <TouchableOpacity style={[s.row, { borderColor: T.border, backgroundColor: T.card }]} onPress={() => router.push('/app-lock')}>
          <Text style={[s.rowTitle, { color: T.text }]}>App Lock</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.row, { borderColor: T.border, backgroundColor: T.card }]} onPress={() => router.push('/security/advanced')}>
          <Text style={[s.rowTitle, { color: T.text }]}>Advanced</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  row: { borderWidth: 1, borderRadius: 12, padding: 12 },
  rowTitle: { fontWeight: '800' },
});
