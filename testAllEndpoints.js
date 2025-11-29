const axios = require('axios');

const API_BASE_URL = 'http://23.22.178.240';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test endpoints organized by category
const endpoints = {
  'HEALTH': [
    { method: 'GET', path: '/api/health', description: 'Health Check' }
  ],
  
  'AUTH': [
    { method: 'POST', path: '/api/auth/signup', description: 'User Signup', requiresBody: true, 
      body: { name: 'Test User', email: 'test@test.com', password: 'Test123!' }},
    { method: 'POST', path: '/api/auth/send-otp', description: 'Send OTP', requiresBody: true,
      body: { email: 'test@test.com', otp: '123456' }},
    { method: 'POST', path: '/api/auth/login', description: 'User Login', requiresBody: true,
      body: { email: 'test@test.com', password: 'Test123!' }},
    { method: 'POST', path: '/api/auth/logout', description: 'User Logout', requiresAuth: true },
    { method: 'POST', path: '/api/auth/forgot-password', description: 'Forgot Password', requiresBody: true,
      body: { email: 'test@test.com' }},
    { method: 'POST', path: '/api/auth/reset-password', description: 'Reset Password', requiresBody: true,
      body: { id: 'test-id', password: 'NewPass123!' }}
  ],
  
  'PAYMENT': [
    { method: 'POST', path: '/api/payment/charge', description: 'Create Charge', requiresAuth: true, requiresBody: true,
      body: { amount: '100', currency: 'USDT', chain: 'bnb' }},
    { method: 'GET', path: '/api/payment/charge/123', description: 'Get Charge', requiresAuth: true },
    { method: 'GET', path: '/api/payment/charges', description: 'List Charges', requiresAuth: true },
    { method: 'POST', path: '/api/payment/charge/123/cancel', description: 'Cancel Charge', requiresAuth: true },
    { method: 'POST', path: '/api/payment/checkout', description: 'Create Checkout', requiresAuth: true, requiresBody: true,
      body: { amount: '100', currency: 'USDT', chain: 'bnb' }},
    { method: 'GET', path: '/api/payment/wallet-addresses', description: 'Get Wallet Addresses', requiresAuth: true },
    { method: 'GET', path: '/api/payment/balance', description: 'Get Balance', requiresAuth: true },
    { method: 'GET', path: '/api/payment/recent-received', description: 'Recent Received', requiresAuth: true },
    { method: 'GET', path: '/api/payment/requests', description: 'Payment Requests', requiresAuth: true },
    { method: 'GET', path: '/api/payment/recipients', description: 'Recipients', requiresAuth: true },
    { method: 'GET', path: '/api/payment/exchange-history', description: 'Exchange History', requiresAuth: true },
    { method: 'POST', path: '/api/payment/webhook', description: 'Webhook', requiresBody: true,
      body: { event: 'test' }}
  ],
  
  'CARD': [
    { method: 'POST', path: '/api/card/create', description: 'Create Card', requiresAuth: true, requiresBody: true,
      body: { currency: 'USD', cardType: 'virtual' }},
    { method: 'GET', path: '/api/card/list', description: 'List Cards', requiresAuth: true },
    { method: 'GET', path: '/api/card/123', description: 'Get Card', requiresAuth: true },
    { method: 'POST', path: '/api/card/123/freeze', description: 'Toggle Card Freeze', requiresAuth: true, requiresBody: true,
      body: { freeze: true }},
    { method: 'DELETE', path: '/api/card/123', description: 'Terminate Card', requiresAuth: true },
    { method: 'POST', path: '/api/card/123/fund', description: 'Fund Card', requiresAuth: true, requiresBody: true,
      body: { amount: '100', currency: 'USD' }},
    { method: 'GET', path: '/api/card/123/transactions', description: 'Card Transactions', requiresAuth: true },
    { method: 'PUT', path: '/api/card/123/settings', description: 'Update Card Settings', requiresAuth: true, requiresBody: true,
      body: { dailySpendLimit: '1000' }}
  ],
  
  'TRANSACTION': [
    { method: 'POST', path: '/api/tx/send', description: 'Send Transaction', requiresAuth: true, requiresBody: true,
      body: { to: '0x123...', amount: '10', currency: 'USDT', chain: 'bnb' }},
    { method: 'GET', path: '/api/tx/history', description: 'Transaction History', requiresAuth: true }
  ],
  
  'PRICE': [
    { method: 'GET', path: '/api/price/BTC', description: 'Get BTC Price' },
    { method: 'GET', path: '/api/price/prices', description: 'Get Multiple Prices', params: '?symbols=BTC,ETH,USDT' }
  ],
  
  '2FA': [
    { method: 'POST', path: '/api/2fa/enable', description: 'Enable 2FA', requiresAuth: true },
    { method: 'POST', path: '/api/2fa/disable', description: 'Disable 2FA', requiresAuth: true, requiresBody: true,
      body: { code: '123456' }},
    { method: 'POST', path: '/api/2fa/verify', description: 'Verify 2FA', requiresBody: true,
      body: { email: 'test@test.com', code: '123456' }}
  ]
};

