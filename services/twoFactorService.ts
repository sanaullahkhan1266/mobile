import { api } from '@/utils/apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TwoFactorSetupResponse {
  secret: string;
  qrCode: string;
  backupCodes?: string[];
}

export interface TwoFactorStatus {
  enabled: boolean;
  method?: 'totp' | 'sms' | 'email';
  lastVerified?: string;
}

/**
 * Enable 2FA for the current user
 * Returns QR code and secret for authenticator app setup
 */
export const enable2FA = async (): Promise<TwoFactorSetupResponse> => {
  try {
    const response = await api.post<TwoFactorSetupResponse>(
      API_ENDPOINTS.TWO_FACTOR.ENABLE
    );
    
    // Store backup codes securely if provided
    if (response.data.backupCodes) {
      await AsyncStorage.setItem(
        '2fa_backup_codes',
        JSON.stringify(response.data.backupCodes)
      );
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Failed to enable 2FA:', error);
    throw {
      message: error?.data?.message || error?.message || 'Failed to enable 2FA',
      error
    };
  }
};

/**
 * Disable 2FA for the current user
 * Requires verification code
 */
export const disable2FA = async (code: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post<{ success: boolean; message: string }>(
      API_ENDPOINTS.TWO_FACTOR.DISABLE,
      { code }
    );
    
    // Clear stored backup codes
    await AsyncStorage.removeItem('2fa_backup_codes');
    
    return response.data;
  } catch (error: any) {
    console.error('Failed to disable 2FA:', error);
    throw {
      message: error?.data?.message || error?.message || 'Failed to disable 2FA',
      error
    };
  }
};

/**
 * Verify 2FA code
 * Used during login or sensitive operations
 */
export const verify2FA = async (email: string, code: string): Promise<{ 
  success: boolean; 
  token?: string;
  message?: string;
}> => {
  try {
    const response = await api.post<{ 
      success: boolean; 
      token?: string;
      message?: string;
    }>(
      API_ENDPOINTS.TWO_FACTOR.VERIFY,
      { email, code }
    );
    
    return response.data;
  } catch (error: any) {
    console.error('Failed to verify 2FA code:', error);
    throw {
      message: error?.data?.message || error?.message || 'Invalid verification code',
      error
    };
  }
};

/**
 * Get 2FA status for current user
 * This endpoint might not exist, so it's optional
 */
export const get2FAStatus = async (): Promise<TwoFactorStatus> => {
  try {
    const response = await api.get<TwoFactorStatus>(
      `${API_ENDPOINTS.TWO_FACTOR.ENABLE}/status`
    );
    return response.data;
  } catch (error: any) {
    console.error('Failed to get 2FA status:', error);
    // Default to disabled if endpoint doesn't exist
    return { enabled: false };
  }
};

/**
 * Generate new backup codes
 * Requires current 2FA code for verification
 */
export const generateBackupCodes = async (code: string): Promise<string[]> => {
  try {
    const response = await api.post<{ backupCodes: string[] }>(
      `${API_ENDPOINTS.TWO_FACTOR.ENABLE}/backup-codes`,
      { code }
    );
    
    // Store new backup codes
    if (response.data.backupCodes) {
      await AsyncStorage.setItem(
        '2fa_backup_codes',
        JSON.stringify(response.data.backupCodes)
      );
    }
    
    return response.data.backupCodes;
  } catch (error: any) {
    console.error('Failed to generate backup codes:', error);
    throw {
      message: error?.data?.message || error?.message || 'Failed to generate backup codes',
      error
    };
  }
};

/**
 * Get stored backup codes from local storage
 */
export const getStoredBackupCodes = async (): Promise<string[] | null> => {
  try {
    const codes = await AsyncStorage.getItem('2fa_backup_codes');
    return codes ? JSON.parse(codes) : null;
  } catch (error) {
    console.error('Failed to retrieve backup codes:', error);
    return null;
  }
};

/**
 * Verify using backup code instead of TOTP
 */
export const verifyWithBackupCode = async (
  email: string, 
  backupCode: string
): Promise<{ success: boolean; token?: string; message?: string }> => {
  try {
    const response = await api.post<{ 
      success: boolean; 
      token?: string;
      message?: string;
    }>(
      `${API_ENDPOINTS.TWO_FACTOR.VERIFY}/backup`,
      { email, backupCode }
    );
    
    return response.data;
  } catch (error: any) {
    console.error('Failed to verify with backup code:', error);
    throw {
      message: error?.data?.message || error?.message || 'Invalid backup code',
      error
    };
  }
};