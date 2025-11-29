import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Share, ActivityIndicator, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { getReferralData, getReferralActivities, getReferralStats } from '@/services/referralService';

const { width } = Dimensions.get('window');

export default function InviteFriendsPage() {
  const router = useRouter();
  const [referralLink, setReferralLink] = useState('https://nationremit.com/invite/...');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ earned: 0, invited: 0, registered: 0 });
  const [activities, setActivities] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<number[]>([25, 50, 75, 100, 60, 80]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const referralData = await getReferralData();
      setReferralLink(referralData.referralLink);

      const statsData = await getReferralStats();
      setStats({
        earned: statsData.earned || 0,
        invited: statsData.invited || 0,
        registered: statsData.registered || 0,
      });
      if (statsData.monthlyData && statsData.monthlyData.length > 0) {
        setMonthlyData(statsData.monthlyData);
      }

      const activitiesList = await getReferralActivities();
      setActivities(activitiesList || []);
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(referralLink);
  };

  const shareLink = async () => {
    try {
      await Share.share({
        message: `Join me on this amazing app! Use my referral link: ${referralLink}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer</Text>
        <TouchableOpacity onPress={() => router.push('/profile')} style={styles.logoutButton}>
          <Text style={styles.logoutText}>log out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={{ paddingVertical: 60, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#000000" />
          </View>
        ) : (
          <>

        {/* Main Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.coinContainer}>
            <View style={styles.coin}>
              <Text style={styles.coinSymbol}>$</Text>
            </View>
            <View style={styles.coinGlow} />
          </View>
          
          {/* Character */}
          <View style={styles.characterContainer}>
            <View style={styles.character}>
              <View style={styles.characterHead}>
                <View style={styles.characterHat} />
                <Text style={styles.characterFace}>😊</Text>
              </View>
              <View style={styles.characterBody} />
            </View>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.mainTitle}>Invite your friend</Text>
        <Text style={styles.subtitle}>
          Refer your friends and both of you will{"\n"}get $20
        </Text>

        {/* Share Link Section */}
        <View style={styles.shareLinkSection}>
          <Text style={styles.shareLinkTitle}>Share your link</Text>
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>{referralLink}</Text>
          </View>
          
          <View style={styles.shareButtons}>
            <TouchableOpacity style={styles.shareButton} onPress={copyToClipboard}>
              <Ionicons name="copy-outline" size={24} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="mail-outline" size={24} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="chatbubble-outline" size={24} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={shareLink}>
              <Ionicons name="paper-plane-outline" size={24} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Invite Reports */}
        <View style={styles.reportsSection}>
          <Text style={styles.reportsTitle}>Invite reports</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>${stats.earned}</Text>
              <Text style={styles.statLabel}>Earned</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.invited}</Text>
              <Text style={styles.statLabel}>Invited</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.registered}</Text>
              <Text style={styles.statLabel}>Registered</Text>
            </View>
          </View>
        </View>

        {/* Overview Chart */}
        <View style={styles.overviewSection}>
          <Text style={styles.overviewTitle}>Overview</Text>
          <View style={styles.chartContainer}>
            {/* Simple bar chart */}
            <View style={styles.chart}>
              {monthlyData.map((height, index) => (
                <View key={index} style={styles.barContainer}>
                  <View style={[styles.bar, { height: height, backgroundColor: index === monthlyData.length - 1 ? '#8B5CF6' : '#E5E7EB' }]} />
                  <Text style={styles.barLabel}>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Earning Activities */}
        <View style={styles.activitiesSection}>
          <Text style={styles.activitiesTitle}>Earning Activities</Text>
          
          {activities.length === 0 ? (
            <View style={{ paddingVertical: 24, alignItems: 'center' }}>
              <Text style={{ color: '#6B7280', fontSize: 14 }}>No activities yet</Text>
            </View>
          ) : (
            activities.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityAvatar}>
                  <Ionicons name="person-outline" size={20} color="#000000" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityName}>{activity.name}</Text>
                  <Text style={styles.activityDate}>{activity.date}</Text>
                </View>
                <Text style={styles.activityAmount}>${activity.amount}</Text>
              </View>
            ))
          )}
        </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  logoutButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  friendsContainer: {
    height: 80,
    marginTop: 20,
    marginBottom: 20,
    position: 'relative',
  },
  friendAvatar: {
    position: 'absolute',
    top: 0,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginVertical: 30,
    height: 200,
    position: 'relative',
  },
  coinContainer: {
    position: 'absolute',
    top: 20,
    left: width * 0.2,
    zIndex: 2,
  },
  coin: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FCD34D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#F59E0B',
  },
  coinSymbol: {
    fontSize: 32,
    fontWeight: '700',
    color: '#92400E',
  },
  coinGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(252, 211, 77, 0.3)',
    top: -10,
    left: -10,
    zIndex: -1,
  },
  characterContainer: {
    position: 'absolute',
    bottom: 0,
    right: width * 0.15,
  },
  character: {
    alignItems: 'center',
  },
  characterHead: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FBBF24',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  characterHat: {
    position: 'absolute',
    top: -15,
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1F2937',
  },
  characterFace: {
    fontSize: 20,
  },
  characterBody: {
    width: 40,
    height: 80,
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
    marginTop: 5,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  shareLinkSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  shareLinkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  linkContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  linkText: {
    fontSize: 14,
    color: '#6B7280',
  },
  shareButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  shareButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  reportsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  overviewSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    width: '100%',
    justifyContent: 'space-between',
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  activitiesSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
  },
  activitiesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityAvatarText: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
});
