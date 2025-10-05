const axios = require('axios');

const testServer = async () => {
  try {
    console.log('Testing server connection...');
    
    // Test basic server response
    const response = await axios.get('http://localhost:5000/api/auth/me', {
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });
    
    console.log('Server is running!');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Server is running and responding correctly (401 for invalid token)');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running. Please start the server with: npm run server');
    } else {
      console.log('✅ Server is running (got response:', error.response?.status, ')');
    }
  }
};

testServer();
