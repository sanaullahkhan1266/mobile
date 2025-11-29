/**
 * Central export file for all API services
 * Import from here for cleaner imports in components
 */

// Auth Service
export * from './authService';
export * as authService from './authService';

// Payment Service
export * from './paymentService';
export * as paymentService from './paymentService';

// Card Service
export * from './cardService';
export * as cardService from './cardService';

// Transaction Service
export * from './transactionService';
export * as transactionService from './transactionService';

// 2FA Service
export * from './twoFactorService';
export * as twoFactorService from './twoFactorService';

// Clerk Auth Service (if needed)
export * from './clerkAuthService';

// Re-export common types
export type {
  SignupData,
  LoginData,
  AuthResponse,
  TwoFactorResponse,
} from './authService';

export type {
  WalletAddresses,
  BalanceInfo,
  PaymentRequest,
  Recipient,
  TransactionRecord,
  PriceData,
} from './paymentService';

export type {
  Card,
  CardTransaction,
  CreateCardParams,
  FundCardParams,
} from './cardService';

export type {
  SendTransactionParams,
  Transaction,
  TransactionResponse,
} from './transactionService';

export type {
  TwoFactorSetupResponse,
  TwoFactorStatus,
} from './twoFactorService';