async function testEndpoint(method, url, body = null, headers = {}) {
  try {
    const config = {
      method: method,
      url: url,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      timeout: 5000,
      validateStatus: () => true // Accept any status code
    };
    
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.data = body;
    }
    
    const response = await axios(config);
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return { success: false, error: 'Timeout' };
    }
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return { success: false, error: 'Connection Failed' };
    }
    return {
      success: false,
      error: error.message
    };
  }
}

async function runTests() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}       API ENDPOINT TEST - ${API_BASE_URL}${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

  let totalEndpoints = 0;
  let workingEndpoints = 0;
  let authRequiredEndpoints = 0;
  let notFoundEndpoints = 0;
  let errorEndpoints = 0;

  for (const [category, categoryEndpoints] of Object.entries(endpoints)) {
    console.log(`${colors.blue}▶ ${category} ENDPOINTS${colors.reset}`);
    console.log(`${colors.blue}${'─'.repeat(40)}${colors.reset}`);
    
    for (const endpoint of categoryEndpoints) {
      totalEndpoints++;
      const url = `${API_BASE_URL}${endpoint.path}${endpoint.params || ''}`;
      const result = await testEndpoint(
        endpoint.method,
        url,
        endpoint.body || null,
        endpoint.requiresAuth ? { 'Authorization': 'Bearer test-token' } : {}
      );
      
      let status = '';
      let statusColor = '';
      let details = '';
      
      if (!result.success) {
        status = '❌ ERROR';
        statusColor = colors.red;
        details = result.error;
        errorEndpoints++;
      } else if (result.status === 200 || result.status === 201) {
        status = '✅ OK';
        statusColor = colors.green;
        workingEndpoints++;
        if (typeof result.data === 'string') {
          details = result.data.substring(0, 50);
        } else if (result.data?.message) {
          details = result.data.message.substring(0, 50);
        }
      } else if (result.status === 401) {
        status = '🔒 AUTH';
        statusColor = colors.yellow;
        authRequiredEndpoints++;
        details = 'Authentication required';
      } else if (result.status === 403) {
        status = '⚠️  403';
        statusColor = colors.yellow;
        details = result.data?.message || 'Forbidden';
      } else if (result.status === 404) {
        status = '❓ 404';
        statusColor = colors.red;
        notFoundEndpoints++;
        details = 'Endpoint not found';
      } else if (result.status === 400) {
        status = '⚠️  400';
        statusColor = colors.yellow;
        details = result.data?.message || 'Bad Request';
      } else if (result.status === 500) {
        status = '💥 500';
        statusColor = colors.red;
        errorEndpoints++;
        details = 'Server Error';
      } else {
        status = `📍 ${result.status}`;
        statusColor = colors.yellow;
        details = result.data?.message || '';
      }
      
      const methodStr = endpoint.method.padEnd(6);
      const pathStr = endpoint.path.padEnd(35);
      console.log(`  ${statusColor}${status}${colors.reset} ${methodStr} ${pathStr} ${colors.cyan}│${colors.reset} ${details}`);
    }
    console.log('');
  }
  
  // Summary
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}                    SUMMARY${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);
  
  console.log(`  Total Endpoints Tested:    ${totalEndpoints}`);
  console.log(`  ${colors.green}✅ Working (200/201):      ${workingEndpoints}${colors.reset}`);
  console.log(`  ${colors.yellow}🔒 Auth Required (401):    ${authRequiredEndpoints}${colors.reset}`);
  console.log(`  ${colors.red}❓ Not Found (404):        ${notFoundEndpoints}${colors.reset}`);
  console.log(`  ${colors.red}❌ Errors:                 ${errorEndpoints}${colors.reset}`);
  
  const successRate = ((workingEndpoints / totalEndpoints) * 100).toFixed(1);
  const implementedRate = (((totalEndpoints - notFoundEndpoints) / totalEndpoints) * 100).toFixed(1);
  
  console.log(`\n  📊 Success Rate:           ${successRate}%`);
  console.log(`  📈 Implementation Rate:    ${implementedRate}%`);
  
  if (notFoundEndpoints > 0) {
    console.log(`\n  ${colors.yellow}⚠️  Note: ${notFoundEndpoints} endpoints returned 404 (not implemented)${colors.reset}`);
  }
  if (authRequiredEndpoints > 0) {
    console.log(`  ${colors.yellow}🔐 Note: ${authRequiredEndpoints} endpoints require authentication${colors.reset}`);
  }
  
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);
}

// Run the tests
runTests().catch(console.error);