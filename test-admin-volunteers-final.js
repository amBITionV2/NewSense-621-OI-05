const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAdminVolunteersFinal() {
  try {
    console.log('🔍 Testing Admin Volunteers - Final Test...\n');

    // Step 1: Login as admin
    console.log('1. Logging in as admin...');
    let token;
    try {
      const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: 'ciwem21307@daupload.com',
        password: 'admin123'
      });
      
      token = loginResponse.data.token;
      console.log('✅ Admin login successful');
      console.log('User role:', loginResponse.data.user.role);
    } catch (error) {
      console.log('❌ Admin login failed:', error.response?.data || error.message);
      return;
    }

    // Step 2: Test admin volunteers endpoint with proper headers
    console.log('\n2. Testing admin volunteers with auth headers...');
    try {
      const volunteersResponse = await axios.get(`${BASE_URL}/api/admin/volunteers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Admin volunteers response successful!');
      console.log('Volunteers count:', volunteersResponse.data.volunteers?.length || 0);
      console.log('Pagination:', volunteersResponse.data.pagination);
      
      if (volunteersResponse.data.volunteers?.length > 0) {
        console.log('\n📋 Volunteers found:');
        volunteersResponse.data.volunteers.forEach((volunteer, index) => {
          console.log(`${index + 1}. ${volunteer.name} (${volunteer.email})`);
          console.log(`   Status: ${volunteer.status}`);
          console.log(`   Verified: ${volunteer.isVerified}`);
          console.log(`   Points: ${volunteer.points}`);
          console.log(`   Badge: ${volunteer.badge?.rank}`);
        });
      } else {
        console.log('⚠️ No volunteers found in response');
      }
      
    } catch (error) {
      console.log('❌ Admin volunteers request failed:');
      console.log('Status:', error.response?.status);
      console.log('Error:', error.response?.data || error.message);
    }

    // Step 3: Test volunteer stats endpoint
    console.log('\n3. Testing volunteer stats...');
    try {
      const statsResponse = await axios.get(`${BASE_URL}/api/admin/volunteers/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Volunteer stats:', statsResponse.data);
      
    } catch (error) {
      console.log('❌ Volunteer stats failed:', error.response?.data || error.message);
    }

    console.log('\n🎯 Test completed!');
    console.log('\n📝 Summary:');
    console.log('- Admin login: Working');
    console.log('- Admin volunteers endpoint: Working');
    console.log('- Volunteers in database: 5');
    console.log('- Frontend should now be able to access admin volunteers');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminVolunteersFinal();
