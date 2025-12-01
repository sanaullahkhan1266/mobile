# 🚀 Quick Postman Reference Card

## 📍 Your Backend URL
```
http://23.22.178.240
```

---

## ⚡ Complete Auth Flow

```
SIGNUP → Check Email → VERIFY OTP → LOGIN → Use Token
```

---

## 1️⃣ SIGNUP (Get OTP)

**Endpoint**: `POST /api/auth/signup`

**Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response**:
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

**📧 Check your email for OTP!**

---

## 2️⃣ VERIFY OTP

**Endpoint**: `POST /api/auth/send-otp`

**Body**:
```json
{
  "email": "john.doe@example.com",
  "otp": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

## 3️⃣ LOGIN (Get Token)

**Endpoint**: `POST /api/auth/login`

**Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "john.doe@example.com",
    "name": "John Doe"
  }
}
```

🔑 **COPY THE TOKEN!**

---

## 4️⃣ USE TOKEN

**Any Protected Route**:

**Headers**:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Example**:
```
GET /api/payment/wallet-addresses
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📋 All Available Endpoints

### Auth
```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/send-otp
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Payment
```
GET  /api/payment/wallet-addresses
GET  /api/payment/balance
POST /api/payment/charge
GET  /api/payment/charges
```

### Cards
```
POST /api/card/create
GET  /api/card/list
GET  /api/card/:cardId
```

### Transactions
```
POST /api/tx/send
GET  /api/tx/history
```

### 2FA
```
POST /api/2fa/enable
POST /api/2fa/disable
POST /api/2fa/verify
```

---

## ⚡ Quick Copy-Paste

### Signup Request
```bash
curl -X POST http://23.22.178.240/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

### Login Request
```bash
curl -X POST http://23.22.178.240/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

### Authenticated Request
```bash
curl -X GET http://23.22.178.240/api/payment/wallet-addresses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

---

## 🎯 Testing Checklist

- [ ] Signup with new email
- [ ] Login with same credentials
- [ ] Copy token from response
- [ ] Use token in Authorization header
- [ ] Test protected endpoint

---

## 🚨 Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Connection refused | Backend not running | Start backend server |
| 400 Bad Request | Invalid JSON | Check request body format |
| 401 Unauthorized | No/invalid token | Login again to get new token |
| 409 Conflict | Email exists | Use different email or login |
| 404 Not Found | Wrong endpoint | Check URL path |

---

**Need the full guide?** See `POSTMAN_AUTH_TESTING.md`
