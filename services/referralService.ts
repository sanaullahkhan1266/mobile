import { api } from '@/utils/apiClient';

export interface ReferralData {
  referralCode: string;
  referralLink: string;
  totalInvites: number;
  successful: number;
  totalEarned: number;
  pendingRewards: number;
}

export interface ReferralActivity {
  id: string;
  name: string;
  date: string;
  amount: string;
  status: 'completed' | 'pending';
}

/**
 * Get user's referral information
 */
export const getReferralData = async (): Promise<ReferralData> => {
  try {
    const response = await api.get<ReferralData>('/api/referral/info');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch referral data:', error);
    // Return mock data if API fails
    return {
      referralCode: 'CARD170',
      referralLink: 'https://cardtick.app/r/ge170',
      totalInvites: 0,
      successful: 0,
      totalEarned: 0,
      pendingRewards: 0,
    };
  }
};

/**
 * Get referral activity history
 */
export const getReferralActivities = async (): Promise<ReferralActivity[]> => {
  try {
    const response = await api.get<ReferralActivity[]>('/api/referral/activities');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch referral activities:', error);
    return [];
  }
};

/**
 * Get referral stats
 */
export const getReferralStats = async () => {
  try {
    const response = await api.get('/api/referral/stats');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch referral stats:', error);
    return {
      earned: 0,
      invited: 0,
      registered: 0,
      monthlyData: [],
    };
  }
};
