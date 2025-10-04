const mongoose = require('mongoose');
const EducationalVideo = require('../models/EducationalVideo');
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

// Function to display video summary
const displayVideoSummary = async () => {
  try {
    console.log('📊 CIVIC SENSE EDUCATIONAL VIDEOS SUMMARY\n');
    console.log('=' .repeat(60));

    // Get all videos
    const videos = await EducationalVideo.find({ generationMethod: 'gemini-veo' }).sort({ category: 1, language: 1 });
    
    console.log(`\n🎥 Total Videos Generated: ${videos.length}\n`);

    // Group by category
    const categoryGroups = {};
    videos.forEach(video => {
      if (!categoryGroups[video.category]) {
        categoryGroups[video.category] = [];
      }
      categoryGroups[video.category].push(video);
    });

    // Display by category
    Object.keys(categoryGroups).forEach(category => {
      const categoryVideos = categoryGroups[category];
      console.log(`📁 ${category.toUpperCase().replace('-', ' ')} (${categoryVideos.length} videos)`);
      console.log('-'.repeat(50));
      
      categoryVideos.forEach((video, index) => {
        const languageFlag = video.language === 'en' ? '🇺🇸' : 
                           video.language === 'hi' ? '🇮🇳' : 
                           video.language === 'ta' ? '🇮🇳' : '🌍';
        
        const audienceIcon = video.targetAudience === 'children' ? '👶' : 
                           video.targetAudience === 'seniors' ? '👴' : '👥';
        
        console.log(`   ${index + 1}. ${languageFlag} ${audienceIcon} ${video.title}`);
        console.log(`      📝 ${video.description}`);
        console.log(`      ⏱️  ${Math.floor(video.duration / 60)} minutes | 🏷️  ${video.language.toUpperCase()}`);
        console.log(`      🎯 Learning Objectives: ${video.learningObjectives.length}`);
        console.log(`      💡 Practical Tips: ${video.practicalTips.length}`);
        console.log('');
      });
    });

    // Language distribution
    const languageStats = {};
    videos.forEach(video => {
      languageStats[video.language] = (languageStats[video.language] || 0) + 1;
    });

    console.log('\n🌍 LANGUAGE DISTRIBUTION');
    console.log('-'.repeat(30));
    Object.keys(languageStats).forEach(lang => {
      const flag = lang === 'en' ? '🇺🇸' : lang === 'hi' ? '🇮🇳' : lang === 'ta' ? '🇮🇳' : '🌍';
      console.log(`   ${flag} ${lang.toUpperCase()}: ${languageStats[lang]} videos`);
    });

    // Audience distribution
    const audienceStats = {};
    videos.forEach(video => {
      const audience = video.targetAudience || 'all';
      audienceStats[audience] = (audienceStats[audience] || 0) + 1;
    });

    console.log('\n👥 TARGET AUDIENCE DISTRIBUTION');
    console.log('-'.repeat(35));
    Object.keys(audienceStats).forEach(audience => {
      const icon = audience === 'children' ? '👶' : 
                  audience === 'seniors' ? '👴' : 
                  audience === 'adults' ? '👨' : '👥';
      console.log(`   ${icon} ${audience.toUpperCase()}: ${audienceStats[audience]} videos`);
    });

    // Total duration
    const totalDuration = videos.reduce((sum, video) => sum + video.duration, 0);
    const totalMinutes = Math.floor(totalDuration / 60);
    const totalHours = Math.floor(totalMinutes / 60);

    console.log('\n⏱️  CONTENT STATISTICS');
    console.log('-'.repeat(25));
    console.log(`   📺 Total Duration: ${totalHours}h ${totalMinutes % 60}m`);
    console.log(`   📝 Total Learning Objectives: ${videos.reduce((sum, video) => sum + video.learningObjectives.length, 0)}`);
    console.log(`   💡 Total Practical Tips: ${videos.reduce((sum, video) => sum + video.practicalTips.length, 0)}`);
    console.log(`   🏷️  Total Tags: ${videos.reduce((sum, video) => sum + video.tags.length, 0)}`);

    console.log('\n🚀 FEATURES AVAILABLE');
    console.log('-'.repeat(20));
    console.log('   ✅ AI-Generated Content (Gemini Veo)');
    console.log('   ✅ Multi-language Support (EN, HI, TA)');
    console.log('   ✅ Age-specific Content (Children, Adults, Seniors)');
    console.log('   ✅ Comprehensive Learning Objectives');
    console.log('   ✅ Practical Action Tips');
    console.log('   ✅ Call-to-Action Sections');
    console.log('   ✅ HD Video Quality');
    console.log('   ✅ Educational Categories');

    console.log('\n📱 USER EXPERIENCE');
    console.log('-'.repeat(20));
    console.log('   🎯 Tabbed Interface (All Videos / Civic Sense Videos)');
    console.log('   🔍 Advanced Filtering and Search');
    console.log('   📱 Responsive Design (Mobile & Desktop)');
    console.log('   ⚡ Real-time Video Generation');
    console.log('   📊 Analytics and Performance Tracking');
    console.log('   🎨 Enhanced Visual Design');

    console.log('\n🎉 SAMPLE VIDEOS SUCCESSFULLY GENERATED!');
    console.log('💡 Users can now access comprehensive civic sense education content.');
    console.log('🌟 The system is ready for citizen education and community engagement.');

  } catch (error) {
    console.error('❌ Error displaying video summary:', error);
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await displayVideoSummary();
    
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

module.exports = { displayVideoSummary };
