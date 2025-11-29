import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Security Configuration for FinTech Application
 * Contains all security-related constants and policies
 * PCI DSS Level 1 Compliance Ready
 */

export enum SecurityLevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4,
}

export enum AuthMethod {
  PASSWORD = 'password',
  BIOMETRIC = 'biometric',
  PIN = 'pin',
  TWO_FACTOR = '2fa',
}

// Security Policies Configuration
export const SECURITY_CONFIG = {
  // Authentication Settings
  AUTH: {
    SESSION_TIMEOUT: 15 * 60 * 1000, // 15 minutes
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 30 * 60 * 1000, // 30 minutes
    PASSWORD_MIN_LENGTH: 12,
    PASSWORD_COMPLEXITY: {
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      minSpecialChars: 2,
    },
    PIN_LENGTH: 6,
    BIOMETRIC_TIMEOUT: 30 * 1000, // 30 seconds
    TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
    MFA_REQUIRED_FOR: ['transfer', 'settings_change', 'account_access'],
  },

  // API Security Settings
  API: {
    REQUEST_TIMEOUT: 30000, // 30 seconds
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second base delay
    RATE_LIMIT: {
      MAX_REQUESTS: 100,
      WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    },
    REQUEST_SIZE_LIMIT: 10 * 1024 * 1024, // 10MB
    ALLOWED_CONTENT_TYPES: [
      'application/json',
      'application/x-www-form-urlencoded',
      'multipart/form-data',
    ],
  },

  // Data Protection Settings
  DATA: {
    ENCRYPTION_ALGORITHM: 'AES-256-GCM',
    KEY_DERIVATION: 'PBKDF2',
    SALT_LENGTH: 32,
    IV_LENGTH: 16,
    TAG_LENGTH: 16,
    ITERATION_COUNT: 100000,
    SECURE_RANDOM_LENGTH: 32,
    BACKUP_ENCRYPTION: true,
    DATA_RETENTION_DAYS: 2555, // 7 years for financial data
  },

  // Network Security Settings
  NETWORK: {
    SSL_PINNING: true,
    CERTIFICATE_VALIDATION: true,
    HSTS_ENABLED: true,
    TLS_MIN_VERSION: '1.3',
    CIPHER_SUITES: [
      'TLS_AES_256_GCM_SHA384',
      'TLS_CHACHA20_POLY1305_SHA256',
      'TLS_AES_128_GCM_SHA256',
    ],
    ALLOWED_DOMAINS: [
      'api.coingecko.com',
      'api.coincap.io',
      'api.exchangerate-api.com',
      // Add your backend domains here
    ],
  },

  // Logging and Monitoring
  MONITORING: {
    ENABLE_SECURITY_LOGS: true,
    LOG_LEVEL: __DEV__ ? 'DEBUG' : 'ERROR',
    MAX_LOG_SIZE: 50 * 1024 * 1024, // 50MB
    LOG_RETENTION_DAYS: 90,
    ANOMALY_DETECTION: true,
    FAILED_LOGIN_THRESHOLD: 3,
    SUSPICIOUS_ACTIVITY_PATTERNS: [
      'multiple_failed_logins',
      'unusual_transaction_amount',
      'new_device_login',
      'rapid_api_calls',
      'invalid_input_patterns',
    ],
  },

  // Privacy Settings
  PRIVACY: {
    DATA_ANONYMIZATION: true,
    PII_ENCRYPTION: true,
    GDPR_COMPLIANCE: true,
    CCPA_COMPLIANCE: true,
    DATA_MINIMIZATION: true,
    CONSENT_REQUIRED_FOR: [
      'analytics',
      'marketing',
      'third_party_sharing',
      'location_services',
      'biometric_data',
    ],
  },

  // Transaction Security
  TRANSACTIONS: {
    MAX_DAILY_LIMIT: 50000, // $50,000
    MAX_SINGLE_TRANSACTION: 10000, // $10,000
    REQUIRE_2FA_ABOVE: 1000, // $1,000
    VELOCITY_CHECKS: true,
    FRAUD_DETECTION: true,
    TRANSACTION_SIGNING: true,
    CONFIRMATION_TIMEOUT: 300, // 5 minutes
    ALLOWED_CURRENCIES: ['USD', 'EUR', 'GBP', 'BTC', 'ETH'],
  },

  // Device Security
  DEVICE: {
    JAILBREAK_DETECTION: true,
    DEBUG_DETECTION: true,
    EMULATOR_DETECTION: true,
    HOOK_DETECTION: true,
    SCREEN_RECORDING_PREVENTION: true,
    SCREENSHOT_PREVENTION: true,
    COPY_PASTE_RESTRICTION: true,
    KEYBOARD_CACHE_DISABLED: true,
    BACKGROUND_TASK_ENCRYPTION: true,
  },

  // Compliance Settings
  COMPLIANCE: {
    PCI_DSS_LEVEL: 1,
    SOX_COMPLIANT: true,
    GDPR_COMPLIANT: true,
    CCPA_COMPLIANT: true,
    ISO_27001: true,
    AUDIT_LOGGING: true,
    DATA_CLASSIFICATION: {
      PUBLIC: 0,
      INTERNAL: 1,
      CONFIDENTIAL: 2,
      RESTRICTED: 3,
    },
  },
} as const;

