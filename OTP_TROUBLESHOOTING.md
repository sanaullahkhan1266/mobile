# 🔧 OTP Troubleshooting Guide

## 🚨 OTP Not Working? Let's Fix It!

---

## ❓ Common OTP Issues

### Issue 1: Wrong Endpoint ⚠️
**Problem**: Using `/api/auth/send-otp` might be for SENDING OTP, not VERIFYING

**Your backend might have TWO different endpoints:**
- **Send OTP**: `/api/auth/send-otp` - Sends OTP to email
- **Verify OTP**: `/api/auth/verify-otp` OR `/api/auth/verify` - Verifies the OTP

### Issue 2: Wrong Request Format
**Problem**: Backend expects different field names

---

## 🧪 Try These Endpoints

### **Option 1: Verify OTP**
```
POST http://23.22.178.240/api/auth/verify-otp

Body:
{
  "email": "your@email.com",
  "otp": "123456"
}
```

### **Option 2: Verify (Shorter)**
```
POST http://23.22.178.240/api/auth/verify

Body:
{
  "email": "your@email.com",
  "otp": "123456"
}
```

### **Option 3: Code instead of OTP**
```
POST http://23.22.178.240/api/auth/send-otp

Body:
{
  "email": "your@email.com",
  "code": "123456"
}
```

### **Option 4: Token in OTP**
```
POST http://23.22.178.240/api/auth/verify

Body:
{
  "email": "your@email.com",
  "token": "123456"
}
```

### **Option 5: OTP in URL Param**
```
POST http://23.22.178.240/api/auth/verify?otp=123456

Body:
{
  "email": "your@email.com"
}
```

---

## 🔍 What Error Are You Getting?

### Error: "Invalid OTP" or "OTP not found"
**Causes:**
1. OTP expired (usually 5-10 minutes)
2. Typed wrong OTP
3. Email doesn't match
4. OTP already used

**Solutions:**
- Request new OTP by signing up again
- Check OTP carefully (no spaces)
- Ensure email is exactly the same
- Use fresh OTP

### Error: "404 Not Found"
**Cause:** Wrong endpoint

**Solutions:**
Try these endpoints:
- `/api/auth/verify-otp`
- `/api/auth/verify`
- `/api/auth/confirm`
- `/api/auth/activate`

### Error: "400 Bad Request"
**Cause:** Wrong request format

**Solutions:**
- Check JSON syntax
- Try different field names: `otp`, `code`, `token`, `verificationCode`
- Add Content-Type header: `application/json`

### Error: "500 Internal Server Error"
**Cause:** Backend issue

**Solutions:**
- Check backend logs
- Verify email service is configured
- Backend might be down

---

## 📋 Diagnostic Checklist

Run through these checks:

### ✅ Step 1: Verify Signup Response
After signup, what response did you get?

**Check for:**
```json
{
  "success": true,
  "message": "OTP sent to email",
  "verificationId": "some-id"  // <-- Do you have this?
}
```

**If you got a `verificationId`**, use it:
```json
{
  "verificationId": "the-id-from-signup",
  "otp": "123456"
}
```

### ✅ Step 2: Check Email
- Did you receive the OTP email?
- Check spam/junk folder
- Is the OTP still valid? (usually expires in 5-10 min)

### ✅ Step 3: Verify Request Format
Your current request:
```json
POST /api/auth/send-otp
{
  "email": "your@email.com",
  "otp": "123456"
}
```

### ✅ Step 4: Test Different Formats

**Try Format A - Verify OTP:**
```bash
curl -X POST http://23.22.178.240/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","otp":"123456"}'
```

**Try Format B - Send OTP (might auto-verify):**
```bash
curl -X POST http://23.22.178.240/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","otp":"123456"}'
```

**Try Format C - Verify:**
```bash
curl -X POST http://23.22.178.240/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","code":"123456"}'
```

---

## 🎯 Recommended Actions

### **Action 1: Check Backend Documentation**
Ask your backend developer:
- What is the exact OTP verification endpoint?
- What are the required fields?
- What format should the request be in?

