# 🔍 OTP Verification Debug Guide

## 🚨 Issue: "Invalid OTP" Error

You're entering the **correct OTP (168128)** but getting error. This means:
- ✅ Email is being sent
- ✅ OTP is correct
- ❌ **Backend endpoint/format is wrong**

---

## 🧪 **Test with Postman to Find Correct Format**

### **Test 1: Current Format (email + otp)**
```
POST http://23.22.178.240/api/auth/send-otp

Headers:
Content-Type: application/json

Body:
{
  "email": "camila.wilson481@gmail.com",
  "otp": "168128"
}
```

### **Test 2: Alternate Field Name (email + code)**
```
POST http://23.22.178.240/api/auth/send-otp

Body:
{
  "email": "camila.wilson481@gmail.com",
  "code": "168128"
}
```

### **Test 3: Different Endpoint**
```
POST http://23.22.178.240/api/auth/verify-otp

Body:
{
  "email": "camila.wilson481@gmail.com",
  "otp": "168128"
}
```

### **Test 4: Verify Endpoint with Different Field**
```
POST http://23.22.178.240/api/auth/verify

Body:
{
  "email": "camila.wilson481@gmail.com",
  "otp": "168128"
}
```

### **Test 5: Token Field**
```
POST http://23.22.178.240/api/auth/verify-otp

Body:
{
  "email": "camila.wilson481@gmail.com",
  "token": "168128"
}
```

---

## 🎯 **Quick Test Steps:**

1. **Open Postman**
2. **Create new request**: POST
3. **Try each URL/body combination above**
4. **Find which one returns success**
5. **Tell me which format worked!**

---

## 📊 **Expected Responses:**

### **Success (200)**:
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### **Error (400)**:
```json
{
  "success": false,
  "message": "Invalid OTP"
}
```

---

## 🔧 **Console Logs to Check:**

After you try to verify OTP in the app, check the console for these logs:

```
🔵 Attempting OTP verification for: camila.wilson481@gmail.com
🔵 OTP: 168128
❌ OTP Verification Failed - Details: { ... }
```

**Share the error details** with me!

---

## 🎯 **What We'll Find:**

One of these is probably the issue:

1. **Wrong endpoint**
   - Using: `/api/auth/send-otp` 
   - Should be: `/api/auth/verify-otp` or `/api/auth/verify`

2. **Wrong field name**
   - Using: `{ email, otp }`
   - Should be: `{ email, code }` or `{ email, token }`

3. **Email case mismatch**
   - Signup: `Camila.Wilson481@gmail.com`
   - Verify: `camila.wilson481@gmail.com`

4. **Missing verification step**
   - Backend needs separate verify call before login

---

## 💡 **Quick Fix Options:**

### **Option A: Ask Backend Developer**
"What's the correct endpoint and request format for OTP verification?"

Example response should be:
```
POST /api/auth/verify-otp
Body: { "email": "...", "code": "..." }
```

### **Option B: Check Backend Code**
Look at backend route handlers:
```javascript
// What does this route expect?
router.post('/api/auth/send-otp', async (req, res) => {
  const { email, otp } = req.body; // Or is it 'code'?
  // ...
});

router.post('/api/auth/verify-otp', async (req, res) => {
  // This might be the right endpoint!
});
```

### **Option C: Test All Combinations**
Use the Postman tests above to find the right format.

---

## 📝 **Report Back:**

After testing, tell me:
1. Which endpoint worked?
2. Which field names worked?
3. What was the success response?

Then I'll update the code to use the correct format!

---

**Let's find the right endpoint!** 🔍
