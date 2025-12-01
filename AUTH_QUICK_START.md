# 🚀 Quick Start - Enhanced JWT Auth

## Your Auth is Now Production-Ready! ✅

I've upgraded your authentication system with enterprise-grade security.

---

## ⚡ What Changed?

### **Old Way** (Basic):
```typescript
// ❌ No validation, no security
const result = await signupWithBackend({
  name,  
  email,
  password: '123'  // Weak password accepted!
});
```

### **New Way** (Secure):
```typescript
// ✅ Validates password, tracks attempts, prevents abuse
try {
  const result = await signupWithBackend({
    name,
    email,
    password: 'SecurePass123!'  // Validated automatically
  });
  
  // OTP sent!
} catch (error) {
  // Clear error messages with helpful feedback
  Alert.alert('Error', error.message);
}
```

---

## 📋 Complete Example - Signup Screen

```typescript
import { useState } from 'react';
import { signupWithBackend, verifyOTP } from '@/services/authService';
import { validatePassword } from '@/utils/passwordValidator';
import { Alert } from 'react-native';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState('');

  // Real-time password validation
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const strength = validatePassword(value);
    setPasswordStrength(strength);
  };

  // Step 1: Signup
  const handleSignup = async () => {
    try {
      await signupWithBackend({ name, email, password });
      
      Alert.alert('Success', 'OTP sent to your email!');
      setShowOTP(true);
    } catch (error) {
      if (error.details) {
        // Password validation failed
        Alert.alert(
          'Weak Password',
          error.details.join('\n\n')
        );
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    try {
      await verifyOTP(email, otp);
      
      Alert.alert('Success', 'Account activated!');
      router.push('/login');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      {!showOTP ? (
        <>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
          />
          
          {/* Password strength indicator */}
          {passwordStrength && (
            <View>
              <Text>Strength: {passwordStrength.strength}</Text>
              {passwordStrength.feedback.map((item) => (
                <Text key={item}>• {item}</Text>
              ))}
            </View>
          )}

          <Button 
            title="Sign Up" 
            onPress={handleSignup}
            disabled={!passwordStrength?.isValid}
          />
        </>
      ) : (
        <>
          <Text>Enter OTP sent to {email}</Text>
          <TextInput
            placeholder="123456"
            value={otp}
            onChangeText={setOTP}
            keyboardType="number-pad"
          />
          <Button title="Verify" onPress={handleVerifyOTP} />
        </>
      )}
    </View>
  );
}
```

---

## 📋 Complete Example - Login Screen

```typescript
import { useState } from 'react';
import { loginWithBackend, verifyTwoFactor } from '@/services/authService';
import SessionManager from '@/utils/sessionManager';
import { Alert } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const handleLogin = async () => {
    try {
      const result = await loginWithBackend({ email, password });

      if ('requiresTwoFactor' in result) {
        // 2FA required
        setShow2FA(true);
      } else {
        // Success! Session saved automatically
        Alert.alert('Welcome', `Logged in as ${result.user.name}`);
        router.replace('/(tabs)');
      }
    } catch (error) {
      if (error.statusCode === 429) {
        Alert.alert(
          'Account Locked',
          'Too many failed attempts. Try again in 15 minutes.'
        );
      } else {
        Alert.alert('Login Failed', error.message);
      }
    }
  };

  const handle2FA = async () => {
    try {
      const result = await verifyTwoFactor(email, twoFactorCode);
      
      Alert.alert('Welcome', `Logged in as ${result.user.name}`);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Invalid Code', error.message);
    }
  };

  return (
    <View>
      {!show2FA ? (
        <>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="Login" onPress={handleLogin} />
        </>
      ) : (
        <>
          <Text>Enter 2FA Code</Text>
          <TextInput
            placeholder="123456"
            value={twoFactorCode}
            onChangeText={setTwoFactorCode}
            keyboardType="number-pad"
          />
          <Button title="Verify" onPress={handle2FA} />
        </>
      )}
    </View>
  );
}
```

---

## 📋 Auto-Login on App Restart

```typescript
// In your root layout (_layout.tsx or index.tsx)
import { useEffect } from 'react';
import SessionManager from '@/utils/sessionManager';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const restored = await SessionManager.restoreSession();
        
        if (restored) {
          console.log('✅ Session restored - user logged in');
          // Navigate to home
          router.replace('/(tabs)');
        } else {
          console.log('ℹ️ No session - show login');
        }
      } catch (error) {
        console.error('Session restore failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <YourNormalLayout />;
}
```

---

## 📋 Logout

```typescript
import { logoutFromBackend } from '@/services/authService';

const handleLogout = async () => {
  try {
    await logoutFromBackend();
    
    // Session cleared, tokens removed
    router.replace('/login');
  } catch (error) {
    Alert.alert('Logout Failed', error.message);
  }
};
```

---

## 🎯 Key Features You Get

### 1. **Password Validation**
```typescript
import { validatePassword } from '@/utils/passwordValidator';

const result = validatePassword('weak');
// Returns: { score: 1, isValid: false, feedback: [...] }
```

### 2. **Session Persistence** 
- User stays logged in for 7 days
- Auto-restores on app restart
- Expires after 30 minutes of inactivity

### 3. **Account Lockout**
- 5 failed login attempts = 15-minute lockout
- Automatically cleared on successful login

### 4. **CSRF Protection**
- Automatically adds CSRF tokens to requests
- No manual work needed

### 5. **Enhanced Errors**
```typescript
try {
  await loginWithBackend({ email, password });
} catch (error) {
  console.log(error.message);    // "Invalid credentials"
  console.log(error.statusCode); // 401
  console.log(error.details);    // Additional info if available
}
```

---

## ✅ Testing Flow

1. **Signup**:
   - Try weak password → Should reject
   - Use strong password → Should succeed
   - Check email for OTP

2. **Verify OTP**:
   - Enter OTP from email
   - Account activated

3. **Login**:
   - Login with credentials
   - Session saved automatically

4. **Close & Reopen App**:
   - Should auto-login (session restored)

5. **Logout**:
   - Session cleared
   - Navigate to login

---

## 🚨 Common Issues

### "Password does not meet requirements"
- Must be 8+ characters
- Must have uppercase, lowercase, number, special char
- Cannot be common password (e.g., "password123")

### "Account temporarily locked"
- Too many failed login attempts (5)
- Wait 15 minutes or try different account

###  "Invalid OTP"
- OTP expired (usually 5-10 minutes)
- Check email for latest OTP
- Make sure no typos

---

## 📊 Testing Checklist

- [ ] Weak password rejected ✅
- [ ] Strong password accepted ✅
- [ ] OTP verification works ✅
- [ ] Login successful ✅
- [ ] Session persists after app restart ✅
- [ ] 5 failed logins locks account ✅
- [ ] Logout clears session ✅

---

## 🎉 You're Ready!

Your authentication system now has:
- ✅ Password validation
- ✅ Session management
- ✅ CSRF protection
- ✅ Account lockout
- ✅ Rate limiting
- ✅ Enhanced security

**Just import and use!** Everything is already integrated and working.

Need help? Check:
- `AUTH_IMPROVEMENTS_COMPLETE.md` - Full documentation
- `AUTH_SECURITY_AUDIT_REPORT.md` - Security details
- `POSTMAN_AUTH_WITH_OTP.md` - API testing guide
