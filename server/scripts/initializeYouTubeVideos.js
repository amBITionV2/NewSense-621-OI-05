const mongoose = require('mongoose');
const { initializeYouTubeVideos } = require('../services/youtubeVideoService');

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

// Initialize YouTube videos
const main = async () => {
  try {
    console.log('🚀 Initializing YouTube Videos for Civic Sense Education...\n');
    
    await connectDB();
    await initializeYouTubeVideos();
    
    console.log('\n🎉 YouTube videos initialization completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start your server: npm run dev');
    console.log('2. Visit the Educational Videos page');
    console.log('3. Click "Load YouTube Videos" to see the curated content');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing YouTube videos:', error);
    process.exit(1);
  }
};

// Run the script
main();
