import { api } from '@/utils/apiClient';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  data?: any;
  createdAt: string;
  read: boolean;
  type: 'transaction' | 'security' | 'promotion' | 'system';
}

export interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  transactionAlerts: boolean;
  priceAlerts: boolean;
  securityAlerts: boolean;
  promotions: boolean;
}

/**
 * Register device for push notifications
 */
export const registerForPushNotifications = async (): Promise<string | null> => {
  try {
    if (!Device.isDevice) {
      console.log('Push notifications only work on physical devices');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push notification permissions');
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;

    // Register token with backend
    await api.post('/api/notifications/register', {
      token,
      platform: Platform.OS,
      deviceId: Device.deviceName,
    });

    return token;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
};

/**
 * Get all notifications
 */
export const getNotifications = async (
  limit: number = 20,
  offset: number = 0
): Promise<PushNotification[]> => {
  try {
    const response = await api.get<PushNotification[]>('/api/notifications', {
      params: { limit, offset },
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch notifications:', error);
    throw {
      message: error?.data?.message || error?.message || 'Failed to fetch notifications',
      error,
    };
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    await api.put(`/api/notifications/${notificationId}/read`);
  } catch (error: any) {
    console.error('Failed to mark notification as read:', error);
    throw {
      message: error?.data?.message || error?.message || 'Failed to update notification',
      error,
    };
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    await api.put('/api/notifications/read-all');
  } catch (error: any) {
    console.error('Failed to mark all notifications as read:', error);
    throw {
      message: error?.data?.message || error?.message || 'Failed to update notifications',
      error,
    };
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await api.delete(`/api/notifications/${notificationId}`);
  } catch (error: any) {
    console.error('Failed to delete notification:', error);
    throw {
      message: error?.data?.message || error?.message || 'Failed to delete notification',
      error,
    };
  }
};

/**
 * Get notification preferences
 */
export const getNotificationPreferences = async (): Promise<NotificationPreferences> => {
  try {
    const response = await api.get<NotificationPreferences>('/api/notifications/preferences');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch notification preferences:', error);
    throw {
      message: error?.data?.message || error?.message || 'Failed to fetch preferences',
      error,
    };
  }
};

/**
 * Update notification preferences
 */
export const updateNotificationPreferences = async (
  preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences> => {
  try {
    const response = await api.put<NotificationPreferences>(
      '/api/notifications/preferences',
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
 * Create price alert
 */
export const createPriceAlert = async (params: {
  symbol: string;
  condition: 'above' | 'below';
  targetPrice: number;
}): Promise<{ success: boolean; alertId: string }> => {
  try {
    const response = await api.post<{ success: boolean; alertId: string }>(
      '/api/notifications/price-alerts',
      params
    );
    return response.data;
  } catch (error: any) {
    console.error('Failed to create price alert:', error);
    throw {
      message: error?.data?.message || error?.message || 'Failed to create price alert',
      error,
    };
  }
};

/**
 * Get price alerts
 */
export const getPriceAlerts = async () => {
  try {
    const response = await api.get('/api/notifications/price-alerts');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch price alerts:', error);
    throw {
      message: error?.data?.message || error?.message || 'Failed to fetch price alerts',
      error,
    };
  }
};

/**
 * Delete price alert
 */
export const deletePriceAlert = async (alertId: string): Promise<void> => {
  try {
    await api.delete(`/api/notifications/price-alerts/${alertId}`);
  } catch (error: any) {
    console.error('Failed to delete price alert:', error);
    throw {
      message: error?.data?.message || error?.message || 'Failed to delete price alert',
      error,
    };
  }
};
