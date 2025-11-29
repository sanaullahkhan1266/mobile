import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import AppHeader from '@/components/AppHeader';
import { useTheme } from '@/constants/Theme';

const ITEMS = [
  { id: 'q1', title: 'How to add a card?', body: 'Use the Cards tab to apply and add cards to your account.' },
  { id: 'q2', title: 'Fees and limits', body: 'Review the fee schedule in the Fees section of Help.' },
];

export default function HelpCollectionPage() {
  const T = useTheme();
  return (
    <SafeAreaView style={[s.container, { backgroundColor: T.bg }]}> 
      <StatusBar barStyle={T.text === '#F9FAFB' ? 'light-content' : 'dark-content'} />
      <AppHeader title="Help Collection" />
      <View style={{ padding: 16 }}>
        {ITEMS.map((it) => (
          <View key={it.id} style={[s.card, { borderColor: T.border, backgroundColor: T.card }]}> 
            <Text style={[s.title, { color: T.text }]}>{it.title}</Text>
            <Text style={{ color: T.muted, marginTop: 4 }}>{it.body}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  card: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 10 },
  title: { fontWeight: '800' },
});
