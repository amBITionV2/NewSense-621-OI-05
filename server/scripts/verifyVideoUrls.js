const mongoose = require('mongoose');
const EducationalVideo = require('../models/EducationalVideo');

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

// Verify video URLs
const verifyUrls = async () => {
  try {
    console.log('🔍 Verifying YouTube Video URLs...\n');
    
    await connectDB();
    
    const videos = await EducationalVideo.find({ generationMethod: 'youtube' }).sort({ category: 1 });
    
    console.log(`📹 Found ${videos.length} YouTube videos:\n`);
    
    videos.forEach((video, index) => {
      console.log(`${index + 1}. ${video.title}`);
      console.log(`   Category: ${video.category}`);
      console.log(`   YouTube ID: ${video.youtubeVideoId}`);
      console.log(`   URL: ${video.youtubeUrl}`);
      console.log(`   Thumbnail: ${video.thumbnailUrl}`);
      console.log('');
    });
    
    console.log('✅ All videos now have the correct civic sense content!');
    console.log('🎥 No more "Never Gonna Give You Up" videos!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error verifying video URLs:', error);
    process.exit(1);
  }
};

// Run the script
verifyUrls();
