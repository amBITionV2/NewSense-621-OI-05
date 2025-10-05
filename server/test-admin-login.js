const mongoose = require('mongoose');
const config = require('./config.dev');

// Import models
const User = require('./models/User');
const Admin = require('./models/Admin');

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

async function testAdminLogin() {
  try {
    await connectDB();
    
    console.log('🔍 Testing Admin Users in Database...\n');

    // Check for admin users
    const adminUsers = await User.find({ role: 'admin' });
    console.log(`✅ Found ${adminUsers.length} admin users:`);
    
    adminUsers.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.name} (${admin.email})`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Created: ${admin.createdAt}`);
      console.log('');
    });

    // Check for Admin model users
    if (Admin) {
      const adminModelUsers = await Admin.find({});
      console.log(`✅ Found ${adminModelUsers.length} Admin model users:`);
      
      adminModelUsers.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.name} (${admin.email})`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   Created: ${admin.createdAt}`);
        console.log('');
      });
    }

    // Create a test admin if none exist
    if (adminUsers.length === 0) {
      console.log('🔧 Creating test admin user...');
      const testAdmin = new User({
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'admin123',
        role: 'admin',
        phone: '+1234567890',
        location: {
          address: '123 Admin Street',
          city: 'Admin City',
          state: 'Admin State',
          pincode: '12345'
        }
      });
      
      await testAdmin.save();
      console.log('✅ Test admin created: admin@test.com / admin123');
    }
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await mongoose.disconnect();
  }
}

testAdminLogin();
