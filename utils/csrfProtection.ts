import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';

/**
 * CSRF Protection Service
 * Generates and manages CSRF tokens for state-changing requests
 */
class CSRFProtection {
    private csrfToken: string | null = null;
    private readonly CSRF_KEY = 'csrf_token';

    /**
     * Generate a new CSRF token
     */
    async generateCSRFToken(): Promise<string> {
        // Generate a cryptographically secure random token
        this.csrfToken = uuidv4();

        try {
            await SecureStore.setItemAsync(this.CSRF_KEY, this.csrfToken);
        } catch (error) {
            console.error('Failed to store CSRF token:', error);
        }

        return this.csrfToken;
    }

    /**
     * Get the current CSRF token (generates if not exists)
     */
    async getCSRFToken(): Promise<string> {
        // Return cached token if available
        if (this.csrfToken) {
            return this.csrfToken;
        }

        // Try to retrieve from secure storage
        try {
            this.csrfToken = await SecureStore.getItemAsync(this.CSRF_KEY);
        } catch (error) {
            console.error('Failed to retrieve CSRF token:', error);
        }

        // Generate new token if none exists
        if (!this.csrfToken) {
            this.csrfToken = await this.generateCSRFToken();
        }

        return this.csrfToken;
    }

    /**
     * Clear the CSRF token (e.g., on logout)
     */
    async clearCSRFToken(): Promise<void> {
        this.csrfToken = null;

        try {
            await SecureStore.deleteItemAsync(this.CSRF_KEY);
        } catch (error) {
            console.error('Failed to clear CSRF token:', error);
        }
    }

    /**
     * Rotate CSRF token (e.g., after sensitive operations)
     */
    async rotateCSRFToken(): Promise<string> {
        await this.clearCSRFToken();
        return await this.generateCSRFToken();
    }
}

// Export singleton instance
export const csrfProtection = new CSRFProtection();
export default csrfProtection;
