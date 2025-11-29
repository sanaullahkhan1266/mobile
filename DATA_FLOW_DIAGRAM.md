# Where Your Data Goes - Visual Guide

## The Complete Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR MOBILE APP                          │
│  (React Native - Runs on your phone)                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. USER ENTERS EMAIL & PASSWORD                            │
│     ↓                                                         │
│  2. SENDS TO CLERK (External Auth Service)                  │
│     ↓                                                         │
│  3. CLERK VERIFIES & CREATES SESSION                        │
│     ↓                                                         │
│  4. SENDS EMAIL VERIFICATION CODE                           │
│     ↓                                                         │
│  5. USER ENTERS OTP CODE                                    │
│     ↓                                                         │
│  6. SESSION CREATED IN CLERK                                │
│     ↓                                                         │
│  7. SENDS TO YOUR BACKEND (http://23.22.178.240)           │
│     ↓                                                         │
│  8. BACKEND STORES IN MONGODB                               │
│     ↓                                                         │
│  9. BACKEND RETURNS JWT TOKEN                               │
│     ↓                                                         │
│  10. TOKEN SAVED IN SECURESTORE (Encrypted)                 │
│     ↓                                                         │
│  11. USER LOGGED IN ✅                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Where Data is Stored

```
┌──────────────────────────────────┐
│  CLERK DASHBOARD                 │
│  (Auth Service)                  │
├──────────────────────────────────┤
│  • User session                  │
│  • Email                         │
│  • Name                          │
│  • Auth status                   │
│                                  │
│  Link: dashboard.clerk.com       │
└──────────────────────────────────┘
              ↕
┌──────────────────────────────────┐
│  YOUR MOBILE APP                 │
│  (Encrypted SecureStore)         │
├──────────────────────────────────┤
│  • JWT Token (encrypted)         │
│  • Session data                  │
│  • User preferences              │
│                                  │
│  Auto-attached to all API calls  │
└──────────────────────────────────┘
              ↕
┌──────────────────────────────────┐
│  YOUR BACKEND SERVER             │
│  (MongoDB Database)              │
├──────────────────────────────────┤
│  • User email                    │
│  • Password hash (bcrypt)        │
│  • Wallet addresses              │
│  • User profile                  │
│  • 2FA settings                  │
│                                  │
│  Server: 23.22.178.240           │
│  Database: MongoDB               │
└──────────────────────────────────┘
```

---

## Authentication Request Flow

```
MOBILE APP (Your Phone)
    |
    | 1. loginWithClerk({ email, password })
    |
    ↓
CLERK SERVERS (Verify credentials)
    |
    | 2. Clerk checks if email exists
    | 3. Clerk verifies password
    | 4. Sends OTP to email
    |
    ↓
YOUR EMAIL
    |
    | 5. User receives OTP
    |
    ↓
MOBILE APP (User enters OTP)
    |
    | 6. User types OTP code
    | 7. sendOTP({ email, otp })
    |
    ↓
CLERK SERVERS
    |
    | 8. Clerk verifies OTP
    | 9. Creates session
    |
    ↓
YOUR MOBILE APP (Session created)
    |
    | 10. Sends login request to backend
    |
    ↓
YOUR BACKEND (http://23.22.178.240)
    |
    | 11. Receives: { email, password }
    | 12. Finds user in MongoDB
    | 13. Compares password hash
    | 14. Generates JWT token
    | 15. Returns token
    |
    ↓
YOUR MOBILE APP
    |
    | 16. Token received ✅
    | 17. Saved in SecureStore (encrypted)
    | 18. Auto-attached to future requests
    |
    ↓
LOGGED IN ✅
```

---

## What Happens Behind the Scenes

### When User Logs In:

```
App Code:
  const result = await loginWithClerk({ email, password });
              ↓
API Client (utils/apiClient.ts):
  1. Creates HTTP request
  2. Adds headers: Content-Type: application/json
  3. Sends to: http://23.22.178.240/api/auth/login
              ↓
Backend (Node.js/Express):
  1. Receives request
  2. Validates email/password format
  3. Queries MongoDB: users.findOne({ email })
  4. Compares password: bcrypt.compare(password, hash)
  5. If match → generates JWT token
  6. Returns: { token, user }
              ↓
App receives response:
  1. API interceptor catches response
  2. Calls: setAuthToken(token)
  3. Token saved to SecureStore
  4. User object displayed on app
  5. Navigation to home screen
```

---

## Where to Check If It Works

### Check 1: Backend (Terminal/Postman)
```
curl -X POST http://23.22.178.240/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"Test@123"}'

Response:
✅ { "success": true, "data": { "token": "...", "user": {...} } }
❌ { "success": false, "message": "Invalid email or password" }
```

### Check 2: Mobile App (Visual)
```
When you click "Login":
✅ Green box with token → Login worked
❌ Red box with error → Login failed
❌ No response → API not responding
```

### Check 3: Console Logs (Mobile)
```
npm start
→ Open app
→ Look for:
  🔵 LOGIN ATTEMPT: { email, password }
  ✅ LOGIN SUCCESS: { token, user }
```

### Check 4: Clerk Dashboard
```
Go to: https://dashboard.clerk.com
→ Users section
→ Should see your test user
✅ User listed → Clerk received signup
```

### Check 5: MongoDB
```
Connect to MongoDB
→ Database: khata-system (or your db name)
→ Collection: users
→ Find document with your test email
✅ Document exists → Backend stored data
```

---

## Example: Complete Test Scenario

```
STEP 1: Test Backend
curl -X POST http://23.22.178.240/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"Test@123"}'
Response: ✅ { "success": true }

STEP 2: Verify OTP
curl -X POST http://23.22.178.240/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","otp":"123456"}'
Response: ✅ { "success": true }

STEP 3: Test Backend Login
curl -X POST http://23.22.178.240/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"Test@123"}'
Response: ✅ { "success": true, "data": { "token": "..." } }

STEP 4: Check Clerk
https://dashboard.clerk.com → Users → See "John"
✅ User found

STEP 5: Check MongoDB
MongoDB client → Connect → Find email "john@test.com"
✅ User document found

STEP 6: Test Mobile App
npm start
→ Click Login
→ See green box with token
✅ Login worked
```

---

## Troubleshooting Checklist

| Issue | Where to Check | Fix |
|-------|---|---|
| "Connection refused" | `.env` file | Make sure `EXPO_PUBLIC_API_URL=http://23.22.178.240` |
| "User not found" | Backend logs | Run signup first, then send-otp, then login |
| "Invalid password" | Backend logs | Check password spelling matches |
| No response on app | Console logs | Run `npm start` and look for errors |
| Green box shows "null" | SecureStore | Token wasn't saved - check `setAuthToken()` |
| User not in Clerk | Clerk dashboard | User signed up but not with Clerk - use signup screen |
| User not in MongoDB | MongoDB client | Backend signup wasn't called - check API logs |

---

## Summary

**3 Systems Talking to Each Other:**
1. **Clerk** → Handles authentication (session, email verification)
2. **Your Backend** → Stores user data (MongoDB)
3. **Your Phone** → Shows UI and stores encrypted token

**Data Flow:**
```
Phone → Clerk → (Email OTP) → Phone → Backend → MongoDB → Phone
```

**When Everything Works:**
- ✅ Clerk dashboard shows user
- ✅ MongoDB has user document
- ✅ Phone shows green "success" box
- ✅ Console shows ✅ SUCCESS logs

**That's it!** 🚀
