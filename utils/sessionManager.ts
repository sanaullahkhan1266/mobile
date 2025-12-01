import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { clearAuthToken, setAuthToken } from './apiClient';

/**
 * User session data interface
 */
export interface SessionData {
    userId: string;
    email: string;
    name: string;
    loginTime: number;
    expiresAt: number;
    deviceId?: string;
    lastActivity?: number;
}

/**
 * Session Manager
 * Handles user session persistence and restoration across app restarts
 */
export class SessionManager {
    private static SESSION_KEY = 'user_session';
    private static SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
    private static ACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

    /**
     * Save user session data
     */
    static async saveSession(userData: Omit<SessionData, 'loginTime' | 'expiresAt' | 'lastActivity'>): Promise<void> {
        try {
            const sessionData: SessionData = {
                ...userData,
                loginTime: Date.now(),
                expiresAt: Date.now() + this.SESSION_DURATION,
                lastActivity: Date.now(),
            };

            await AsyncStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
            console.log('✅ Session saved successfully');
        } catch (error) {
            console.error('Failed to save session:', error);
            throw error;
        }
    }

    /**
     * Get current session data
     */
    static async getSession(): Promise<SessionData | null> {
        try {
            const data = await AsyncStorage.getItem(this.SESSION_KEY);
            if (!data) {
                return null;
            }

            const session: SessionData = JSON.parse(data);

            // Check if session is expired
            if (Date.now() > session.expiresAt) {
                console.log('⚠️ Session expired');
                await this.clearSession();
                return null;
            }

            return session;
        } catch (error) {
            console.error('Failed to get session:', error);
            return null;
        }
    }

    /**
     * Update last activity timestamp
     */
    static async updateActivity(): Promise<void> {
        try {
            const session = await this.getSession();
            if (!session) return;

            session.lastActivity = Date.now();
            await AsyncStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        } catch (error) {
            console.error('Failed to update activity:', error);
        }
    }

    /**
     * Check if session is active (not timed out due to inactivity)
     */
    static async isSessionActive(): Promise<boolean> {
        try {
            const session = await this.getSession();
            if (!session) return false;

            const timeSinceActivity = Date.now() - (session.lastActivity || session.loginTime);

            if (timeSinceActivity > this.ACTIVITY_TIMEOUT) {
                console.log('⚠️ Session timed out due to inactivity');
                await this.clearSession();
                return false;
            }

            return true;
        } catch (error) {
            console.error('Failed to check session activity:', error);
            return false;
        }
    }

    /**
     * Restore user session on app startup
     */
    static async restoreSession(): Promise<boolean> {
        try {
            const session = await this.getSession();
            if (!session) {
                console.log('ℹ️ No session to restore');
                return false;
            }

            // Check if session is still active
            if (!(await this.isSessionActive())) {
                return false;
            }

            // Try to get auth token
            const token = await SecureStore.getItemAsync('authToken');
            if (!token) {
                console.log('⚠️ Session exists but token missing');
                await this.clearSession();
                return false;
            }

            // Restore auth state
            await setAuthToken(token);
            await this.updateActivity();

            console.log('✅ Session restored successfully');
            console.log('👤 User:', session.email);

            return true;
        } catch (error) {
            console.error('Failed to restore session:', error);
            return false;
        }
    }

    /**
     * Clear user session
     */
    static async clearSession(): Promise<void> {
        try {
            await AsyncStorage.removeItem(this.SESSION_KEY);
            await clearAuthToken();
            console.log('✅ Session cleared');
        } catch (error) {
            console.error('Failed to clear session:', error);
        }
    }

    /**
     * Extend session expiry time
     */
    static async extendSession(): Promise<void> {
        try {
            const session = await this.getSession();
            if (!session) return;

            session.expiresAt = Date.now() + this.SESSION_DURATION;
            session.lastActivity = Date.now();

            await AsyncStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
            console.log('✅ Session extended');
        } catch (error) {
            console.error('Failed to extend session:', error);
        }
    }

    /**
     * Get session time remaining (in milliseconds)
     */
    static async getTimeRemaining(): Promise<number> {
        try {
            const session = await this.getSession();
            if (!session) return 0;

            return Math.max(0, session.expiresAt - Date.now());
        } catch (error) {
            console.error('Failed to get time remaining:', error);
            return 0;
        }
    }

    /**
     * Check if session will expire soon (within 24 hours)
     */
    static async isExpiringSoon(): Promise<boolean> {
        try {
            const timeRemaining = await this.getTimeRemaining();
            return timeRemaining > 0 && timeRemaining < 24 * 60 * 60 * 1000;
        } catch (error) {
            console.error('Failed to check expiry:', error);
            return false;
        }
    }
}

export default SessionManager;
