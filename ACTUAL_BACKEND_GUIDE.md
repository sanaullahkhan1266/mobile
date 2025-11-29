# Actual Backend Integration Guide

Your backend has different endpoints and flows than the initial setup. Here's the corrected guide.

## Backend URL

**Base URL:** `http://23.22.178.240`

All endpoints use this base URL.

## Authentication Endpoints

### 1. Signup (with OTP Verification)

```
POST http://23.22.178.240/api/auth/signup
```

**Payload:**
```json
{
  "name": "John Doe",
  "email": "user@gmail.com",
  "password": "User@12345"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Signup successful. Please verify your email with OTP."
}
```

**Usage:**
```typescript
import { signupWithBackend } from '@/services/authService';

const result = await signupWithBackend({
  name: 'John Doe',
  email: 'user@gmail.com',
  password: 'User@12345'
});

// Next step: Ask user to enter OTP
```

### 2. Send OTP (Email Verification)

```
POST http://23.22.178.240/api/auth/send-otp
```

**Payload:**
```json
{
  "email": "user@gmail.com",
  "otp": "293722"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Usage:**
```typescript
import { sendOTP } from '@/services/authService';

// After signup, user receives OTP in email
// User enters OTP in UI
const result = await sendOTP('user@gmail.com', '293722');

// If successful, user can now login
```

### 3. Login

```
POST http://23.22.178.240/api/auth/login
```

**Payload:**
```json
{
  "email": "user@gmail.com",
  "password": "User@12345"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@gmail.com",
      "name": "John Doe"
    }
  }
}
```

**Usage:**
```typescript
import { loginWithBackend } from '@/services/authService';

const response = await loginWithBackend({
  email: 'user@gmail.com',
  password: 'User@12345'
});

// Token is automatically stored in SecureStore
// Navigate to home screen
```

### 4. Logout

```
POST http://23.22.178.240/api/auth/logout
```

**Payload:**
```json
{}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Usage:**
```typescript
import { logoutFromBackend } from '@/services/authService';

await logoutFromBackend();
// Navigate to login screen
```

### 5. Forgot Password

```
POST http://23.22.178.240/api/auth/forgot-password
```

**Payload:**
```json
{
  "email": "user@gmail.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reset code sent to your email"
}
```

**Usage:**
```typescript
import { forgotPassword } from '@/services/authService';

await forgotPassword('user@gmail.com');
// User receives reset code in email
```

### 6. Reset Password

```
POST http://23.22.178.240/api/auth/reset-password
```

**Payload:**
```json
{
  "id": "68fe885b38a9ced2ffdb0aaa",
  "password": "NewPassword@12345"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Usage:**
```typescript
import { resetPassword } from '@/services/authService';

// After user enters reset code and new password
const result = await resetPassword(
  '68fe885b38a9ced2ffdb0aaa', // ID from forgot password response
  'NewPassword@12345'
);
```

## Complete Authentication Flow

### Signup Flow

```
1. User enters: name, email, password
   ↓
2. Call signupWithBackend()
   POST /api/auth/signup
   ↓
3. Backend sends OTP to email
   ↓
4. User receives OTP in email inbox
   ↓
5. User enters OTP in app
   ↓
6. Call sendOTP(email, otp)
   POST /api/auth/send-otp
   ↓
7. Email verified → User can login
   ↓
8. Navigate to Login screen
```

### Login Flow

```
1. User enters: email, password
   ↓
2. Call loginWithBackend()
   POST /api/auth/login
   ↓
3. Backend verifies credentials
   ↓
4. Response includes JWT token
   ↓
5. Token automatically stored in SecureStore
   ↓
6. Navigate to Home screen (tabs)
```

### Password Reset Flow

```
1. User clicks "Forgot Password"
   ↓
2. User enters email
   ↓
3. Call forgotPassword(email)
   POST /api/auth/forgot-password
   ↓
4. Backend sends reset code to email
   ↓
5. User receives code in email
   ↓
6. User enters code + new password
   ↓
7. Call resetPassword(id, newPassword)
   POST /api/auth/reset-password
   ↓
8. Password reset successful
   ↓
