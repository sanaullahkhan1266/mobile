# 🚀 Complete Signup → OTP → Dashboard Flow

## ✅ Auto-Login After OTP Verification!

Your auth service now automatically logs users in after they verify their OTP, taking them straight to the dashboard!

---

## 📱 Complete Example - Signup with Auto-Login

```typescript
import { useState } from 'react';
import { View, TextInput, Button, Alert, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { signupWithBackend, verifyOTPAndLogin } from '@/services/authService';
import { validatePassword } from '@/utils/passwordValidator';

export default function SignupScreen() {
  const router = useRouter();
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(null);
  
  // OTP state
  const [showOTPScreen, setShowOTPScreen] = useState(false);
  const [otp, setOTP] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Store password for auto-login after OTP
  const [savedPassword, setSavedPassword] = useState('');
  const [savedEmail, setSavedEmail] = useState('');

  // Real-time password validation
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const strength = validatePassword(value);
    setPasswordStrength(strength);
  };

  // STEP 1: Signup - Backend sends OTP
  const handleSignup = async () => {
    setIsLoading(true);
    try {
      await signupWithBackend({
        name: name.trim(),
        email: email.trim(),
        password
      });

      // Save for auto-login after OTP
      setSavedEmail(email);
      setSavedPassword(password);

      Alert.alert(
        'OTP Sent! 📧',
        `We've sent a verification code to ${email}.\n\nPlease check your email and enter the code below.`,
        [{ 
          text: 'OK', 
          onPress: () => setShowOTPScreen(true) 
        }]
      );
    } catch (error) {
      if (error.details) {
        Alert.alert(
          'Weak Password',
          error.details.join('\n\n'),
          [{ text: 'Try Again' }]
        );
      } else {
        Alert.alert('Signup Failed', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Verify OTP and Auto-Login!
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit code from your email');
      return;
    }

    setIsLoading(true);
    try {
      // ✅ This verifies OTP AND logs you in automatically!
      const authResponse = await verifyOTPAndLogin(
        savedEmail,
        otp,
        savedPassword
      );

      console.log('✅ User logged in:', authResponse.user);

      // Success! Go to dashboard
      router.replace('/(tabs)');
      
      // Optional: Show welcome message
      setTimeout(() => {
        Alert.alert(
          'Welcome! 🎉',
          `Account created successfully!\n\nWelcome, ${authResponse.user.name}!`
        );
      }, 500);

    } catch (error) {
      if (error.statusCode === 400) {
        Alert.alert(
          'Invalid OTP',
          'The code you entered is incorrect or has expired.\n\nPlease try again or request a new code.',
          [
            { text: 'Try Again', style: 'cancel' },
            { text: 'Resend OTP', onPress: handleResendOTP }
          ]
        );
      } else {
        Alert.alert('Verification Failed', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP if needed
  const handleResendOTP = async () => {
    try {
      await signupWithBackend({
        name,
        email: savedEmail,
        password: savedPassword
      });
      Alert.alert('OTP Resent', 'A new verification code has been sent to your email');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      {!showOTPScreen ? (
        // ============ SIGNUP FORM ============
        <>
          <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 30 }}>
            Create Account
          </Text>

          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text.toLowerCase())}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            style={styles.input}
          />

          {/* Password strength indicator */}
          {passwordStrength && (
            <View style={{
              marginBottom: 20,
              padding: 15,
              backgroundColor: passwordStrength.isValid ? '#e8f5e9' : '#ffebee',
              borderRadius: 8
            }}>
              <Text style={{
                fontWeight: 'bold',
                color: passwordStrength.isValid ? '#2e7d32' : '#c62828',
                marginBottom: 5
              }}>
                Password Strength: {passwordStrength.strength}
              </Text>
              {passwordStrength.feedback.map((item, index) => (
                <Text
                  key={index}
                  style={{
                    color: passwordStrength.isValid ? '#4caf50' : '#f44336',
                    fontSize: 13
                  }}
                >
                  {passwordStrength.isValid ? '✓' : '•'} {item}
                </Text>
              ))}
            </View>
          )}

          <Button
            title={isLoading ? 'Creating Account...' : 'Sign Up'}
            onPress={handleSignup}
            disabled={!passwordStrength?.isValid || isLoading || !name || !email}
          />

          <Button
            title="Already have an account? Login"
            onPress={() => router.push('/login')}
            color="#666"
          />
        </>
      ) : (
        // ============ OTP VERIFICATION FORM ============
        <>
          <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10 }}>
            Verify Email
          </Text>
          
          <Text style={{ marginBottom: 30, color: '#666', fontSize: 16 }}>
            We've sent a 6-digit code to{'\n'}
            <Text style={{ fontWeight: 'bold', color: '#000' }}>{savedEmail}</Text>
          </Text>

          <TextInput
            placeholder="Enter 6-digit code"
            value={otp}
            onChangeText={(text) => setOTP(text.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            maxLength={6}
            style={{
              borderWidth: 2,
              borderColor: otp.length === 6 ? '#4caf50' : '#ddd',
              padding: 15,
              marginBottom: 20,
              fontSize: 24,
              textAlign: 'center',
              letterSpacing: 10,
              fontWeight: 'bold',
              borderRadius: 8
            }}
          />

          {isLoading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <>
              <Button
                title="Verify and Continue"
                onPress={handleVerifyOTP}
                disabled={otp.length !== 6}
              />

              <View style={{ marginTop: 15 }}>
                <Button
                  title="Resend OTP"
                  onPress={handleResendOTP}
                  color="#666"
                />
              </View>

              <View style={{ marginTop: 10 }}>
                <Button
                  title="Change Email"
                  onPress={() => {
                    setShowOTPScreen(false);
                    setOTP('');
                  }}
                  color="#999"
                />
              </View>
            </>
          )}

          <Text style={{ marginTop: 20, textAlign: 'center', color: '#999', fontSize: 12 }}>
            Didn't receive the code? Check your spam folder or tap Resend OTP
          </Text>
        </>
      )}
    </View>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16
  }
};
```

---

## 🔄 Complete Flow Diagram

```
┌─────────────────┐
│  SIGNUP FORM    │
│                 │
│  - Name         │
│  - Email        │
│  - Password     │ ← Password validated in real-time
│                 │
│  [Sign Up]      │
└────────┬────────┘
         │
         ↓ signupWithBackend()
         │ OTP sent to email
         │
