import { api } from '@/utils/apiClient';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  kycStatus?: 'not_started' | 'pending' | 'approved' | 'rejected';
  accountType?: 'basic' | 'premium' | 'business';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

export interface UploadAvatarResponse {
  success: boolean;
  avatarUrl: string;
  message?: string;
}

/**
 * Get current user profile
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get<UserProfile>('/api/user/profile');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch user profile:', error);
    throw {
      message: error?.data?.message || error?.message || 'Failed to fetch profile',
      error,
    };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  data: UpdateProfileData
): Promise<UserProfile> => {
  try {
    const response = await api.put<UserProfile>('/api/user/profile', data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to update user profile:', error);
    throw {
      message: error?.data?.message || error?.message || 'Failed to update profile',
      error,
    };
  }
};

/**
 * Upload profile avatar
 */
export const uploadAvatar = async (imageUri: string): Promise<UploadAvatarResponse> => {
  try {
    const formData = new FormData();
    const filename = imageUri.split('/').pop() || 'avatar.jpg';
    const type = filename.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

    formData.append('avatar', {
      uri: imageUri,
      name: filename,
      type: type,
    } as any);

    const response = await api.post<UploadAvatarResponse>(
      '/api/user/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Failed to upload avatar:', error);
    throw {
      message: error?.data?.message || error?.message || 'Failed to upload avatar',
      error,
    };
  }
};

/**
 * Delete account
 */
export const deleteAccount = async (password: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete<{ success: boolean; message: string }>(
      '/api/user/account',
      {
        data: { password },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Failed to delete account:', error);
    throw {
      message: error?.data?.message || error?.message || 'Failed to delete account',
      error,
    };
  }
};

/**
 * Update notification preferences
 */
export const updateNotificationPreferences = async (preferences: {
  email?: boolean;
  push?: boolean;
  sms?: boolean;
  transactionAlerts?: boolean;
  priceAlerts?: boolean;
  newsletter?: boolean;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.put<{ success: boolean; message: string }>(
      '/api/user/preferences/notifications',
      preferences
    );
    return response.data;
  } catch (error: any) {
    console.error('Failed to update notification preferences:', error);
    throw {
      message: error?.data?.message || error?.message || 'Failed to update preferences',
      error,
    };
  }
};

/**
 * Get notification preferences
 */
export const getNotificationPreferences = async () => {
  try {
    const response = await api.get('/api/user/preferences/notifications');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch notification preferences:', error);
    throw {
      message: error?.data?.message || error?.message || 'Failed to fetch preferences',
      error,
    };
  }
};
