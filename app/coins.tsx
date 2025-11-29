import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import cryptoService, { CryptoCurrency } from '@/services/CryptoService';

const service = cryptoService;

export default function CoinsScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coins, setCoins] = useState<CryptoCurrency[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await service.getAllCoins(200);
        if (mounted) setCoins(data);
      } catch (e: any) {
        setError('Failed to load coins');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return coins;
    const q = query.trim().toLowerCase();
    return coins.filter(c => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
  }, [coins, query]);

  const goToCoin = (coin: CryptoCurrency) => {
    const route = service.getWalletRouteForSymbol(coin.symbol);
    if (route) {
      router.push(route as any);
    } else {
      router.push({ pathname: '/token/[symbol]', params: { symbol: coin.symbol, name: coin.name } } as any);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={s.title}>Coins</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={s.searchBox}>
        <Ionicons name="search" size={18} color="#9CA3AF" />
        <TextInput
          placeholder="Search by name or symbol"
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          style={s.searchInput}
        />
      </View>

      {loading ? (
        <View style={s.center}><ActivityIndicator /></View>
      ) : error ? (
        <View style={s.center}><Text style={{ color: '#DC2626' }}>{error}</Text></View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={s.sep} />}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.row} activeOpacity={0.8} onPress={() => goToCoin(item)}>
              <View style={s.iconBadge}><Ionicons name="ellipse" color="#111827" size={14} /></View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                  <Text style={s.symbol}>{item.symbol}</Text>
                  <Text style={s.name}>{item.name}</Text>
                </View>
                <Text style={s.price}>${Number(item.current_price || 0).toFixed(2)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 8 },
  backButton: { padding: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#111827' },
  searchBox: { marginHorizontal: 16, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#F9FAFB' },
  searchInput: { flex: 1, color: '#111827' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sep: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  iconBadge: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E7EB' },
  symbol: { fontSize: 16, fontWeight: '800', color: '#111827' },
  name: { fontSize: 14, color: '#6B7280' },
  price: { marginTop: 4, fontSize: 13, color: '#111827' },
});
