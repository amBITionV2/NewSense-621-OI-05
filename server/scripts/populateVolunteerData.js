const mongoose = require('mongoose');
const config = require('../config.dev');

// Import models
const Volunteer = require('../models/Volunteer');
const VolunteerTask = require('../models/VolunteerTask');
const User = require('../models/User');

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

// Sample volunteer data
const sampleVolunteers = [
  {
    name: 'John Smith',
    email: 'john.smith@email.com',
    password: 'password123',
    phone: '+1234567890',
    location: {
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      pincode: '10001',
      country: 'USA'
    },
    skills: ['community_service', 'leadership', 'communication'],
    interests: ['environment', 'education', 'healthcare'],
    experience: 'intermediate',
    status: 'active',
    isVerified: true,
    verificationStatus: 'approved',
    points: 150,
    badge: {
      rank: 'silver',
      level: 2,
      nextRankPoints: 50
    },
    totalTasksCompleted: 8,
    totalHoursVolunteered: 32,
    averageRating: 4.5
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    password: 'password123',
    phone: '+1234567891',
    location: {
      address: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      pincode: '90210',
      country: 'USA'
    },
    skills: ['healthcare', 'crisis_management', 'empathy'],
    interests: ['healthcare', 'social_work'],
    experience: 'advanced',
    status: 'active',
    isVerified: true,
    verificationStatus: 'approved',
    points: 320,
    badge: {
      rank: 'gold',
      level: 3,
      nextRankPoints: 180
    },
    totalTasksCompleted: 15,
    totalHoursVolunteered: 60,
    averageRating: 4.8
  },
  {
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    password: 'password123',
    phone: '+1234567892',
    location: {
      address: '789 Pine Street',
      city: 'Chicago',
      state: 'IL',
      pincode: '60601',
      country: 'USA'
    },
    skills: ['education', 'technology', 'public_speaking'],
    interests: ['education', 'technology'],
    experience: 'expert',
    status: 'active',
    isVerified: true,
    verificationStatus: 'approved',
    points: 450,
    badge: {
      rank: 'gold',
      level: 5,
      nextRankPoints: 50
    },
    totalTasksCompleted: 22,
    totalHoursVolunteered: 88,
    averageRating: 4.9
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    password: 'password123',
    phone: '+1234567893',
    location: {
      address: '321 Elm Street',
      city: 'Boston',
      state: 'MA',
      pincode: '02101',
      country: 'USA'
    },
    skills: ['environment', 'gardening', 'organization'],
    interests: ['environment', 'community_service'],
    experience: 'beginner',
    status: 'active',
    isVerified: true,
    verificationStatus: 'approved',
    points: 80,
    badge: {
      rank: 'bronze',
      level: 3,
      nextRankPoints: 20
    },
    totalTasksCompleted: 4,
    totalHoursVolunteered: 16,
    averageRating: 4.2
  },
  {
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    password: 'password123',
    phone: '+1234567894',
    location: {
      address: '654 Maple Drive',
      city: 'Seattle',
      state: 'WA',
      pincode: '98101',
      country: 'USA'
    },
    skills: ['social_work', 'counseling', 'communication'],
    interests: ['social_work', 'healthcare'],
    experience: 'intermediate',
    status: 'pending_approval',
    isVerified: false,
    verificationStatus: 'pending',
    points: 0,
    badge: {
      rank: 'bronze',
      level: 1,
      nextRankPoints: 100
    },
    totalTasksCompleted: 0,
    totalHoursVolunteered: 0,
    averageRating: 0
  }
];

// Sample volunteer tasks
const sampleTasks = [
  {
    title: 'Community Garden Maintenance',
    description: 'Help maintain the community garden by weeding, planting, and general upkeep. This is a weekly commitment that helps beautify our neighborhood.',
    category: 'community_service',
    priority: 'medium',
    status: 'open',
    location: {
      address: '123 Garden Street, Community District',
      city: 'New York',
      state: 'NY',
      pincode: '10001',
      coordinates: {
        latitude: 40.7128,
        longitude: -74.0060
      }
    },
    requiredSkills: ['gardening', 'community_service'],
    requiredExperience: 'beginner',
    maxVolunteers: 5,
    currentVolunteers: 2,
    estimatedDuration: {
      hours: 3,
      unit: 'hours'
    },
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    startDate: new Date(),
    instructions: 'Bring your own gardening tools if possible. Water and snacks will be provided.',
    tags: ['gardening', 'community', 'outdoor'],
    isActive: true
  },
  {
    title: 'Senior Center Meal Service',
    description: 'Help serve meals and interact with senior citizens at the local senior center. This is a great opportunity to make a difference in the lives of elderly community members.',
    category: 'healthcare',
    priority: 'high',
    status: 'open',
    location: {
      address: '456 Elder Care Avenue, Senior District',
      city: 'New York',
      state: 'NY',
      pincode: '10002',
      coordinates: {
        latitude: 40.7589,
        longitude: -73.9851
      }
    },
    requiredSkills: ['healthcare', 'communication', 'empathy'],
    requiredExperience: 'intermediate',
    maxVolunteers: 4,
    currentVolunteers: 1,
    estimatedDuration: {
      hours: 4,
      unit: 'hours'
    },
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    startDate: new Date(),
    instructions: 'Dress professionally and be prepared to interact with elderly residents.',
    tags: ['healthcare', 'seniors', 'meals'],
    isActive: true
  },
  {
    title: 'Environmental Cleanup Drive',
    description: 'Join our monthly environmental cleanup drive to help keep our city clean and protect local wildlife. This is a great way to contribute to environmental conservation.',
    category: 'environment',
    priority: 'medium',
    status: 'open',
    location: {
      address: '789 Green Street, Eco District',
      city: 'New York',
      state: 'NY',
      pincode: '10003',
      coordinates: {
        latitude: 40.7505,
        longitude: -73.9934
      }
    },
    requiredSkills: ['environment', 'physical_fitness'],
    requiredExperience: 'beginner',
    maxVolunteers: 10,
    currentVolunteers: 6,
    estimatedDuration: {
      hours: 5,
      unit: 'hours'
    },
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    startDate: new Date(),
    instructions: 'Wear comfortable clothes and bring water. Cleanup supplies will be provided.',
    tags: ['environment', 'cleanup', 'conservation'],
    isActive: true
  },
  {
    title: 'Digital Literacy Workshop',
    description: 'Teach basic computer skills to senior citizens at the community center. Help bridge the digital divide by sharing your technology knowledge.',
    category: 'education',
    priority: 'medium',
    status: 'open',
    location: {
      address: '321 Learning Avenue, Education District',
      city: 'New York',
      state: 'NY',
      pincode: '10004',
      coordinates: {
        latitude: 40.7614,
        longitude: -73.9776
      }
    },
    requiredSkills: ['education', 'technology', 'patience'],
    requiredExperience: 'intermediate',
    maxVolunteers: 3,
    currentVolunteers: 1,
    estimatedDuration: {
      hours: 6,
      unit: 'hours'
    },
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    startDate: new Date(),
    instructions: 'Basic computer knowledge required. Teaching materials will be provided.',
    tags: ['education', 'technology', 'seniors'],
    isActive: true
  },
  {
    title: 'Food Bank Distribution',
    description: 'Help distribute food packages to families in need at the local food bank. This is a critical service that helps fight hunger in our community.',
    category: 'social_work',
    priority: 'high',
    status: 'open',
    location: {
      address: '654 Food Bank Lane, Help District',
      city: 'New York',
      state: 'NY',
      pincode: '10005',
      coordinates: {
        latitude: 40.7831,
        longitude: -73.9712
      }
    },
    requiredSkills: ['social_work', 'organization', 'empathy'],
    requiredExperience: 'beginner',
    maxVolunteers: 8,
    currentVolunteers: 4,
    estimatedDuration: {
      hours: 4,
      unit: 'hours'
    },
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    startDate: new Date(),
    instructions: 'Be prepared to lift and carry food packages. Gloves will be provided.',
    tags: ['social_work', 'hunger', 'community'],
    isActive: true
  }
];

// Populate database
const populateDatabase = async () => {
  try {
    console.log('🗑️ Clearing existing data...');
    
    // Clear existing data
    await Volunteer.deleteMany({});
    await VolunteerTask.deleteMany({});
    
    console.log('👥 Creating sample volunteers...');
    
    // Create volunteers
    const createdVolunteers = [];
    for (const volunteerData of sampleVolunteers) {
      const volunteer = new Volunteer(volunteerData);
      await volunteer.save();
      createdVolunteers.push(volunteer);
      console.log(`✅ Created volunteer: ${volunteer.name}`);
    }
    
    console.log('📋 Creating sample tasks...');
    
    // Create tasks (assign first volunteer as creator)
    const createdTasks = [];
    for (const taskData of sampleTasks) {
      const task = new VolunteerTask({
        ...taskData,
        createdBy: createdVolunteers[0]._id // Assign first volunteer as creator
      });
      await task.save();
      createdTasks.push(task);
      console.log(`✅ Created task: ${task.title}`);
    }
    
    console.log('🎉 Database populated successfully!');
    console.log(`📊 Created ${createdVolunteers.length} volunteers and ${createdTasks.length} tasks`);
    
    // Display summary
    console.log('\n📈 Summary:');
    console.log(`- Volunteers: ${createdVolunteers.length}`);
    console.log(`- Tasks: ${createdTasks.length}`);
    console.log(`- Active volunteers: ${createdVolunteers.filter(v => v.status === 'active').length}`);
    console.log(`- Verified volunteers: ${createdVolunteers.filter(v => v.isVerified).length}`);
    console.log(`- Open tasks: ${createdTasks.filter(t => t.status === 'open').length}`);
    
  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
    process.exit(0);
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await populateDatabase();
};

run();
