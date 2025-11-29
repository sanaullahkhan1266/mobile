import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, StatusBar, FlatList, ActivityIndicator } from 'react-native';
import AppHeader from '@/components/AppHeader';
import { useTheme } from '@/constants/Theme';
import { getMessages } from '@/services/notificationService';

export default function MessagesPage() {
  const T = useTheme();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await getMessages();
      setMessages(data || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: T.bg }]}> 
      <StatusBar barStyle={T.text === '#F9FAFB' ? 'light-content' : 'dark-content'} />
      <AppHeader title="Messages" />
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={T.text} />
        </View>
      ) : messages.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          <Text style={[s.body, { color: T.muted, textAlign: 'center' }]}>No messages yet</Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(it) => it.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={[s.card, { borderColor: T.border, backgroundColor: T.card }]}> 
              <View style={{ flex: 1 }}>
                <Text style={[s.title, { color: T.text }]}>{item.title}</Text>
                <Text style={[s.body, { color: T.muted }]}>{item.body}</Text>
              </View>
              <Text style={[s.time, { color: T.muted }]}>{item.time}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  card: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 10 },
  title: { fontWeight: '800' },
  body: { fontSize: 12, marginTop: 2 },
  time: { marginLeft: 8, fontSize: 12 },
});