### **Action 2: Check Backend Logs**
Have backend dev check:
- Was OTP sent successfully?
- What error is being returned?
- Is request reaching the server?

### **Action 3: Test with Curl First**
Before using Postman, test with curl to isolate the issue:

```bash
# 1. Signup
curl -X POST http://23.22.178.240/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test123@gmail.com","password":"Test123!"}'

# Copy OTP from email

# 2. Verify OTP (try different endpoints)
curl -X POST http://23.22.178.240/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test123@gmail.com","otp":"YOUR_OTP_HERE"}'
```

### **Action 4: Try Complete Fresh Flow**
1. Use a NEW email address
2. Signup
3. Wait for OTP email
4. Copy OTP exactly (no spaces)
5. Verify within 5 minutes
6. Try different endpoints until one works

---

## 🔑 Alternative: Skip OTP (Development Only)

If you're testing and just need to bypass OTP temporarily, ask backend dev if there's:
- A test OTP that always works (e.g., "000000")
- A dev mode that skips OTP
- A backdoor endpoint for testing

**Common test OTPs:**
- `123456`
- `000000`
- `111111`
- `999999`

---

## 📊 Request/Response Debug Template

**What you're sending:**
```
POST http://23.22.178.240/api/auth/send-otp
Content-Type: application/json

{
  "email": "___________",
  "otp": "___________"
}
```

**What you're getting back:**
```
Status Code: ___________

{
  "error": "___________",
  "message": "___________"
}
```

Fill this out and share the exact error with me!

---

## 🎬 Step-by-Step Debug Session

Let's debug together:

### Step 1: Fresh Signup
```
POST http://23.22.178.240/api/auth/signup

{
  "name": "Debug Test",
  "email": "debugtest@gmail.com",
  "password": "DebugPass123!"
}
```

**What response do you get?** Copy it exactly.

### Step 2: Check Email
- Did you receive OTP?
- What is the OTP? (e.g., 123456)

### Step 3: Try Each Endpoint

**Test A:**
```
POST http://23.22.178.240/api/auth/verify-otp

{
  "email": "debugtest@gmail.com",
  "otp": "123456"
}
```

**Test B:**
```
POST http://23.22.178.240/api/auth/verify

{
  "email": "debugtest@gmail.com",
  "otp": "123456"
}
```

**Test C:**
```
POST http://23.22.178.240/api/auth/send-otp

{
  "email": "debugtest@gmail.com",
  "code": "123456"
}
```

**Which one works?**

---

## 💡 Quick Fixes

### Fix 1: OTP Format
Remove any spaces or dashes:
- ❌ "123 456"
- ❌ "123-456"
- ✅ "123456"

### Fix 2: Email Case
Make sure email matches exactly (including case):
- Signup: Test@Example.com
- Verify: test@example.com ❌ (won't match!)

### Fix 3: Request Headers
Always include:
```
Content-Type: application/json
Accept: application/json
```

### Fix 4: JSON Syntax
Check for:
- Missing commas
- Extra commas
- Missing quotes
- Wrong quotes (use ", not ' for JSON)

---

## 🆘 Still Not Working?

### Tell Me:
1. **What endpoint are you using?**
   - `/api/auth/send-otp`
   - `/api/auth/verify-otp`
   - Other?

2. **What's the EXACT error message?**
   - Copy the full response

3. **What OTP did you receive?**
   - Is it 6 digits?
   - Any letters?

4. **Did signup succeed?**
   - What was the response?

5. **How long ago did you get the OTP?**
   - Might be expired

---

## 🔧 Backend Might Have Different Routes

Your backend could use:
- `/api/auth/verify-otp`
- `/api/auth/verify`
- `/api/auth/confirm`
- `/api/auth/activate`
- `/api/auth/validate-otp`
- `/api/auth/check-otp`

**Try them all!**

---

**Share your exact request and response with me, and I'll help you fix it!** 🚀
