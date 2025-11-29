import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getNotifications } from '@/services/notificationService';

const TABS: ('All' | 'Transaction' | 'System')[] = ['All', 'Transaction', 'System'];

export default function NotificationsPage() {
  const router = useRouter();
  const [active, setActive] = useState<'All' | 'Transaction' | 'System'>('All');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = notifications.filter(notif => {
    if (active === 'All') return true;
    return notif.type?.toLowerCase() === active.toLowerCase();
  });

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name={item.icon as any} size={18} color="#1F2937" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSub}>{item.time || item.body}</Text>
      </View>
      {'amount' in item && (
        <Text style={[styles.amount, { color: item.positive ? '#10B981' : '#EF4444' }]}>{item.amount}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map((t) => (
          <TouchableOpacity key={t} onPress={() => setActive(t)} style={[styles.tabBtn, active === t && styles.tabBtnActive]}> 
            <Text style={[styles.tabText, active === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.empty}>
          <ActivityIndicator size="large" color="#1F2937" />
        </View>
      ) : filteredItems.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="notifications-outline" size={36} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No {active} notifications</Text>
          <Text style={styles.emptySub}>We'll let you know when there's something to see.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(it) => it.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 }}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F3F4F6' },
  backButton: { padding: 6 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },

  tabsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginTop: 8 },
  tabBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
  tabBtnActive: { backgroundColor: '#111827' },
  tabText: { fontSize: 13, color: '#1F2937', fontWeight: '600' },
  tabTextActive: { color: '#FFFFFF' },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyTitle: { marginTop: 12, fontSize: 16, fontWeight: '700', color: '#1F2937' },
  emptySub: { marginTop: 4, fontSize: 13, color: '#6B7280', textAlign: 'center' },

  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', padding: 12, borderRadius: 12, marginBottom: 12 },
  iconWrap: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  itemTitle: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  itemSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  amount: { fontSize: 14, fontWeight: '800' },
});
