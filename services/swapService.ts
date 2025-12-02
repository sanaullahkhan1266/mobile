import { api } from '@/utils/apiClient';

export interface SwapParams {
    fromCurrency: string;
    toCurrency: string;
    amount: string;
    chain?: string;
}

export interface SwapResponse {
    success: boolean;
    message: string;
    data?: {
        transactionId: string;
        fromAmount: string;
        toAmount: string;
        exchangeRate: number;
        fee?: string;
    };
}

export interface SwapHistory {
    id: string;
    fromCurrency: string;
    toCurrency: string;
    fromAmount: string;
    toAmount: string;
    exchangeRate: number;
    status: 'pending' | 'completed' | 'failed';
    timestamp: string;
}

/**
 * Execute a currency swap
 */
export const executeSwap = async (params: SwapParams): Promise<SwapResponse> => {
    try {
        const response = await api.post<SwapResponse>(
            '/api/swap/execute',
            params
        );
        return response.data;
    } catch (error: any) {
        console.error('Failed to execute swap:', error);
        throw {
            message: error?.response?.data?.message || error?.message || 'Swap failed',
            error
        };
    }
};

/**
 * Get exchange rate between two currencies
 */
export const getExchangeRate = async (from: string, to: string): Promise<{ rate: number; timestamp: string }> => {
    try {
        const response = await api.get<{ rate: number; timestamp: string }>(
            '/api/swap/rate',
            { params: { from, to } }
        );
        return response.data;
    } catch (error: any) {
        console.error('Failed to fetch exchange rate:', error);

        // Fallback to approximate rates if API fails
        const approximateRates: { [key: string]: number } = {
            'USDT': 1,
            'USDC': 1,
            'BTC': 95000,
            'ETH': 3500,
            'BNB': 600,
        };

        const fromRate = approximateRates[from] || 1;
        const toRate = approximateRates[to] || 1;

        return {
            rate: fromRate / toRate,
            timestamp: new Date().toISOString()
        };
    }
};

/**
 * Get swap history
 */
export const getSwapHistory = async (limit: number = 20): Promise<SwapHistory[]> => {
    try {
        const response = await api.get<SwapHistory[]>(
            '/api/swap/history',
            { params: { limit } }
        );
        return response.data;
    } catch (error: any) {
        console.error('Failed to fetch swap history:', error);
        return [];
    }
};

/**
 * Get estimated output amount for a swap
 */
export const getSwapEstimate = async (params: {
    fromCurrency: string;
    toCurrency: string;
    amount: string;
}): Promise<{
    estimatedOutput: string;
    exchangeRate: number;
    fee: string;
    total: string;
}> => {
    try {
        const response = await api.post<{
            estimatedOutput: string;
            exchangeRate: number;
            fee: string;
            total: string;
        }>(
            '/api/swap/estimate',
            params
        );
        return response.data;
    } catch (error: any) {
        console.error('Failed to get swap estimate:', error);

        // Fallback calculation
        const rate = await getExchangeRate(params.fromCurrency, params.toCurrency);
        const estimatedOutput = (parseFloat(params.amount) * rate.rate).toFixed(8);
        const fee = (parseFloat(params.amount) * 0.001).toFixed(8); // 0.1% fee

        return {
            estimatedOutput,
            exchangeRate: rate.rate,
            fee,
            total: estimatedOutput
        };
    }
};
