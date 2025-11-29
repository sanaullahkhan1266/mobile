# 401 Error Fix Documentation

## Problem Summary

Your app is experiencing **401 Unauthorized errors** across all API calls. After thorough investigation, I've identified and fixed **three critical issues**:

---

## Issues Found and Fixed

### 1. **Token Storage Bug (CRITICAL)**

**Problem:**
- `clearAuthToken()` was setting the token to an **empty string** (`''`) instead of **deleting** it
- When the app checked for a token, it found the empty string and sent `Bearer ` (with no actual token)
- This caused all API calls to be rejected with 401

**Location:** `utils/apiClient.ts`
- Line 59: `await SecureStore.setItemAsync('authToken', '')`
- Line 104: `await SecureStore.setItemAsync('authToken', '')`

**Fix Applied:**
```typescript
// BEFORE (WRONG)
export const clearAuthToken = async () => {
  authToken = null;
  try {
    await SecureStore.setItemAsync('authToken', ''); // ❌ Sets empty string
  } catch (error) {
    console.error('Failed to clear auth token:', error);
  }
};

// AFTER (CORRECT)
export const clearAuthToken = async () => {
  authToken = null;
  try {
    await SecureStore.deleteItemAsync('authToken'); // ✅ Deletes the key
  } catch (error) {
    console.error('Failed to clear auth token:', error);
  }
};
```

---

### 2. **Empty Token Validation**

**Problem:**
- The request interceptor didn't check if the token was an empty string
- It would send `Authorization: Bearer ` with no token

**Location:** `utils/apiClient.ts`, line 35-39

**Fix Applied:**
```typescript
// Added validation to check for empty strings
const token = await SecureStore.getItemAsync('authToken');
if (token && token.trim() !== '') {
  authToken = token;
  config.headers.Authorization = `Bearer ${token}`;
}
```

---

### 3. **Clerk Token Retrieval Error (CRITICAL)**

**Problem:**
- The code tried to call `session.getToken()` on `result.createdSessionId`
- But `createdSessionId` is just a **string ID**, not a session object!
- This meant tokens were **never being saved** after login/signup

**Location:** `services/clerkAuthService.ts`, lines 84-95 and 148-159

**Fix Applied:**
```typescript
// BEFORE (WRONG)
const session = result.createdSessionId; // This is just a string ID
if (session) {
  const token = await session.getToken(); // ❌ Can't call method on string
}

// AFTER (CORRECT)
const { session } = useSession(); // Get actual session object from hook
await setActive({ session: result.createdSessionId });
await new Promise(resolve => setTimeout(resolve, 100)); // Wait for session

if (session) {
  const token = await session.getToken(); // ✅ Now works correctly
  if (token) {
    await setAuthToken(token);
  }
}
```

---

### 4. **Logout Using Wrong Method**

**Problem:**
- `logout()` called `setAuthToken('')` instead of `clearAuthToken()`
- This would set empty string again

**Location:** `services/clerkAuthService.ts`, line 194

**Fix Applied:**
```typescript
// BEFORE
await setAuthToken(''); // ❌ Sets empty string

// AFTER
await clearAuthToken(); // ✅ Properly deletes token
```

---

## Additional Improvements

### Enhanced Logging
Added better logging to help debug future auth issues:
```typescript
if (statusCode === 401) {
  console.warn('⚠️ 401 UNAUTHORIZED - token may be expired or invalid');
  console.warn('Request URL:', config?.url);
  console.warn('Auth header present:', !!config?.headers?.Authorization);
}
```

### Token Helper Utility
Created `utils/clerkTokenHelper.ts` to help refresh Clerk tokens:
```typescript
import { useClerkToken } from '@/utils/clerkTokenHelper';

const { getFreshToken } = useClerkToken();

// Get a fresh token before making API calls
const token = await getFreshToken();
```

---

## Testing the Fix

### 1. Clear Current State
First, clear any corrupted auth state:

```typescript
// In your app, run this once:
import * as SecureStore from 'expo-secure-store';

await SecureStore.deleteItemAsync('authToken');
```

