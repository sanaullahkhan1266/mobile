import React, { useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import TokenWallet from '@/components/TokenWallet';
import { CryptoToken } from '@/types/crypto';

const fallbackColors: Record<string, string> = {
  BTC: '#F7931A', ETH: '#627EEA', USDT: '#26A17B', USDC: '#2775CA', BNB: '#F3BA2F', XRP: '#23292F', SOL: '#9945FF', TON: '#0098EA', TRX: '#E51A1A'
};

export default function GenericTokenScreen() {
  const params = useLocalSearchParams<{ symbol?: string; name?: string }>();
  const symbol = (params.symbol || '').toString().toUpperCase();
  const name = (params.name || symbol).toString();

  const token: CryptoToken = useMemo(() => ({
    symbol,
    name,
    balance: '0.00',
    usdValue: '0.00',
    icon: 'ellipse',
    color: fallbackColors[symbol] || '#2C2C2E',
    decimals: 8,
  }), [symbol, name]);

  return (
    <TokenWallet token={token} transactions={[]} />
  );
}
