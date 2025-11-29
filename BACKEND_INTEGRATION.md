# Backend Integration Guide

This guide explains how to integrate the EnPaying backend with the mobile app.

## Overview

The mobile app uses:
- **Clerk** for user authentication (optional but recommended)
- **Backend API** (Node.js/Express) for core business logic
- **Axios** for API communication with automatic retry and error handling

## Backend Structure

Your backend has the following routes:

```
/api/auth/       - Authentication (signup, login, logout)
/api/payment/    - Payment & wallet management
/api/card/       - Virtual card management
/api/tx/         - Transaction history
/api/price/      - Cryptocurrency prices
/api/2fa/        - Two-factor authentication
```

## Setup

### 1. Environment Configuration

Copy `.env.example` to `.env` in the mobile app root:

```bash
cp .env.example .env
```

Update with your values:
```env
EXPO_PUBLIC_API_URL=http://localhost:8080
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
```

For production, use your deployed backend URL instead of localhost.

### 2. Install Dependencies

The project already has axios installed. Verify:

```bash
npm list axios
```

### 3. API Client Setup

The API client is pre-configured in `utils/apiClient.ts`:

- **Automatic token management** - Tokens are stored in SecureStore
- **Request interceptors** - Automatically adds Authorization header
- **Response interceptors** - Handles 401 errors, retry logic
- **Error handling** - Standardized error responses

## Integration Points

### Authentication Flow

```typescript
import { loginWithBackend, signupWithBackend } from '@/services/authService';

// Signup
const signupResponse = await signupWithBackend({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
});

// Login
const loginResponse = await loginWithBackend({
  email: 'john@example.com',
  password: 'password123'
});

// 2FA verification (if enabled)
if (loginResponse.requiresTwoFactor) {
  const authData = await verifyTwoFactor(email, totpCode);
}
```

### Wallet & Payment

```typescript
import { 
  getWalletAddresses, 
  getBalance, 
  createCharge 
} from '@/services/paymentService';

// Get all wallet addresses (auto-generated during signup)
const wallets = await getWalletAddresses();
// { bnb: '0x...', eth: '0x...', arb: '0x...', ... }

// Get balance for all wallets
const balances = await getBalance();
// { USDT: { balance: '100', symbol: 'USDT', chain: 'bsc' }, ... }

// Create charge for receiving crypto
const charge = await createCharge({
  amount: '100',
  currency: 'USDT',
  chain: 'bnb'
});
```

### Virtual Cards

```typescript
import { 
  createCard, 
  getCards, 
  fundCard 
} from '@/services/cardService';

// Create a new virtual card
const card = await createCard({
  currency: 'USD',
  fundingAmount: '100'
});

// List all cards
const cards = await getCards();

// Fund a card from wallet
const fundResult = await fundCard(cardId, {
  amount: '50',
  currency: 'USDT',
  source: 'bnbAddr' // wallet type
});
```

## Example Screen Integration

### Login Screen

```typescript typescript path=null start=null
import React, { useState } from 'react';
import { loginWithBackend } from '@/services/authService';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await loginWithBackend({ email, password });
      
      if (response.requiresTwoFactor) {
        // Navigate to 2FA verification
        router.push({ pathname: '/two-factor', params: { email } });
      } else {
        // Successfully logged in
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />
    </View>
  );
}
```

### Home Screen (Wallet Display)

```typescript typescript path=null start=null
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getBalance, getWalletAddresses } from '@/services/paymentService';

export default function HomeScreen() {
  const [balances, setBalances] = useState<any>(null);
  const [wallets, setWallets] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const [balancesData, walletsData] = await Promise.all([
        getBalance(),
        getWalletAddresses()
      ]);
      setBalances(balancesData);
      setWallets(walletsData);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <View>
      <Text>Total Balance: {Object.values(balances).reduce((sum, b: any) => sum + parseFloat(b.balance), 0)}</Text>
      {/* Display balances and wallets */}
    </View>
  );
}
```

## Key Features by Endpoint

