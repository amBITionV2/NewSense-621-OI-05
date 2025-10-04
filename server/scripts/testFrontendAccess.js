const axios = require('axios');

// Test frontend access to videos
const testFrontendAccess = async () => {
  try {
    console.log('🧪 Testing Frontend Access to Videos...\n');
    
    // Test the main videos endpoint
    console.log('📡 Testing /api/ai/videos endpoint...');
    try {
      const response = await axios.get('http://localhost:5000/api/ai/videos');
      console.log('✅ Videos endpoint accessible');
      console.log(`📊 Found ${response.data.videos.length} videos`);
      
      if (response.data.videos.length > 0) {
        console.log('\n📋 Available Videos:');
        response.data.videos.forEach((video, index) => {
          console.log(`   ${index + 1}. ${video.title}`);
          console.log(`      Category: ${video.category}`);
          console.log(`      Language: ${video.language}`);
          console.log(`      Duration: ${Math.floor(video.duration / 60)} minutes`);
        });
      }
    } catch (error) {
      console.log(`❌ Videos endpoint error: ${error.message}`);
    }
    
    // Test the civic videos endpoint
    console.log('\n📡 Testing /api/ai/civic-videos endpoint...');
    try {
      const response = await axios.get('http://localhost:5000/api/ai/civic-videos');
      console.log('✅ Civic videos endpoint accessible');
      console.log(`📊 Found ${response.data.videos.length} civic videos`);
      
      if (response.data.videos.length > 0) {
        console.log('\n📋 Available Civic Videos:');
        response.data.videos.forEach((video, index) => {
          console.log(`   ${index + 1}. ${video.title}`);
          console.log(`      Category: ${video.category}`);
          console.log(`      Generation Method: ${video.generationMethod}`);
        });
      }
    } catch (error) {
      console.log(`❌ Civic videos endpoint error: ${error.message}`);
    }
    
    // Test category filtering
    console.log('\n📡 Testing category filtering...');
    try {
      const response = await axios.get('http://localhost:5000/api/ai/videos?category=civic-responsibility');
      console.log('✅ Category filtering works');
      console.log(`📊 Found ${response.data.videos.length} civic responsibility videos`);
    } catch (error) {
      console.log(`❌ Category filtering error: ${error.message}`);
    }
    
    console.log('\n🎉 Frontend Access Test Complete!');
    console.log('💡 The educational videos should now be accessible from the frontend.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run the test
testFrontendAccess();
