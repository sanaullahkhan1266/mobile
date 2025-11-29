import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BitcoinLogo } from '../../components/Logo';
import ProfileButton from '../../components/ProfileButton';

const { width, height } = Dimensions.get('window');

const HubScreen = () => {
  const router = useRouter();

  const C = {
    bg: '#FFFFFF',
    text: '#1F2937',
    muted: '#6B7280',
    card: '#FFFFFF',
    cardAlt: '#FFFFFF',
    border: '#E5E7EB',
    red: '#DC2626',
  } as const;

  const categories = [
    {
      title: 'Quick Actions',
      items: [
        { title: 'Refer Friends', icon: 'gift-outline', route: '/share' },
        { title: 'All Crypto', icon: 'logo-bitcoin', route: '/coins' },
        { title: 'Apply Card', icon: 'card-outline', route: '/card' },
        { title: 'Learn', icon: 'book-outline', route: '/learn' },
        { title: 'My Rewards', icon: 'trophy-outline', route: '/my-rewards' },
        { title: 'Scan QR', icon: 'qr-code-outline', route: '/scan' },
        { title: 'Swap', icon: 'swap-horizontal-outline', route: '/swap' },
        { title: 'Records', icon: 'list-outline', route: '/records' },
      ],
    },
    {
      title: 'Popular Wallets',
      items: [
        { title: 'BTC', icon: 'logo-bitcoin', route: '/wallet/BTC' },
        { title: 'ETH', icon: 'diamond-outline', route: '/wallet/ETH' },
        { title: 'USDT', icon: 'card-outline', route: '/wallet/USDT' },
        { title: 'USDC', icon: 'ellipse-outline', route: '/wallet/USDC' },
        { title: 'BNB', icon: 'triangle-outline', route: '/wallet/BNB' },
        { title: 'SOL', icon: 'sunny-outline', route: '/wallet/SOL' },
        { title: 'TRX', icon: 'flash-outline', route: '/wallet/TRX' },
        { title: 'XRP', icon: 'water-outline', route: '/wallet/XRP' },
      ],
    },
    {
      title: 'Account & Security',
      items: [
        { title: 'Profile', icon: 'person-outline', route: '/profile' },
        { title: 'KYC Verify', icon: 'checkmark-done-circle-outline', route: '/kyc' },
        { title: 'Security', icon: 'lock-closed-outline', route: '/security' },
        { title: 'App Lock', icon: 'key-outline', route: '/app-lock' },
        { title: 'Risk Check', icon: 'warning-outline', route: '/risk-assessment' },
      ],
    },
    {
      title: 'Settings',
      items: [
        { title: 'Settings', icon: 'settings-outline', route: '/settings' },
        { title: 'Appearance', icon: 'color-palette-outline', route: '/appearance' },
        { title: 'Language', icon: 'language-outline', route: '/language-selection' },
        { title: 'Notifications', icon: 'notifications-outline', route: '/notifications' },
        { title: 'Messages', icon: 'chatbubble-ellipses-outline', route: '/messages' },
      ],
    },
    {
      title: 'Help & Support',
      items: [
        { title: 'Help Center', icon: 'help-circle-outline', route: '/help' },
        { title: 'Support', icon: 'headset-outline', route: '/help/support' },
        { title: 'Network Info', icon: 'wifi-outline', route: '/network-diagnostics' },
        { title: 'About', icon: 'information-circle-outline', route: '/about' },
      ],
    },
  ];

  const s = getStyles(C);

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={C.bg} />
      
      {/* Header */}
      <View style={s.header}>
        <ProfileButton size={32} />
        <BitcoinLogo size={64} />
        <TouchableOpacity style={s.notificationButton} activeOpacity={0.7} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={24} color={C.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
        {categories.map((category, categoryIndex) => (
          <View key={categoryIndex} style={s.categorySection}>
            <Text style={[s.categoryTitle, { color: C.text }]}>{category.title}</Text>
            <View style={s.itemsGrid}>
              {category.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={s.serviceItem}
                  activeOpacity={0.8}
                  onPress={() => item.route && router.push(item.route as any)}
                >
                  <View style={[s.serviceIcon, { backgroundColor: C.card, borderColor: C.border }]}>
                    <Ionicons name={item.icon as any} size={20} color={C.text} />
                  </View>
                  <Text style={[s.serviceTitle, { color: C.text }]}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (C: { bg: string; text: string; muted: string; card: string; cardAlt: string; border: string; red: string }) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    header: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      paddingHorizontal: width * 0.06, 
      paddingTop: height * 0.02, 
      paddingBottom: height * 0.015 
    },
    brand: { fontSize: 20, fontWeight: '700' },
    notificationButton: { width: 40, height: 40, alignItems: 'flex-end', justifyContent: 'center' },
    
    content: { flex: 1, paddingHorizontal: width * 0.06 },
    
    categorySection: { marginBottom: 32 },
    categoryTitle: { 
      fontSize: 22, 
      fontWeight: '700', 
      marginBottom: 16 
    },
    
    itemsGrid: { 
      flexDirection: 'row', 
      flexWrap: 'wrap', 
      justifyContent: 'space-between',
      gap: 16
    },
    
    serviceItem: { 
      alignItems: 'center', 
      width: (width * 0.88 - 16 * 3) / 4,
      marginBottom: 20
    },
    
    serviceIcon: { 
      width: 56, 
      height: 56, 
      borderRadius: 16, 
      alignItems: 'center', 
      justifyContent: 'center', 
      marginBottom: 8,
      borderWidth: 1,
      borderColor: C.border,
      backgroundColor: C.card,
    },
    
    serviceTitle: { 
      fontSize: 12, 
      fontWeight: '500', 
      textAlign: 'center' 
    },
  });

export default HubScreen;