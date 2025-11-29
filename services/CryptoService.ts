import Constants from 'expo-constants';

// Environment variables with fallbacks
const CRYPTO_API_BASE_URL = Constants.expoConfig?.extra?.CRYPTO_API_BASE_URL || process.env.EXPO_PUBLIC_CRYPTO_API_BASE_URL || 'https://api.coingecko.com/api/v3';
const CRYPTO_API_BACKUP_URL = Constants.expoConfig?.extra?.CRYPTO_API_BACKUP_URL || process.env.EXPO_PUBLIC_CRYPTO_API_BACKUP_URL || 'https://api.coincap.io/v2';
const CURRENCY_API_BASE_URL = Constants.expoConfig?.extra?.CURRENCY_API_BASE_URL || process.env.EXPO_PUBLIC_CURRENCY_API_BASE_URL || 'https://api.exchangerate-api.com/v4/latest';
const API_TIMEOUT = Number(Constants.expoConfig?.extra?.API_TIMEOUT || process.env.EXPO_PUBLIC_REQUEST_TIMEOUT || '10000');
const MAX_RETRY_ATTEMPTS = Number(Constants.expoConfig?.extra?.MAX_RETRY_ATTEMPTS || process.env.EXPO_PUBLIC_MAX_RETRY_ATTEMPTS || '3');
const CACHE_DURATION = Number(Constants.expoConfig?.extra?.API_CACHE_DURATION || process.env.EXPO_PUBLIC_API_CACHE_DURATION || '300000'); // 5 minutes

// Types
export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

export interface FiatCurrency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  description?: string;
}

export interface CurrencyBalance {
  currency: string;
  balance: number;
  usdValue: number;
}

// Cache management
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();

  set<T>(key: string, data: T, duration: number = CACHE_DURATION): void {
    const timestamp = Date.now();
    const expiresAt = timestamp + duration;
    this.cache.set(key, { data, timestamp, expiresAt });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  clear(): void {
    this.cache.clear();
  }
}

// API Client with retry logic
class SecureApiClient {
  private cache = new CacheManager();

  private async makeRequest<T>(
    url: string, 
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    const cacheKey = `${url}_${JSON.stringify(options)}`;
    const cachedData = this.cache.get<T>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'EnPaying-Mobile-App/1.0',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: T = await response.json();
      
      // Cache successful responses
      this.cache.set(cacheKey, data);
      
      return data;
    } catch (error: any) {
      // Retry logic
      if (
        retryCount < MAX_RETRY_ATTEMPTS &&
        (error instanceof TypeError || (error as any)?.name === 'AbortError')
      ) {
        console.warn(`API request failed, retrying... (${retryCount + 1}/${MAX_RETRY_ATTEMPTS})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return this.makeRequest<T>(url, options, retryCount + 1);
      }

      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, baseUrl: string = CRYPTO_API_BASE_URL): Promise<T> {
    const url = `${baseUrl}${endpoint}`;
    return this.makeRequest<T>(url, { method: 'GET' });
  }
}

// Main Crypto Service
class CryptoService {
  private api = new SecureApiClient();
  
  // Raw asset (CoinCap) for broader coin list
  public static CoinCapAsset: any;
  
  // Popular cryptocurrencies with their details
  private popularCryptos: Omit<CryptoCurrency, 'current_price' | 'market_cap' | 'price_change_percentage_24h'>[] = [
    {
      id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      image: '🟠'
    },
    {
      id: 'ethereum',
      symbol: 'ETH', 
      name: 'Ethereum',
      image: '⚫'
    },
    {
      id: 'tether',
      symbol: 'USDT',
      name: 'Tether',
      image: '🟢'
    },
    {
      id: 'binancecoin',
      symbol: 'BNB',
      name: 'BNB',
      image: '🟡'
    },
    {
      id: 'ripple',
      symbol: 'XRP',
      name: 'XRP',
      image: '⚫'
    },
    {
      id: 'tron',
      symbol: 'TRX',
      name: 'TRON',
      image: '🔴'
    },
    {
      id: 'the-open-network',
      symbol: 'TON',
      name: 'Toncoin',
      image: '🔵'
    },
    {
      id: 'solana',
      symbol: 'SOL',
      name: 'Solana',
      image: '🟣'
    }
  ];

  // Fiat currencies
  private fiatCurrencies: FiatCurrency[] = [
    {
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      flag: '🇪🇺',
      description: 'IBAN and Swift/BIC'
    },
    {
      code: 'GBP',
      name: 'British Pound',
      symbol: '£',
      flag: '🇬🇧',
      description: 'Sort Code and Account Number'
    },
    {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      flag: '🇺🇸',
      description: 'ACH and Wire Transfer'
    },
    {
      code: 'JPY',
      name: 'Japanese Yen',
      symbol: '¥',
      flag: '🇯🇵',
      description: 'Bank Transfer'
    }
  ];

  async getCryptocurrencies(): Promise<CryptoCurrency[]> {
    try {
      const cryptoIds = this.popularCryptos.map(c => c.id).join(',');
      const endpoint = `/simple/price?ids=${cryptoIds}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`;
      
      const priceData = await this.api.get<Record<string, {
        usd: number;
        usd_market_cap: number;
        usd_24h_change: number;
      }>>(endpoint);

      return this.popularCryptos.map(crypto => ({
        ...crypto,
        current_price: priceData[crypto.id]?.usd || 0,
        market_cap: priceData[crypto.id]?.usd_market_cap || 0,
        price_change_percentage_24h: priceData[crypto.id]?.usd_24h_change || 0,
      }));
    } catch (error) {
      console.error('Failed to fetch cryptocurrency data:', error);
      // Return static data as fallback
      return this.popularCryptos.map(crypto => ({
        ...crypto,
        current_price: 0,
        market_cap: 0,
        price_change_percentage_24h: 0,
      }));
    }
  }

  // Fetch a broad list of coins (top N by market cap) from CoinCap (no key required)
  async getAllCoins(limit: number = 200): Promise<CryptoCurrency[]> {
    try {
      const endpoint = `/assets?limit=${limit}`;
      const data = await this.api.get<{ data: Array<{
        id: string;
        symbol: string;
        name: string;
        priceUsd: string;
        marketCapUsd: string;
        changePercent24Hr: string;
      }>; }>(endpoint, CRYPTO_API_BACKUP_URL);

      return (data?.data || []).map((a) => ({
        id: a.id,
        symbol: (a.symbol || '').toUpperCase(),
        name: a.name,
        image: '',
        current_price: Number(a.priceUsd || '0'),
        market_cap: Number(a.marketCapUsd || '0'),
        price_change_percentage_24h: Number(a.changePercent24Hr || '0'),
      }));
    } catch (error) {
      console.error('Failed to fetch all coins (CoinCap):', error);
      // Fallback to popular cryptos without prices
      return this.popularCryptos.map((c) => ({
        ...c,
        current_price: 0,
        market_cap: 0,
        price_change_percentage_24h: 0,
      }));
    }
  }

  async getCoinBySymbol(symbol: string): Promise<CryptoCurrency | undefined> {
    const coins = await this.getAllCoins(500);
    return coins.find(c => c.symbol.toUpperCase() === symbol.toUpperCase());
  }

  async getCryptocurrencyPrice(cryptoId: string): Promise<number> {
    try {
      const endpoint = `/simple/price?ids=${cryptoId}&vs_currencies=usd`;
      const data = await this.api.get<Record<string, { usd: number }>>(endpoint);
      return data[cryptoId]?.usd || 0;
    } catch (error) {
      console.error(`Failed to fetch price for ${cryptoId}:`, error);
      return 0;
    }
  }

  getFiatCurrencies(): FiatCurrency[] {
    return this.fiatCurrencies;
  }

  getAllCurrencies(): Promise<{
    crypto: CryptoCurrency[];
    fiat: FiatCurrency[];
  }> {
    return Promise.resolve({
      crypto: this.popularCryptos.map(crypto => ({
        ...crypto,
        current_price: 0,
        market_cap: 0,
        price_change_percentage_24h: 0,
      })),
      fiat: this.fiatCurrencies
    });
  }

  // Convenience mapping of known symbol -> route used by wallet screens
  getWalletRouteForSymbol(symbol: string): string | null {
    const map: Record<string, string> = {
      ETH: '/eth-wallet',
      USDC: '/usdc-wallet',
      USDT: '/usdt-wallet',
      USDS: '/usds-wallet',
      XRP: '/xrp-wallet',
      TON: '/ton-wallet',
      S: '/s-wallet',
      BNB: '/bnb-wallet',
      SOL: '/sol-wallet',
    };
    return map[symbol.toUpperCase()] || null;
  }

  // Mock user balances (in a real app, this would come from your backend)
  async getUserBalances(): Promise<CurrencyBalance[]> {
    const cryptos = await this.getCryptocurrencies();
    
    return [
      // Mock crypto balances
      ...cryptos.slice(0, 5).map(crypto => ({
        currency: crypto.symbol,
        balance: 0.00,
        usdValue: 0.00
      })),
      // Mock fiat balances
      ...this.fiatCurrencies.slice(0, 2).map(fiat => ({
        currency: fiat.code,
        balance: 0.00,
        usdValue: 0.00
      }))
    ];
  }

  clearCache(): void {
    console.log('Clearing crypto service cache');
  }
}

// Export singleton instance
export const cryptoService = new CryptoService();
export default cryptoService;