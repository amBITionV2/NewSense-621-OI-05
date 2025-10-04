const express = require('express');
const { body, validationResult } = require('express-validator');
const mockDB = require('../mockDatabase');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/complaints
// @desc    Create a new complaint
// @access  Private
router.post('/', auth, [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('category').isIn([
    'potholes', 'garbage', 'street-lighting', 'water-supply', 'sewage',
    'traffic-signals', 'road-maintenance', 'public-transport', 'parks-recreation',
    'noise-pollution', 'air-pollution', 'other'
  ]).withMessage('Invalid category'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('location.coordinates.lat').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('location.coordinates.lng').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, location, priority = 'medium' } = req.body;
    
    // Create complaint
    const complaint = mockDB.createComplaint({
      user: req.userId,
      title,
      description,
      category,
      priority,
      location: {
        address: location.address,
        coordinates: {
          lat: parseFloat(location.coordinates.lat),
          lng: parseFloat(location.coordinates.lng)
        },
        city: location.city,
        state: location.state,
        country: location.country || 'India',
        pincode: location.pincode
      },
      images: [],
      videos: [],
      socialMediaPosts: []
    });

    // Get user info for response
    const user = mockDB.findUserById(req.userId);
    const complaintWithUser = {
      ...complaint,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    };

    res.status(201).json({
      message: 'Complaint created successfully',
      complaint: complaintWithUser
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ message: 'Server error creating complaint' });
  }
});

// @route   GET /api/complaints
// @desc    Get complaints with filters
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status,
      priority
    } = req.query;

    const query = {};

    // Filter by user's complaints or all complaints for admin
    const user = mockDB.findUserById(req.userId);
    if (user.role === 'citizen') {
      query.user = req.userId;
    }

    // Apply filters
    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const allComplaints = mockDB.findComplaints(query);
    const total = allComplaints.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const complaints = allComplaints.slice(startIndex, endIndex);

    // Add user info to complaints
    const complaintsWithUsers = complaints.map(complaint => {
      const complaintUser = mockDB.findUserById(complaint.user);
      return {
        ...complaint,
        user: {
          _id: complaintUser._id,
          name: complaintUser.name,
          email: complaintUser.email
        }
      };
    });

    res.json({
      complaints: complaintsWithUsers,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ message: 'Server error fetching complaints' });
  }
});

// @route   GET /api/complaints/:id
// @desc    Get single complaint
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const complaint = mockDB.findComplaintById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check if user can view this complaint
    const user = mockDB.findUserById(req.userId);
    if (user.role === 'citizen' && complaint.user !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Add user info
    const complaintUser = mockDB.findUserById(complaint.user);
    const complaintWithUser = {
      ...complaint,
      user: {
        _id: complaintUser._id,
        name: complaintUser.name,
        email: complaintUser.email
      }
    };

    res.json({ complaint: complaintWithUser });
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({ message: 'Server error fetching complaint' });
  }
});

module.exports = router;
