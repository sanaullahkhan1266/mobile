import AsyncStorage from '@react-native-async-storage/async-storage';

export type KycStatus = 'not_started' | 'in_progress' | 'submitted' | 'approved' | 'rejected';

export interface KycPersonalInfo {
  firstName?: string;
  lastName?: string;
  dob?: string; // YYYY-MM-DD
  phoneCountryCode?: string; // e.g. +92
  phoneNumber?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

export interface KycDocumentInfo {
  type?: 'passport' | 'id' | 'driver_license';
  frontUploaded?: boolean;
  backUploaded?: boolean;
  frontUri?: string; // local file uri
  backUri?: string; // local file uri
}

export interface KycState {
  status: KycStatus;
  country?: string; // readable country name
  countryCode?: string; // ISO 3166-1 alpha-2, e.g. PK
  dialCode?: string; // +92
  personal?: KycPersonalInfo;
  document?: KycDocumentInfo;
  selfieDone?: boolean;
  selfieUri?: string;
  attempts?: number; // identity verification attempts used
  maxAttempts?: number; // default 3
}

const KYC_KEY = 'kyc.state.v1';
const DEFAULT_MAX_ATTEMPTS = 3;

class KycService {
  async getState(): Promise<KycState> {
    try {
      const raw = await AsyncStorage.getItem(KYC_KEY);
      if (!raw) return { status: 'not_started', attempts: 0, maxAttempts: DEFAULT_MAX_ATTEMPTS };
      const parsed = JSON.parse(raw) as KycState;
      return { attempts: 0, maxAttempts: DEFAULT_MAX_ATTEMPTS, ...parsed };
    } catch (e) {
      return { status: 'not_started', attempts: 0, maxAttempts: DEFAULT_MAX_ATTEMPTS };
    }
  }

  async save(partial: Partial<KycState>): Promise<KycState> {
    const current = await this.getState();
    const next: KycState = { ...current, ...partial } as KycState;
    if (next.status === 'not_started') next.status = 'in_progress';
    if (typeof next.attempts !== 'number') next.attempts = current.attempts ?? 0;
    if (typeof next.maxAttempts !== 'number') next.maxAttempts = current.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
    await AsyncStorage.setItem(KYC_KEY, JSON.stringify(next));
    return next;
  }

  async incrementAttempts(): Promise<KycState> {
    const current = await this.getState();
    const attempts = Math.min((current.attempts ?? 0) + 1, current.maxAttempts ?? DEFAULT_MAX_ATTEMPTS);
    return this.save({ attempts });
  }

  async reset(): Promise<void> {
    await AsyncStorage.removeItem(KYC_KEY);
  }

  computeProgress(state: KycState): number {
    const steps = [
      !!state.country,
      !!(state.personal?.firstName && state.personal?.lastName && state.personal?.dob && state.personal?.phoneNumber),
      !!state.document?.type,
      !!(state.document?.frontUploaded && state.document?.backUploaded),
      !!state.selfieDone,
    ];
    const done = steps.filter(Boolean).length;
    return Math.round((done / steps.length) * 100);
  }
}

const kycService = new KycService();
export default kycService;
