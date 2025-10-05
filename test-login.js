const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login with demo credentials...');
    
    // First, let's check if the server is running
    const healthResponse = await axios.get('http://localhost:5000/api/auth/me');
    console.log('Server is running, but this should fail without auth...');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Server is running (got expected 401 for /me without auth)');
    } else {
      console.log('Server status check:', error.message);
    }
  }
  
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'demo@example.com',
      password: 'password'
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('❌ Login failed:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data);
    console.error('Full error:', error.message);
  }
}

testLogin();
