const mongoose = require('mongoose');
const geminiVeoService = require('../services/geminiVeoService');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/citizen-complaint-system');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample video generation function
const generateSampleVideos = async () => {
  try {
    console.log('🎥 Starting sample civic sense video generation...\n');

    const categories = [
      'civic-responsibility',
      'environmental-awareness', 
      'traffic-rules',
      'waste-management',
      'public-safety',
      'community-service',
      'digital-citizenship',
      'health-hygiene'
    ];

    const languages = ['en', 'hi', 'ta'];
    const targetAudiences = ['all', 'children', 'adults'];

    let generatedCount = 0;
    const totalVideos = categories.length * 2; // 2 videos per category

    for (const category of categories) {
      console.log(`📹 Generating videos for category: ${category}`);
      
      // Generate English video for all audiences
      try {
        console.log(`  🌍 Creating English video for ${category}...`);
        const video1 = await geminiVeoService.generateCivicSenseVideo(category, 'en', 'all');
        console.log(`  ✅ Generated: "${video1.title}"`);
        generatedCount++;
      } catch (error) {
        console.log(`  ❌ Failed to generate English video for ${category}:`, error.message);
      }

      // Generate Hindi video for adults
      try {
        console.log(`  🇮🇳 Creating Hindi video for ${category}...`);
        const video2 = await geminiVeoService.generateCivicSenseVideo(category, 'hi', 'adults');
        console.log(`  ✅ Generated: "${video2.title}"`);
        generatedCount++;
      } catch (error) {
        console.log(`  ❌ Failed to generate Hindi video for ${category}:`, error.message);
      }

      console.log(''); // Empty line for readability
    }

    // Generate some Tamil videos for specific categories
    const tamilCategories = ['civic-responsibility', 'environmental-awareness', 'traffic-rules'];
    for (const category of tamilCategories) {
      try {
        console.log(`  🇮🇳 Creating Tamil video for ${category}...`);
        const video = await geminiVeoService.generateCivicSenseVideo(category, 'ta', 'all');
        console.log(`  ✅ Generated: "${video.title}"`);
        generatedCount++;
      } catch (error) {
        console.log(`  ❌ Failed to generate Tamil video for ${category}:`, error.message);
      }
    }

    // Generate children-specific videos
    const childrenCategories = ['civic-responsibility', 'environmental-awareness', 'traffic-rules'];
    for (const category of childrenCategories) {
      try {
        console.log(`  👶 Creating children's video for ${category}...`);
        const video = await geminiVeoService.generateCivicSenseVideo(category, 'en', 'children');
        console.log(`  ✅ Generated: "${video.title}"`);
        generatedCount++;
      } catch (error) {
        console.log(`  ❌ Failed to generate children's video for ${category}:`, error.message);
      }
    }

    console.log('\n🎉 Sample video generation completed!');
    console.log(`📊 Total videos generated: ${generatedCount}`);
    console.log('\n📋 Generated videos include:');
    console.log('   • Civic Responsibility videos (English, Hindi, Tamil)');
    console.log('   • Environmental Awareness videos (English, Hindi, Tamil)');
    console.log('   • Traffic Rules videos (English, Hindi, Tamil)');
    console.log('   • Waste Management videos (English, Hindi)');
    console.log('   • Public Safety videos (English, Hindi)');
    console.log('   • Community Service videos (English, Hindi)');
    console.log('   • Digital Citizenship videos (English, Hindi)');
    console.log('   • Health & Hygiene videos (English, Hindi)');
    console.log('   • Children-specific educational content');
    console.log('   • Adult-focused practical guides');

  } catch (error) {
    console.error('❌ Error generating sample videos:', error);
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await generateSampleVideos();
    
    console.log('\n🚀 Sample videos are now available in the educational videos section!');
    console.log('💡 Users can now access AI-generated civic sense educational content.');
    
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

module.exports = { generateSampleVideos };