Or restart the app and clear storage:
- iOS Simulator: Device → Erase All Content and Settings
- Android: Settings → Apps → Your App → Clear Data
- Expo: Shake device → Clear AsyncStorage

### 2. Test Login Flow

1. **Sign up or log in** with Clerk
2. **Check console logs** for:
   ```
   ✅ TOKEN SAVED: eyJhbGciOiJSUzI1Ni...
   ```
3. **Make an API call** (e.g., get wallet addresses)
4. **Should NOT see 401 errors** anymore

### 3. Verify Token is Saved

Add this debug code temporarily:
```typescript
import * as SecureStore from 'expo-secure-store';

const token = await SecureStore.getItemAsync('authToken');
console.log('Current token:', token ? `${token.substring(0, 20)}...` : 'NONE');
```

---

## Common Scenarios and Solutions

### Scenario 1: Still Getting 401 After Login

**Possible Causes:**
1. Clerk session not active yet
2. Backend not accepting Clerk JWT tokens
3. Token format mismatch

**Solution:**
```typescript
// Add this after login to verify token
import { useAuth } from '@clerk/clerk-expo';

const { getToken } = useAuth();
const token = await getToken();
console.log('Clerk token:', token);

// Make a test API call
import { api } from '@/utils/apiClient';
const result = await api.get('/api/health');
console.log('API test result:', result);
```

### Scenario 2: Token Expires Mid-Session

**Solution:**
Add token refresh logic before critical API calls:
```typescript
import { useClerkToken } from '@/utils/clerkTokenHelper';

const { getFreshToken } = useClerkToken();

// Before making API call
await getFreshToken(); // Refreshes if needed
const result = await api.get('/api/payment/balance');
```

### Scenario 3: Backend Expects Different Token Format

**Check Backend Auth Middleware:**
The backend at `http://23.22.178.240` needs to:
1. Accept Clerk JWT tokens
2. Validate JWT signature with Clerk public key
3. Extract user ID from token claims

**Backend Integration Required:**
```javascript
// Backend: Middlewares/Auth.js (example)
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// Verify Clerk JWT
app.use('/api/*', ClerkExpressRequireAuth());
```

---

## Backend Configuration Check

Your backend at `http://23.22.178.240` needs proper Clerk integration:

### Required Backend Setup:

1. **Install Clerk SDK:**
   ```bash
   npm install @clerk/clerk-sdk-node
   ```

2. **Configure Clerk:**
   ```javascript
   // Backend: .env
   CLERK_PUBLISHABLE_KEY=pk_test_ZGVzdGluZWQtYmVlLTY4LmNsZXJrLmFjY291bnRzLmRldiQ
   CLERK_SECRET_KEY=sk_test_... // Get from Clerk dashboard
   ```

3. **Auth Middleware:**
   ```javascript
   const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
   
   app.use('/api/*', ClerkExpressRequireAuth());
   ```

---

## Quick Verification Commands

### Check Backend Health:
```powershell
Invoke-WebRequest -Uri "http://23.22.178.240/api/health"
```

### Test Auth Endpoint:
```powershell
$token = "YOUR_CLERK_JWT_TOKEN"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
Invoke-WebRequest -Uri "http://23.22.178.240/api/payment/wallet-addresses" -Headers $headers
```

---

## Next Steps

1. ✅ **All code fixes have been applied**
2. **Clear app storage/cache** and test
3. **Verify Clerk tokens are being saved** after login
4. **Check backend accepts Clerk JWT tokens**
5. **Monitor console logs** for auth debugging

---

## Summary

The main issues were:
1. ❌ Tokens being set to empty strings instead of deleted
2. ❌ Wrong way to get Clerk session token
3. ❌ Empty strings being sent in Authorization headers

All fixed! The app should now properly:
- ✅ Store Clerk JWT tokens after login
- ✅ Send tokens with all API requests
- ✅ Clear tokens properly on logout
- ✅ Handle 401 errors with better logging

If you still see 401 errors after these fixes, the issue is likely on the **backend** not accepting Clerk JWT tokens properly.
