import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function HelpArticle() {
  const router = useRouter();
  const params = useLocalSearchParams<{ slug?: string; title?: string }>();
  const title = (params.title || 'Help Article') as string;

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={s.headerTitle} numberOfLines={1}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
        <Text style={s.placeholder}>This is a placeholder for “{title}”. You can wire this page to your CMS or knowledge base later.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 8 },
  backButton: { padding: 8 },
  headerTitle: { flex: 1, marginLeft: 8, fontSize: 18, fontWeight: '700', color: '#111827' },
  placeholder: { marginTop: 12, color: '#6B7280', fontSize: 15, lineHeight: 22 },
});
