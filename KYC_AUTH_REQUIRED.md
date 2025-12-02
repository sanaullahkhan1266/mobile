# Authentication Required for KYC

## Issue
You're getting "Authentication required" when submitting KYC because **you haven't logged in yet** or your session expired.

## Solution

### Option 1: Login First (Recommended)
1. **Go back to the login screen**
2. **Login with your credentials** or **create a new account**
3. **Complete the OTP verification**
4. **Then come back to KYC**

### Option 2: Quick Debug - Check if Token Exists

You can check if you're logged in by adding this to your code:

```typescript
import * as SecureStore from 'expo-secure-store';

// Check auth status
const token = await SecureStore.getItemAsync('authToken');
console.log('Auth token:', token ? 'EXISTS' : 'MISSING');
```

## Why This Happens

Your app flow should be:
1. **Signup** → Saves credentials
2. **Verify OTP** → Logs you in and saves `authToken` to SecureStore  
3. **Access Protected Features** (like KYC) → Uses the saved `authToken`

Without step 2 (login), there's no `authToken`, so KYC submission fails.

## Current Situation

Based on the logs:
```
LOG  🔐 Checking authentication...
LOG  🔑 Auth token retrieved: No token found
ERROR  ❌ No auth token available for KYC submission
```

This means **you haven't completed the login/OTP verification process**.

## Next Steps

**Please login to your account:**
1. Navigate to the login screen
2. Enter your email and password
3. Verify the OTP sent to your email
4. You'll be redirected to the home screen
5. Now you can submit KYC successfully!

---

## Technical Details

The auth token is stored when you complete OTP verification in `verify.tsx` (line 88):
```typescript
await SecureStore.setItemAsync('authToken', loginData.token);
```

This token is then used for all authenticated API calls, including KYC submission.
