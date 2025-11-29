// API Configuration
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://23.22.178.240';

export const API_ENDPOINTS = {
  // Auth Routes
  AUTH: {
    SIGNUP: '/api/auth/signup',
    SEND_OTP: '/api/auth/send-otp',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },

  // Payment Routes
  PAYMENT: {
    CREATE_CHARGE: '/api/payment/charge',
    GET_CHARGE: '/api/payment/charge/:chargeId',
    LIST_CHARGES: '/api/payment/charges',
    CANCEL_CHARGE: '/api/payment/charge/:chargeId/cancel',
    CREATE_CHECKOUT: '/api/payment/checkout',
    WALLET_ADDRESSES: '/api/payment/wallet-addresses',
    GET_BALANCE: '/api/payment/balance',
    RECENT_RECEIVED: '/api/payment/recent-received',
    PAYMENT_REQUESTS: '/api/payment/requests',
    RECIPIENTS: '/api/payment/recipients',
    EXCHANGE_HISTORY: '/api/payment/exchange-history',
    WEBHOOK: '/api/payment/webhook',
  },

  // Card Routes
  CARD: {
    CREATE: '/api/card/create',
    LIST: '/api/card/list',
    GET: '/api/card/:cardId',
    TOGGLE_FREEZE: '/api/card/:cardId/freeze',
    TERMINATE: '/api/card/:cardId',
    FUND: '/api/card/:cardId/fund',
    TRANSACTIONS: '/api/card/:cardId/transactions',
    UPDATE_SETTINGS: '/api/card/:cardId/settings',
  },

  // Transaction Routes
  TX: {
    SEND: '/api/tx/send',
    HISTORY: '/api/tx/history',
  },

  // Price Routes
  PRICE: {
    GET_PRICE: '/api/price/:symbol',
    GET_PRICES: '/api/price/prices',
  },

  // 2FA Routes
  TWO_FACTOR: {
    ENABLE: '/api/2fa/enable',
    DISABLE: '/api/2fa/disable',
    VERIFY: '/api/2fa/verify',
  },

  // Health Check
  HEALTH: '/api/health',
};

// API Timeout
export const API_TIMEOUT = 30000; // 30 seconds

// Retry Configuration
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
};

// Supported Chains
export const CHAINS = {
  BNB: 'bnb',
  ETH: 'eth',
  ARB: 'arb',
  POLY: 'poly',
  TRON: 'tron',
  BTC: 'btc',
};

// Supported Currencies
export const CURRENCIES = {
  USDT: 'USDT',
  USDC: 'USDC',
  ETH: 'ETH',
  BTC: 'BTC',
  BNB: 'BNB',
};

// Chain-to-Currency Mapping
export const CHAIN_CURRENCIES = {
  [CHAINS.BNB]: [CURRENCIES.USDT, CURRENCIES.USDC, CURRENCIES.ETH],
  [CHAINS.ETH]: [CURRENCIES.USDT, CURRENCIES.USDC, CURRENCIES.ETH],
  [CHAINS.ARB]: [CURRENCIES.USDT, CURRENCIES.USDC],
  [CHAINS.POLY]: [CURRENCIES.USDC],
  [CHAINS.TRON]: [CURRENCIES.USDT],
  [CHAINS.BTC]: [CURRENCIES.BTC],
};
