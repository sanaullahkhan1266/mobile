import { API_BASE_URL } from '@/constants/api';
import * as SecureStore from 'expo-secure-store';

export type KycSubmitResponse = {
  success: boolean;
  message?: string;
  referenceId?: string;
  status?: 'pending' | 'approved' | 'rejected';
};

export type KycStatusResponse = {
  status: 'not_started' | 'pending' | 'approved' | 'rejected';
  message?: string;
  submittedAt?: string;
  reviewedAt?: string;
};

class KycApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Get authorization token for API calls
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      console.log('🔑 Auth token retrieved:', token ? `Yes (${token.substring(0, 20)}...)` : 'No token found');
      return token;
    } catch (error) {
      console.error('❌ Failed to get auth token:', error);
      return null;
    }
  }

  /**
   * Submit KYC documents and information to backend
   */
  async submitKyc(fields: any): Promise<KycSubmitResponse> {
    try {
      console.log('🔐 Checking authentication...');
      const token = await this.getAuthToken();

      if (!token) {
        console.error('❌ No auth token available for KYC submission');
        console.log('💡 Please ensure you are logged in');
        return { success: false, message: 'Authentication required. Please log in again.' };
      }

      console.log('✅ Auth token found, preparing KYC submission...');

      const url = `${this.baseUrl}/api/kyc/submit`;
      const form = new FormData();

      const { document, selfieUri, ...rest } = fields;

      // Append JSON fields
      form.append('personalInfo', JSON.stringify(rest));
      form.append('documentType', document?.type || 'passport');

      // Helper to append files - React Native FormData syntax
      const appendFile = (key: string, uri?: string) => {
        if (!uri) {
          console.log(`⚠️ No URI provided for ${key}`);
          return;
        }

        const fname = uri.split('/').pop() || 'file.jpg';
        const match = /\.(\w+)$/.exec(fname);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        // React Native requires this specific format
        form.append(key, {
          uri: uri,
          name: fname,
          type: type,
        } as any);

        console.log(`✅ Attached ${key}: ${fname}`);
      };

      console.log('📤 Preparing KYC files...');
      appendFile('documentFront', document?.frontUri);
      appendFile('documentBack', document?.backUri);
      appendFile('selfie', selfieUri);

      console.log('📤 Submitting KYC to:', url);
      console.log('📋 Personal Info:', rest);
      console.log('📄 Document Type:', document?.type);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: form,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Request failed');
        console.error('❌ KYC submission failed:', response.status, errorText);
        return {
          success: false,
          message: errorText || `HTTP ${response.status}`
        };
      }

      const data = await response.json();
      console.log('✅ KYC submitted successfully:', data);

      return {
        success: true,
        message: data.message || 'KYC submitted successfully',
        referenceId: data.referenceId,
        status: data.status || 'pending',
      };
    } catch (error: any) {
      console.error('❌ KYC submission error:', error);
      return {
        success: false,
        message: error.message || 'Failed to submit KYC',
      };
    }
  }

  /**
   * Get KYC verification status
   */
  async getKycStatus(): Promise<KycStatusResponse> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        return { status: 'not_started', message: 'Authentication required' };
      }

      const url = `${this.baseUrl}/api/kyc/status`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        return { status: 'not_started', message: 'Failed to fetch status' };
      }

      const data = await response.json();
      return {
        status: data.status || 'not_started',
        message: data.message,
        submittedAt: data.submittedAt,
        reviewedAt: data.reviewedAt,
      };
    } catch (error: any) {
      console.error('KYC status fetch error:', error);
      return {
        status: 'not_started',
        message: error.message || 'Failed to fetch KYC status',
      };
    }
  }

  /**
   * Retry KYC submission if rejected
   */
  async retryKyc(fields: any): Promise<KycSubmitResponse> {
    return this.submitKyc(fields);
  }
}

const kycApiService = new KycApiService();
export default kycApiService;
