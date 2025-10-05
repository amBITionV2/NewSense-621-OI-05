const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAdminVolunteers() {
  try {
    console.log('🔍 Testing Admin Volunteers Endpoint...\n');

    // Test 1: Check if admin volunteers endpoint exists
    console.log('1. Testing GET /api/admin/volunteers (without auth)...');
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/volunteers`);
      console.log('✅ Response:', response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('⚠️ Endpoint requires authentication (expected)');
      } else {
        console.log('❌ Error:', error.response?.data || error.message);
      }
    }

    // Test 2: Check if volunteers exist in database
    console.log('\n2. Testing volunteer count...');
    try {
      const response = await axios.get(`${BASE_URL}/api/volunteers/stats`);
      console.log('✅ Volunteer stats:', response.data);
    } catch (error) {
      console.log('❌ Error getting stats:', error.response?.data || error.message);
    }

    // Test 3: Check if we can get volunteers directly
    console.log('\n3. Testing direct volunteer access...');
    try {
      const response = await axios.get(`${BASE_URL}/api/volunteers`);
      console.log('✅ Volunteers endpoint:', response.data);
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
    }

    console.log('\n🎯 Test completed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminVolunteers();
