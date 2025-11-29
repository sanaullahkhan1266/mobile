import { useAuth } from '@clerk/clerk-expo';
import { setAuthToken } from './apiClient';

/**
 * Helper to get and refresh Clerk JWT token
 * Use this in your API calls to ensure you always have a fresh token
 */
export const useClerkToken = () => {
  const { getToken, isSignedIn } = useAuth();

  /**
   * Get a fresh Clerk JWT token
   * This will automatically refresh if expired
   */
  const getFreshToken = async (): Promise<string | null> => {
    if (!isSignedIn) {
      console.warn('⚠️ User is not signed in to Clerk');
      return null;
    }

    try {
      const token = await getToken();
      if (token) {
        // Update the stored token for API client
        await setAuthToken(token);
        return token;
      }
      return null;
    } catch (error) {
      console.error('❌ Failed to get Clerk token:', error);
      return null;
    }
  };

  return { getFreshToken, isSignedIn };
};

/**
 * Non-hook version for use outside of React components
 * Note: This requires the Clerk session to already be active
 */
export const getClerkTokenNonHook = async (getToken: () => Promise<string | null>): Promise<string | null> => {
  try {
    const token = await getToken();
    if (token) {
      await setAuthToken(token);
      return token;
    }
    return null;
  } catch (error) {
    console.error('❌ Failed to get Clerk token:', error);
    return null;
  }
};
