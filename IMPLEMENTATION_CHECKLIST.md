# Implementation Checklist

Complete these steps to fully integrate your mobile app with the backend.

## Phase 1: Setup ✅ (Already Done)

- [x] Created API client (`utils/apiClient.ts`)
- [x] Created constants (`constants/api.ts`)
- [x] Created auth service (`services/authService.ts`)
- [x] Created payment service (`services/paymentService.ts`)
- [x] Created card service (`services/cardService.ts`)
- [x] Added axios to `package.json`
- [x] Created `.env.example`
- [x] Created documentation

## Phase 2: Configuration

- [ ] Copy `.env.example` to `.env`
  ```bash
  cp .env.example .env
  ```

- [ ] Update `.env` with your backend URL
  ```env
  EXPO_PUBLIC_API_URL=http://localhost:8080
  # or for production
  EXPO_PUBLIC_API_URL=https://api.enpaying.com
  ```

- [ ] Add your Clerk publishable key to `.env`
  ```env
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_from_clerk_dashboard
  ```

- [ ] Install axios dependency
  ```bash
  npm install
  ```

## Phase 3: Update Authentication Screens

### Login Screen (`app/login.tsx`)

- [ ] Import `loginWithBackend` from `services/authService`
- [ ] Replace hardcoded login with backend call
- [ ] Handle 2FA response (if `requiresTwoFactor` is true)
- [ ] Store JWT token (handled automatically by `apiClient`)
- [ ] Navigate to home on success

**Example:**
```typescript typescript path=null start=null
import { loginWithBackend } from '@/services/authService';

const handleLogin = async () => {
  try {
    const response = await loginWithBackend({ email, password });
    if (response.requiresTwoFactor) {
      router.push({ pathname: '/two-factor', params: { email } });
    } else {
      router.replace('/(tabs)');
    }
  } catch (error) {
    setError(error.message);
  }
};
```

### Signup Screen (`app/signup.tsx` or similar)

- [ ] Import `signupWithBackend`
- [ ] Replace hardcoded signup with backend call
- [ ] Wallets are created automatically on backend
- [ ] Display success message with user data
- [ ] Navigate to login after signup

**Example:**
```typescript typescript path=null start=null
import { signupWithBackend } from '@/services/authService';

const handleSignup = async () => {
  try {
    const response = await signupWithBackend({ name, email, password });
    Alert.alert('Success', `Account created with ${response.user.email}`);
    router.replace('/login');
  } catch (error) {
    setError(error.message);
  }
};
```

### Logout (Menu/Settings Screen)

- [ ] Import `logoutFromBackend`
- [ ] Add logout button
- [ ] Clear user data locally
- [ ] Navigate to login

**Example:**
```typescript typescript path=null start=null
import { logoutFromBackend } from '@/services/authService';

const handleLogout = async () => {
  try {
    await logoutFromBackend();
    router.replace('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
```

## Phase 4: Display Wallet Data

### Home Screen (`app/(tabs)/index.tsx`)

- [ ] Import `getWalletAddresses`, `getBalance` from `services/paymentService`
- [ ] Load wallet addresses on screen mount
- [ ] Load balances on screen mount
- [ ] Display addresses in UI (shortened format)
- [ ] Display balances for each currency
- [ ] Add refresh button (pull-to-refresh)
- [ ] Show loading state while fetching

**Example:**
```typescript typescript path=null start=null
import { useEffect, useState } from 'react';
import { getBalance, getWalletAddresses } from '@/services/paymentService';

export default function HomeScreen() {
  const [wallets, setWallets] = useState<any>(null);
  const [balances, setBalances] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const [walletsData, balancesData] = await Promise.all([
        getWalletAddresses(),
        getBalance()
      ]);
      setWallets(walletsData);
      setBalances(balancesData);
    } catch (error) {
      console.error('Failed to load wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Text>BNB: {wallets.bnb.slice(0, 10)}...</Text>
          <Text>ETH: {wallets.eth.slice(0, 10)}...</Text>
          {balances && Object.entries(balances).map(([key, data]: any) => (
            <Text key={key}>{data.symbol}: {data.balance}</Text>
          ))}
          <Button title="Refresh" onPress={loadWalletData} />
        </>
      )}
    </View>
  );
}
```

## Phase 5: Implement Card Features

### Card Screen (`app/(tabs)/card.tsx` or `app/card/*`)

- [ ] Import `createCard`, `getCards`, `fundCard` from `services/cardService`
- [ ] Display list of user's cards
- [ ] Show card details (last 4 digits, expiry, balance)
- [ ] Add "Create Card" button
- [ ] Add "Fund Card" button
- [ ] Add "Freeze/Unfreeze" button
- [ ] Add "Delete Card" button
- [ ] Show loading states

**Example:**
```typescript typescript path=null start=null
import { useEffect, useState } from 'react';
import { getCards, createCard, toggleCardFreeze } from '@/services/cardService';

export default function CardScreen() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      const data = await getCards();
      setCards(data);
    } catch (error) {
      console.error('Failed to load cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCard = async () => {
    try {
      await createCard({ currency: 'USD' });
      await loadCards();
      Alert.alert('Success', 'Card created');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      {cards.map(card => (
        <View key={card.id}>
          <Text>{card.lastFour}</Text>
          <Text>{card.balance} {card.currency}</Text>
          <Button title="Freeze" onPress={() => toggleCardFreeze(card.id, true)} />
        </View>
      ))}
      <Button title="Create Card" onPress={handleCreateCard} disabled={loading} />
    </View>
  );
}
```

