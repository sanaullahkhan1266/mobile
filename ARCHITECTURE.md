# System Architecture

## Complete Integration Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    MOBILE APP (React Native)                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         UI Components / Screens                       │    │
│  │  - Login Screen → loginWithBackend()                │    │
│  │  - Home Screen → getBalance(), getWalletAddresses()│    │
│  │  - Card Screen → createCard(), getCards()          │    │
│  │  - Settings → enableTwoFactor()                    │    │
│  └────────────────────┬────────────────────────────────┘    │
│                       │                                      │
│  ┌────────────────────▼────────────────────────────────┐    │
│  │         Service Layer (Async Functions)              │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │ authService.ts                                │  │    │
│  │  │ - signupWithBackend()                        │  │    │
│  │  │ - loginWithBackend()                         │  │    │
│  │  │ - verifyTwoFactor()                          │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │ paymentService.ts                             │  │    │
│  │  │ - getWalletAddresses()                       │  │    │
│  │  │ - getBalance()                               │  │    │
│  │  │ - createCharge()                             │  │    │
│  │  │ - getPrice()                                 │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │ cardService.ts                                │  │    │
│  │  │ - createCard()                               │  │    │
│  │  │ - getCards()                                 │  │    │
│  │  │ - fundCard()                                 │  │    │
│  │  │ - getCardTransactions()                      │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  └────────────────────┬────────────────────────────────┘    │
│                       │                                      │
│  ┌────────────────────▼────────────────────────────────┐    │
│  │         API Client Layer (utils/apiClient.ts)        │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │ Axios Instance Configuration                │  │    │
│  │  │ - Base URL: EXPO_PUBLIC_API_URL            │  │    │
│  │  │ - Timeout: 30s                             │  │    │
│  │  │ - Headers: Content-Type: application/json  │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │ Request Interceptor                        │  │    │
│  │  │ - Attach JWT token from SecureStore       │  │    │
│  │  │ - Add Authorization: Bearer {token}       │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │ Response Interceptor                       │  │    │
│  │  │ - Handle 401 (expired token)              │  │    │
│  │  │ - Retry on 500, 502, 503, 504            │  │    │
│  │  │ - Standardize error format               │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  └────────────────────┬────────────────────────────────┘    │
│                       │                                      │
│  ┌────────────────────▼────────────────────────────────┐    │
│  │ Secure Storage (expo-secure-store)                  │    │
│  │ - JWT Token encrypted in device secure storage     │    │
│  │ - Key: authToken                                   │    │
│  └────────────────────┬────────────────────────────────┘    │
│                       │                                      │
└───────────────────────┼──────────────────────────────────────┘
                        │
                        │ HTTP/HTTPS
                        │ (Encrypted)
                        │
┌───────────────────────▼──────────────────────────────────────┐
│              BACKEND SERVER (Node.js/Express)               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         API Routes (index.js)                        │    │
│  │  POST   /api/auth/signup                           │    │
│  │  POST   /api/auth/login                            │    │
│  │  POST   /api/auth/logout                           │    │
│  │  GET    /api/payment/wallet-addresses              │    │
│  │  GET    /api/payment/balance                       │    │
│  │  POST   /api/payment/charge                        │    │
│  │  POST   /api/card/create                           │    │
│  │  GET    /api/card/list                             │    │
│  │  POST   /api/2fa/enable                            │    │
│  │  POST   /api/2fa/verify                            │    │
│  └────────────────────┬────────────────────────────────┘    │
│                       │                                      │
│  ┌────────────────────▼────────────────────────────────┐    │
│  │      Controllers (Business Logic)                   │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │ AuthController.js                            │  │    │
│  │  │ - signup: Create user + wallets             │  │    │
│  │  │ - login: Authenticate + return JWT          │  │    │
│  │  │ - logout: Clear session                     │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │ PaymentController.js                         │  │    │
│  │  │ - getBalance: Query wallet balances          │  │    │
│  │  │ - createCharge: Generate receive address    │  │    │
│  │  │ - getWalletAddresses: Return user wallets   │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │ CardController.js                            │  │    │
│  │  │ - createCard: Create virtual card            │  │    │
│  │  │ - getCards: List user cards                 │  │    │
│  │  │ - fundCard: Add crypto to card              │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │ TwoFactorController.js                       │  │    │
│  │  │ - enable: Generate 2FA secret               │  │    │
│  │  │ - verify: Validate TOTP code                │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  └────────────────────┬────────────────────────────────┘    │
│                       │                                      │
│  ┌────────────────────▼────────────────────────────────┐    │
│  │         Middleware                                   │    │
│  │  - ensureAuthenticated: Verify JWT token           │    │
│  │  - AuthValidation: Validate request data           │    │
│  │  - Cache: Response caching                         │    │
│  │  - CORS: Cross-origin requests                     │    │
│  │  - Helmet: Security headers                        │    │
│  └────────────────────┬────────────────────────────────┘    │
│                       │                                      │
│  ┌────────────────────▼────────────────────────────────┐    │
│  │         Database & External Services               │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │ MongoDB (User, Wallet, Card data)            │  │    │
│  │  │ - Users collection                          │  │    │
│  │  │ - Wallet addresses (encrypted)              │  │    │
│  │  │ - Private keys (AES-256-GCM encrypted)      │  │    │
│  │  │ - 2FA secrets                               │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │ External APIs                                │  │    │
│  │  │ - Blockchain RPC (ethers.js)                │  │    │
│  │  │ - Marqeta/Galileo (Virtual Cards)           │  │    │
│  │  │ - Coinbase Commerce (Payments)              │  │    │
│  │  │ - Price Feeds (CoinGecko, etc)              │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### 1. User Signup Flow

