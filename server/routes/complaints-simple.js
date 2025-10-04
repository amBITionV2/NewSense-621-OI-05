const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const mockDB = require('../mockDatabase');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for local file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'), false);
    }
  }
});

// Middleware to parse location JSON string
const parseLocationMiddleware = (req, res, next) => {
  if (req.body.location && typeof req.body.location === 'string') {
    try {
      req.body.location = JSON.parse(req.body.location);
    } catch (parseError) {
      return res.status(400).json({ message: 'Invalid location data format' });
    }
  }
  next();
};

// @route   POST /api/complaints
// @desc    Create a new complaint
// @access  Private
router.post('/', auth, upload.array('media', 5), parseLocationMiddleware, [
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
    
    // Handle uploaded media files
    const mediaFiles = [];
    if (req.files) {
      for (const file of req.files) {
        // Create local URL for the uploaded file
        const fileUrl = `/uploads/${file.filename}`;
        mediaFiles.push({
          url: fileUrl,
          filename: file.originalname,
          localPath: file.path,
          type: file.mimetype.startsWith('image/') ? 'image' : 'video'
        });
      }
    }

    // Separate images and videos
    const images = mediaFiles.filter(f => f.type === 'image');
    const videos = mediaFiles.filter(f => f.type === 'video');
    
    let complaint;

    // Check if MongoDB is connected, otherwise use mock database
    if (mongoose.connection.readyState === 1) {
      // Use MongoDB
      complaint = new Complaint({
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
        images,
        videos,
        socialMediaPosts: []
      });

      await complaint.save();
    } else {
      // Use mock database
      complaint = mockDB.createComplaint({
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
        images,
        videos,
        socialMediaPosts: []
      });
    }

    // Get user info for response
    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(req.userId).select('name email');
    } else {
      user = mockDB.findUserById(req.userId);
    }
    
    const complaintWithUser = {
      ...complaint,
      user: user ? { 
        _id: user._id, 
        name: user.name, 
        email: user.email 
      } : { 
        _id: req.userId, 
        name: 'Anonymous', 
        email: '' 
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

    let complaints, total;

    // Check if MongoDB is connected, otherwise use mock database
    if (mongoose.connection.readyState === 1) {
      // Use MongoDB
      const user = await User.findById(req.userId).select('role');
      if (user && user.role === 'citizen') {
        query.user = req.userId;
      }

      // Apply filters
      if (category) query.category = category;
      if (status) query.status = status;
      if (priority) query.priority = priority;

      complaints = await Complaint.find(query)
        .populate('user', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      total = await Complaint.countDocuments(query);
    } else {
      // Use mock database
      const user = mockDB.findUserById(req.userId);
      if (user && user.role === 'citizen') {
        query.user = req.userId;
      }

      // Apply filters
      if (category) query.category = category;
      if (status) query.status = status;
      if (priority) query.priority = priority;

      const allComplaints = mockDB.findComplaints(query);
      total = allComplaints.length;
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      complaints = allComplaints.slice(startIndex, endIndex);
      
      // Populate user data for mock complaints
      complaints = complaints.map(complaint => {
        const user = mockDB.findUserById(complaint.user);
        return {
          ...complaint,
          user: user ? { name: user.name, email: user.email } : { name: 'Anonymous', email: '' }
        };
      });
    }

    res.json({
      complaints,
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

// @route   GET /api/complaints/public
// @desc    Get public complaints for community view
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      status,
      priority
    } = req.query;

    const query = {};

    // Apply filters
    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    let complaints, total;

    // Check if MongoDB is connected, otherwise use mock database
    if (mongoose.connection.readyState === 1) {
      // Use MongoDB
      complaints = await Complaint.find(query)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      total = await Complaint.countDocuments(query);
    } else {
      // Use mock database
      const allComplaints = mockDB.findComplaints(query);
      total = allComplaints.length;
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      complaints = allComplaints.slice(startIndex, endIndex);
      
      // Populate user data for mock complaints
      complaints = complaints.map(complaint => {
        const user = mockDB.findUserById(complaint.user);
        return {
          ...complaint,
          user: user ? { name: user.name, email: user.email } : { name: 'Anonymous', email: '' }
        };
      });
    }

    res.json({
      complaints,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get public complaints error:', error);
    res.status(500).json({ message: 'Server error fetching public complaints' });
  }
});

// @route   GET /api/complaints/:id
// @desc    Get single complaint
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid complaint ID format' });
    }

    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .populate('updates.updatedBy', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check if user can view this complaint
    const user = await User.findById(req.userId).select('role');
    if (user && user.role === 'citizen' && complaint.user._id.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ complaint });
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({ message: 'Server error fetching complaint' });
  }
});

module.exports = router;
