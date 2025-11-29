# Quick Start - Backend Integration

Get your mobile app connected to the backend in 5 minutes.

## Prerequisites

- Backend running: `cd ../backend && npm start` (runs on `http://localhost:8080`)
- Mobile app dependencies: `npm install` (already done)

## Step 1: Configure Environment

```bash
# In mobile app root
cp .env.example .env
```

Edit `.env`:
```env
EXPO_PUBLIC_API_URL=http://localhost:8080
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

## Step 2: Test Backend Connection

```bash
# Test if backend is accessible
curl http://localhost:8080/api/health
```

Expected response: `"Server is running!"`

## Step 3: Create a Simple Test

Create a test file `test-api.ts`:

```typescript typescript path=null start=null
import { loginWithBackend, signupWithBackend } from '@/services/authService';

async function testApi() {
  try {
    // Test signup
    console.log('Testing signup...');
    const signupResult = await signupWithBackend({
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'Test123!@#'
    });
    console.log('✓ Signup successful:', signupResult.user.email);

    // Test login
    console.log('Testing login...');
    const loginResult = await loginWithBackend({
      email: signupResult.user.email,
      password: 'Test123!@#'
    });
    console.log('✓ Login successful');
    console.log('✓ Wallet addresses received:', Object.keys(loginResult.user.walletAddresses));

  } catch (error: any) {
    console.error('✗ Test failed:', error.message);
  }
}

testApi();
```

## Step 4: Integrate into Your Screen

**Example: Update Login Screen** (`app/login.tsx`)

```typescript typescript path=null start=null
import { loginWithBackend } from '@/services/authService';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await loginWithBackend({ email, password });
      
      // Check if 2FA is required
      if ('requiresTwoFactor' in response && response.requiresTwoFactor) {
        router.push({ pathname: '/two-factor', params: { email } });
        return;
      }

      // Successfully logged in - go to home
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      {error && <Text style={{ color: 'red', marginVertical: 10 }}>{error}</Text>}
      <Button
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        disabled={loading || !email || !password}
      />
    </View>
  );
}
```

## Step 5: Load Wallet Data in Home Screen

**Example: Update Home Screen** (`app/(tabs)/index.tsx`)

```typescript typescript path=null start=null
import { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { getBalance, getWalletAddresses } from '@/services/paymentService';

export default function HomeScreen() {
  const [balance, setBalance] = useState<any>(null);
  const [wallets, setWallets] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [balanceData, walletsData] = await Promise.all([
        getBalance(),
        getWalletAddresses()
      ]);
      setBalance(balanceData);
      setWallets(walletsData);
    } catch (error) {
      console.error('Failed to load wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) return <Text>Loading wallet...</Text>;

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Your Wallets</Text>
      
      {wallets && (
        <View style={{ marginTop: 20 }}>
          <Text>BNB Address: {wallets.bnb.slice(0, 10)}...</Text>
          <Text>ETH Address: {wallets.eth.slice(0, 10)}...</Text>
          <Text>TRON Address: {wallets.tron.slice(0, 10)}...</Text>
        </View>
      )}

      <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20 }}>Balances</Text>
      {balance && Object.entries(balance).map(([key, data]: any) => (
        <Text key={key}>{data.symbol}: {data.balance}</Text>
      ))}

      <Button title="Refresh" onPress={onRefresh} />
    </View>
  );
}
```

## Step 6: Run the App

```bash
npm start
# or
npm run android  # For Android
npm run ios      # For iOS
```

## Common Issues & Fixes

### "Network Error: Connection Refused"
- Backend not running? Start it: `cd ../backend && npm start`
- Wrong URL? Check `.env` - should be `http://localhost:8080`
- Using iOS simulator? Use `http://127.0.0.1:8080` instead

### "Email already exists (409)"
- User already signed up with that email
- Use a new email: `test-${Date.now()}@example.com`

### "401 Unauthorized"
- Token expired? Re-login
- Token not being sent? Check `utils/apiClient.ts` interceptors

### Backend crashes on signup
- MongoDB not connected? Check backend `.env` `MONGODB_URI`
- Missing dependencies? Run `npm install` in backend folder

## What's Integrated

✅ API Client with auto-retry  
✅ Authentication (login/signup)  
✅ Wallet addresses auto-created  
✅ Balance fetching  
✅ Card management endpoints  
✅ Payment endpoints  
✅ 2FA support  
✅ Error handling  
✅ Token management  

## Next Steps

1. Update your login/signup screens to use `loginWithBackend` and `signupWithBackend`
2. Add wallet display to home screen using `getBalance` and `getWalletAddresses`
3. Implement card creation in card screen using `cardService`
4. Add transaction history using `paymentService`
5. Implement 2FA verification flow

## File Reference

| File | Purpose |
|------|---------|
| `constants/api.ts` | API endpoints and config |
| `utils/apiClient.ts` | Axios instance with interceptors |
| `services/authService.ts` | Authentication functions |
| `services/paymentService.ts` | Wallet & payment functions |
| `services/cardService.ts` | Virtual card functions |
| `.env.example` | Environment template |

## Debug Mode

To enable detailed logging, edit `utils/apiClient.ts` and add:

```typescript typescript path=null start=null
// Add after creating apiClient
apiClient.interceptors.request.use((config) => {
  console.log('🔵 API Request:', config.method?.toUpperCase(), config.url);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.log('❌ API Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);
```

Enjoy! 🚀
