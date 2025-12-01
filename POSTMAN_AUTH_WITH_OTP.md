# 🔐 Complete Signup Flow with OTP Verification

## Your Backend Uses OTP! 📧

After signup, you'll receive an OTP (One-Time Password) via email that you need to verify.

---

## 🎯 Complete Flow

```
1. SIGNUP → Backend sends OTP to your email
2. VERIFY OTP → Activate your account  
3. LOGIN → Get auth token
4. USE TOKEN → Access protected routes
```

---

## Step 1️⃣: SIGNUP (Register)

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

### **Response**
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

**📧 Check your email for the OTP code!**

---

## Step 2️⃣: VERIFY OTP

After receiving the OTP in your email (e.g., "123456"):

### **Request**
```
POST http://23.22.178.240/api/auth/send-otp
```

### **Headers**
```
Content-Type: application/json
```

### **Body** (raw JSON)
```json
{
  "email": "john.doe@example.com",
  "otp": "123456"
}
```

### **Response** (Success)
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### **Response** (Wrong OTP)
```json
{
  "success": false,
  "message": "Invalid OTP"
}
```

---

## Step 3️⃣: LOGIN (Get Token)

Now that your account is verified, you can login:

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

### **Response**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123abc",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "walletAddresses": {
      "bnb": "0x1234...",
      "eth": "0xabcd...",
      "arb": "0x9876...",
      "poly": "0xfedc...",
      "tron": "T1234...",
      "btc": "1A1zP..."
    }
  }
}
```

**🔑 COPY THE TOKEN!**

---

## Step 4️⃣: USE TOKEN

Use the token in the Authorization header for protected routes:

### **Example: Get Wallet Addresses**
```
GET http://23.22.178.240/api/payment/wallet-addresses
```

### **Headers**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### **Response**
```json
{
  "bnb": "0x1234567890abcdef...",
  "eth": "0xabcdef1234567890...",
  "arb": "0x9876543210fedcba...",
  "poly": "0xfedcba0987654321...",
  "tron": "T123456789abcdef...",
  "btc": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
}
```

---

## 📦 Complete Postman Collection (with OTP)

Import this into Postman:

```json
{
  "info": {
    "name": "EnPaying Auth with OTP",
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
    },
    {
      "key": "otp_code",
      "value": "",
      "type": "string",
      "description": "Enter OTP from email"
    }
  ],
  "item": [
    {
      "name": "1. Signup (Get OTP)",
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
          "raw": "{\n  \"name\": \"Test User\",\n  \"email\": \"{{user_email}}\",\n  \"password\": \"{{user_password}}\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/auth/signup",
          "host": ["{{base_url}}"],
          "path": ["api", "auth", "signup"]
        },
        "description": "Register new user. OTP will be sent to email."
      }
    },
    {
      "name": "2. Verify OTP",
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
          "raw": "{\n  \"email\": \"{{user_email}}\",\n  \"otp\": \"{{otp_code}}\"\n}",
          "options": {
            "raw": {
              "description": "Enter OTP from email in collection variables"
            }
          }
        },
        "url": {
          "raw": "{{base_url}}/api/auth/send-otp",
          "host": ["{{base_url}}"],
          "path": ["api", "auth", "send-otp"]
        },
        "description": "Verify OTP received via email. Update 'otp_code' variable first!"
      }
    },
    {
      "name": "3. Login (Get Token)",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "// Auto-save token",
              "if (pm.response.code === 200) {",
              "    const jsonData = pm.response.json();",
              "    if (jsonData.token) {",
              "        pm.collectionVariables.set('auth_token', jsonData.token);",
              "        console.log('✅ Token saved:', jsonData.token.substring(0, 20) + '...');",
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
        },
        "description": "Login after OTP verification. Token auto-saved."
      }
    },
    {
      "name": "4. Get Wallet Addresses",
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
        },
        "description": "Test authenticated request with token"
      }
    },
    {
      "name": "5. Get Balance",
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
          "raw": "{{base_url}}/api/payment/balance",
          "host": ["{{base_url}}"],
          "path": ["api", "payment", "balance"]
        }
      }
    },
    {
      "name": "6. Logout",
      "request": {
        "method": "POST",
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
          "raw": "{{base_url}}/api/auth/logout",
          "host": ["{{base_url}}"],
          "path": ["api", "auth", "logout"]
        }
      }
    }
  ]
}
```

---

## 🎬 Step-by-Step Testing Guide

### **1. Import Collection**
- Copy the JSON above
- Postman → **Import** → Paste → **Import**

### **2. Update Variables**
- Click collection name
- Go to **Variables** tab
- Set `user_email` to your test email
- Set `user_password` to your password
- Leave `otp_code` empty for now

### **3. Run Signup**
- Click "1. Signup (Get OTP)"
- Click **Send**
- You should see: `"message": "OTP sent to your email"`

### **4. Check Email**
- Open your email inbox
- Find the OTP code (e.g., "123456")

### **5. Update OTP Variable**
- Go to collection **Variables** tab
- Set `otp_code` to the code from email (e.g., "123456")
- Click **Save**

### **6. Run OTP Verification**
- Click "2. Verify OTP"
- Click **Send**
- You should see: `"message": "Email verified successfully"`

### **7. Run Login**
- Click "3. Login (Get Token)"
- Click **Send**
- Token will be **auto-saved** to `auth_token` variable
- Check console: "✅ Token saved"

### **8. Test Protected Route**
- Click "4. Get Wallet Addresses"
- Click **Send**
- Should return your wallet addresses

---

## 🔄 Visual Flow Diagram

```
┌─────────────┐
│   SIGNUP    │ → Backend sends OTP to email
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Check Email │ → Copy OTP code (e.g., 123456)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ VERIFY OTP  │ → Account activated
└──────┬──────┘
       │
       ↓
