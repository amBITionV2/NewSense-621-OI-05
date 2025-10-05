const axios = require('axios');

async function checkUserData() {
  try {
    console.log('Checking user data from server...');
    
    // Let's try to get user info (this might fail if auth is required)
    const response = await axios.get('http://localhost:5000/api/auth/me');
    console.log('User data:', response.data);
    
  } catch (error) {
    console.log('Could not get user data (expected if not logged in)');
    
    // Let's try a different approach - check if we can access the mock database directly
    console.log('\nTrying to access mock database directly...');
    
    try {
      const mockResponse = await axios.get('http://localhost:5000/api/debug/users');
      console.log('Mock database users:', mockResponse.data);
    } catch (debugError) {
      console.log('Debug endpoint not available');
    }
  }
}

checkUserData();
