const mongoose = require('mongoose');
const EducationalVideo = require('../models/EducationalVideo');
const jwt = require('jsonwebtoken');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/citizen-complaints', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test videos with authentication
const testVideosWithAuth = async () => {
  try {
    console.log('🧪 Testing Videos with Authentication...\n');
    
    // Create a test JWT token
    const testToken = jwt.sign(
      { userId: 'test-user-id', role: 'citizen' },
      'dev-super-secret-jwt-key-change-in-production',
      { expiresIn: '1h' }
    );
    
    console.log('🔑 Created test JWT token');
    
    // Test the videos query directly
    const query = { isPublished: true };
    const videos = await EducationalVideo.find(query)
      .sort({ publishedAt: -1 })
      .limit(10);
    
    console.log(`📊 Found ${videos.length} videos in database`);
    
    if (videos.length > 0) {
      console.log('\n📋 Available Videos:');
      videos.forEach((video, index) => {
        console.log(`   ${index + 1}. ${video.title}`);
        console.log(`      Category: ${video.category}`);
        console.log(`      Language: ${video.language}`);
        console.log(`      Duration: ${Math.floor(video.duration / 60)} minutes`);
        console.log(`      Published: ${video.publishedAt ? 'Yes' : 'No'}`);
        console.log('');
      });
    } else {
      console.log('❌ No videos found in database');
    }
    
    // Test API endpoint with authentication
    const axios = require('axios');
    
    try {
      const response = await axios.get('http://localhost:5000/api/ai/videos', {
        headers: {
          'Authorization': `Bearer ${testToken}`
        }
      });
      
      console.log('✅ API call successful!');
      console.log(`📊 API returned ${response.data.videos.length} videos`);
      
      if (response.data.videos.length > 0) {
        console.log('\n📋 API Response Videos:');
        response.data.videos.forEach((video, index) => {
          console.log(`   ${index + 1}. ${video.title} (${video.category})`);
        });
      }
      
    } catch (error) {
      if (error.response) {
        console.log(`❌ API Error: ${error.response.status} - ${error.response.data.message}`);
      } else {
        console.log(`❌ Network Error: ${error.message}`);
        console.log('💡 Make sure the server is running on port 5000');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await testVideosWithAuth();
    
  } catch (error) {
    console.error('❌ Script execution failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
    process.exit(0);
  }
};

// Run the script
if (require.main === module) {
  main();
}

module.exports = { testVideosWithAuth };
