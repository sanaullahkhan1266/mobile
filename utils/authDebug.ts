import * as SecureStore from 'expo-secure-store';
import { api } from './apiClient';
import { API_BASE_URL } from '@/constants/api';

/**
 * Debug utility to test authentication status
 * Use this to troubleshoot 401 errors
 */
export const authDebug = {
  /**
   * Check current auth token status
   */
  async checkTokenStatus() {
    console.log('\n🔍 === AUTH DEBUG ===');
    
    try {
      const token = await SecureStore.getItemAsync('authToken');
      
      if (!token) {
        console.log('❌ No token found in SecureStore');
        return { hasToken: false, isValid: false };
      }
      
      if (token.trim() === '') {
        console.log('❌ Empty token found in SecureStore (THIS IS THE BUG!)');
        return { hasToken: false, isValid: false, isEmpty: true };
      }
      
      console.log('✅ Token found:', token.substring(0, 30) + '...');
      console.log('📏 Token length:', token.length);
      
      // Try to decode JWT (basic check)
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          console.log('🔓 Token payload:', {
            sub: payload.sub,
            exp: payload.exp,
            iat: payload.iat,
            expiresAt: new Date(payload.exp * 1000).toISOString(),
            isExpired: Date.now() > payload.exp * 1000
          });
          
          return { 
            hasToken: true, 
            isValid: true, 
            isExpired: Date.now() > payload.exp * 1000,
            payload 
          };
        }
      } catch (e) {
        console.warn('⚠️ Could not decode token:', e);
      }
      
      return { hasToken: true, isValid: true };
    } catch (error) {
      console.error('❌ Error checking token:', error);
      return { hasToken: false, isValid: false, error };
    }
  },

  /**
   * Test API call with current token
   */
  async testApiCall() {
    console.log('\n🧪 Testing API call...');
    
    try {
      const result = await api.get('/api/health');
      console.log('✅ API call successful:', result);
      return { success: true, data: result };
    } catch (error: any) {
      console.error('❌ API call failed:', {
        status: error.statusCode,
        message: error.message,
        url: API_BASE_URL
      });
      return { success: false, error };
    }
  },

  /**
   * Clear auth token (for testing)
   */
  async clearToken() {
    console.log('\n🗑️ Clearing auth token...');
    
    try {
      await SecureStore.deleteItemAsync('authToken');
      console.log('✅ Token cleared successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to clear token:', error);
      return { success: false, error };
    }
  },

  /**
   * Set a test token (for debugging)
   */
  async setTestToken(token: string) {
    console.log('\n🔧 Setting test token...');
    
    try {
      await SecureStore.setItemAsync('authToken', token);
      console.log('✅ Test token set successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to set token:', error);
      return { success: false, error };
    }
  },

  /**
   * Run all checks
   */
  async runFullDiagnostic() {
    console.log('\n🏥 === RUNNING FULL AUTH DIAGNOSTIC ===\n');
    
    const tokenStatus = await this.checkTokenStatus();
    const apiTest = await this.testApiCall();
    
    console.log('\n📊 === DIAGNOSTIC SUMMARY ===');
    console.log('Token present:', tokenStatus.hasToken);
    console.log('Token valid:', tokenStatus.isValid);
    console.log('Token expired:', tokenStatus.isExpired || false);
    console.log('API accessible:', apiTest.success);
    console.log('API URL:', API_BASE_URL);
    
    if (!tokenStatus.hasToken) {
      console.log('\n💡 SOLUTION: Log in to get a token');
    } else if (tokenStatus.isEmpty) {
      console.log('\n💡 SOLUTION: Clear the empty token and log in again');
      console.log('   Run: authDebug.clearToken()');
    } else if (tokenStatus.isExpired) {
      console.log('\n💡 SOLUTION: Token expired, log in again');
    } else if (!apiTest.success) {
      console.log('\n💡 POSSIBLE ISSUES:');
      console.log('   1. Backend not accepting Clerk JWT tokens');
      console.log('   2. Backend authentication middleware not configured');
      console.log('   3. Network connectivity issues');
    } else {
      console.log('\n✅ Everything looks good!');
    }
    
    console.log('\n=== END DIAGNOSTIC ===\n');
    
    return {
      tokenStatus,
      apiTest,
      baseUrl: API_BASE_URL
    };
  }
};

// Make it available globally for debugging
if (__DEV__) {
  (global as any).authDebug = authDebug;
  console.log('\n💡 Auth debug utility available: authDebug.runFullDiagnostic()');
}
