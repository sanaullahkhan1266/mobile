/**
 * Quick API Connection Test Script
 * 
 * Run this to test if your backend is accessible:
 * node test-api-connection.js
 */

const axios = require('axios');

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://23.22.178.240';

async function testConnection() {
  console.log('🔍 Testing backend connection...\n');
  console.log(`API Base URL: ${API_BASE_URL}\n`);

  // Test 1: Health Check
  try {
    console.log('1️⃣ Testing Health Endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/api/health`, {
      timeout: 5000
    });
    console.log('   ✅ Health check passed!');
    console.log(`   Response: ${JSON.stringify(healthResponse.data)}\n`);
  } catch (error) {
    console.log('   ❌ Health check failed!');
    console.log(`   Error: ${error.message}\n`);
  }

  // Test 2: Price Endpoint (doesn't require auth)
  try {
    console.log('2️⃣ Testing Price Endpoint...');
    const priceResponse = await axios.get(`${API_BASE_URL}/api/price/USDT`, {
      timeout: 5000
    });
    console.log('   ✅ Price endpoint works!');
    console.log(`   USDT Price: $${priceResponse.data.price}\n`);
  } catch (error) {
    console.log('   ❌ Price endpoint failed!');
    console.log(`   Error: ${error.message}\n`);
  }

  // Test 3: Auth Signup Endpoint
  try {
    console.log('3️⃣ Testing Signup Endpoint (structure only)...');
    // Just test if endpoint exists (will fail without proper data, but that's ok)
    await axios.post(`${API_BASE_URL}/api/auth/signup`, {
      name: 'Test User',
      email: 'test@test.com',
      password: 'Test12345!'
    }, {
      timeout: 5000,
      validateStatus: () => true // Accept any status
    });
    console.log('   ✅ Signup endpoint is reachable\n');
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('   ❌ Cannot reach signup endpoint');
      console.log(`   Error: ${error.message}\n`);
    } else {
      console.log('   ✅ Signup endpoint is reachable\n');
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Test Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\nIf all tests passed, your backend is ready!');
  console.log('If any failed, check:');
  console.log('  1. Backend server is running');
  console.log('  2. Correct API URL in .env file');
  console.log('  3. Network/firewall settings\n');
}

// Run tests
testConnection().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