┌─────────────┐
│    LOGIN    │ → Receive auth token
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  USE TOKEN  │ → Access all protected routes
└─────────────┘
```

---

## 💡 Important Notes

### **OTP Expiry**
- OTPs usually expire after 5-10 minutes
- If expired, you may need to request a new one

### **OTP Already Used**
- Each OTP can typically only be used once
- If you get "OTP already used", signup again with different email

### **Can't Find Email?**
- Check spam/junk folder
- Make sure email address is correct
- Check backend logs for sent OTP

### **Testing with Same Email**
- You might not be able to signup twice with same email
- Use different emails: test1@example.com, test2@example.com, etc.

---

## 🚨 Troubleshooting

### **"OTP sent" but no email received**
- Check spam folder
- Verify email service is configured on backend
- Ask backend dev to check logs

### **"Invalid OTP"**
- Make sure you copied the correct code
- Check if OTP expired
- Verify email matches the one you signed up with

### **"Email already registered"**
- Use a different email
- Or check if account already exists and just login

### **"Account not verified" on login**
- You forgot to verify OTP
- Run step 2 (Verify OTP) first

---

## ✅ Quick Testing Checklist

- [ ] Run "1. Signup" with unique email
- [ ] Check email inbox for OTP
- [ ] Copy OTP code from email
- [ ] Update `otp_code` in collection variables
- [ ] Run "2. Verify OTP" - should succeed
- [ ] Run "3. Login" - should get token
- [ ] Token auto-saved to `auth_token` variable
- [ ] Run "4. Get Wallet Addresses" - should succeed

---

## 🎯 Example Test Run

```
Email: john.test@gmail.com
Password: SecurePass123!

Step 1: Signup → Success, "OTP sent"
Step 2: Check email → OTP: 847362
Step 3: Update otp_code variable → "847362"
Step 4: Verify OTP → Success, "Email verified"
Step 5: Login → Token: eyJhbGc...
Step 6: Get Wallets → Success, addresses returned
```

---

**You're all set!** 🚀

The key difference is:
1. **Signup** → Wait for email
2. **Enter OTP** → Verify account
3. **Login** → Get token

Need help with any step? Let me know!
