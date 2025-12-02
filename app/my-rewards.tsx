import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getReferralData, getReferralActivities } from '@/services/referralService';

export default function MyRewardsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      const [data, acts] = await Promise.all([
        getReferralData(),
        getReferralActivities()
      ]);
      setReferralData(data);
      setActivities(acts);
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Rewards</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchReferralData}>
          <Ionicons name="refresh" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Earnings Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="trophy" size={24} color="#F59E0B" />
              <Text style={styles.summaryTitle}>Total Earned</Text>
            </View>
            <Text style={styles.summaryAmount}>${referralData?.totalEarned || 0}</Text>
            <Text style={styles.summarySubtitle}>
              Pending: ${referralData?.pendingRewards || 0}
            </Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{referralData?.totalInvites || 0}</Text>
              <Text style={styles.statLabel}>Total Invites</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{referralData?.successful || 0}</Text>
              <Text style={styles.statLabel}>Successful</Text>
            </View>
          </View>

          {/* Referral Code */}
          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>Your Referral Code</Text>
            <Text style={styles.code}>{referralData?.referralCode || 'N/A'}</Text>
            <TouchableOpacity style={styles.shareButton} onPress={() => router.push('/invite-friends')}>
              <Text style={styles.shareButtonText}>Share & Earn</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Recent Activities */}
          {activities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Activities</Text>
              {activities.map((activity) => (
                <View key={activity.id} style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Ionicons 
                      name={activity.status === 'completed' ? 'checkmark-circle' : 'time'} 
                      size={20} 
                      color={activity.status === 'completed' ? '#10B981' : '#F59E0B'} 
                    />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityName}>{activity.name}</Text>
                    <Text style={styles.activityDate}>{new Date(activity.date).toLocaleDateString()}</Text>
                  </View>
                  <Text style={[styles.activityAmount, {
                    color: activity.status === 'completed' ? '#10B981' : '#F59E0B'
                  }]}>
                    {activity.amount}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth, 
    borderBottomColor: '#E5E7EB' 
  },
  backButton: { padding: 8 },
  refreshButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#000000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, paddingHorizontal: 20 },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  codeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  codeLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  code: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
    letterSpacing: 2,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 15,
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
  },
});
