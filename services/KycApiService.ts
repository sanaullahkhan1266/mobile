import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/api';

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
      return await SecureStore.getItemAsync('authToken');
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }

  /**
   * Submit KYC documents and information to backend
   */
  async submitKyc(fields: any): Promise<KycSubmitResponse> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        return { success: false, message: 'Authentication required' };
      }

      // TODO: Backend KYC routes not implemented yet
      // Remove this mock response once backend routes are ready
      console.warn('⚠️ KYC routes not implemented on backend yet');
      return {
        success: true,
        message: 'KYC submitted (mock - backend pending)',
        referenceId: 'MOCK_' + Date.now(),
        status: 'pending'
      };

      /* Uncomment when backend routes are ready:
      const url = `${this.baseUrl}/api/kyc/submit`;
      const form = new FormData();

      const { document, selfieUri, ...rest } = fields;
      
      // Append JSON fields
      form.append('personalInfo', JSON.stringify(rest));
      form.append('documentType', document?.type || 'passport');

      // Helper to append files
      const appendFile = (key: string, uri?: string) => {
        if (!uri) return;
        const name = uri.split('/').pop() || 'file.jpg';
        const type = name.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
        form.append(key, { uri, name, type } as any);
      };

      appendFile('documentFront', document?.frontUri);
      appendFile('documentBack', document?.backUri);
      appendFile('selfie', selfieUri);

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
        return { 
          success: false, 
          message: errorText || `HTTP ${response.status}` 
        };
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || 'KYC submitted successfully',
        referenceId: data.referenceId,
        status: data.status || 'pending',
      };
      */
    } catch (error: any) {
      console.error('KYC submission error:', error);
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

      // TODO: Backend KYC routes not implemented yet
      console.warn('⚠️ KYC routes not implemented on backend yet');
      return {
        status: 'not_started',
        message: 'KYC not yet available (backend pending)'
      };

      /* Uncomment when backend routes are ready:
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
      */
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