### Authentication (`/api/auth/`)

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| POST | `/signup` | Create new user with wallets | `{ token, user: { id, email, name, walletAddresses } }` |
| POST | `/login` | Authenticate user | `{ token, user: {...} }` or `{ requiresTwoFactor: true, email }` |
| POST | `/logout` | Logout | `{ success: true }` |

**Wallets Created Automatically:**
- BNB Chain (USDT, USDC, ETH)
- Ethereum (USDT, USDC, ETH)
- Arbitrum (USDT, USDC)
- Polygon (USDC)
- TRON (USDT)
- Bitcoin (BTC)

### Payment (`/api/payment/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wallet-addresses` | Get all wallet addresses |
| GET | `/balance` | Get balance for all wallets |
| POST | `/charge` | Create charge for receiving crypto |
| GET | `/charge/:chargeId` | Get charge details |
| GET | `/charges` | List all charges |
| POST | `/charge/:chargeId/cancel` | Cancel charge |
| POST | `/checkout` | Create checkout |
| GET | `/recent-received` | Get recent received transactions |
| GET | `/requests` | Get payment requests |
| GET | `/recipients` | Get saved recipients |
| GET | `/exchange-history` | Get exchange history |

### Cards (`/api/card/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create` | Create virtual card |
| GET | `/list` | Get all cards |
| GET | `/:cardId` | Get card details |
| POST | `/:cardId/freeze` | Freeze/unfreeze card |
| DELETE | `/:cardId` | Terminate card |
| POST | `/:cardId/fund` | Fund card from wallet |
| GET | `/:cardId/transactions` | Get card transactions |
| PUT | `/:cardId/settings` | Update card settings |

## Error Handling

All API errors follow this format:

```typescript
interface ApiError {
  message: string;
  statusCode?: number;
  data?: any;
}
```

Common status codes:
- **400** - Bad request (validation error)
- **401** - Unauthorized (invalid token or credentials)
- **409** - Conflict (user already exists, duplicate email)
- **500** - Server error

Example error handling:

```typescript
try {
  await loginWithBackend({ email, password });
} catch (error: any) {
  if (error.statusCode === 401) {
    // Invalid credentials
  } else if (error.statusCode === 500) {
    // Server error
  } else {
    console.error('Error:', error.message);
  }
}
```

## Security Best Practices

1. **Token Storage** - Tokens are stored in SecureStore (encrypted)
2. **HTTPS Only** - In production, only use HTTPS endpoints
3. **Token Expiry** - Backend issues 24-hour JWT tokens
4. **Refresh Tokens** - Implement refresh token flow for longer sessions
5. **CORS** - Backend already has CORS configured for mobile

## Testing API Calls

Use PostMan or Insomnia to test:

```bash
# Test backend health
GET http://localhost:8080/api/health

# Signup
POST http://localhost:8080/api/auth/signup
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

# Login
POST http://localhost:8080/api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

## Troubleshooting

### "Network Error" or Connection Refused
- Check backend is running: `npm start` in backend folder
- Verify API URL in `.env` matches backend address
- On iOS simulator: use `http://127.0.0.1:8080` instead of `localhost`

### "401 Unauthorized"
- Token may have expired (24 hours)
- Clear app data and re-login
- Check Authorization header is being sent

### "CORS Error"
- Backend needs to add mobile app origin to allowed list
- Edit `index.js` in backend and add your domain

### Slow API Calls
- Check network connection
- Review backend logs for bottlenecks
- May be hitting rate limits (default 100 req/15min)

## Next Steps

1. **Implement Missing Controllers** - Backend has route definitions but controllers need completion
2. **Add Payment Gateway** - Integrate Coinbase Commerce, Marqeta, or Galileo
3. **Blockchain Integration** - Add ethers.js for direct blockchain interactions
4. **Real-time Updates** - Consider WebSocket for live balance updates
5. **Advanced KYC** - Implement document upload and verification
6. **Offline Support** - Add local caching for offline functionality

## Support

For issues or questions:
- Check backend logs: `tail -f logs/backend.log`
- Review API responses in Postman
- Enable debug logging in `utils/apiClient.ts`