```
Mobile                          Backend                    Database
  │                              │                           │
  ├─ signupWithBackend()         │                           │
  │  (name, email, password)     │                           │
  │                              │                           │
  ├─ apiClient.post()            │                           │
  │  /api/auth/signup            │                           │
  │                              │                           │
  ├─ Request with JSON           │                           │
  │  ────────────────────────────>                           │
  │                              │                           │
  │                              ├─ AuthController.signup()  │
  │                              │                           │
  │                              ├─ Hash password (bcrypt)   │
  │                              │                           │
  │                              ├─ Create wallets:          │
  │                              │  - BNB (ethers.js)        │
  │                              │  - ETH (ethers.js)        │
  │                              │  - TRON (TronWeb)         │
  │                              │  - Arbitrum, Polygon, BTC │
  │                              │                           │
  │                              ├─ Encrypt private keys     │
  │                              │  (AES-256-GCM)            │
  │                              │                           │
  │                              ├─ Save User document       │
  │                              ├──────────────────────────>
  │                              │                           │
  │                              ├─ Generate JWT token       │
  │                              │  (expires: 24h)           │
  │                              │                           │
  │  Response with token & data  │                           │
  │  <─────────────────────────  │                           │
  │                              │                           │
  ├─ secureStore.setItem(token)  │                           │
  │                              │                           │
  └─ setAuthToken(token)         │                           │
     (Save for future requests)   │                           │
```

### 2. User Login Flow

```
Mobile                          Backend                    Database
  │                              │                           │
  ├─ loginWithBackend()          │                           │
  │  (email, password)           │                           │
  │                              │                           │
  ├─ apiClient.post()            │                           │
  │  /api/auth/login             │                           │
  │  ────────────────────────────>                           │
  │                              │                           │
  │                              ├─ AuthController.login()   │
  │                              │                           │
  │                              ├─ Find user by email       │
  │                              ├──────────────────────────>
  │                              │  User document             │
  │                              │<──────────────────────────┤
  │                              │                           │
  │                              ├─ bcrypt.compare()        │
  │                              │  (password verification)   │
  │                              │                           │
  │                              ├─ Check if 2FA enabled    │
  │                              │  If yes → require 2FA     │
  │                              │  If no → generate JWT     │
  │                              │                           │
  │  Response with:              │                           │
  │  - token                     │                           │
  │  - walletAddresses           │                           │
  │  - user data                 │                           │
  │  <─────────────────────────  │                           │
  │                              │                           │
  ├─ secureStore.setItem(token)  │                           │
  └─ Navigate to home screen     │                           │
```

### 3. Get Wallet Balances Flow

