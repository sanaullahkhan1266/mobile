import { api, setAuthToken, clearAuthToken } from '@/utils/apiClient';
import { API_ENDPOINTS } from '@/constants/api';

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    walletAddresses: {
      bnb: string;
      eth: string;
      arb: string;
      poly: string;
      tron: string;
      btc: string;
    };
  };
}

export interface TwoFactorResponse {
  requiresTwoFactor: boolean;
  email?: string;
}

/**
 * Sign up a new user with the backend
 * Requires OTP verification
 */
export const signupWithBackend = async (data: SignupData): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post<{ success: boolean; message: string }>(API_ENDPOINTS.AUTH.SIGNUP, {
      name: data.name,
      email: data.email,
      password: data.password,
    });
    return response.data;
  } catch (error) {
    console.error('Backend signup failed:', error);
    throw error;
  }
};

/**
 * Send OTP to email for verification
 */
export const sendOTP = async (email: string, otp: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post<{ success: boolean; message: string }>(
      API_ENDPOINTS.AUTH.SEND_OTP,
      { email, otp }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to send OTP:', error);
    throw error;
  }
};

/**
 * Login with the backend
 * If 2FA is enabled, requiresTwoFactor will be true
 */
export const loginWithBackend = async (data: LoginData): Promise<AuthResponse | TwoFactorResponse> => {
  try {
    const response = await api.post<AuthResponse | TwoFactorResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        email: data.email,
        password: data.password,
      }
    );

    // If 2FA is required, don't set token yet
    if ('requiresTwoFactor' in response.data) {
      return response.data;
    }

    // Normal login - set token
    const authResponse = response.data as AuthResponse;
    if (authResponse.token) {
      await setAuthToken(authResponse.token);
    }

    return authResponse;
  } catch (error) {
    console.error('Backend login failed:', error);
    throw error;
  }
};

/**
 * Logout from the backend
 */
export const logoutFromBackend = async (): Promise<void> => {
  try {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    await clearAuthToken();
  } catch (error) {
    console.error('Backend logout failed:', error);
    // Still clear token locally even if backend call fails
    await clearAuthToken();
  }
};

/**
 * Verify 2FA code and complete login
 */
export const verifyTwoFactor = async (email: string, code: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.TWO_FACTOR.VERIFY, {
      email,
      code,
    });

    if (response.data.token) {
      await setAuthToken(response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error('2FA verification failed:', error);
    throw error;
  }
};

/**
 * Enable 2FA for the current user
 */
export const enableTwoFactor = async (): Promise<{ secret: string; qrCode: string }> => {
  try {
    const response = await api.post<{ secret: string; qrCode: string }>(
      API_ENDPOINTS.TWO_FACTOR.ENABLE
    );
    return response.data;
  } catch (error) {
    console.error('2FA enable failed:', error);
    throw error;
  }
};

/**
 * Disable 2FA for the current user
 */
export const disableTwoFactor = async (code: string): Promise<void> => {
  try {
    await api.post(API_ENDPOINTS.TWO_FACTOR.DISABLE, { code });
  } catch (error) {
    console.error('2FA disable failed:', error);
    throw error;
  }
};

/**
 * Request password reset - sends OTP to email
 */
export const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post<{ success: boolean; message: string }>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email }
    );
    return response.data;
  } catch (error) {
    console.error('Forgot password request failed:', error);
    throw error;
  }
};

/**
 * Reset password with verification ID and new password
 */
export const resetPassword = async (id: string, password: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post<{ success: boolean; message: string }>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      { id, password }
    );
    return response.data;
  } catch (error) {
    console.error('Password reset failed:', error);
    throw error;
  }
};