┌────────┴────────┐
│  OTP SCREEN     │
│                 │
│  Enter code:    │
│  [ 1 2 3 4 5 6 ]│
│                 │
│  [Verify]       │
└────────┬────────┘
         │
         ↓ verifyOTPAndLogin()
         │ ✅ OTP verified
         │ ✅ Auto-logged in
         │ ✅ Session saved
         │
┌────────┴────────┐
│   DASHBOARD     │
│                 │
│  Welcome! 🎉    │
│                 │
│  [Your App]     │
└─────────────────┘
```

---

## ✨ What Happens Behind the Scenes

### **Step 1: Signup**
```typescript
await signupWithBackend({ name, email, password });
```

**Backend does:**
1. ✅ Validates password strength
2. ✅ Creates user account (unverified)
3. ✅ Sends OTP to email
4. ✅ Returns success message

### **Step 2: Verify OTP with Auto-Login**
```typescript
const authResponse = await verifyOTPAndLogin(email, otp, password);
```

**Backend does:**
1. ✅ Verifies OTP code
2. ✅ Activates account
3. ✅ **Automatically logs in user**
4. ✅ Returns auth token + user data
5. ✅ **Session saved** for persistence

### **Step 3: Navigate to Dashboard**
```typescript
router.replace('/(tabs)');
```

**User is now:**
- ✅ Logged in
- ✅ Session persists (7 days)
- ✅ Can access all protected routes
- ✅ Will auto-login on app restart

---

## 🎯 Key Functions

### **1. signupWithBackend()**
```typescript
const result = await signupWithBackend({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePass123!'
});

// Returns: { success: true, message: "OTP sent to email" }
```

### **2. verifyOTPAndLogin()** ⭐ NEW!
```typescript
const authResponse = await verifyOTPAndLogin(
  email,      // User's email
  otp,        // Code from email
  password    // Password they signed up with
);

// Returns full auth response with token and user data
// User is logged in and can access dashboard!
```

### **3. Alternative: verifyOTP()** (manual login)
```typescript
// If you want to manually handle login:
await verifyOTP(email, otp);        // Just verifies OTP
await loginWithBackend({ email, password }); // Manual login
router.push('/(tabs)');
```

---

## ✅ Benefits of Auto-Login

1. **Seamless UX** - Users go straight to dashboard after verification
2. **No extra step** - Don't need to manually login after signup
3. **Session saved** - Works across app restarts
4. **Secure** - Password validated before signup
5. **Error handling** - Clear messages if anything fails

---

## 🧪 Testing the Flow

1. **Enter signup details**
   - Name: Test User
   - Email: test@gmail.com
   - Password: SecurePass123!

2. **See password strength** in real-time

3. **Click "Sign Up"** → OTP screen appears

4. **Check email** for OTP code (e.g., 123456)

5. **Enter OTP** → Automatically logged in!

6. **Dashboard appears** → User is logged in

7. **Close and reopen app** → Still logged in!

---

## 💡 Tips

### **Password Requirements:**
- Minimum 8 characters
- Uppercase + lowercase
- Numbers + special characters
- Not a common password

### **OTP Handling:**
- Usually expires in 5-10 minutes
- Can resend if needed
- Must match exactly (6 digits)

### **Error Messages:**
- "Weak Password" → Shows what's missing
- "Invalid OTP" → Let user try again or resend
- "Account Locked" → Too many failed attempts

---

**You're all set! The flow is:** 

**Signup → OTP Screen → Dashboard** 🚀

No extra login step needed!