## Phase 6: Implement 2FA (Optional)

### 2FA Setup Screen

- [ ] Import `enableTwoFactor`, `verifyTwoFactor` from `services/authService`
- [ ] Display QR code from `enableTwoFactor` response
- [ ] Allow user to scan with authenticator app
- [ ] Verify code from app

**Example:**
```typescript typescript path=null start=null
import { enableTwoFactor, verifyTwoFactor } from '@/services/authService';

const handleEnable2FA = async () => {
  try {
    const { secret, qrCode } = await enableTwoFactor();
    // Display QR code to user
    // User scans with Google Authenticator, Authy, etc.
    // Then asks for verification code
  } catch (error) {
    console.error('Failed to enable 2FA:', error);
  }
};
```

## Phase 7: Add Payment Features

### Receive/Send Crypto Screens

- [ ] Import functions from `paymentService`
- [ ] `createCharge()` - Generate QR for receiving
- [ ] `getRecentReceived()` - Show recent transactions
- [ ] `getPaymentRequests()` - Show pending requests
- [ ] `createCheckout()` - Generate payment link
- [ ] Display transaction history

## Phase 8: Testing

### Backend Connection Test

- [ ] Start backend: `cd ../backend && npm start`
- [ ] Verify backend runs on port 8080
- [ ] Test health endpoint: `curl http://localhost:8080/api/health`
- [ ] Expected: `"Server is running!"`

### Mobile App Testing

- [ ] Install dependencies: `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Update `.env` with backend URL
- [ ] Start app: `npm start`
- [ ] Test signup with new email
- [ ] Verify wallets created on backend
- [ ] Test login with created account
- [ ] Verify balances load
- [ ] Test card creation

### Common Test Cases

- [ ] ✅ Signup → Login → Home (wallet display)
- [ ] ✅ Login with existing account
- [ ] ✅ Load wallet addresses
- [ ] ✅ Load balances
- [ ] ✅ Create virtual card
- [ ] ✅ List cards
- [ ] ✅ Fund card from wallet
- [ ] ✅ Logout

## Phase 9: Error Handling

- [ ] Add try/catch to all API calls
- [ ] Display user-friendly error messages
- [ ] Handle network errors
- [ ] Handle validation errors (400)
- [ ] Handle auth errors (401)
- [ ] Handle server errors (500)
- [ ] Add error logging

**Example:**
```typescript typescript path=null start=null
try {
  await loginWithBackend({ email, password });
} catch (error: any) {
  if (error.statusCode === 401) {
    setError('Invalid email or password');
  } else if (error.statusCode === 500) {
    setError('Server error. Please try again later.');
  } else {
    setError(error.message || 'An error occurred');
  }
}
```

## Phase 10: Production Checklist

Before deploying to production:

- [ ] Update `.env` with production backend URL (HTTPS)
- [ ] Set `EXPO_PUBLIC_ENV=production`
- [ ] Remove console.log statements
- [ ] Enable HTTPS only in production
- [ ] Test with real backend
- [ ] Test all user flows
- [ ] Verify token security (SecureStore)
- [ ] Test 2FA flow
- [ ] Test error scenarios
- [ ] Monitor backend logs
- [ ] Set up monitoring/logging
- [ ] Backup database regularly
- [ ] Test account recovery flow

## Backend Completion Tasks

Your backend has all routes defined, but some controllers need completion:

- [ ] **PaymentController**
  - [ ] Implement balance calculation
  - [ ] Implement charge creation
  - [ ] Integrate blockchain RPC calls
  - [ ] Add transaction history

- [ ] **CardController**
  - [ ] Integrate Marqeta/Galileo API
  - [ ] Implement card funding
  - [ ] Add card transaction retrieval

- [ ] **TxController**
  - [ ] Implement transaction sending
  - [ ] Add transaction history

- [ ] **PriceRouter**
  - [ ] Implement price fetching
  - [ ] Add price history

## Support Resources

- **Docs**: Read `BACKEND_INTEGRATION.md` for detailed information
- **Quick Start**: Follow `QUICK_START.md` for 5-minute setup
- **Architecture**: Check `ARCHITECTURE.md` for system design
- **API Constants**: See `constants/api.ts` for all endpoints

## Debugging Tips

1. **Enable Debug Logging**
   - Uncomment logging in `utils/apiClient.ts`
   - Check console for API requests/responses

2. **Test with Postman**
   - Test API endpoints directly
   - Verify request/response format
   - Check authentication headers

3. **Mobile Device Testing**
   - Test on actual device before deployment
   - Check network requests in browser dev tools
   - Monitor console for errors

4. **Backend Logs**
   - Check backend console for errors
   - Monitor MongoDB connection
   - Review controller logic

## Next Steps

1. ✅ Phase 1-2: Configuration (TODAY)
2. 🎯 Phase 3: Update Auth Screens (PRIORITY)
3. 🎯 Phase 4: Display Wallets (HIGH)
4. 📋 Phase 5-7: Additional Features (MEDIUM)
5. 🧪 Phase 8-10: Testing & Production (BEFORE LAUNCH)

---

**You're all set! Start with Phase 2 configuration and Phase 3 authentication screens.** 🚀
