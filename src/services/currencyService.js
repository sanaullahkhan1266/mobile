import { data as currencyCodes } from 'currency-codes';
import getSymbolFromCurrency from 'currency-symbol-map';

class CurrencyService {
  constructor() {
    this.apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
    this.timeout = 10000; // 10 seconds
  }

  // Get offline currency data
  getOfflineCurrencies() {
    return currencyCodes.map(currency => ({
      code: currency.code,
      name: currency.currency,
      flag: this.getCurrencyFlag(currency.code),
      symbol: getSymbolFromCurrency(currency.code),
    })).sort((a, b) => a.code.localeCompare(b.code));
  }

  // Get currency flag emoji
  getCurrencyFlag(code) {
    const currencyFlags = {
      'AED': '🇦🇪', 'AFN': '🇦🇫', 'ALL': '🇦🇱', 'AMD': '🇦🇲', 'ANG': '🇳🇱',
      'AOA': '🇦🇴', 'ARS': '🇦🇷', 'AUD': '🇦🇺', 'AWG': '🇦🇼', 'AZN': '🇦🇿',
      'BAM': '🇧🇦', 'BBD': '🇧🇧', 'BDT': '🇧🇩', 'BGN': '🇧🇬', 'BHD': '🇧🇭',
      'BIF': '🇧🇮', 'BMD': '🇧🇲', 'BND': '🇧🇳', 'BOB': '🇧🇴', 'BRL': '🇧🇷',
      'BSD': '🇧🇸', 'BTN': '🇧🇹', 'BWP': '🇧🇼', 'BYN': '🇧🇾', 'BZD': '🇧🇿',
      'CAD': '🇨🇦', 'CDF': '🇨🇩', 'CHF': '🇨🇭', 'CLP': '🇨🇱', 'CNY': '🇨🇳',
      'COP': '🇨🇴', 'CRC': '🇨🇷', 'CUC': '🇨🇺', 'CUP': '🇨🇺', 'CVE': '🇨🇻',
      'CZK': '🇨🇿', 'DJF': '🇩🇯', 'DKK': '🇩🇰', 'DOP': '🇩🇴', 'DZD': '🇩🇿',
      'EGP': '🇪🇬', 'ERN': '🇪🇷', 'ETB': '🇪🇹', 'EUR': '🇪🇺', 'FJD': '🇫🇯',
      'FKP': '🇫🇰', 'GBP': '🇬🇧', 'GEL': '🇬🇪', 'GGP': '🇬🇬', 'GHS': '🇬🇭',
      'GIP': '🇬🇮', 'GMD': '🇬🇲', 'GNF': '🇬🇳', 'GTQ': '🇬🇹', 'GYD': '🇬🇾',
      'HKD': '🇭🇰', 'HNL': '🇭🇳', 'HRK': '🇭🇷', 'HTG': '🇭🇹', 'HUF': '🇭🇺',
      'IDR': '🇮🇩', 'ILS': '🇮🇱', 'IMP': '🇮🇲', 'INR': '🇮🇳', 'IQD': '🇮🇶',
      'IRR': '🇮🇷', 'ISK': '🇮🇸', 'JEP': '🇯🇪', 'JMD': '🇯🇲', 'JOD': '🇯🇴',
      'JPY': '🇯🇵', 'KES': '🇰🇪', 'KGS': '🇰🇬', 'KHR': '🇰🇭', 'KMF': '🇰🇲',
      'KPW': '🇰🇵', 'KRW': '🇰🇷', 'KWD': '🇰🇼', 'KYD': '🇰🇾', 'KZT': '🇰🇿',
      'LAK': '🇱🇦', 'LBP': '🇱🇧', 'LKR': '🇱🇰', 'LRD': '🇱🇷', 'LSL': '🇱🇸',
      'LYD': '🇱🇾', 'MAD': '🇲🇦', 'MDL': '🇲🇩', 'MGA': '🇲🇬', 'MKD': '🇲🇰',
      'MMK': '🇲🇲', 'MNT': '🇲🇳', 'MOP': '🇲🇴', 'MRO': '🇲🇷', 'MRU': '🇲🇷',
      'MUR': '🇲🇺', 'MVR': '🇲🇻', 'MWK': '🇲🇼', 'MXN': '🇲🇽', 'MYR': '🇲🇾',
      'MZN': '🇲🇿', 'NAD': '🇳🇦', 'NGN': '🇳🇬', 'NIO': '🇳🇮', 'NOK': '🇳🇴',
      'NPR': '🇳🇵', 'NZD': '🇳🇿', 'OMR': '🇴🇲', 'PAB': '🇵🇦', 'PEN': '🇵🇪',
      'PGK': '🇵🇬', 'PHP': '🇵🇭', 'PKR': '🇵🇰', 'PLN': '🇵🇱', 'PYG': '🇵🇾',
      'QAR': '🇶🇦', 'RON': '🇷🇴', 'RSD': '🇷🇸', 'RUB': '🇷🇺', 'RWF': '🇷🇼',
      'SAR': '🇸🇦', 'SBD': '🇸🇧', 'SCR': '🇸🇨', 'SDG': '🇸🇩', 'SEK': '🇸🇪',
      'SGD': '🇸🇬', 'SHP': '🇸🇭', 'SLE': '🇸🇱', 'SLL': '🇸🇱', 'SOS': '🇸🇴',
      'SRD': '🇸🇷', 'STD': '🇸🇹', 'STN': '🇸🇹', 'SVC': '🇸🇻', 'SYP': '🇸🇾',
      'SZL': '🇸🇿', 'THB': '🇹🇭', 'TJS': '🇹🇯', 'TMT': '🇹🇲', 'TND': '🇹🇳',
      'TOP': '🇹🇴', 'TRY': '🇹🇷', 'TTD': '🇹🇹', 'TWD': '🇹🇼', 'TZS': '🇹🇿',
      'UAH': '🇺🇦', 'UGX': '🇺🇬', 'USD': '🇺🇸', 'UYU': '🇺🇾', 'UZS': '🇺🇿',
      'VED': '🇻🇪', 'VES': '🇻🇪', 'VND': '🇻🇳', 'VUV': '🇻🇺', 'WST': '🇼🇸',
      'XAF': '🇨🇲', 'XCD': '🇦🇬', 'XOF': '🇸🇳', 'XPF': '🇵🇫', 'YER': '🇾🇪',
      'ZAR': '🇿🇦', 'ZMK': '🇿🇲', 'ZMW': '🇿🇲', 'ZWL': '🇿🇼'
    };
    return currencyFlags[code] || '🏳️';
  }