// Environment-specific security overrides
export const getSecurityConfig = () => {
  // Deep clone to avoid readonly mutations from `as const`
  const baseConfig: any = JSON.parse(JSON.stringify(SECURITY_CONFIG));
  
  if (__DEV__) {
    // Development overrides (less strict for debugging)
    baseConfig.AUTH.SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour
    baseConfig.AUTH.MAX_LOGIN_ATTEMPTS = 10;
    baseConfig.DEVICE.JAILBREAK_DETECTION = false;
    baseConfig.DEVICE.DEBUG_DETECTION = false;
    baseConfig.DEVICE.EMULATOR_DETECTION = false;
  }

  if (Platform.OS === 'web') {
    // Web-specific security adjustments
    baseConfig.AUTH.BIOMETRIC_TIMEOUT = 0; // Not available on web
    baseConfig.DEVICE.JAILBREAK_DETECTION = false;
    baseConfig.DEVICE.SCREEN_RECORDING_PREVENTION = false;
  }

  return baseConfig;
};

// Security Headers for API Requests
export const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

// Sensitive Data Fields (for encryption/masking)
export const SENSITIVE_FIELDS = [
  'password',
  'pin',
  'token',
  'ssn',
  'cardNumber',
  'cvv',
  'expiryDate',
  'bankAccount',
  'routingNumber',
  'privateKey',
  'seed',
  'mnemonic',
  'biometricData',
  'location',
  'ipAddress',
  'deviceId',
] as const;

// Allowed file types for uploads
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'text/plain',
] as const;

// Maximum file size for uploads (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Security Event Types
export enum SecurityEventType {
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILURE = 'login_failure',
  LOGOUT = 'logout',
  ACCOUNT_LOCKED = 'account_locked',
  PASSWORD_CHANGED = 'password_changed',
  BIOMETRIC_ENROLLED = 'biometric_enrolled',
  TRANSACTION_CREATED = 'transaction_created',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  API_ERROR = 'api_error',
  SECURITY_VIOLATION = 'security_violation',
  DATA_EXPORT = 'data_export',
  SETTINGS_CHANGED = 'settings_changed',
}

// Error Codes (for secure error handling)
export enum SecureErrorCode {
  AUTHENTICATION_FAILED = 'AUTH_001',
  AUTHORIZATION_DENIED = 'AUTH_002',
  SESSION_EXPIRED = 'AUTH_003',
  ACCOUNT_LOCKED = 'AUTH_004',
  INVALID_INPUT = 'VAL_001',
  RATE_LIMITED = 'API_001',
  NETWORK_ERROR = 'NET_001',
  ENCRYPTION_FAILED = 'SEC_001',
  DEVICE_COMPROMISED = 'SEC_002',
  TRANSACTION_FAILED = 'TXN_001',
  COMPLIANCE_VIOLATION = 'COM_001',
  UNKNOWN_ERROR = 'UNK_001',
}

export default SECURITY_CONFIG;