9. Navigate to Login screen
```

## Screen Implementation Guide

### Signup Screen (`app/signup.tsx`)

```typescript typescript path=null start=null
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { signupWithBackend, sendOTP } from '@/services/authService';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'signup' | 'otp'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      await signupWithBackend({ name, email, password });
      Alert.alert('Success', 'Please check your email for OTP');
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError('');
    try {
      await sendOTP(email, otp);
      Alert.alert('Success', 'Email verified. You can now login.');
      router.replace('/login');
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
          Verify Your Email
        </Text>
        <TextInput
          placeholder="Enter OTP from email"
          value={otp}
          onChangeText={setOtp}
          editable={!loading}
          keyboardType="numeric"
        />
        {error && <Text style={{ color: 'red', marginVertical: 10 }}>{error}</Text>}
        <Button
          title={loading ? 'Verifying...' : 'Verify OTP'}
          onPress={handleVerifyOTP}
          disabled={loading || !otp}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        editable={!loading}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
        keyboardType="email-address"
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
        title={loading ? 'Creating account...' : 'Sign Up'}
        onPress={handleSignup}
        disabled={loading || !name || !email || !password}
      />
    </View>
  );
}
```

### Login Screen (`app/login.tsx`)

```typescript typescript path=null start=null
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Pressable } from 'react-native';
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
      await loginWithBackend({ email, password });
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Login failed');
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
        keyboardType="email-address"
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
      <Pressable onPress={() => router.push('/forgot-password')}>
        <Text style={{ color: 'blue', marginTop: 15, textAlign: 'center' }}>
          Forgot Password?
        </Text>
      </Pressable>
    </View>
  );
}
```

### Forgot Password Screen (`app/forgot-password.tsx`)

```typescript typescript path=null start=null
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { forgotPassword, resetPassword } from '@/services/authService';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [resetId, setResetId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleForgotPassword = async () => {
    setLoading(true);
    setError('');
    try {
      await forgotPassword(email);
      Alert.alert('Success', 'Reset code sent to your email');
      setStep('reset');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setError('');
    try {
      await resetPassword(resetId, newPassword);
      Alert.alert('Success', 'Password reset successfully');
      router.replace('/login');
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'reset') {
    return (
      <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
        <TextInput
          placeholder="Reset ID from email"
          value={resetId}
          onChangeText={setResetId}
          editable={!loading}
        />
        <TextInput
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          editable={!loading}
        />
        {error && <Text style={{ color: 'red', marginVertical: 10 }}>{error}</Text>}
        <Button
          title={loading ? 'Resetting...' : 'Reset Password'}
          onPress={handleResetPassword}
          disabled={loading || !resetId || !newPassword}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
        keyboardType="email-address"
      />
      {error && <Text style={{ color: 'red', marginVertical: 10 }}>{error}</Text>}
      <Button
        title={loading ? 'Sending...' : 'Send Reset Code'}
        onPress={handleForgotPassword}
        disabled={loading || !email}
      />
    </View>
  );
}
```

## Configuration

### 1. Update `.env`

```env
EXPO_PUBLIC_API_URL=http://23.22.178.240
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start App

```bash
npm start
```

## Updated Available Functions

All functions from `services/authService.ts`:

```typescript
// Signup & OTP
signupWithBackend(name, email, password)
sendOTP(email, otp)

// Login & Logout
loginWithBackend(email, password)
logoutFromBackend()

// 2FA
enableTwoFactor()
verifyTwoFactor(email, code)
disableTwoFactor(code)

// Password Recovery
forgotPassword(email)
resetPassword(id, password)
```

## Testing

### Test Signup
```bash
# Signup
POST http://23.22.178.240/api/auth/signup
{
  "name": "Test User",
  "email": "test@gmail.com",
  "password": "Test@12345"
}

# You'll receive OTP in email

# Verify OTP
POST http://23.22.178.240/api/auth/send-otp
{
  "email": "test@gmail.com",
  "otp": "received_otp"
}

# Now you can login
POST http://23.22.178.240/api/auth/login
{
  "email": "test@gmail.com",
  "password": "Test@12345"
}
```

---

Now your mobile app is connected to the actual backend! 🚀
