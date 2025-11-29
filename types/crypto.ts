export interface CryptoToken {
  symbol: string;
  name: string;
  balance: string;
  usdValue: string;
  icon: string;
  color: string;
  decimals: number;
}

export interface CryptoAction {
  id: string;
  title: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
  onPress: () => void;
}

export interface TransactionHistoryItem {
  id: string;
  type: 'reward' | 'transfer' | 'swap' | 'deposit' | 'withdraw';
  amount: string;
  currency: string;
  date: string;
  time: string;
  description: string;
}

export interface RewardInfo {
  amount: string;
  currency: string;
  expiryDate: string;
  description: string;
}

export interface TokenScreenProps {
  token: CryptoToken;
  rewards?: RewardInfo;
  transactions?: TransactionHistoryItem[];
  showBinancePay?: boolean;
  showDepositCode?: boolean;
}