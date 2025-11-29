# How to Test Your Auth Integration

## Where Your Data is Stored

### 1. Clerk (Frontend Auth)
- **Storage**: Device's SecureStore (encrypted)
- **What's stored**: User session, email, name
- **Where to check**: 
  ```
  Clerk Dashboard: https://dashboard.clerk.com
  Your account → Users → See all signed-up users
  ```

### 2. Backend Database (Your Server)
- **Storage**: MongoDB at your backend
- **What's stored**: User data (email, password hash, wallets, etc.)
- **Where to check**:
  ```
  Your backend MongoDB
  Database: users collection
  Server: http://23.22.178.240
  ```

### 3. Your Mobile App
- **Storage**: SecureStore (encrypted JWT token)
- **What's stored**: Authentication token for API calls
- **Where to check**: Console logs in your app

---

## Step-by-Step Testing

### Step 1: Test Backend Directly (Before Opening App)

Open **Postman** or **Terminal** and test:

#### Test 1: Signup
```bash
curl -X POST http://23.22.178.240/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test-user-123@gmail.com",
    "password": "Test@12345"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Signup successful. Please verify your email with OTP."
}
```

✅ **If you see this**, your backend signup works!

#### Test 2: Send OTP
```bash
curl -X POST http://23.22.178.240/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-user-123@gmail.com",
    "otp": "123456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

✅ **If you see this**, OTP verification works!

#### Test 3: Login
```bash
curl -X POST http://23.22.178.240/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-user-123@gmail.com",
    "password": "Test@12345"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Logged in successfully!",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "test-user-123@gmail.com",
      "name": "Test User"
    }
  }
}
```

✅ **If you see this with a token**, backend login works!

---

### Step 2: Test in Your Mobile App

#### Create Simple Login Screen (`app/login.tsx`)

```typescript typescript path=null start=null
import React, { useState } from 'react';
import { View, TextInput, Button, Text, ScrollView } from 'react-native';
import { loginWithClerk } from '@/services/clerkAuthService';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('test-user-123@gmail.com');
  const [password, setPassword] = useState('Test@12345');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setResponse('');
    setError('');
    
    try {
      console.log('🔵 LOGIN ATTEMPT:', { email, password });
      
      const result = await loginWithClerk({ email, password });
      
      console.log('✅ LOGIN SUCCESS:', result);
      setResponse(JSON.stringify(result, null, 2));
      
      // Navigate to home after 2 seconds
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 2000);
    } catch (err: any) {
      console.error('❌ LOGIN ERROR:', err);
      setError(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, paddingTop: 50 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Test Login
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
      />

      <Button
        title={loading ? 'Logging in...' : 'Test Login'}
        onPress={handleLogin}
        disabled={loading}
      />

      {response && (
        <View style={{ marginTop: 20, padding: 10, backgroundColor: '#e8f5e9', borderRadius: 5 }}>
          <Text style={{ color: 'green', fontWeight: 'bold', marginBottom: 10 }}>
            ✅ SUCCESS:
          </Text>
          <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>
            {response}
          </Text>
        </View>
      )}

      {error && (
        <View style={{ marginTop: 20, padding: 10, backgroundColor: '#ffebee', borderRadius: 5 }}>
          <Text style={{ color: 'red', fontWeight: 'bold', marginBottom: 10 }}>
            ❌ ERROR:
          </Text>
          <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>
            {error}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
```

#### What to Look For:

**When you click "Test Login", check 3 places:**

1. **Browser Console** (if using web simulator)
   - Look for: `🔵 LOGIN ATTEMPT: { email, password }`
   - Look for: `✅ LOGIN SUCCESS: { data }`

2. **App Screen**
   - Green box appears with token
   - Or red box appears with error message

3. **Mobile Phone Console** (if using physical device)
   - Connect with `npm start`
   - Look for console logs

---

### Step 3: Verify Data Was Stored

#### Check Clerk Dashboard
1. Go to https://dashboard.clerk.com
2. Click "Users"
3. Should see: "Test User" with email "test-user-123@gmail.com"
4. ✅ **If it's there, Clerk signup worked!**

#### Check Backend Database
1. Connect to your MongoDB (if you have access)
2. Database: Look for "users" collection
3. Find document with email: "test-user-123@gmail.com"
4. ✅ **If it's there, backend signup worked!**

---

## What Each Login Response Means

### ✅ Success Response
```json
{
  "success": true,
  "message": "Logged in successfully!",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "test@gmail.com",
      "name": "Test User"
    }
  }
}
```
**Means:** Everything works! Token is saved in your app.

### ❌ Error: User Not Found
```json
{
  "success": false,
  "message": "Authentication failed! Invalid Email or Password"
}
```
**Means:** User doesn't exist in backend. Run signup first.

### ❌ Error: Wrong Password
```json
{
  "success": false,
  "message": "Authentication failed! Invalid Email or Password"
}
```
**Means:** Password doesn't match. Check your password.

### ❌ Error: Connection Refused
```
Error: connect ECONNREFUSED 23.22.178.240:80
```
**Means:** Backend is down or wrong URL. Check:
- Is backend running?
- Is URL correct in `.env`?

---

## Full Testing Checklist

### Backend Test (Do First)
- [ ] POST /api/auth/signup → See success message
- [ ] POST /api/auth/send-otp → See OTP verified
- [ ] POST /api/auth/login → See JWT token returned
- [ ] Check Clerk dashboard → User exists
- [ ] Check MongoDB → User document exists

### Mobile App Test
- [ ] Run `npm start`
- [ ] Open login screen
- [ ] Enter: test-user-123@gmail.com / Test@12345
- [ ] Click "Test Login"
- [ ] See green success box with token
- [ ] App navigates to home screen
- [ ] Check console logs → See ✅ SUCCESS

---

## Debugging: If Something Doesn't Work

### Problem: "Connection refused"
```
Fix: Check .env
EXPO_PUBLIC_API_URL=http://23.22.178.240
```

### Problem: "Invalid email or password"
```
Fix: Make sure user exists
1. Run signup endpoint first
2. Run send-otp to verify email
3. Then run login
```

### Problem: "No response from app"
```
Fix: Check console logs
1. npm start
2. Open app
3. Look for console logs
4. You should see: 🔵 LOGIN ATTEMPT
```

### Problem: "Token not saved"
```
Fix: Check SecureStore
The token is saved automatically by apiClient.ts
Check if `setAuthToken()` is being called
```

---

## Checklist: When Everything Works

✅ Backend signup returns success  
✅ Backend OTP verification works  
✅ Backend login returns JWT token  
✅ User appears in Clerk dashboard  
✅ User appears in MongoDB  
✅ Mobile app shows success message  
✅ App navigates to home screen  
✅ Console shows ✅ SUCCESS logs  

**When all 8 are ✅, your auth integration is working!** 🎉

---

## Next: What Happens After Login

Once login works, the token is automatically:
1. **Saved** in SecureStore (encrypted)
2. **Attached** to all API requests via interceptor
3. **Used** to authenticate with your backend
4. **Renewed** if it expires (auto-retry)

You don't need to do anything - it's automatic!

---

## Quick Debug Commands

### Run from terminal to test backend:
```bash
# Test backend health
curl http://23.22.178.240/api/health

# Test signup
curl -X POST http://23.22.178.240/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Test@123"}'

# Test login
curl -X POST http://23.22.178.240/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@123"}'
```

---

**Now you know where everything is stored and how to test it!** 🚀
