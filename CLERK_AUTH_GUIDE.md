# Clerk Authentication Guide

Your mobile app now uses **Clerk for authentication** with backend integration.

## Why Clerk?

✅ **Secure** - Industry standard auth platform  
✅ **Email verification** - Built-in  
✅ **Password reset** - Managed by Clerk  
✅ **Multi-factor** - Optional 2FA  
✅ **Session management** - Automatic token handling  
✅ **Backend sync** - Notify backend of new users  

## Setup

### 1. Clerk Configuration

Your `.env` already has:
```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZGVzdGluZWQtYmVlLTY4LmNsZXJrLmFjY291bnRzLmRldiQ
```

This is already configured in `app/_layout.tsx` with ClerkProvider.

### 2. Available Functions

```typescript
import {
  signupWithClerk,
  verifyClerkEmail,
  loginWithClerk,
  logoutWithClerk,
  requestPasswordReset,
  resetPasswordWithClerk,
  useClerkAuth
} from '@/services/clerkAuthService';
```

## Authentication Flow

### Signup Flow

```
1. User enters: email, password, name
   ↓
2. Call signupWithClerk()
   ↓
3. Clerk creates user account
   ↓
4. Clerk sends verification email
   ↓
5. User receives code in email
   ↓
6. User enters code in app
   ↓
7. Call verifyClerkEmail(sessionId, code)
   ↓
8. Backend is notified via signupWithBackend()
   ↓
9. Session created → Navigate to home
```

### Login Flow

```
1. User enters: email, password
   ↓
2. Call loginWithClerk()
   ↓
3. Clerk verifies credentials
   ↓
4. Session created
   ↓
5. Token stored automatically
   ↓
6. Navigate to home (tabs)
```

## Screen Implementation

### Signup Screen (`app/signup.tsx`)

```typescript typescript path=null start=null
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { signupWithClerk, verifyClerkEmail } from '@/services/clerkAuthService';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  
  // Signup fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Verification fields
  const [code, setCode] = useState('');
  const [sessionId, setSessionId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signupWithClerk({
        email,
        password,
        firstName,
        lastName,
      });
      
      setSessionId(result.sessionId);
      Alert.alert('Success', 'Verification code sent to your email');
      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    setError('');
    try {
      await verifyClerkEmail(sessionId, code);
      Alert.alert('Success', 'Email verified! Welcome to EnPaying');
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
          Verify Your Email
        </Text>
        <Text style={{ marginBottom: 15, color: '#666' }}>
          We sent a verification code to {email}
        </Text>
        
        <TextInput
          placeholder="Enter verification code"
          value={code}
          onChangeText={setCode}
          editable={!loading}
          keyboardType="numeric"
          style={{ borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 8 }}
        />
        
        {error && <Text style={{ color: 'red', marginBottom: 15 }}>{error}</Text>}
        
        <Button
          title={loading ? 'Verifying...' : 'Verify Code'}
          onPress={handleVerifyCode}
          disabled={loading || !code}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Create Account
      </Text>
      
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        editable={!loading}
        style={{ borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 8 }}
      />
      
      <TextInput
        placeholder="Last Name (optional)"
        value={lastName}
        onChangeText={setLastName}
        editable={!loading}
        style={{ borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 8 }}
      />
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 8 }}
      />
      
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
        style={{ borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 8 }}
      />
      
      {error && <Text style={{ color: 'red', marginBottom: 15 }}>{error}</Text>}
      
      <Button
        title={loading ? 'Creating account...' : 'Sign Up'}
        onPress={handleSignup}
        disabled={loading || !firstName || !email || !password}
      />
    </View>
  );
}
```

### Login Screen (`app/login.tsx`)

```typescript typescript path=null start=null
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Pressable } from 'react-native';
import { loginWithClerk } from '@/services/clerkAuthService';
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
      await loginWithClerk({ email, password });
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Login
      </Text>
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 8 }}
      />
      
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
        style={{ borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 8 }}
      />
      
      {error && <Text style={{ color: 'red', marginBottom: 15 }}>{error}</Text>}
      
      <Button
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        disabled={loading || !email || !password}
      />
      
      <Pressable onPress={() => router.push('/forgot-password')} style={{ marginTop: 15 }}>
        <Text style={{ color: 'blue', textAlign: 'center' }}>Forgot Password?</Text>
      </Pressable>
      
      <Pressable onPress={() => router.push('/signup')} style={{ marginTop: 10 }}>
        <Text style={{ color: 'blue', textAlign: 'center' }}>Create Account</Text>
      </Pressable>
    </View>
  );
}
```

### Logout (Menu/Settings)

```typescript typescript path=null start=null
import React from 'react';
import { View, Button, Alert } from 'react-native';
import { useClerkAuth } from '@/services/clerkAuthService';
import { useRouter } from 'expo-router';

export default function MenuScreen() {
  const router = useRouter();
  const { logout } = useClerkAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await logout();
              router.replace('/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
}
```

## Backend Integration

### How Clerk + Backend Works

1. **Clerk handles auth** - User signup/login/password reset
2. **Backend gets notified** - User data synced to backend database
3. **JWT tokens** - Clerk tokens used for API calls to backend
4. **Automatic sync** - When user signs up, backend is notified

### Backend Signup Call

When user verifies email in Clerk, we notify backend:

```typescript
// Sent to http://23.22.178.240/api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "clerkId": "user_123" // Clerk user ID for reference
}
```

## Using useClerkAuth Hook

```typescript typescript path=null start=null
import { useClerkAuth } from '@/services/clerkAuthService';

export default function ProfileScreen() {
  const { isLoaded, isSignedIn, user, logout } = useClerkAuth();

  if (!isLoaded) return <Text>Loading...</Text>;
  
  if (!isSignedIn) return <Text>Not signed in</Text>;

  return (
    <View>
      <Text>Welcome, {user?.firstName}</Text>
      <Text>Email: {user?.primaryEmailAddress?.emailAddress}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
```

## Security

✅ **Passwords** - Never handled by your app, Clerk secures them  
✅ **Tokens** - Clerk JWTs stored in SecureStore  
✅ **Email verification** - Required for account creation  
✅ **Password reset** - Secure link sent via email  
✅ **Session management** - Automatic expiration  

## Next Steps

1. **Update `app/signup.tsx`** - Use Clerk signup
2. **Update `app/login.tsx`** - Use Clerk login
3. **Add `app/forgot-password.tsx`** - Password reset
4. **Test signup** - Create account and verify email
5. **Test login** - Login with created account

## Troubleshooting

### "Clerk not initialized"
- Check `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` in `.env`
- Verify ClerkProvider is in `app/_layout.tsx`

### "Verification code not received"
- Check spam folder
- Check email address is correct
- Clerk test mode sends codes to console

### "Backend notification failed"
- Backend may have issues
- User still logged in (continues anyway)
- Check backend logs at `http://23.22.178.240`

---

Now your app uses Clerk for secure authentication! 🚀
