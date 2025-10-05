const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');

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

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.userType !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

// @route   GET /api/admin/volunteers
// @desc    Get all volunteers (admin only)
// @access  Private
router.get('/', auth, requireAdmin, async (req, res) => {
  try {
    console.log('🔍 Admin volunteers route called');
    console.log('User type:', req.userType);
    console.log('User ID:', req.userId);
    
    if (!Volunteer) {
      console.log('❌ Volunteer model not available');
      return res.status(500).json({ message: 'Volunteer management not available' });
    }

    const { status, page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }

    console.log('🔍 Query:', query);
    const volunteers = await Volunteer.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Volunteer.countDocuments(query);
    
    console.log(`✅ Found ${volunteers.length} volunteers out of ${total} total`);

    res.json({
      volunteers,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('❌ Get volunteers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/volunteers/:id
// @desc    Get volunteer details (admin only)
// @access  Private
router.get('/:id', auth, requireAdmin, async (req, res) => {
  try {
    if (!Volunteer) {
      return res.status(500).json({ message: 'Volunteer management not available' });
    }

    const volunteer = await Volunteer.findById(req.params.id).select('-password');
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.json({ volunteer });
  } catch (error) {
    console.error('Get volunteer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/volunteers/:id/status
// @desc    Update volunteer status (admin only)
// @access  Private
router.put('/:id/status', auth, requireAdmin, [
  body('status').isIn(['active', 'inactive', 'suspended', 'pending_approval']).withMessage('Invalid status'),
  body('reason').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!Volunteer) {
      return res.status(500).json({ message: 'Volunteer management not available' });
    }

    const { status, reason } = req.body;
    const volunteer = await Volunteer.findById(req.params.id);
    
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    volunteer.status = status;
    if (reason) {
      volunteer.statusChangeReason = reason;
    }
    
    await volunteer.save();

    res.json({ message: 'Volunteer status updated successfully' });
  } catch (error) {
    console.error('Update volunteer status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/volunteers/:id/verification
// @desc    Update volunteer verification status (admin only)
// @access  Private
router.put('/:id/verification', auth, requireAdmin, [
  body('verificationStatus').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid verification status'),
  body('notes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!Volunteer) {
      return res.status(500).json({ message: 'Volunteer management not available' });
    }

    const { verificationStatus, notes } = req.body;
    const volunteer = await Volunteer.findById(req.params.id);
    
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    volunteer.verificationStatus = verificationStatus;
    volunteer.isVerified = verificationStatus === 'approved';
    
    if (notes) {
      volunteer.verificationNotes = notes;
    }
    
    await volunteer.save();

    res.json({ message: 'Volunteer verification status updated successfully' });
  } catch (error) {
    console.error('Update volunteer verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/volunteer-tasks
// @desc    Create a new volunteer task (admin only)
// @access  Private
router.post('/volunteer-tasks', auth, requireAdmin, [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').isIn(['community_service', 'education', 'healthcare', 'environment', 'disaster_relief', 'social_work', 'other']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('location.address').isString().withMessage('Address is required'),
  body('requiredSkills').optional().isArray(),
  body('maxVolunteers').optional().isInt({ min: 1 }),
  body('estimatedDuration.hours').isInt({ min: 1 }).withMessage('Estimated duration is required'),
  body('deadline').isISO8601().withMessage('Valid deadline is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!VolunteerTask) {
      return res.status(500).json({ message: 'Task management not available' });
    }

    const {
      title, description, category, priority, location, requiredSkills,
      maxVolunteers, estimatedDuration, deadline, startDate, instructions,
      resources, tags
    } = req.body;

    const task = await VolunteerTask.create({
      title,
      description,
      category,
      priority: priority || 'medium',
      location,
      requiredSkills: requiredSkills || [],
      maxVolunteers: maxVolunteers || 1,
      estimatedDuration,
      deadline: new Date(deadline),
      startDate: new Date(startDate),
      instructions,
      resources: resources || [],
      tags: tags || [],
      createdBy: req.userId,
      isActive: true
    });

    res.status(201).json({
      message: 'Volunteer task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/volunteer-tasks
// @desc    Get all volunteer tasks (admin only)
// @access  Private
router.get('/volunteer-tasks', auth, requireAdmin, async (req, res) => {
  try {
    console.log('🔍 Admin volunteer tasks route called');
    console.log('User type:', req.userType);
    console.log('User ID:', req.userId);
    
    if (!VolunteerTask) {
      console.log('❌ VolunteerTask model not available');
      return res.status(500).json({ message: 'Task management not available' });
    }

    const { status, category, priority, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    console.log('🔍 Task query:', query);
    const tasks = await VolunteerTask.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedVolunteers.volunteerId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await VolunteerTask.countDocuments(query);
    
    console.log(`✅ Found ${tasks.length} tasks out of ${total} total`);

    // Add hardcoded tasks for demonstration
    const hardcodedTasks = [
      {
        _id: 'admin_hardcoded_1',
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
        isActive: true,
        createdBy: { name: 'Community Manager', email: 'manager@community.com' },
        isHardcoded: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        _id: 'admin_hardcoded_2',
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
        isActive: true,
        createdBy: { name: 'Senior Center Director', email: 'director@seniorcenter.com' },
        isHardcoded: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        _id: 'admin_hardcoded_3',
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
        isActive: true,
        createdBy: { name: 'Environmental Coordinator', email: 'eco@environment.com' },
        isHardcoded: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        _id: 'admin_hardcoded_4',
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
        isActive: true,
        createdBy: { name: 'Education Coordinator', email: 'education@community.com' },
        isHardcoded: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        _id: 'admin_hardcoded_5',
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
        isActive: true,
        createdBy: { name: 'Food Bank Manager', email: 'manager@foodbank.com' },
        isHardcoded: true,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        _id: 'admin_hardcoded_6',
        title: 'Emergency Shelter Support',
        description: 'Provide support and assistance at the emergency shelter for homeless families. Help with meal preparation, cleaning, and providing emotional support.',
        category: 'social_work',
        priority: 'urgent',
        status: 'open',
        location: {
          address: '147 Shelter Street, Support District',
          city: 'New York',
          state: 'NY',
          pincode: '10006',
          coordinates: {
            latitude: 40.7505,
            longitude: -73.9934
          }
        },
        requiredSkills: ['social_work', 'empathy', 'crisis_management'],
        requiredExperience: 'advanced',
        maxVolunteers: 8,
        currentVolunteers: 4,
        estimatedDuration: {
          hours: 6,
          unit: 'hours'
        },
        deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        startDate: new Date(),
        instructions: 'Background check required. Training will be provided on-site.',
        tags: ['social_work', 'emergency', 'crisis'],
        isActive: true,
        createdBy: { name: 'Shelter Director', email: 'director@shelter.org' },
        isHardcoded: true,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      },
      {
        _id: 'admin_hardcoded_7',
        title: 'Youth Mentorship Program',
        description: 'Mentor young people in your community by sharing your skills and experiences. Help guide the next generation towards success.',
        category: 'education',
        priority: 'medium',
        status: 'open',
        location: {
          address: '555 Youth Center, Mentorship District',
          city: 'New York',
          state: 'NY',
          pincode: '10007',
          coordinates: {
            latitude: 40.7282,
            longitude: -73.7949
          }
        },
        requiredSkills: ['education', 'mentoring', 'communication'],
        requiredExperience: 'intermediate',
        maxVolunteers: 6,
        currentVolunteers: 2,
        estimatedDuration: {
          hours: 2,
          unit: 'hours'
        },
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        startDate: new Date(),
        instructions: 'Commitment to at least 3 months required. Training provided.',
        tags: ['education', 'mentoring', 'youth'],
        isActive: true,
        createdBy: { name: 'Youth Program Coordinator', email: 'youth@community.com' },
        isHardcoded: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        _id: 'admin_hardcoded_8',
        title: 'Disaster Relief Preparation',
        description: 'Help prepare emergency supplies and organize disaster relief resources for the community. This is crucial for community resilience.',
        category: 'disaster_relief',
        priority: 'high',
        status: 'open',
        location: {
          address: '888 Emergency Center, Relief District',
          city: 'New York',
          state: 'NY',
          pincode: '10008',
          coordinates: {
            latitude: 40.6892,
            longitude: -74.0445
          }
        },
        requiredSkills: ['disaster_relief', 'organization', 'crisis_management'],
        requiredExperience: 'intermediate',
        maxVolunteers: 12,
        currentVolunteers: 7,
        estimatedDuration: {
          hours: 8,
          unit: 'hours'
        },
        deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        startDate: new Date(),
        instructions: 'Physical fitness required. Safety training provided.',
        tags: ['disaster_relief', 'emergency', 'preparation'],
        isActive: true,
        createdBy: { name: 'Emergency Coordinator', email: 'emergency@relief.org' },
        isHardcoded: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    // Combine database tasks with hardcoded tasks
    const allTasks = [...tasks, ...hardcodedTasks];
    const totalWithHardcoded = total + hardcodedTasks.length;
    
    console.log(`✅ Returning ${allTasks.length} total tasks: ${tasks.length} from database + ${hardcodedTasks.length} hardcoded`);

    res.json({
      tasks: allTasks,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(totalWithHardcoded / limit),
        total: totalWithHardcoded
      }
    });
  } catch (error) {
    console.error('❌ Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/volunteer-tasks/:id
// @desc    Get volunteer task details (admin only)
// @access  Private
router.get('/volunteer-tasks/:id', auth, requireAdmin, async (req, res) => {
  try {
    if (!VolunteerTask) {
      return res.status(500).json({ message: 'Task management not available' });
    }

    const task = await VolunteerTask.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedVolunteers.volunteerId', 'name email phone status');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/volunteer-tasks/:id
// @desc    Update volunteer task (admin only)
// @access  Private
router.put('/volunteer-tasks/:id', auth, requireAdmin, [
  body('title').optional().trim().isLength({ min: 5 }),
  body('description').optional().trim().isLength({ min: 10 }),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('status').optional().isIn(['open', 'assigned', 'in_progress', 'completed', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!VolunteerTask) {
      return res.status(500).json({ message: 'Task management not available' });
    }

    const task = await VolunteerTask.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        task[key] = updates[key];
      }
    });

    await task.save();

    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/volunteer-tasks/:id/assign
// @desc    Assign volunteer to task (admin only)
// @access  Private
router.post('/volunteer-tasks/:id/assign', auth, requireAdmin, [
  body('volunteerId').isMongoId().withMessage('Valid volunteer ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!VolunteerTask || !Volunteer) {
      return res.status(500).json({ message: 'Task assignment not available' });
    }

    const { volunteerId } = req.body;
    const task = await VolunteerTask.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    if (volunteer.status !== 'active') {
      return res.status(400).json({ message: 'Volunteer is not active' });
    }

    await task.addVolunteer(volunteerId);
    
    // Update volunteer's assigned tasks
    volunteer.assignedTasks.push({
      taskId: task._id,
      assignedDate: new Date(),
      status: 'assigned'
    });
    await volunteer.save();

    res.json({ message: 'Volunteer assigned to task successfully' });
  } catch (error) {
    console.error('Assign volunteer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/volunteer-tasks/:id/volunteers/:volunteerId
// @desc    Remove volunteer from task (admin only)
// @access  Private
router.delete('/volunteer-tasks/:id/volunteers/:volunteerId', auth, requireAdmin, async (req, res) => {
  try {
    if (!VolunteerTask || !Volunteer) {
      return res.status(500).json({ message: 'Task management not available' });
    }

    const { id: taskId, volunteerId } = req.params;
    const task = await VolunteerTask.findById(taskId);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.removeVolunteer(volunteerId);
    
    // Update volunteer's assigned tasks
    const volunteer = await Volunteer.findById(volunteerId);
    if (volunteer) {
      volunteer.assignedTasks = volunteer.assignedTasks.filter(
        task => task.taskId.toString() !== taskId
      );
      await volunteer.save();
    }

    res.json({ message: 'Volunteer removed from task successfully' });
  } catch (error) {
    console.error('Remove volunteer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/volunteers/stats
// @desc    Get volunteer statistics (admin only)
// @access  Private
router.get('/stats', auth, requireAdmin, async (req, res) => {
  try {
    if (!Volunteer || !VolunteerTask) {
      return res.status(500).json({ message: 'Statistics not available' });
    }

    const totalVolunteers = await Volunteer.countDocuments();
    const activeVolunteers = await Volunteer.countDocuments({ status: 'active' });
    const pendingVolunteers = await Volunteer.countDocuments({ status: 'pending_approval' });
    const verifiedVolunteers = await Volunteer.countDocuments({ isVerified: true });

    const totalTasks = await VolunteerTask.countDocuments();
    const openTasks = await VolunteerTask.countDocuments({ status: 'open' });
    const inProgressTasks = await VolunteerTask.countDocuments({ status: 'in_progress' });
    const completedTasks = await VolunteerTask.countDocuments({ status: 'completed' });

    // Get top performing volunteers
    const topVolunteers = await Volunteer.find({ status: 'active' })
      .sort({ totalTasksCompleted: -1, averageRating: -1 })
      .limit(5)
      .select('name email totalTasksCompleted averageRating totalHoursVolunteered');

    res.json({
      volunteers: {
        total: totalVolunteers,
        active: activeVolunteers,
        pending: pendingVolunteers,
        verified: verifiedVolunteers
      },
      tasks: {
        total: totalTasks,
        open: openTasks,
        inProgress: inProgressTasks,
        completed: completedTasks
      },
      topVolunteers
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