  // Get currency name from legacy currency list
  getCurrencyName(code) {
    const currencyNames = {
      'AED': 'UAE Dirham',
      'AFN': 'Afghan Afghani',
      'ALL': 'Albanian Lek',
      'AMD': 'Armenian Dram',
      'ANG': 'Netherlands Antillean Guilder',
      'AOA': 'Angolan Kwanza',
      'ARS': 'Argentine Peso',
      'AUD': 'Australian Dollar',
      'AWG': 'Aruban Florin',
      'AZN': 'Azerbaijani Manat',
      // ... add more as needed or use the currency-codes package data
    };
    return currencyNames[code] || code;
  }

  // Fetch currencies with automatic fallback
  async fetchCurrencies() {
    try {
      console.log('Attempting to fetch currencies from API...');
      
      const response = await Promise.race([
        fetch(this.apiUrl),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), this.timeout)
        )
      ]);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Extract currency codes and create currency objects
      const currencyList = Object.keys(data.rates).map(code => ({
        code,
        name: this.getCurrencyName(code),
        flag: this.getCurrencyFlag(code),
        symbol: getSymbolFromCurrency(code),
      }));

      // Add base currency (USD) if not already included
      if (!currencyList.find(c => c.code === 'USD')) {
        currencyList.unshift({
          code: 'USD',
          name: 'US Dollar',
          flag: '🇺🇸',
          symbol: '$',
        });
      }

      const sortedCurrencies = currencyList.sort((a, b) => a.code.localeCompare(b.code));
      console.log('✅ Currencies loaded from API');
      
      return {
        data: sortedCurrencies,
        isOffline: false,
        source: 'api'
      };

    } catch (error) {
      console.warn('⚠️ API failed, using offline data:', error.message);
      
      // Fallback to offline currency data
      const offlineCurrencies = this.getOfflineCurrencies();
      
      return {
        data: offlineCurrencies,
        isOffline: true,
        source: 'offline'
      };
    }
  }

  // Get popular currencies for quick access
  getPopularCurrencies() {
    const popularCodes = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD'];
    const allCurrencies = this.getOfflineCurrencies();
    
    return allCurrencies.filter(currency => 
      popularCodes.includes(currency.code)
    );
  }
}

export const currencyService = new CurrencyService();
export default currencyService;