const axios = require('axios');

const API_URL = 'http://23.22.178.240';

async function testAPIConnection() {
  console.log('Testing API connection to:', API_URL);
  console.log('================================\n');

  // Test 1: Health Check
  console.log('1. Testing Health Endpoint...');
  try {
    const healthResponse = await axios.get(`${API_URL}/api/health`, {
      timeout: 5000
    });
    console.log('✅ Health Check: SUCCESS');
    console.log(`   Status: ${healthResponse.status}`);
    console.log(`   Response: ${healthResponse.data}\n`);
  } catch (error) {
    console.log('❌ Health Check: FAILED');
    console.log(`   Error: ${error.message}\n`);
  }

  // Test 2: Auth Endpoint (should fail with 403 for invalid credentials)
  console.log('2. Testing Auth Endpoint...');
  try {
    const authResponse = await axios.post(
      `${API_URL}/api/auth/login`,
      {
        email: 'test@test.com',
        password: 'test123'
      },
      {
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    console.log('⚠️  Auth Test: Unexpected success');
    console.log(`   Status: ${authResponse.status}\n`);
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('✅ Auth Endpoint: WORKING (returned expected 403)');
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data.message}\n`);
    } else {
      console.log('❌ Auth Endpoint: FAILED');
      console.log(`   Error: ${error.message}\n`);
    }
  }

  // Test 3: Response Time
  console.log('3. Testing Response Time...');
  const startTime = Date.now();
  try {
    await axios.get(`${API_URL}/api/health`, { timeout: 5000 });
    const responseTime = Date.now() - startTime;
    console.log(`✅ Response Time: ${responseTime}ms`);
    if (responseTime < 100) {
      console.log('   Performance: Excellent');
    } else if (responseTime < 500) {
      console.log('   Performance: Good');
    } else if (responseTime < 1000) {
      console.log('   Performance: Fair');
    } else {
      console.log('   Performance: Slow');
    }
  } catch (error) {
    console.log('❌ Response Time Test: FAILED');
  }

  console.log('\n================================');
  console.log('API Connection Test Complete');
  console.log('API URL is:', API_URL);
}

testAPIConnection();