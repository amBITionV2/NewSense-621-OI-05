const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAdminFull() {
  try {
    console.log('🔍 Testing Complete Admin Flow...\n');

    // Test 1: Login as admin
    console.log('1. Logging in as admin...');
    let token;
    try {
      const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: 'ciwem21307@daupload.com',
        password: 'admin123'
      });
      
      token = loginResponse.data.token;
      console.log('✅ Admin login successful');
      console.log('User:', loginResponse.data.user);
    } catch (error) {
      console.log('❌ Admin login failed:', error.response?.data || error.message);
      
      // Try with the test admin
      try {
        const testLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
          email: 'admin@test.com',
          password: 'admin123'
        });
        
        token = testLoginResponse.data.token;
        console.log('✅ Test admin login successful');
        console.log('User:', testLoginResponse.data.user);
      } catch (testError) {
        console.log('❌ Test admin login failed:', testError.response?.data || testError.message);
        return;
      }
    }

    // Test 2: Get admin volunteers
    console.log('\n2. Getting admin volunteers...');
    try {
      const volunteersResponse = await axios.get(`${BASE_URL}/api/admin/volunteers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Admin volunteers response:');
      console.log('Volunteers count:', volunteersResponse.data.volunteers?.length || 0);
      console.log('Pagination:', volunteersResponse.data.pagination);
      
      if (volunteersResponse.data.volunteers?.length > 0) {
        console.log('\nFirst volunteer:');
        const firstVolunteer = volunteersResponse.data.volunteers[0];
        console.log('- Name:', firstVolunteer.name);
        console.log('- Email:', firstVolunteer.email);
        console.log('- Status:', firstVolunteer.status);
        console.log('- Verified:', firstVolunteer.isVerified);
        console.log('- Points:', firstVolunteer.points);
        console.log('- Badge:', firstVolunteer.badge?.rank);
      }
      
    } catch (error) {
      console.log('❌ Admin volunteers request failed:', error.response?.data || error.message);
    }

    // Test 3: Get volunteer stats
    console.log('\n3. Getting volunteer stats...');
    try {
      const statsResponse = await axios.get(`${BASE_URL}/api/admin/volunteers/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Volunteer stats:', statsResponse.data);
      
    } catch (error) {
      console.log('❌ Volunteer stats request failed:', error.response?.data || error.message);
    }

    console.log('\n🎯 Test completed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminFull();
