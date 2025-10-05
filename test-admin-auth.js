const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAdminWithAuth() {
  try {
    console.log('🔍 Testing Admin Volunteers with Authentication...\n');

    // First, let's try to login as an admin
    console.log('1. Attempting admin login...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: 'admin@example.com',
        password: 'admin123'
      });
      
      console.log('✅ Admin login successful');
      const token = loginResponse.data.token;
      
      // Test admin volunteers endpoint with auth
      console.log('\n2. Testing GET /api/admin/volunteers with auth...');
      const volunteersResponse = await axios.get(`${BASE_URL}/api/admin/volunteers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Admin volunteers response:', volunteersResponse.data);
      
    } catch (error) {
      console.log('❌ Admin login failed:', error.response?.data || error.message);
      
      // Try with a different admin account
      console.log('\n3. Trying alternative admin login...');
      try {
        const altLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
          email: 'admin@newsense.com',
          password: 'admin123'
        });
        
        console.log('✅ Alternative admin login successful');
        const token = altLoginResponse.data.token;
        
        const volunteersResponse = await axios.get(`${BASE_URL}/api/admin/volunteers`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('✅ Admin volunteers response:', volunteersResponse.data);
        
      } catch (altError) {
        console.log('❌ Alternative admin login failed:', altError.response?.data || altError.message);
      }
    }

    console.log('\n🎯 Test completed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminWithAuth();
