# Minimal API Endpoints Required

Based on your app's actual screens, here are **ONLY the endpoints you need** to get started.

## Phase 1: Core Authentication (MUST HAVE)

```
✅ POST /api/auth/signup
✅ POST /api/auth/send-otp
✅ POST /api/auth/login
✅ POST /api/auth/logout
```

These 4 endpoints cover all your auth screens and are already configured in your backend.

---

## Phase 2: Core Features (NICE TO HAVE)

Your app displays these screens, but most are UI-only right now. Only add these when needed:

### Wallet Display
```
GET /api/payment/wallet-addresses      # Show wallet addresses on home
GET /api/payment/balance               # Show balance on home
```

### Card Management
```
POST /api/card/create                  # Create virtual card
GET /api/card/list                     # List user's cards
```

---

## Phase 3: Additional Features (LATER)

These can be added later:

```
POST /api/payment/charge               # Receive crypto
GET /api/payment/recent-received       # Recent transactions
GET /api/price/:symbol                 # Get crypto prices
POST /api/tx/send                      # Send transactions
GET /api/help/articles                 # Help articles
```

---

## What Your App Actually Needs NOW

Looking at your screens:

### ✅ Active Screens (Need Backend)
1. **Home** (`app/(tabs)/index.tsx`)
   - Shows balance: `GET /api/payment/balance` 
   - Hard-coded for now: "5.00 USD"

2. **Card** (`app/(tabs)/card.tsx`)
   - Shows virtual card info
   - Button to apply card (not connected yet)

3. **Menu** (`app/(tabs)/menu.tsx`)
   - 100% UI - no API calls needed
   - Navigation to other screens

### ❌ Placeholder Screens (No Backend Needed Yet)
- Wallet screens (BTC, ETH, etc.) - Just show icons
- Help/Support - Static content
- Settings/Profile - UI only
- KYC - Document upload (future)
- Security - App lock (local)

---

## Simplified Service Layer

Instead of all the services, you only need these 2 files:

### 1. `services/authService.ts`
```typescript
// Just these functions:
signupWithClerk()
verifyClerkEmail()
loginWithClerk()
logoutWithClerk()
```

### 2. `services/paymentService.ts` (Optional)
```typescript
// Add when you need wallet display:
getWalletAddresses()
getBalance()
```

**Remove these services for now** (add later if needed):
- `cardService.ts` - Wait until card feature is ready
- `authService.ts` (old backend auth) - Using Clerk now

---

## Recommended Implementation Order

### Week 1: Just Auth
1. Implement login/signup screens
2. Test with Clerk
3. Test with backend `/auth` endpoints
4. ✅ **You're done for MVP**

### Week 2: Add Wallet
5. Add `getBalance()` to home screen
6. Add `getWalletAddresses()` to display addresses
7. Test with backend `/payment` endpoints

### Week 3+: Expand
8. Card creation
9. Transaction history
10. KYC/Verification

---

## Clean Up: What to Remove

### Files You Don't Need Yet
```
services/authService.ts          ❌ Remove (using Clerk now)
services/cardService.ts          ❌ Remove (add later)
services/paymentService.ts       ⚠️  Keep but minimal (just 2 functions)

ACTUAL_BACKEND_GUIDE.md          ❌ Remove (confusing)
BACKEND_INTEGRATION.md           ❌ Remove (too much)
```

### Files to Keep
```
services/clerkAuthService.ts     ✅ Keep
utils/apiClient.ts               ✅ Keep
constants/api.ts                 ✅ Keep (simplify it)
CLERK_AUTH_GUIDE.md              ✅ Keep
PRODUCTION_READY.md              ✅ Keep
```

---

## Simplified constants/api.ts

You can clean this up to just:

```typescript typescript path=null start=null
// API Configuration
export const API_BASE_URL = 'http://23.22.178.240';

export const API_ENDPOINTS = {
  // Auth (Required)
  AUTH: {
    SIGNUP: '/api/auth/signup',
    SEND_OTP: '/api/auth/send-otp',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
  },
  
  // Payment (Optional, add when needed)
  PAYMENT: {
    WALLET_ADDRESSES: '/api/payment/wallet-addresses',
    BALANCE: '/api/payment/balance',
  },
  
  // Card (Add later)
  CARD: {
    CREATE: '/api/card/create',
    LIST: '/api/card/list',
  },
};
```

---

## Real Talk: What You Need to Start

**Minimum for MVP:**
- ✅ Clerk authentication (already working)
- ✅ Login/Signup screens (use Clerk)
- ✅ Home screen with hardcoded balance

**Total API calls: 1**
- Just `/api/auth/login` and `/api/auth/send-otp`

**That's it.** Everything else can wait.

---

## Next Actions

1. **Keep it simple** - Only implement auth first
2. **Remove confusing docs** - Delete old backend guides
3. **Test one thing** - Get login working
4. **Deploy** - Go live with auth-only MVP
5. **Add wallet later** - Once auth is solid

**You're overthinking this.** Start with just login. 🚀
