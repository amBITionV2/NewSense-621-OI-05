const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Complaint = require('../models/Complaint');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (Admin only)
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // Get complaint statistics
    const totalComplaints = await Complaint.countDocuments();
    const openComplaints = await Complaint.countDocuments({ status: 'open' });
    const inProgressComplaints = await Complaint.countDocuments({ status: 'in-progress' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
    const closedComplaints = await Complaint.countDocuments({ status: 'closed' });
    
    const resolutionRate = totalComplaints > 0 ? 
      Math.round(((resolvedComplaints + closedComplaints) / totalComplaints) * 100) : 0;

    // Get user statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await Admin.countDocuments();
    const citizenUsers = await User.countDocuments({ role: 'citizen' });

    // Get recent complaints
    const recentComplaints = await Complaint.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Get category statistics
    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get complaints by status
    const statusStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get monthly complaint trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyTrends = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      stats: {
        complaints: {
          total: totalComplaints,
          open: openComplaints,
          inProgress: inProgressComplaints,
          resolved: resolvedComplaints,
          closed: closedComplaints,
          resolutionRate
        },
        users: {
          total: totalUsers,
          active: activeUsers,
          admins: adminUsers,
          citizens: citizenUsers
        }
      },
      recentComplaints,
      categoryStats,
      statusStats,
      monthlyTrends
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/complaints
// @desc    Get all complaints with filtering and pagination
// @access  Private (Admin only)
router.get('/complaints', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { status, category, priority, search } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const complaints = await Complaint.find(filter)
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Complaint.countDocuments(filter);

    res.json({
      complaints,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/complaints/:id
// @desc    Get specific complaint details
// @access  Private (Admin only)
router.get('/complaints/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email phone location')
      .populate('assignedTo', 'name email')
      .populate('updates.updatedBy', 'name email')
      .lean();

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/complaints/:id/status
// @desc    Update complaint status
// @access  Private (Admin only)
router.put('/complaints/:id/status', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const { status, message } = req.body;
    
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Add update to complaint
    complaint.updates.push({
      message: message || `Status changed to ${status}`,
      status,
      updatedBy: req.userId
    });

    complaint.status = status;
    
    if (status === 'resolved' || status === 'closed') {
      complaint.actualResolution = new Date();
    }

    await complaint.save();

    res.json({ message: 'Complaint status updated successfully', complaint });
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with filtering and pagination
// @access  Private (Admin only)
router.get('/users', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { role, status, search } = req.query;
    
    // Build filter object
    const filter = {};
    if (role) filter.role = role;
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Get users with filters (both regular users and admins)
    const [users, admins] = await Promise.all([
      User.find(filter).select('-password').sort({ createdAt: -1 }).lean(),
      Admin.find().select('-password').sort({ createdAt: -1 }).lean()
    ]);

    // Combine users and admins
    const allUsers = [...users, ...admins].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const paginatedUsers = allUsers.slice(skip, skip + limit);

    const totalUsers = await User.countDocuments(filter);
    const totalAdmins = await Admin.countDocuments();
    const total = totalUsers + totalAdmins;

    res.json({
      users: paginatedUsers,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users/:id
// @desc    Get specific user details
// @access  Private (Admin only)
router.get('/users/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const targetUser = await User.findById(req.params.id)
      .select('-password')
      .lean();

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's complaints
    const userComplaints = await Complaint.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({
      user: targetUser,
      complaints: userComplaints
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status (activate/deactivate)
// @access  Private (Admin only)
router.put('/users/:id/status', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const { isActive } = req.body;
    
    // Check both User and Admin collections
    let targetUser = await User.findById(req.params.id);
    let isAdmin = false;
    
    if (!targetUser) {
      targetUser = await Admin.findById(req.params.id);
      isAdmin = true;
    }
    
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    targetUser.isActive = isActive;
    await targetUser.save();

    res.json({ message: 'User status updated successfully', user: targetUser });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;