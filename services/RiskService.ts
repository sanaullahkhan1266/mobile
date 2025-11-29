import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RiskState {
  attempts: number;
  maxAttempts: number; // default 5
  completed: boolean;
  answers?: Record<string, string>;
}

const KEY = 'risk.state.v1';
const DEFAULT_MAX = 5;

class RiskService {
  async getState(): Promise<RiskState> {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (!raw) return { attempts: 0, maxAttempts: DEFAULT_MAX, completed: false };
      const parsed = JSON.parse(raw) as RiskState;
      return { attempts: 0, maxAttempts: DEFAULT_MAX, completed: false, ...parsed };
    } catch {
      return { attempts: 0, maxAttempts: DEFAULT_MAX, completed: false };
    }
  }

  async save(partial: Partial<RiskState>): Promise<RiskState> {
    const cur = await this.getState();
    const next: RiskState = { ...cur, ...partial };
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
    return next;
  }

  async submitAnswers(answers: Record<string, string>): Promise<RiskState> {
    const cur = await this.getState();
    const attempts = Math.min(cur.attempts + 1, cur.maxAttempts);
    return this.save({ answers, attempts, completed: true });
  }

  async reset(): Promise<void> {
    await AsyncStorage.removeItem(KEY);
  }
}

const riskService = new RiskService();
export default riskService;
