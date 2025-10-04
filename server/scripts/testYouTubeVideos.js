const mongoose = require('mongoose');
const { getYouTubeVideos, initializeYouTubeVideos } = require('../services/youtubeVideoService');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/citizen-complaints');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test YouTube videos
const testYouTubeVideos = async () => {
  try {
    console.log('🧪 Testing YouTube Videos...\n');
    
    await connectDB();
    
    // Test getting videos for a specific category
    console.log('📹 Testing civic-responsibility videos...');
    const civicVideos = await getYouTubeVideos('civic-responsibility', 'en', 'all');
    console.log(`✅ Found ${civicVideos.length} civic responsibility videos`);
    
    // Test getting environmental videos
    console.log('🌱 Testing environmental-awareness videos...');
    const envVideos = await getYouTubeVideos('environmental-awareness', 'en', 'all');
    console.log(`✅ Found ${envVideos.length} environmental awareness videos`);
    
    // Test getting traffic videos
    console.log('🚦 Testing traffic-rules videos...');
    const trafficVideos = await getYouTubeVideos('traffic-rules', 'en', 'all');
    console.log(`✅ Found ${trafficVideos.length} traffic rules videos`);
    
    console.log('\n🎉 All YouTube video tests passed successfully!');
    console.log('\n📋 Video Details:');
    
    // Display video details
    [...civicVideos, ...envVideos, ...trafficVideos].forEach((video, index) => {
      console.log(`\n${index + 1}. ${video.title}`);
      console.log(`   Category: ${video.category}`);
      console.log(`   Duration: ${Math.floor(video.duration / 60)} minutes`);
      console.log(`   YouTube ID: ${video.youtubeVideoId}`);
      console.log(`   Content: ${video.content.substring(0, 100)}...`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing YouTube videos:', error);
    process.exit(1);
  }
};

// Run the test
testYouTubeVideos();
