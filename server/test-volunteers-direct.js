const mongoose = require('mongoose');
const config = require('./config.dev');

// Import models
const Volunteer = require('./models/Volunteer');

// Connect to database
const connectDB = async () => {
  try {
    if (config.MONGODB_URI) {
      await mongoose.connect(config.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('✅ Connected to MongoDB');
    } else {
      console.log('❌ No MongoDB URI found');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

async function testVolunteersDirect() {
  try {
    await connectDB();
    
    console.log('🔍 Testing Volunteers Direct Database Access...\n');

    // Get all volunteers
    const volunteers = await Volunteer.find({}).select('-password');
    console.log(`✅ Found ${volunteers.length} volunteers in database:`);
    
    volunteers.forEach((volunteer, index) => {
      console.log(`${index + 1}. ${volunteer.name} (${volunteer.email})`);
      console.log(`   Status: ${volunteer.status}`);
      console.log(`   Verified: ${volunteer.isVerified}`);
      console.log(`   Points: ${volunteer.points}`);
      console.log(`   Badge: ${volunteer.badge?.rank} (Level ${volunteer.badge?.level})`);
      console.log(`   Tasks Completed: ${volunteer.totalTasksCompleted}`);
      console.log(`   Average Rating: ${volunteer.averageRating}`);
      console.log('');
    });

    // Test admin volunteers query
    console.log('🔍 Testing admin volunteers query...');
    const adminQuery = await Volunteer.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    
    console.log(`✅ Admin query returned ${adminQuery.length} volunteers`);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await mongoose.disconnect();
  }
}

testVolunteersDirect();
