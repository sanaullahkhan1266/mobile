# 📮 Postman KYC Testing Guide

## 🔗 Backend Information
- **Base URL**: `http://23.22.178.240`
- **KYC Feature Enabled**: ✅ Yes (see `.env`: `EXPO_PUBLIC_ENABLE_KYC=true`)

## ⚠️ Current Status
The KYC API routes are **currently mocked** in the frontend. According to `KycApiService.ts` lines 47-55, the backend routes are not implemented yet.

However, here's how you would test them in Postman once they're implemented:

---

## 📋 Step-by-Step Testing

### **1️⃣ First: Authenticate to Get Token**

#### Request: Login
```
POST http://23.22.178.240/api/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "email": "your-email@example.com",
    "name": "Your Name",
    "walletAddresses": {
      "bnb": "0x...",
      "eth": "0x...",
      "arb": "0x...",
      "poly": "0x...",
      "tron": "T...",
      "btc": "1..."
    }
  }
}
```

**Copy the `token` value** - you'll need it for KYC requests!

---

### **2️⃣ Submit KYC Documents**

#### Request: Submit KYC
```
POST http://23.22.178.240/api/kyc/submit
```

**Headers:**
```
Authorization: Bearer your-token-here
Accept: application/json
```

**Body (form-data):**
Since this endpoint expects file uploads, use **form-data** in Postman:

| Key | Type | Value | Description |
|-----|------|-------|-------------|
| `personalInfo` | Text | `{"firstName":"John","lastName":"Doe","dob":"1990-01-01","phoneCountryCode":"+92","phoneNumber":"3001234567","address":"123 Main St","city":"Karachi","postalCode":"75500","country":"Pakistan","countryCode":"PK"}` | JSON string with personal details |
| `documentType` | Text | `passport` | Document type: `passport`, `id`, or `driver_license` |
| `documentFront` | File | (select file) | Front of document image (JPG/PNG) |
| `documentBack` | File | (select file) | Back of document image (JPG/PNG) |
| `selfie` | File | (select file) | Selfie image (JPG/PNG) |

**Expected Response:**
```json
{
  "success": true,
  "message": "KYC submitted successfully",
  "referenceId": "KYC-2024-12345",
  "status": "pending"
}
```

---

### **3️⃣ Check KYC Status**

#### Request: Get KYC Status
```
GET http://23.22.178.240/api/kyc/status
```

**Headers:**
```
Authorization: Bearer your-token-here
Accept: application/json
```

**Expected Response:**
```json
{
  "status": "pending",
  "message": "Your KYC is under review",
  "submittedAt": "2024-12-01T10:30:00Z",
  "reviewedAt": null
}
```

**Possible status values:**
- `not_started` - KYC not submitted
- `pending` - Under review
- `approved` - KYC approved
- `rejected` - KYC rejected

---

## 🧪 Creating a Postman Collection

### Option 1: Quick Import (JSON)

Create a file `KYC_API_Tests.postman_collection.json` with this content:

```json
{
  "info": {
    "name": "EnPaying KYC API",
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
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    const jsonData = pm.response.json();",
                  "    if (jsonData.token) {",
                  "        pm.collectionVariables.set('auth_token', jsonData.token);",
                  "        console.log('Token saved:', jsonData.token);",
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
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/auth/login",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "KYC",
      "item": [
        {
          "name": "Submit KYC",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{auth_token}}"
              },
              {
                "key": "Accept",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "formdata",
              "formdata": [
                {
                  "key": "personalInfo",
                  "value": "{\"firstName\":\"John\",\"lastName\":\"Doe\",\"dob\":\"1990-01-01\",\"phoneCountryCode\":\"+92\",\"phoneNumber\":\"3001234567\",\"address\":\"123 Main St\",\"city\":\"Karachi\",\"postalCode\":\"75500\",\"country\":\"Pakistan\",\"countryCode\":\"PK\"}",
                  "type": "text"
                },
                {
                  "key": "documentType",
                  "value": "passport",
                  "type": "text"
                },
                {
                  "key": "documentFront",
                  "type": "file",
                  "src": []
                },
                {
                  "key": "documentBack",
                  "type": "file",
                  "src": []
                },
                {
                  "key": "selfie",
                  "type": "file",
                  "src": []
                }
              ]
            },
            "url": {
              "raw": "{{base_url}}/api/kyc/submit",
              "host": ["{{base_url}}"],
              "path": ["api", "kyc", "submit"]
            }
          }
        },
        {
          "name": "Get KYC Status",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{auth_token}}"
              },
              {
                "key": "Accept",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/kyc/status",
              "host": ["{{base_url}}"],
              "path": ["api", "kyc", "status"]
            }
          }
        }
      ]
    }
  ]
}
```

