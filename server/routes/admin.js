const express = require('express');
const { body, validationResult } = require('express-validator');
const { adminAuth } = require('../middleware/auth');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const EducationalVideo = require('../models/EducationalVideo');
const { getVideoAnalytics } = require('../services/educationalVideoService');
const { getTranslationStats } = require('../services/translationService');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const [
      totalComplaints,
      openComplaints,
      resolvedComplaints,
      totalUsers,
      activeUsers,
      totalVideos,
      videoViews
    ] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: { $in: ['open', 'in-progress'] } }),
      Complaint.countDocuments({ status: { $in: ['resolved', 'closed'] } }),
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      EducationalVideo.countDocuments({ isPublished: true }),
      EducationalVideo.aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ])
    ]);

    // Recent complaints
    const recentComplaints = await Complaint.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Category-wise complaint distribution
    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $in: ['$status', ['resolved', 'closed']] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Monthly complaint trends
    const monthlyTrends = await Complaint.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      stats: {
        complaints: {
          total: totalComplaints,
          open: openComplaints,
          resolved: resolvedComplaints,
          resolutionRate: totalComplaints > 0 ? (resolvedComplaints / totalComplaints * 100).toFixed(1) : 0
        },
        users: {
          total: totalUsers,
          active: activeUsers
        },
        videos: {
          total: totalVideos,
          totalViews: videoViews[0]?.totalViews || 0
        }
      },
      recentComplaints,
      categoryStats,
      monthlyTrends
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

// @route   GET /api/admin/complaints
// @desc    Get all complaints for admin
// @access  Private (Admin)
router.get('/complaints', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      category,
      priority,
      assignedTo,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const complaints = await Complaint.find(query)
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Complaint.countDocuments(query);

    res.json({
      complaints,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Admin complaints error:', error);
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
});

// @route   PUT /api/admin/complaints/:id/assign
// @desc    Assign complaint to staff member
// @access  Private (Admin)
router.put('/complaints/:id/assign', adminAuth, [
  body('assignedTo').isMongoId().withMessage('Valid user ID is required'),
  body('department').optional().isIn([
    'public-works', 'sanitation', 'transport', 'environment',
    'health', 'education', 'other'
  ])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { assignedTo, department } = req.body;

    // Verify assigned user exists and has appropriate role
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser || !['admin', 'moderator'].includes(assignedUser.role)) {
      return res.status(400).json({ message: 'Invalid user for assignment' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.assignedTo = assignedTo;
    if (department) complaint.department = department;

    // Add update to history
    complaint.updates.push({
      message: `Complaint assigned to ${assignedUser.name}`,
      status: 'in-progress',
      updatedBy: req.userId
    });

    complaint.status = 'in-progress';
    await complaint.save();

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`complaint-${complaint._id}`).emit('assignment-update', {
      complaint: await Complaint.findById(complaint._id).populate('user', 'name email').populate('assignedTo', 'name email')
    });

    res.json({
      message: 'Complaint assigned successfully',
      complaint: await Complaint.findById(complaint._id).populate('user', 'name email').populate('assignedTo', 'name email')
    });
  } catch (error) {
    console.error('Assignment error:', error);
    res.status(500).json({ message: 'Failed to assign complaint' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users for admin
// @access  Private (Admin)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      isActive,
      search
    } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status
// @access  Private (Admin)
router.put('/users/:id/status', adminAuth, [
  body('isActive').isBoolean().withMessage('isActive must be a boolean'),
  body('role').optional().isIn(['citizen', 'moderator', 'admin'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { isActive, role } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.userId.toString() && isActive === false) {
      return res.status(400).json({ message: 'Cannot deactivate your own account' });
    }

    const updates = { isActive };
    if (role) updates.role = role;

    await User.findByIdAndUpdate(req.params.id, updates);

    res.json({
      message: 'User status updated successfully',
      user: await User.findById(req.params.id).select('-password')
    });
  } catch (error) {
    console.error('User status update error:', error);
    res.status(500).json({ message: 'Failed to update user status' });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get comprehensive analytics
// @access  Private (Admin)
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const [videoAnalytics, translationStats] = await Promise.all([
      getVideoAnalytics(),
      getTranslationStats()
    ]);

    // Complaint resolution time analytics
    const resolutionTimeStats = await Complaint.aggregate([
      {
        $match: {
          status: { $in: ['resolved', 'closed'] },
          actualResolution: { $exists: true }
        }
      },
      {
        $project: {
          resolutionTime: {
            $divide: [
              { $subtract: ['$actualResolution', '$createdAt'] },
              1000 * 60 * 60 * 24 // Convert to days
            ]
          },
          category: 1
        }
      },
      {
        $group: {
          _id: '$category',
          averageResolutionTime: { $avg: '$resolutionTime' },
          count: { $sum: 1 }
        }
      },
      { $sort: { averageResolutionTime: 1 } }
    ]);

    // User engagement analytics
    const userEngagement = await Complaint.aggregate([
      {
        $group: {
          _id: '$user',
          complaintCount: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $group: {
          _id: null,
          totalActiveUsers: { $sum: 1 },
          avgComplaintsPerUser: { $avg: '$complaintCount' },
          avgUserRating: { $avg: '$avgRating' }
        }
      }
    ]);

    res.json({
      videoAnalytics,
      translationStats,
      resolutionTimeStats,
      userEngagement: userEngagement[0] || {
        totalActiveUsers: 0,
        avgComplaintsPerUser: 0,
        avgUserRating: 0
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

module.exports = router;
