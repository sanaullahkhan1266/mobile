# Fix Clerk OAuth Error - Dashboard Configuration

## Problem
Your Clerk instance is configured to require OAuth (Google/GitHub) instead of email/password authentication.

## Solution - Update Clerk Dashboard

### 1. Go to Clerk Dashboard
- Open: https://dashboard.clerk.com
- Select your application

### 2. Disable OAuth Providers
- Go to **"Authentications" → "Social connections"** (or "OAuth connections")
- **Disable/Remove**:
  - Google OAuth
  - GitHub OAuth
  - Any other social provider
- You should see them as "Disabled" or remove them

### 3. Enable Email/Password
- Go to **"Authentications" → "Email, Phone, Username"**
- Make sure **"Email address"** is ✅ **ENABLED**
- Authentication strategies should show:
  - ✅ Email address (Sign-up + Sign-in)
  - Password should be enabled for sign-in

### 4. Verification Settings
- Go to **"Email"** section
- Set **Email verification** to one of:
  - ✅ "Optional" (faster for testing)
  - "Required" (more secure)
- Recommended: Use "Optional" for development

### 5. Password Requirements
- Go to **"Passwords"** section
- Set password complexity to **"Low"** for testing
- You can require complexity later

### 6. Save & Restart
- Click **Save** on any changes
- Restart your Expo app (stop and `expo start`)

## Expected Behavior After Fix

When user tries to login:
1. ✅ No OAuth redirect
2. ✅ Email/password form works
3. ✅ User created in Clerk dashboard
4. ✅ Console shows: "✅ CLERK LOGIN RESULT: complete"
5. ✅ Token saved to SecureStore

## If Still Getting OAuth Error

1. **Clear cache**: `expo start --clear`
2. **Verify .env**: Check `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is correct
3. **Check network**: App might be cached - hard refresh browser too
4. **Restart dev server**: Stop Expo and run again

## Testing Credentials

After fix, try logging in with:
- Email: `test@example.com`
- Password: `Test123!`

You should see in console:
```
🔵 CLERK LOGIN: test@example.com
✅ CLERK LOGIN RESULT: complete
✅ TOKEN SAVED
```