**Import Steps:**
1. Open Postman
2. Click **Import** button
3. Select the JSON file
4. The collection will be imported with all requests ready to use!

### Option 2: Manual Setup in Postman

1. **Create a new Collection** named "EnPaying KYC API"
2. **Add Collection Variables:**
   - Right-click collection → Edit
   - Go to Variables tab
   - Add: `base_url` = `http://23.22.178.240`
   - Add: `auth_token` = (leave empty, will auto-fill)

3. **Create folders:**
   - Create folder "Auth"
   - Create folder "KYC"

4. **Add requests as shown above**

---

## 🚨 Important Notes

### Backend Not Implemented Yet
According to your `KycApiService.ts` (lines 47-55 and 123-128), the backend routes are **not implemented yet**. You're currently getting mock responses:

```typescript
// TODO: Backend KYC routes not implemented yet
console.warn('⚠️ KYC routes not implemented on backend yet');
return {
  success: true,
  message: 'KYC submitted (mock - backend pending)',
  referenceId: 'MOCK_' + Date.now(),
  status: 'pending'
};
```

### What You Need to Do First:

1. **Implement Backend Routes** on your server (`http://23.22.178.240`):
   - `POST /api/kyc/submit` - Handle file uploads and KYC data
   - `GET /api/kyc/status` - Return user's KYC status

2. **Uncomment the Real Code** in `KycApiService.ts` (lines 57-103 and 130-151)

3. **Test with Postman** using the guide above

---

## 🔧 Testing Before Backend is Ready

If you want to test the API structure before the backend is implemented, you can use:

### **Mock Server (Postman)**
1. In Postman, go to your collection
2. Click "..." → "Mock Collection"
3. Create mock server
4. Define example responses
5. Test your frontend against the mock server

### **Or Use a Local Mock with `json-server`**

Install:
```bash
npm install -g json-server
```

Create `db.json`:
```json
{
  "kyc": {
    "status": "pending",
    "message": "KYC under review",
    "submittedAt": "2024-12-01T10:00:00Z"
  }
}
```

Run:
```bash
json-server --watch db.json --port 8080
```

---

## 📸 Sample Test Images

For testing, use these requirements:
- **Document images**: Min 800x600px, JPG or PNG, max 5MB
- **Selfie**: Min 400x400px, clear face visible
- **File names**: Use descriptive names like `passport_front.jpg`

---

## ✅ Testing Checklist

- [ ] Backend KYC routes implemented
- [ ] Uncommented real API code in `KycApiService.ts`
- [ ] Created Postman collection
- [ ] Tested login and got auth token
- [ ] Tested KYC submission with valid documents
- [ ] Tested KYC status retrieval
- [ ] Tested error cases (invalid token, missing fields)
- [ ] Tested with different document types (passport, ID, license)

---

## 🆘 Troubleshooting

### "Authentication required"
→ Make sure you've logged in first and copied the token correctly

### "Failed to submit KYC"
→ Check if backend routes are implemented and server is running

### CORS errors
→ Backend needs to allow requests from your origin

### File upload fails
→ Ensure `Content-Type: multipart/form-data` header is set

---

Need help? Check the commented code in `KycApiService.ts` for the exact implementation details!
