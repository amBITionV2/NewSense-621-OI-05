const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login functionality...');
    
    // First, let's test the demo user
    console.log('\n=== Testing Demo User ===');
    const demoResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'demo@example.com',
      password: 'password'
    });
    console.log('✅ Demo login successful!');
    console.log('Response:', demoResponse.data);
    
  } catch (error) {
    console.log('❌ Demo login failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
  
  try {
    // Now test admin user
    console.log('\n=== Testing Admin User ===');
    const adminResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'password'
    });
    console.log('✅ Admin login successful!');
    console.log('Response:', adminResponse.data);
    
  } catch (error) {
    console.log('❌ Admin login failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLogin();
