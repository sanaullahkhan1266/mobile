import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import AppHeader from '@/components/AppHeader';
import { useTheme } from '@/constants/Theme';

export default function HelpSupportPage() {
  const T = useTheme();
  return (
    <SafeAreaView style={[s.container, { backgroundColor: T.bg }]}> 
      <StatusBar barStyle={T.text === '#F9FAFB' ? 'light-content' : 'dark-content'} />
      <AppHeader title="Support" />
      <View style={{ padding: 16, gap: 12 }}>
        <Text style={{ color: T.muted }}>Contact our support team:</Text>
        <View style={[s.card, { borderColor: T.border, backgroundColor: T.card }]}>
          <Text style={[s.title, { color: T.text }]}>Email</Text>
          <Text style={{ color: T.muted }}>support@cardtick.app</Text>
        </View>
        <View style={[s.card, { borderColor: T.border, backgroundColor: T.card }]}>
          <Text style={[s.title, { color: T.text }]}>Help Center</Text>
          <Text style={{ color: T.muted }}>Browse FAQs and guides.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  card: { borderWidth: 1, borderRadius: 12, padding: 12 },
  title: { fontWeight: '800' },
});
