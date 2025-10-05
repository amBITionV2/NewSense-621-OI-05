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

    // Get priority statistics
    const priorityStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get urgent complaints count
    const urgentComplaints = await Complaint.countDocuments({ priority: 'urgent' });

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
          urgent: urgentComplaints,
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
      priorityStats,
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

// Get all citizens with filters, sorting, and pagination
router.get('/citizens', auth, async (req, res) => {
  try {
    if (req.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const { 
      gender, 
      caste, 
      religion, 
      occupation, 
      verificationStatus, 
      isActive, 
      search, 
      ageMin,
      ageMax,
      incomeMin,
      incomeMax,
      residenceType,
      language,
      hasIncome,
      registrationDateFrom,
      registrationDateTo,
      location,
      sortBy = 'createdAt', 
      sortOrder = 'desc', 
      page = 1, 
      limit = 10 
    } = req.query;
    
    const query = {}; // Fetch all users from users collection

    // Apply filters
    if (gender) query.gender = gender;
    if (caste) query.caste = caste;
    if (religion) query.religion = religion;
    if (occupation) query.occupation = { $regex: occupation, $options: 'i' };
    if (verificationStatus) query.verificationStatus = verificationStatus;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (residenceType) query.residenceType = residenceType;
    if (hasIncome) query.hasIncome = hasIncome;
    
    // Age range filter
    if (ageMin || ageMax) {
      const currentDate = new Date();
      query.dateOfBirth = {};
      if (ageMin) {
        const maxBirthDate = new Date(currentDate.getFullYear() - parseInt(ageMin), currentDate.getMonth(), currentDate.getDate());
        query.dateOfBirth.$lte = maxBirthDate;
      }
      if (ageMax) {
        const minBirthDate = new Date(currentDate.getFullYear() - parseInt(ageMax) - 1, currentDate.getMonth(), currentDate.getDate());
        query.dateOfBirth.$gte = minBirthDate;
      }
    }
    
    // Income range filter
    if (incomeMin || incomeMax) {
      query.salary = {};
      if (incomeMin) {
        query.salary.$gte = parseInt(incomeMin);
      }
      if (incomeMax) {
        query.salary.$lte = parseInt(incomeMax);
      }
    }
    
    // Language filter
    if (language) {
      query.languagesSpoken = { $regex: language, $options: 'i' };
    }
    
    // Registration date range filter
    if (registrationDateFrom || registrationDateTo) {
      query.createdAt = {};
      if (registrationDateFrom) {
        query.createdAt.$gte = new Date(registrationDateFrom);
      }
      if (registrationDateTo) {
        const endDate = new Date(registrationDateTo);
        endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }
    
    // Location filter
    if (location) {
      query.$or = [
        { 'location.address': { $regex: location, $options: 'i' } },
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } }
      ];
    }

    // Search functionality
    if (search) {
      const searchConditions = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { aadhaarNumber: { $regex: search, $options: 'i' } }
      ];
      
      // If location filter is also applied, combine them with $and
      if (query.$or && query.$or.some(condition => condition['location.address'])) {
        query.$and = [
          { $or: query.$or },
          { $or: searchConditions }
        ];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const citizens = await User.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-password -__v'); // Exclude sensitive fields

    const totalCitizens = await User.countDocuments(query);

    res.json({
      citizens,
      totalCitizens,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCitizens / limit)
    });
  } catch (error) {
    console.error('Error fetching citizens:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get citizen statistics
router.get('/citizen-stats', auth, async (req, res) => {
  try {
    if (req.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const total = await User.countDocuments({});
    const verified = await User.countDocuments({ verificationStatus: 'approved' });
    const pending = await User.countDocuments({ verificationStatus: 'pending' });
    const active = await User.countDocuments({ isActive: true });

    res.json({ total, verified, pending, active });
  } catch (error) {
    console.error('Error fetching citizen stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update citizen verification status
router.put('/citizens/:id/verification', auth, async (req, res) => {
  try {
    if (req.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const { id } = req.params;
    const { verificationStatus } = req.body;

    const citizen = await User.findById(id);
    if (!citizen || citizen.role !== 'citizen') {
      return res.status(404).json({ message: 'Citizen not found' });
    }

    citizen.verificationStatus = verificationStatus;
    await citizen.save();

    res.json({ message: 'Citizen verification status updated successfully', citizen });
  } catch (error) {
    console.error('Error updating citizen verification status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export citizens data to CSV
router.get('/citizens/export/csv', auth, async (req, res) => {
  try {
    if (req.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const citizens = await User.find({ role: 'citizen' }).lean();
    
    const headers = [
      '_id', 'name', 'email', 'phone', 'aadhaarNumber', 'dateOfBirth', 'gender',
      'fatherName', 'motherName', 'caste', 'religion', 'occupation', 'salary',
      'hasIncome', 'languagesSpoken', 'nativePlace', 'residenceType',
      'location.address', 'location.city', 'location.state', 'location.pincode',
      'isActive', 'isVerified', 'verificationStatus', 'createdAt'
    ];

    let csv = headers.join(',') + '\n';
    citizens.forEach(citizen => {
      const row = headers.map(header => {
        let value = citizen;
        for (const part of header.split('.')) {
          value = value ? value[part] : '';
        }
        if (Array.isArray(value)) {
          value = `"${value.join(';')}"`; // Handle arrays
        } else if (typeof value === 'string' && value.includes(',')) {
          value = `"${value}"`; // Quote strings with commas
        }
        return value;
      }).join(',');
      csv += row + '\n';
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('citizens_export.csv');
    res.send(csv);

  } catch (error) {
    console.error('Error exporting citizens data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics data for charts
router.get('/analytics', auth, async (req, res) => {
  try {
    if (req.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // Get all users for analytics
    const users = await User.find({}).select('gender religion caste occupation dateOfBirth createdAt');

    // Calculate age from date of birth
    const calculateAge = (dateOfBirth) => {
      if (!dateOfBirth) return null;
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };

    // Gender distribution
    const genderStats = users.reduce((acc, user) => {
      const gender = user.gender || 'Not specified';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    // Religion distribution
    const religionStats = users.reduce((acc, user) => {
      const religion = user.religion || 'Not specified';
      acc[religion] = (acc[religion] || 0) + 1;
      return acc;
    }, {});

    // Caste distribution
    const casteStats = users.reduce((acc, user) => {
      const caste = user.caste || 'Not specified';
      acc[caste] = (acc[caste] || 0) + 1;
      return acc;
    }, {});

    // Age distribution
    const ageStats = users.reduce((acc, user) => {
      const age = calculateAge(user.dateOfBirth);
      if (age === null) {
        acc['Not specified'] = (acc['Not specified'] || 0) + 1;
      } else if (age < 18) {
        acc['Under 18'] = (acc['Under 18'] || 0) + 1;
      } else if (age >= 18 && age < 25) {
        acc['18-24'] = (acc['18-24'] || 0) + 1;
      } else if (age >= 25 && age < 35) {
        acc['25-34'] = (acc['25-34'] || 0) + 1;
      } else if (age >= 35 && age < 45) {
        acc['35-44'] = (acc['35-44'] || 0) + 1;
      } else if (age >= 45 && age < 55) {
        acc['45-54'] = (acc['45-54'] || 0) + 1;
      } else if (age >= 55 && age < 65) {
        acc['55-64'] = (acc['55-64'] || 0) + 1;
      } else {
        acc['65+'] = (acc['65+'] || 0) + 1;
      }
      return acc;
    }, {});

    // Occupation distribution
    const occupationStats = users.reduce((acc, user) => {
      const occupation = user.occupation || 'Not specified';
      acc[occupation] = (acc[occupation] || 0) + 1;
      return acc;
    }, {});

    // Registration trends (last 12 months)
    const registrationTrends = {};
    const currentDate = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      registrationTrends[monthKey] = 0;
    }

    users.forEach(user => {
      const userDate = new Date(user.createdAt);
      const monthKey = userDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (registrationTrends.hasOwnProperty(monthKey)) {
        registrationTrends[monthKey]++;
      }
    });

    res.json({
      gender: genderStats,
      religion: religionStats,
      caste: casteStats,
      age: ageStats,
      occupation: occupationStats,
      registrationTrends: registrationTrends,
      totalUsers: users.length
    });

  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get analytics data for dashboard
// @access  Private (Admin only)
router.get('/analytics', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // Get total users
    const totalUsers = await User.countDocuments();

    // Get gender distribution
    const genderStats = await User.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const gender = {};
    genderStats.forEach(stat => {
      gender[stat._id || 'Not specified'] = stat.count;
    });

    // Get religion distribution
    const religionStats = await User.aggregate([
      { $group: { _id: '$religion', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const religion = {};
    religionStats.forEach(stat => {
      religion[stat._id || 'Not specified'] = stat.count;
    });

    // Get caste distribution
    const casteStats = await User.aggregate([
      { $group: { _id: '$caste', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const caste = {};
    casteStats.forEach(stat => {
      caste[stat._id || 'Not specified'] = stat.count;
    });

    // Get occupation distribution
    const occupationStats = await User.aggregate([
      { $group: { _id: '$occupation', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const occupation = {};
    occupationStats.forEach(stat => {
      occupation[stat._id || 'Not specified'] = stat.count;
    });

    // Get age distribution (group by age ranges)
    const ageStats = await User.aggregate([
      {
        $addFields: {
          age: {
            $divide: [
              { $subtract: [new Date(), '$dateOfBirth'] },
              365.25 * 24 * 60 * 60 * 1000
            ]
          }
        }
      },
      {
        $bucket: {
          groupBy: '$age',
          boundaries: [0, 18, 25, 35, 45, 55, 65, 100],
          default: '65+',
          output: { count: { $sum: 1 } }
        }
      }
    ]);
    const age = {};
    ageStats.forEach(stat => {
      const range = stat._id === '65+' ? '65+' : `${stat._id}-${stat._id + 10}`;
      age[range] = stat.count;
    });

    // Get registration trends (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const registrationTrends = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo }
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
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    const registrationTrendsFormatted = {};
    registrationTrends.forEach(stat => {
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const monthName = monthNames[stat._id.month - 1];
      const year = stat._id.year;
      const key = `${monthName} ${year}`;
      registrationTrendsFormatted[key] = stat.count;
    });

    res.json({
      totalUsers,
      gender,
      religion,
      caste,
      occupation,
      age,
      registrationTrends: registrationTrendsFormatted
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;