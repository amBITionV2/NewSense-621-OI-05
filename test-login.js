const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login functionality...');
    
    // Test with demo user
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'demo@example.com',
      password: 'password'
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ Login failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else if (error.request) {
      console.log('No response received. Server might not be running.');
      console.log('Error:', error.message);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLogin();