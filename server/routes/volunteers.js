const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const config = require('../config.dev');

let Volunteer, VolunteerTask, Admin;
try {
  Volunteer = require('../models/Volunteer');
  VolunteerTask = require('../models/VolunteerTask');
  Admin = require('../models/Admin');
} catch (e) {
  Volunteer = null;
  VolunteerTask = null;
  Admin = null;
}

const router = express.Router();

// Generate JWT token for volunteers
const generateToken = (volunteerId) => {
  return jwt.sign({ userId: volunteerId, userType: 'volunteer' }, config.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/volunteers/register
// @desc    Register a new volunteer (for existing citizens)
// @access  Private
router.post('/register', auth, [
  body('userId').isMongoId().withMessage('Valid user ID is required'),
  body('skills').isArray().withMessage('Skills must be an array'),
  body('interests').isArray().withMessage('Interests must be an array'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('gender').isIn(['male', 'female', 'other', 'prefer_not_to_say']).withMessage('Invalid gender'),
  body('aadhaarNumber').isString().withMessage('Aadhaar number is required'),
  body('emergencyContact.name').isString().withMessage('Emergency contact name is required'),
  body('emergencyContact.relationship').isString().withMessage('Emergency contact relationship is required'),
  body('emergencyContact.phone').isString().withMessage('Emergency contact phone is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, ...volunteerData } = req.body;

    if (Volunteer) {
      // Check if user is already a volunteer
      const existingVolunteer = await Volunteer.findOne({ userId });
      if (existingVolunteer) {
        return res.status(400).json({ message: 'User is already registered as a volunteer' });
      }

      // Get user details from User model
      const User = require('../models/User');
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Create volunteer record linked to existing user
      const volunteer = await Volunteer.create({
        userId: userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        ...volunteerData,
        isActive: true,
        verificationStatus: 'pending',
        lastLogin: new Date()
      });

      // Update user role to include volunteer and add volunteer info
      user.role = user.role === 'admin' ? 'admin' : 'volunteer';
      user.volunteerInfo = {
        volunteerId: volunteer._id,
        points: 0,
        badge: {
          rank: 'bronze',
          level: 1
        },
        totalTasksCompleted: 0,
        averageRating: 0
      };
      await user.save();

      return res.status(201).json({
        message: 'Successfully registered as a volunteer',
        success: true,
        volunteer: {
          id: volunteer._id,
          name: volunteer.name,
          email: volunteer.email,
          status: volunteer.status
        }
      });
    } else {
      // Fallback for when models are not available - use mock database
      const mockDB = require('../mockDatabase');
      const user = mockDB.findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if user is already a volunteer in mock DB
      if (user.role === 'volunteer') {
        return res.status(400).json({ message: 'User is already registered as a volunteer' });
      }

      // Update user role to volunteer in mock DB
      user.role = 'volunteer';
      user.volunteerData = volunteerData;

      return res.status(201).json({
        message: 'Successfully registered as a volunteer',
        success: true,
        volunteer: {
          id: user._id,
          name: user.name,
          email: user.email,
          status: 'active'
        }
      });
    }
  } catch (error) {
    console.error('Citizen volunteer registration error:', error);
    res.status(500).json({
      message: 'Server error during volunteer registration',
      error: error.message
    });
  }
});

// @route   POST /api/volunteers/register-new
// @desc    Register a new volunteer (standalone registration)
// @access  Public
router.post('/register-new', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').isString().withMessage('Please provide a valid phone number'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('interests').optional().isArray().withMessage('Interests must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name, email, password, phone, alternateContact, location,
      skills, interests, availability, experience, emergencyContact,
      aadhaarNumber, dateOfBirth, gender, preferences
    } = req.body;

    if (Volunteer) {
      // Check if volunteer already exists
      const existingVolunteer = await Volunteer.findOne({ email });
      if (existingVolunteer) {
        return res.status(400).json({ message: 'Volunteer already exists with this email' });
      }

      // Ensure location has proper structure
      const volunteerLocation = {
        address: location?.address || '',
        city: location?.city || '',
        state: location?.state || '',
        pincode: location?.pincode || '',
        country: location?.country || ''
      };

      const volunteer = await Volunteer.create({
        name,
        email,
        password,
        phone,
        alternateContact,
        location: volunteerLocation,
        skills: skills || [],
        interests: interests || [],
        availability: availability || {
          weekdays: true,
          weekends: true,
          timeSlots: []
        },
        experience: experience || 'beginner',
        emergencyContact: emergencyContact || {},
        aadhaarNumber,
        dateOfBirth,
        gender,
        preferences: {
          language: preferences?.language || 'en',
          notifications: {
            email: preferences?.notifications?.email !== undefined ? preferences.notifications.email : true,
            sms: preferences?.notifications?.sms !== undefined ? preferences.notifications.sms : false,
            push: preferences?.notifications?.push !== undefined ? preferences.notifications.push : true
          },
          taskTypes: preferences?.taskTypes || [],
          maxDistance: preferences?.maxDistance || 10
        },
        isActive: true,
        verificationStatus: 'pending',
        lastLogin: new Date()
      });

      const token = generateToken(volunteer._id);
      return res.status(201).json({
        message: 'Volunteer registered successfully',
        token,
        user: {
          id: volunteer._id,
          name: volunteer.name,
          email: volunteer.email,
          role: 'volunteer',
          userType: 'volunteer',
          status: volunteer.status
        }
      });
    }

    // Fallback for when models are not available
    res.status(500).json({ message: 'Volunteer registration not available' });
  } catch (error) {
    console.error('Volunteer registration error:', error);
    res.status(500).json({
      message: 'Server error during volunteer registration',
      error: error.message
    });
  }
});

// @route   POST /api/volunteers/login
// @desc    Login volunteer
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    if (Volunteer) {
      const volunteer = await Volunteer.findOne({ email });
      if (!volunteer) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await volunteer.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      volunteer.lastLogin = new Date();
      await volunteer.save();

      const token = generateToken(volunteer._id);
      return res.json({
        message: 'Volunteer login successful',
        token,
        user: {
          id: volunteer._id,
          name: volunteer.name,
          email: volunteer.email,
          role: 'volunteer',
          userType: 'volunteer',
          status: volunteer.status,
          location: volunteer.location
        }
      });
    }

    res.status(500).json({ message: 'Volunteer login not available' });
  } catch (error) {
    console.error('Volunteer login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/volunteers/me
// @desc    Get current volunteer
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    if (req.userType !== 'volunteer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (Volunteer) {
      const volunteer = await Volunteer.findById(req.userId).lean();
      if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
      const { password, ...volunteerWithoutPassword } = volunteer;
      return res.json({ user: volunteerWithoutPassword });
    }

    res.status(500).json({ message: 'Volunteer data not available' });
  } catch (error) {
    console.error('Get volunteer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/volunteers/profile
// @desc    Update volunteer profile
// @access  Private
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone(),
  body('skills').optional().isArray(),
  body('interests').optional().isArray()
], async (req, res) => {
  try {
    if (req.userType !== 'volunteer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = req.body;

    if (Volunteer) {
      const volunteer = await Volunteer.findById(req.userId);
      if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });

      // Merge updates into volunteer document
      Object.keys(updates).forEach(key => {
        if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
          volunteer[key] = { ...volunteer[key], ...updates[key] };
        } else {
          volunteer[key] = updates[key];
        }
      });

      await volunteer.save();
      const volunteerObj = volunteer.toObject();
      delete volunteerObj.password;
      return res.json({ message: 'Profile updated successfully', user: volunteerObj });
    }

    res.status(500).json({ message: 'Profile update not available' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/volunteers/tasks
// @desc    Get available tasks for volunteer (including complaints as tasks)
// @access  Private
router.get('/tasks', auth, async (req, res) => {
  try {
    console.log('🔍 Available tasks route called');
    console.log('User type:', req.userType);
    console.log('User ID:', req.userId);
    
    if (req.userType !== 'volunteer') {
      console.log('❌ Access denied - not a volunteer');
      return res.status(403).json({ message: 'Access denied' });
    }

    if (VolunteerTask && Volunteer) {
      const volunteer = await Volunteer.findById(req.userId);
      if (!volunteer) {
        console.log('❌ Volunteer not found');
        return res.status(404).json({ message: 'Volunteer not found' });
      }

      console.log('✅ Volunteer found:', volunteer.name);
      const { status = 'open', category, priority } = req.query;
      
      let query = { status, isActive: true };
      if (category) query.category = category;
      if (priority) query.priority = priority;

      // Get volunteer tasks
      const volunteerTasks = await VolunteerTask.find(query)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

      console.log(`✅ Found ${volunteerTasks.length} volunteer tasks`);

      // Get complaints as tasks
      const Complaint = require('../models/Complaint');
      const complaintQuery = { status: { $in: ['open', 'in-progress'] } };
      if (category) {
        // Map volunteer task categories to complaint categories
        const categoryMap = {
          'community_service': ['potholes', 'garbage', 'street-lighting', 'road-maintenance'],
          'environment': ['air-pollution', 'noise-pollution'],
          'healthcare': ['water-supply', 'sewage'],
          'social_work': ['public-transport', 'parks-recreation'],
          'other': ['traffic-signals', 'other']
        };
        if (categoryMap[category]) {
          complaintQuery.category = { $in: categoryMap[category] };
        }
      }

      const complaints = await Complaint.find(complaintQuery)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(20); // Limit complaints to avoid overwhelming

      console.log(`✅ Found ${complaints.length} complaint tasks`);

      // Convert complaints to task format
      const complaintTasks = complaints.map(complaint => ({
        _id: `complaint_${complaint._id}`,
        title: `Help with: ${complaint.title}`,
        description: complaint.description,
        category: 'community_service', // Default category for complaints
        priority: complaint.priority,
        status: complaint.status === 'in-progress' ? 'assigned' : 'open',
        location: {
          address: complaint.location.address,
          city: complaint.location.city,
          state: complaint.location.state,
          pincode: complaint.location.pincode,
          coordinates: {
            latitude: complaint.location.coordinates.lat,
            longitude: complaint.location.coordinates.lng
          }
        },
        estimatedDuration: {
          hours: 2,
          unit: 'hours'
        },
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        startDate: new Date(),
        maxVolunteers: 3,
        currentVolunteers: 0,
        requiredSkills: ['community_service'],
        requiredExperience: 'beginner',
        createdBy: complaint.user,
        isComplaintTask: true,
        originalComplaintId: complaint._id,
        createdAt: complaint.createdAt,
        updatedAt: complaint.updatedAt
      }));

      // Combine volunteer tasks and complaint tasks
      const allTasks = [...volunteerTasks, ...complaintTasks];

      // Add comprehensive hardcoded tasks for demonstration
      const hardcodedTasks = [
        {
          _id: 'hardcoded_1',
          title: 'Community Garden Cleanup',
          description: 'Help clean and maintain the community garden. Tasks include weeding, planting, and general maintenance.',
          category: 'community_service',
          priority: 'medium',
          status: 'open',
          location: {
            address: '123 Community Street, Garden District',
            city: 'Sample City',
            state: 'Sample State',
            pincode: '12345',
            coordinates: { latitude: 40.7128, longitude: -74.0060 }
          },
          estimatedDuration: { hours: 4, unit: 'hours' },
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          startDate: new Date(),
          maxVolunteers: 5,
          currentVolunteers: 2,
          requiredSkills: ['gardening', 'community_service'],
          requiredExperience: 'beginner',
          createdBy: { name: 'Community Manager', email: 'manager@community.com' },
          isHardcoded: true,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          _id: 'hardcoded_2',
          title: 'Senior Center Meal Service',
          description: 'Help serve meals and interact with senior citizens at the local senior center.',
          category: 'healthcare',
          priority: 'high',
          status: 'open',
          location: {
            address: '456 Elder Care Avenue, Senior District',
            city: 'Sample City',
            state: 'Sample State',
            pincode: '12345',
            coordinates: { latitude: 40.7589, longitude: -73.9851 }
          },
          estimatedDuration: { hours: 3, unit: 'hours' },
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          startDate: new Date(),
          maxVolunteers: 4,
          currentVolunteers: 1,
          requiredSkills: ['healthcare', 'communication'],
          requiredExperience: 'intermediate',
          createdBy: { name: 'Senior Center Director', email: 'director@seniorcenter.com' },
          isHardcoded: true,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          _id: 'hardcoded_3',
          title: 'Environmental Awareness Campaign',
          description: 'Help organize and run an environmental awareness campaign in local schools.',
          category: 'environment',
          priority: 'medium',
          status: 'open',
          location: {
            address: '789 Green Street, Eco District',
            city: 'Sample City',
            state: 'Sample State',
            pincode: '12345',
            coordinates: { latitude: 40.7505, longitude: -73.9934 }
          },
          estimatedDuration: { hours: 6, unit: 'hours' },
          deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          startDate: new Date(),
          maxVolunteers: 8,
          currentVolunteers: 3,
          requiredSkills: ['education', 'environment', 'public_speaking'],
          requiredExperience: 'intermediate',
          createdBy: { name: 'Environmental Coordinator', email: 'eco@environment.com' },
          isHardcoded: true,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          _id: 'hardcoded_4',
          title: 'Food Bank Distribution',
          description: 'Help distribute food packages to families in need at the local food bank.',
          category: 'social_work',
          priority: 'high',
          status: 'open',
          location: {
            address: '321 Food Bank Lane, Help District',
            city: 'Sample City',
            state: 'Sample State',
            pincode: '12345',
            coordinates: { latitude: 40.7831, longitude: -73.9712 }
          },
          estimatedDuration: { hours: 5, unit: 'hours' },
          deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          startDate: new Date(),
          maxVolunteers: 6,
          currentVolunteers: 3,
          requiredSkills: ['social_work', 'organization'],
          requiredExperience: 'beginner',
          createdBy: { name: 'Food Bank Manager', email: 'manager@foodbank.com' },
          isHardcoded: true,
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
        },
        {
          _id: 'hardcoded_5',
          title: 'Digital Literacy Workshop',
          description: 'Teach basic computer skills to senior citizens at the community center.',
          category: 'education',
          priority: 'medium',
          status: 'open',
          location: {
            address: '654 Learning Avenue, Education District',
            city: 'Sample City',
            state: 'Sample State',
            pincode: '12345',
            coordinates: { latitude: 40.7614, longitude: -73.9776 }
          },
          estimatedDuration: { hours: 4, unit: 'hours' },
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          startDate: new Date(),
          maxVolunteers: 3,
          currentVolunteers: 1,
          requiredSkills: ['education', 'technology', 'patience'],
          requiredExperience: 'intermediate',
          createdBy: { name: 'Education Coordinator', email: 'education@community.com' },
          isHardcoded: true,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          _id: 'hardcoded_6',
          title: 'Beach Cleanup Drive',
          description: 'Join the monthly beach cleanup to help keep our coastline clean and protect marine life.',
          category: 'environment',
          priority: 'medium',
          status: 'open',
          location: {
            address: '987 Ocean View Road, Coastal District',
            city: 'Sample City',
            state: 'Sample State',
            pincode: '12345',
            coordinates: { latitude: 40.6892, longitude: -74.0445 }
          },
          estimatedDuration: { hours: 3, unit: 'hours' },
          deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
          startDate: new Date(),
          maxVolunteers: 15,
          currentVolunteers: 8,
          requiredSkills: ['environment', 'physical_fitness'],
          requiredExperience: 'beginner',
          createdBy: { name: 'Environmental Group Leader', email: 'leader@environmental.org' },
          isHardcoded: true,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          _id: 'hardcoded_7',
          title: 'Emergency Shelter Support',
          description: 'Provide support and assistance at the emergency shelter for homeless families.',
          category: 'social_work',
          priority: 'urgent',
          status: 'open',
          location: {
            address: '147 Shelter Street, Support District',
            city: 'Sample City',
            state: 'Sample State',
            pincode: '12345',
            coordinates: { latitude: 40.7505, longitude: -73.9934 }
          },
          estimatedDuration: { hours: 6, unit: 'hours' },
          deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          startDate: new Date(),
          maxVolunteers: 8,
          currentVolunteers: 4,
          requiredSkills: ['social_work', 'empathy', 'crisis_management'],
          requiredExperience: 'advanced',
          createdBy: { name: 'Shelter Director', email: 'director@shelter.org' },
          isHardcoded: true,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
        },
        {
          _id: 'hardcoded_8',
          title: 'Youth Mentorship Program',
          description: 'Mentor young people in your community by sharing your skills and experiences. Help guide the next generation.',
          category: 'education',
          priority: 'medium',
          status: 'open',
          location: {
            address: '555 Youth Center, Mentorship District',
            city: 'Sample City',
            state: 'Sample State',
            pincode: '12345',
            coordinates: { latitude: 40.7282, longitude: -73.7949 }
          },
          estimatedDuration: { hours: 2, unit: 'hours' },
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          startDate: new Date(),
          maxVolunteers: 6,
          currentVolunteers: 2,
          requiredSkills: ['education', 'mentoring', 'communication'],
          requiredExperience: 'intermediate',
          createdBy: { name: 'Youth Program Coordinator', email: 'youth@community.com' },
          isHardcoded: true,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
          _id: 'hardcoded_9',
          title: 'Disaster Relief Preparation',
          description: 'Help prepare emergency supplies and organize disaster relief resources for the community.',
          category: 'disaster_relief',
          priority: 'high',
          status: 'open',
          location: {
            address: '888 Emergency Center, Relief District',
            city: 'Sample City',
            state: 'Sample State',
            pincode: '12345',
            coordinates: { latitude: 40.6892, longitude: -74.0445 }
          },
          estimatedDuration: { hours: 8, unit: 'hours' },
          deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          startDate: new Date(),
          maxVolunteers: 12,
          currentVolunteers: 7,
          requiredSkills: ['disaster_relief', 'organization', 'crisis_management'],
          requiredExperience: 'intermediate',
          createdBy: { name: 'Emergency Coordinator', email: 'emergency@relief.org' },
          isHardcoded: true,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          _id: 'hardcoded_10',
          title: 'Animal Shelter Support',
          description: 'Help care for animals at the local animal shelter. Tasks include feeding, cleaning, and socializing with the animals.',
          category: 'healthcare',
          priority: 'medium',
          status: 'open',
          location: {
            address: '999 Animal Care Street, Pet District',
            city: 'Sample City',
            state: 'Sample State',
            pincode: '12345',
            coordinates: { latitude: 40.7505, longitude: -73.9934 }
          },
          estimatedDuration: { hours: 4, unit: 'hours' },
          deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
          startDate: new Date(),
          maxVolunteers: 6,
          currentVolunteers: 3,
          requiredSkills: ['healthcare', 'animal_care', 'empathy'],
          requiredExperience: 'beginner',
          createdBy: { name: 'Animal Shelter Manager', email: 'animals@shelter.org' },
          isHardcoded: true,
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
        }
      ];

      const finalTasks = [...allTasks, ...hardcodedTasks];

      console.log(`Returning ${finalTasks.length} tasks: ${volunteerTasks.length} volunteer tasks, ${complaintTasks.length} complaint tasks, ${hardcodedTasks.length} hardcoded tasks`);
      
      res.json({ 
        tasks: finalTasks,
        summary: {
          volunteerTasks: volunteerTasks.length,
          complaintTasks: complaintTasks.length,
          hardcodedTasks: hardcodedTasks.length,
          total: finalTasks.length
        }
      });
    } else {
      // Fallback: return only hardcoded tasks if database is not available
      const hardcodedTasks = [
        {
          _id: 'fallback_1',
          title: 'Community Garden Cleanup',
          description: 'Help clean and maintain the community garden. Tasks include weeding, planting, and general maintenance.',
          category: 'community_service',
          priority: 'medium',
          status: 'open',
          location: {
            address: '123 Community Street, Garden District',
            city: 'Sample City',
            state: 'Sample State',
            pincode: '12345',
            coordinates: { latitude: 40.7128, longitude: -74.0060 }
          },
          estimatedDuration: { hours: 4, unit: 'hours' },
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          startDate: new Date(),
          maxVolunteers: 5,
          currentVolunteers: 2,
          requiredSkills: ['gardening', 'community_service'],
          requiredExperience: 'beginner',
          createdBy: { name: 'Community Manager', email: 'manager@community.com' },
          isHardcoded: true,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          _id: 'fallback_2',
          title: 'Senior Center Meal Service',
          description: 'Help serve meals and interact with senior citizens at the local senior center.',
          category: 'healthcare',
          priority: 'high',
          status: 'open',
          location: {
            address: '456 Elder Care Avenue, Senior District',
            city: 'Sample City',
            state: 'Sample State',
            pincode: '12345',
            coordinates: { latitude: 40.7589, longitude: -73.9851 }
          },
          estimatedDuration: { hours: 3, unit: 'hours' },
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          startDate: new Date(),
          maxVolunteers: 4,
          currentVolunteers: 1,
          requiredSkills: ['healthcare', 'communication'],
          requiredExperience: 'intermediate',
          createdBy: { name: 'Senior Center Director', email: 'director@seniorcenter.com' },
          isHardcoded: true,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          _id: 'fallback_3',
          title: 'Environmental Cleanup Drive',
          description: 'Join the monthly environmental cleanup to help keep our city clean and protect marine life.',
          category: 'environment',
          priority: 'medium',
          status: 'open',
          location: {
            address: '789 Green Street, Eco District',
            city: 'Sample City',
            state: 'Sample State',
            pincode: '12345',
            coordinates: { latitude: 40.7505, longitude: -73.9934 }
          },
          estimatedDuration: { hours: 3, unit: 'hours' },
          deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
          startDate: new Date(),
          maxVolunteers: 15,
          currentVolunteers: 8,
          requiredSkills: ['environment', 'physical_fitness'],
          requiredExperience: 'beginner',
          createdBy: { name: 'Environmental Group Leader', email: 'leader@environmental.org' },
          isHardcoded: true,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ];
      
      res.json({ 
        tasks: hardcodedTasks,
        summary: {
          volunteerTasks: 0,
          complaintTasks: 0,
          hardcodedTasks: hardcodedTasks.length,
          total: hardcodedTasks.length
        }
      });
    }
  } catch (error) {
    console.error('❌ Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/volunteers/tasks/:taskId/apply
// @desc    Apply for a volunteer task
// @access  Private
router.post('/tasks/:taskId/apply', auth, async (req, res) => {
  try {
    if (req.userType !== 'volunteer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (VolunteerTask && Volunteer) {
      const { taskId } = req.params;
      const volunteer = await Volunteer.findById(req.userId);
      if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });

      const task = await VolunteerTask.findById(taskId);
      if (!task) return res.status(404).json({ message: 'Task not found' });

      if (task.isFull()) {
        return res.status(400).json({ message: 'Task is already full' });
      }

      await task.addVolunteer(req.userId);
      
      // Update volunteer's assigned tasks
      volunteer.assignedTasks.push({
        taskId: task._id,
        assignedDate: new Date(),
        status: 'assigned'
      });
      await volunteer.save();

      res.json({ message: 'Successfully applied for the task' });
    } else {
      res.status(500).json({ message: 'Task application not available' });
    }
  } catch (error) {
    console.error('Apply for task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/volunteers/my-tasks
// @desc    Get volunteer's assigned tasks
// @access  Private
router.get('/my-tasks', auth, async (req, res) => {
  try {
    console.log('🔍 My tasks route called');
    console.log('User type:', req.userType);
    console.log('User ID:', req.userId);
    
    if (req.userType !== 'volunteer') {
      console.log('❌ Access denied - not a volunteer');
      return res.status(403).json({ message: 'Access denied' });
    }

    if (VolunteerTask && Volunteer) {
      const volunteer = await Volunteer.findById(req.userId);
      if (!volunteer) {
        console.log('❌ Volunteer not found');
        return res.status(404).json({ message: 'Volunteer not found' });
      }

      console.log('✅ Volunteer found:', volunteer.name);
      const taskIds = volunteer.assignedTasks.map(task => task.taskId);
      console.log('🔍 Task IDs:', taskIds);
      
      const tasks = await VolunteerTask.find({ _id: { $in: taskIds } })
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

      console.log(`✅ Found ${tasks.length} assigned tasks`);
      res.json({ tasks });
    } else {
      console.log('❌ Models not available');
      res.status(500).json({ message: 'Tasks not available' });
    }
  } catch (error) {
    console.error('❌ Get my tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/volunteers/tasks/:taskId/status
// @desc    Update task status (in_progress, completed)
// @access  Private
router.put('/tasks/:taskId/status', auth, [
  body('status').isIn(['in_progress', 'completed']).withMessage('Invalid status'),
  body('feedback').optional().isString(),
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('hoursWorked').optional().isNumeric()
], async (req, res) => {
  try {
    if (req.userType !== 'volunteer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { taskId } = req.params;
    const { status, feedback, rating, hoursWorked } = req.body;

    if (VolunteerTask && Volunteer) {
      const volunteer = await Volunteer.findById(req.userId);
      if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });

      const task = await VolunteerTask.findById(taskId);
      if (!task) return res.status(404).json({ message: 'Task not found' });

      // Find the volunteer's assignment
      const assignment = task.assignedVolunteers.find(
        assignment => assignment.volunteerId.toString() === req.userId.toString()
      );

      if (!assignment) {
        return res.status(404).json({ message: 'You are not assigned to this task' });
      }

      assignment.status = status;
      if (feedback) assignment.feedback = feedback;
      if (rating) assignment.rating = rating;
      if (hoursWorked) assignment.hoursWorked = hoursWorked;

      if (status === 'completed') {
        assignment.completedDate = new Date();
        // Update volunteer performance
        if (rating) {
          await volunteer.updatePerformance(rating);
        }
        
        // Award points based on task completion
        let pointsEarned = 10; // Base points for completing a task
        
        // Bonus points based on rating
        if (rating) {
          pointsEarned += rating * 2; // 2-10 bonus points based on rating
        }
        
        // Bonus points based on task priority
        if (task.priority === 'urgent') {
          pointsEarned += 15;
        } else if (task.priority === 'high') {
          pointsEarned += 10;
        } else if (task.priority === 'medium') {
          pointsEarned += 5;
        }
        
        // Bonus points for hours worked
        if (hoursWorked) {
          pointsEarned += Math.floor(hoursWorked * 2); // 2 points per hour
        }
        
        await volunteer.addPoints(pointsEarned);
        
        // Update user's volunteer info if they are a citizen volunteer
        if (volunteer.userId) {
          const User = require('../models/User');
          const user = await User.findById(volunteer.userId);
          if (user && user.volunteerInfo) {
            user.volunteerInfo.points = volunteer.points;
            user.volunteerInfo.badge = volunteer.badge;
            user.volunteerInfo.totalTasksCompleted = volunteer.totalTasksCompleted;
            user.volunteerInfo.averageRating = volunteer.averageRating;
            await user.save();
          }
        }
      }

      await task.save();

      // Update volunteer's assigned tasks
      const volunteerTask = volunteer.assignedTasks.find(
        task => task.taskId.toString() === taskId
      );
      if (volunteerTask) {
        volunteerTask.status = status;
        if (status === 'completed') {
          volunteerTask.completedDate = new Date();
        }
        await volunteer.save();
      }

      res.json({ message: 'Task status updated successfully' });
    } else {
      res.status(500).json({ message: 'Task update not available' });
    }
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/volunteers/leaderboard
// @desc    Get volunteer leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    if (Volunteer) {
      const { limit = 10 } = req.query;
      
      const volunteers = await Volunteer.find({ 
        isActive: true, 
        verificationStatus: 'approved' 
      })
      .select('name points badge totalTasksCompleted averageRating')
      .sort({ points: -1, averageRating: -1 })
      .limit(parseInt(limit));

      res.json({ 
        leaderboard: volunteers.map((volunteer, index) => ({
          rank: index + 1,
          name: volunteer.name,
          points: volunteer.points,
          badge: volunteer.badge,
          totalTasksCompleted: volunteer.totalTasksCompleted,
          averageRating: volunteer.averageRating
        }))
      });
    } else {
      res.status(500).json({ message: 'Leaderboard not available' });
    }
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/volunteers/test-tasks
// @desc    Test endpoint to get hardcoded tasks
// @access  Public
router.get('/test-tasks', async (req, res) => {
  try {
    const hardcodedTasks = [
      {
        _id: 'test_1',
        title: 'Test Community Garden Cleanup',
        description: 'This is a test task to verify hardcoded tasks are working.',
        category: 'community_service',
        priority: 'medium',
        status: 'open',
        location: {
          address: '123 Test Street, Test District',
          city: 'Test City',
          state: 'Test State',
          pincode: '12345',
          coordinates: { latitude: 40.7128, longitude: -74.0060 }
        },
        estimatedDuration: { hours: 4, unit: 'hours' },
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        startDate: new Date(),
        maxVolunteers: 5,
        currentVolunteers: 2,
        requiredSkills: ['gardening', 'community_service'],
        requiredExperience: 'beginner',
        createdBy: { name: 'Test Manager', email: 'test@community.com' },
        isHardcoded: true,
        createdAt: new Date()
      }
    ];
    
    res.json({ 
      message: 'Test tasks endpoint working',
      tasks: hardcodedTasks,
      count: hardcodedTasks.length
    });
  } catch (error) {
    console.error('Test tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/volunteers/stats
// @desc    Get volunteer statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    if (Volunteer) {
      const totalVolunteers = await Volunteer.countDocuments({ isActive: true });
      const activeVolunteers = await Volunteer.countDocuments({ 
        isActive: true, 
        verificationStatus: 'approved' 
      });
      const totalPoints = await Volunteer.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: '$points' } } }
      ]);
      const avgRating = await Volunteer.aggregate([
        { $match: { isActive: true, averageRating: { $gt: 0 } } },
        { $group: { _id: null, average: { $avg: '$averageRating' } } }
      ]);

      res.json({
        totalVolunteers,
        activeVolunteers,
        totalPoints: totalPoints[0]?.total || 0,
        averageRating: avgRating[0]?.average || 0
      });
    } else {
      res.status(500).json({ message: 'Stats not available' });
    }
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
