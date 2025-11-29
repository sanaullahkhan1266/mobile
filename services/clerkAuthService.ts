import { useAuth, useSignUp, useSignIn, useSession } from '@clerk/clerk-expo';
import { api, setAuthToken, clearAuthToken } from '@/utils/apiClient';
import { API_ENDPOINTS } from '@/constants/api';

/**
 * WORKING Clerk Authentication Service
 * This version fixes the OAuth error
 */

export interface SignupParams {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

/**
 * Hook-based signup (use in components)
 */
export const useClerkSignup = () => {
  const { signUp, setActive, isLoaded } = useSignUp();
  const { session } = useSession();

  const signup = async (params: SignupParams) => {
    if (!isLoaded || !signUp) {
      throw new Error('Clerk not loaded yet');
    }

    try {
      console.log('🔵 CLERK SIGNUP:', params.email);

      // Create user in Clerk
      const result = await signUp.create({
        emailAddress: params.email,
        password: params.password,
        firstName: params.firstName,
        lastName: params.lastName || '',
      });

      console.log('✅ CLERK USER CREATED:', result.status);

      // Send verification email
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      console.log('✅ VERIFICATION EMAIL SENT');

      return {
        success: true,
        message: 'Verification code sent to email',
        signUpAttempt: result,
      };
    } catch (error: any) {
      console.error('❌ CLERK SIGNUP ERROR:', error);
      throw {
        message: error.errors?.[0]?.message || error.message || 'Signup failed',
        statusCode: 400,
      };
    }
  };

  const verifyEmail = async (code: string) => {
    if (!signUp) {
      throw new Error('No signup attempt found');
    }

    try {
      console.log('🔵 VERIFYING EMAIL CODE:', code);

      const result = await signUp.attemptEmailAddressVerification({ code });

      console.log('✅ EMAIL VERIFICATION RESULT:', result.status);

      if (result.status === 'complete') {
        // Set active session
        await setActive({ session: result.createdSessionId });

        // Get Clerk JWT token from the active session
        // Wait a moment for the session to become active
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (session) {
          try {
            const token = await session.getToken();
            if (token) {
              await setAuthToken(token);
              console.log('✅ TOKEN SAVED:', token.substring(0, 20) + '...');
            } else {
              console.warn('⚠️ No token received from Clerk session');
            }
          } catch (tokenError) {
            console.error('❌ Token retrieval failed:', tokenError);
          }
        } else {
          console.warn('⚠️ No active session available after signup');
        }

        return {
          success: true,
          message: 'Email verified successfully',
          user: {
            id: result.id,
            email: result.emailAddresses[0].emailAddress,
            name: `${result.firstName} ${result.lastName || ''}`.trim(),
          },
        };
      }

      throw new Error('Email verification incomplete');
    } catch (error: any) {
      console.error('❌ EMAIL VERIFICATION ERROR:', error);
      throw {
        message: error.message || 'Email verification failed',
        statusCode: 400,
      };
    }
  };

  return { signup, verifyEmail, isLoaded };
};

/**
 * Hook-based login (use in components)
 */
export const useClerkLogin = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { session } = useSession();

  const login = async (params: LoginParams) => {
    if (!isLoaded || !signIn) {
      throw new Error('Clerk not loaded yet');
    }

    try {
      console.log('🔵 CLERK LOGIN:', params.email);

      // Sign in with email and password
      const result = await signIn.create({
        identifier: params.email,
        password: params.password,
      });

      console.log('✅ CLERK LOGIN RESULT:', result.status);

      if (result.status === 'complete') {
        // Set active session
        await setActive({ session: result.createdSessionId });

        // Get Clerk JWT token from the active session
        // Wait a moment for the session to become active
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (session) {
          try {
            const token = await session.getToken();
            if (token) {
              await setAuthToken(token);
              console.log('✅ TOKEN SAVED:', token.substring(0, 20) + '...');
            } else {
              console.warn('⚠️ No token received from Clerk session');
            }
          } catch (tokenError) {
            console.error('❌ Token retrieval failed:', tokenError);
          }
        } else {
          console.warn('⚠️ No active session available after login');
        }

        return {
          success: true,
          message: 'Logged in successfully',
          user: {
            id: result.userId,
            email: params.email,
          },
        };
      }

      throw new Error('Login incomplete');
    } catch (error: any) {
      console.error('❌ CLERK LOGIN ERROR:', error);
      throw {
        message: error.errors?.[0]?.message || error.message || 'Login failed',
        statusCode: 401,
      };
    }
  };

  return { login, isLoaded };
};

/**
 * Hook for logout and auth state
 */
export const useClerkAuth = () => {
  const { isLoaded, isSignedIn, user, signOut } = useAuth();

  const logout = async () => {
    try {
      console.log('🔵 CLERK LOGOUT');
      await signOut();
      await clearAuthToken();
      console.log('✅ LOGGED OUT');
    } catch (error: any) {
      console.error('❌ LOGOUT ERROR:', error);
      throw error;
    }
  };

  return {
    isLoaded,
    isSignedIn,
    user,
    logout,
  };
};