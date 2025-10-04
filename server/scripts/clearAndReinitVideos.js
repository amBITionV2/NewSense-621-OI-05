const mongoose = require('mongoose');
const EducationalVideo = require('../models/EducationalVideo');
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

// Clear existing videos and reinitialize
const clearAndReinit = async () => {
  try {
    console.log('🧹 Clearing existing YouTube videos...\n');
    
    await connectDB();
    
    // Delete all existing YouTube videos
    const deleteResult = await EducationalVideo.deleteMany({ generationMethod: 'youtube' });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing videos`);
    
    console.log('\n🔄 Reinitializing with new video IDs...');
    await initializeYouTubeVideos();
    
    console.log('\n🎉 Successfully updated all YouTube videos with new IDs!');
    console.log('\n📋 New Video IDs:');
    console.log('- Civic Responsibility: 9nQ8QyNvjqM, 8ZtInClXe1Q');
    console.log('- Environmental Awareness: WfGMYdalClU');
    console.log('- Traffic Rules: X5WqVZzrZqY');
    console.log('- Waste Management: OagTXWfaXEo');
    console.log('- Public Safety: hJ1j37oE4LI');
    console.log('- Community Service: Z7dLU6fk9QY');
    console.log('- Digital Citizenship: X6HoyvN4Ur0');
    console.log('- Health & Hygiene: YQaAGmFNEzs');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing and reinitializing videos:', error);
    process.exit(1);
  }
};

// Run the script
clearAndReinit();
