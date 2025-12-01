# 🧪 Postman Authentication Testing Guide

Quick guide to test Signup → Login flow in Postman

---

## 🌐 Backend Information

- **Base URL**: `http://23.22.178.240`
- **Environment**: Development/Production

---

## 📝 Step 1: Signup (Create Account)

### **Request**
```
POST http://23.22.178.240/api/auth/signup
```

### **Headers**
```
Content-Type: application/json
```

### **Body** (raw JSON)
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

### **Expected Response** (Success - 200/201)
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email."
}
```

### **Possible Errors**

**Email already exists (400/409)**:
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**Validation error (400)**:
```json
{
  "success": false,
  "message": "Invalid email format"
}
```

---

## 🔐 Step 2: Login (Get Auth Token)

### **Request**
```
POST http://23.22.178.240/api/auth/login
```

### **Headers**
```
Content-Type: application/json
```

### **Body** (raw JSON)
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

### **Expected Response** (Success - 200)

**Without 2FA**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123abc",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "walletAddresses": {
      "bnb": "0x1234567890abcdef...",
      "eth": "0xabcdef1234567890...",
      "arb": "0x9876543210fedcba...",
      "poly": "0xfedcba0987654321...",
      "tron": "T123456789abcdef...",
      "btc": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
    }
  }
}
```

**With 2FA Enabled**:
```json
{
  "requiresTwoFactor": true,
  "email": "john.doe@example.com"
}
```

### **Possible Errors**

**Invalid credentials (401)**:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Account not found (404)**:
```json
{
  "success": false,
  "message": "User not found"
}
```

---

## 🔑 Using the Auth Token

After successful login, **COPY THE TOKEN** from the response.

### Use it in subsequent requests:

**Example: Get user profile**
```
GET http://23.22.178.240/api/user/profile
```

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## 🎯 Complete Postman Collection (JSON)

Copy this and import into Postman:

```json
{
  "info": {
    "name": "EnPaying Auth Flow",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://23.22.178.240",
      "type": "string"
    },
    {
      "key": "auth_token",
      "value": "",
      "type": "string"
    },
    {
      "key": "user_email",
      "value": "test@example.com",
      "type": "string"
    },
    {
      "key": "user_password",
      "value": "SecurePassword123!",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "1. Signup",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"{{user_email}}\",\n  \"password\": \"{{user_password}}\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/auth/signup",
          "host": ["{{base_url}}"],
          "path": ["api", "auth", "signup"]
        }
      }
    },
    {
      "name": "2. Login",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "// Auto-save token to collection variable",
              "if (pm.response.code === 200) {",
              "    const jsonData = pm.response.json();",
              "    if (jsonData.token) {",
              "        pm.collectionVariables.set('auth_token', jsonData.token);",
              "        console.log('✅ Token saved automatically');",
              "    }",
              "}"
            ]
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"{{user_email}}\",\n  \"password\": \"{{user_password}}\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/auth/login",
          "host": ["{{base_url}}"],
          "path": ["api", "auth", "login"]
        }
      }
    },
    {
      "name": "3. Test Auth (Get Wallet)",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{auth_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/payment/wallet-addresses",
          "host": ["{{base_url}}"],
          "path": ["api", "payment", "wallet-addresses"]
        }
      }
    }
  ]
}
```

### **How to Import:**
1. Open Postman
2. Click **Import**
3. Paste the JSON above
4. Click **Import**
5. The collection will appear with all requests ready!

---

## 🔄 Testing the Complete Flow

### **Test Sequence:**

1. **Run "1. Signup"** first
   - Enter unique email (change the email if testing multiple times)
   - Should get: `"success": true`

2. **Run "2. Login"**
   - Use same email/password from signup
   - Token will be **automatically saved** to `{{auth_token}}` variable
   - Check console for "✅ Token saved automatically"

3. **Run "3. Test Auth"**
   - This will use the saved token automatically
   - Should return your wallet addresses

---

## 💡 Quick Tips

### **Change User for Each Test:**
In collection variables, update:
```
user_email = "test2@example.com"  
user_password = "SecurePassword123!"
```

### **View Saved Token:**
- Click collection name
- Go to **Variables** tab
- Look at `auth_token` value

### **Manual Token Usage:**
If auto-save doesn't work:
1. Copy token from login response
2. Go to collection Variables
3. Paste into `auth_token` Current Value

### **Test Token Expiry:**
Wait for token to expire, then:
- Run "3. Test Auth" 
- Should get: `401 Unauthorized`
- Re-run "2. Login" to get new token

---

## 🧪 Example Test Scenarios

### **Scenario 1: New User Journey**
```
1. Signup → Success
2. Login → Get token
3. Test Auth → Get wallet addresses
4. Logout → Clear token
```

### **Scenario 2: Existing User**
```
1. Login → Get token
2. Test Auth → Success
```

### **Scenario 3: Wrong Password**
```
1. Login (wrong password) → 401 Error
2. Login (correct password) → Success
```

### **Scenario 4: 2FA User**
```
1. Login → requiresTwoFactor: true
2. Verify 2FA (if UI implemented)
3. Get token
```

---

## 📊 Expected Status Codes

| Action | Success Code | Error Code |
|--------|--------------|------------|
| Signup | 200 or 201 | 400 (validation), 409 (exists) |
| Login | 200 | 401 (wrong password), 404 (not found) |
| Authenticated Request | 200 | 401 (no/invalid token) |

---

## 🚨 Troubleshooting

### **"Connection refused" or timeout**
→ Backend server is not running or wrong URL

### **"Email already registered"**
→ Use a different email or check your database

### **"401 Unauthorized" on login**
→ Check email/password are correct

### **"401 Unauthorized" on authenticated request**
→ Token expired or invalid - login again

### **No token in response**
→ Check if backend is returning token in response

---

## 🎬 Video Tutorial Alternative

If you prefer, you can also use **Postman's** built-in features:

1. **Pre-request Scripts** - Set variables before request
2. **Tests** - Auto-save tokens after request
3. **Environments** - Switch between dev/prod
4. **Collection Runner** - Run all tests in sequence

---

## ✅ Quick Start Checklist

- [ ] Import collection JSON into Postman
- [ ] Update `user_email` in collection variables
- [ ] Run "1. Signup" - Should succeed
- [ ] Run "2. Login" - Should get token
- [ ] Verify token is saved in variables tab
- [ ] Run "3. Test Auth" - Should get wallet addresses

---

**You're ready to test!** 🚀

If you encounter any errors, check:
1. Backend is running (`http://23.22.178.240`)
2. Request body format is correct
3. Headers include `Content-Type: application/json`

Need more help? Ask me about:
- Testing specific endpoints
- Debugging error responses
- Setting up Postman environments
- Testing 2FA flow
