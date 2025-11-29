import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share as RNShare,
  Linking,
  Animated,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { getReferralData } from '@/services/referralService';

const { width, height } = Dimensions.get('window');

export default function ShareScreen() {
  const router = useRouter();
  const [referralCode, setReferralCode] = useState('CARD170');
  const [referralLink, setReferralLink] = useState('https://cardtick.app/r/ge170');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [stats, setStats] = useState({
    totalInvites: 0,
    successful: 0,
    totalEarned: 0,
    pendingRewards: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch referral data from backend
  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    setLoading(true);
    try {
      const data = await getReferralData();
      setReferralCode(data.referralCode);
      setReferralLink(data.referralLink);
      setStats({
        totalInvites: data.totalInvites,
        successful: data.successful,
        totalEarned: data.totalEarned,
        pendingRewards: data.pendingRewards,
      });
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowToast(false));
  };

  const copyToClipboard = async (text: string, type: string) => {
    await Clipboard.setStringAsync(text);
    showToastMessage(`${type} copied to clipboard!`);
  };

  const shareContent = async (platform: string) => {
    const message = `🚀 Join Cardtick and get $5 USD instantly!\n\n💰 Use my referral code: ${referralCode}\n🔗 Or click: ${referralLink}\n\n✨ Start earning crypto rewards today!`;
    
    try {
      switch (platform) {
        case 'telegram':
          const telegramUrl = `tg://msg?text=${encodeURIComponent(message)}`;
          const canOpenTelegram = await Linking.canOpenURL(telegramUrl);
          if (canOpenTelegram) {
            await Linking.openURL(telegramUrl);
          } else {
            await Linking.openURL(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join Cardtick and get $5 USD!')}`);
          }
          break;
        case 'whatsapp':
          await Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}`);
          break;
        case 'twitter':
          const tweetText = `🚀 Just discovered @Cardtick - get $5 USD for signing up! Use my code: ${referralCode}`;
          await Linking.openURL(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(referralLink)}`);
          break;
        case 'email':
          await Linking.openURL(`mailto:?subject=${encodeURIComponent('Join Cardtick & Get $5!')}&body=${encodeURIComponent(message)}`);
          break;
        case 'sms':
          await Linking.openURL(`sms:?body=${encodeURIComponent(message)}`);
          break;
        case 'more':
          await RNShare.share({
            message: message,
            title: 'Join Cardtick & Get $5!',
          });
          break;
      }
    } catch (error) {
      console.error('Error sharing:', error);
      showToastMessage('Could not open the selected app');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share</Text>
        <TouchableOpacity style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#1F2937" />
          </View>
        ) : (
          <>
        {/* Promo Card (clean white) */}
        <View style={styles.promoCard}>
          <View style={styles.promoHeader}>
            <Text style={[styles.brandText, { color: '#1F2937' }]}>Cardtick</Text>
            <View style={[styles.cryptoIcon, { borderColor: '#E5E7EB' }]}>
              <Ionicons name="gift-outline" size={18} color="#1F2937" />
            </View>
          </View>
          <Text style={[styles.promoTitleText, { color: '#1F2937' }]}>Invite friends and get $5</Text>
          <Text style={styles.promoSub}>Share your code or link below to earn rewards.</Text>
        </View>

        {/* Referral Code Section */}
        <View style={styles.referralSection}>
          <Text style={styles.sectionLabel}>Referral Code</Text>
          <View style={styles.referralContainer}>
            <Text style={styles.referralCode}>{referralCode}</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => copyToClipboard(referralCode, 'Referral code')}
            >
              <Ionicons name="copy-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Referral Link Section */}
        <View style={styles.referralSection}>
          <Text style={styles.sectionLabel}>Referral Link</Text>
          <View style={styles.referralContainer}>
            <Text style={styles.referralLink} numberOfLines={1} ellipsizeMode="tail">
              {referralLink}
            </Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => copyToClipboard(referralLink, 'Referral link')}
            >
              <Ionicons name="copy-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
          </>
        )}
      </ScrollView>

      {/* Share Options */}
      <View style={styles.shareOptions}>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => shareContent('save')}
        >
          <Ionicons name="download-outline" size={24} color="#666" />
          <Text style={styles.shareButtonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => shareContent('telegram')}
        >
          <Ionicons name="paper-plane-outline" size={24} color="#666" />
          <Text style={styles.shareButtonText}>Telegram</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => shareContent('whatsapp')}
        >
          <Ionicons name="logo-whatsapp" size={24} color="#666" />
          <Text style={styles.shareButtonText}>WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => shareContent('more')}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
          <Text style={styles.shareButtonText}>More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  promoCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  promoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '800',
  },
  cryptoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
  },
  promoTitleText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  promoSub: {
    color: '#6B7280',
    fontSize: 12,
  },
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  registerText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  cardContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  cryptoCard: {
    width: 80,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLogo: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  decorativeElements: {
    position: 'absolute',
    right: -30,
    top: -10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  platformIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 12,
  },
  platformIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aliExpressText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  chainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentMethods: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentIcon: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  gPayText: {
    color: '#4285F4',
    fontSize: 12,
    fontWeight: 'bold',
  },
  binanceText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  referralSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 8,
  },
  referralContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  referralCode: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  referralLink: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  copyButton: {
    padding: 4,
  },
  shareOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
  shareButton: {
    alignItems: 'center',
    gap: 8,
  },
  shareButtonText: {
    fontSize: 12,
    color: '#666666',
  },
});