```
Mobile                          Backend                    Blockchain
  │                              │                           │
  ├─ getBalance()                │                           │
  │  (No parameters)             │                           │
  │                              │                           │
  ├─ apiClient.get()             │                           │
  │  /api/payment/balance        │                           │
  │                              │                           │
  ├─ Request with JWT in         │                           │
  │  Authorization header        │                           │
  │  ────────────────────────────>                           │
  │                              │                           │
  │                              ├─ ensureAuthenticated()    │
  │                              │  (Verify JWT)             │
  │                              │                           │
  │                              ├─ Get user from token     │
  │                              │                           │
  │                              ├─ getBalance() for each:   │
  │                              │                           │
  │                              ├─ BNB chain               │
  │                              ├─ ethers.js               │
  │                              │  ─────────────────────────>
  │                              │  getBalance(bnbAddr)     │
  │                              │  <─────────────────────────
  │                              │                           │
  │                              ├─ ETH chain               │
  │                              ├─ ETH chain               │
  │                              │  ─────────────────────────>
  │                              │  getBalance(ethAddr)     │
  │                              │  <─────────────────────────
  │                              │                           │
  │                              ├─ TRON chain              │
  │                              ├─ TronWeb                 │
  │                              │  ─────────────────────────>
  │                              │  getBalance(tronAddr)    │
  │                              │  <─────────────────────────
  │                              │                           │
  │  Response with all           │                           │
  │  balances                    │                           │
  │  <─────────────────────────  │                           │
  │                              │                           │
  ├─ setState(balances)          │                           │
  └─ Display in UI               │                           │
```

### 4. Create Virtual Card Flow

```
Mobile                          Backend                    External APIs
  │                              │                           │
  ├─ createCard()                │                           │
  │  (currency, fundingAmount)   │                           │
  │                              │                           │
  ├─ apiClient.post()            │                           │
  │  /api/card/create            │                           │
  │  ────────────────────────────>                           │
  │                              │                           │
  │                              ├─ CardController.create()  │
  │                              │                           │
  │                              ├─ Call Marqeta/Galileo    │
  │                              ├────────────────────────────>
  │                              │  Create card request      │
  │                              │  <────────────────────────
  │                              │  Card response:           │
  │                              │  - cardNumber             │
  │                              │  - expiryDate             │
  │                              │  - cvv                    │
  │                              │                           │
  │                              ├─ Save to MongoDB         │
  │                              ├─ (associate to user)     │
  │                              │                           │
  │  Response with Card          │                           │
  │  details                     │                           │
  │  <─────────────────────────  │                           │
  │                              │                           │
  └─ Display card in UI          │                           │
```

## Technology Stack

### Frontend (Mobile)
- **React Native 0.81.4** - Mobile framework
- **Expo 54** - Development & deployment
- **Expo Router 6** - File-based routing
- **Clerk** - Authentication
- **Axios** - HTTP client
- **expo-secure-store** - Secure token storage
- **TypeScript** - Type safety

### Backend
- **Node.js** - Runtime
- **Express 5.1** - Web framework
- **MongoDB 8.13.2** - Database
- **Mongoose** - ODM
- **JWT** - Token-based auth
- **bcrypt** - Password hashing
- **ethers.js 6.9** - Ethereum/EVM chains
- **TronWeb 5.3** - TRON blockchain
- **Helmet** - Security headers
- **CORS** - Cross-origin requests

### External Services
- **Clerk** - User authentication
- **MongoDB Atlas** - Cloud database
- **Marqeta/Galileo** - Virtual cards
- **Coinbase Commerce** - Payments
- **Blockchain RPCs** - Infura, Alchemy, Tron Grid
- **Etherscan, BSCScan** - Block explorers

## Security Measures

1. **Token Security**
   - JWT tokens stored in SecureStore (encrypted)
   - 24-hour expiration
   - Bearer token in Authorization header

2. **Data Encryption**
   - Private keys encrypted with AES-256-GCM
   - IV + Auth Tag stored with encrypted data
   - Database-level encryption (MongoDB Enterprise)

3. **CORS & Headers**
   - Helmet for security headers
   - CORS configured for mobile origins
   - Content-Type validation

4. **Authentication**
   - bcrypt password hashing (10 rounds)
   - JWT signature verification
   - 2FA (optional, TOTP)

5. **Network**
   - HTTPS enforced in production
   - API timeout (30 seconds)
   - Request/response logging

## Scalability Considerations

1. **Database**
   - MongoDB indexes on email, userId
   - Connection pooling (Mongoose)
   - Sharding-ready schema

2. **API**
   - Rate limiting (configurable)
   - Response caching layer
   - Load balancing ready

3. **Mobile**
   - Lazy loading screens
   - Image optimization
   - Request batching

## Error Handling

All errors follow standard format:
```typescript
{
  success: false,
  message: "Human readable message",
  statusCode: 400-500,
  data?: { /* Additional error context */ }
}
```

Common codes:
- **400** - Bad request / validation
- **401** - Unauthorized / expired token
- **409** - Conflict / duplicate
- **500** - Server error
- **503** - Service unavailable

---

This architecture ensures secure, scalable communication between mobile app and backend services.
