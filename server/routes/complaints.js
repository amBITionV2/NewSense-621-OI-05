const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const { auth } = require('../middleware/auth');
const { postToSocialMedia } = require('../services/socialMediaService');

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

// @route   POST /api/complaints
// @desc    Create a new complaint
// @access  Private
router.post('/', auth, upload.array('media', 5), [
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

    // Create complaint
    const complaint = new Complaint({
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
      images: mediaFiles.filter(f => f.type === 'image'),
      videos: mediaFiles.filter(f => f.type === 'video')
    });

    await complaint.save();

    // Schedule social media posts
    try {
      await postToSocialMedia(complaint);
    } catch (socialError) {
      console.error('Social media posting error:', socialError);
      // Don't fail the complaint creation if social media fails
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('new-complaint', {
      complaint: await Complaint.findById(complaint._id).populate('user', 'name email')
    });

    res.status(201).json({
      message: 'Complaint created successfully',
      complaint: await Complaint.findById(complaint._id).populate('user', 'name email')
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
      priority,
      location,
      radius = 10, // km
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    // Filter by user's complaints or all complaints for admin
    if (req.user.role === 'citizen') {
      query.user = req.userId;
    }

    // Apply filters
    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Location-based filtering
    if (location && location.lat && location.lng) {
      query['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(location.lng), parseFloat(location.lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const complaints = await Complaint.find(query)
      .populate('user', 'name email')
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
    console.error('Get complaints error:', error);
    res.status(500).json({ message: 'Server error fetching complaints' });
  }
});

// @route   GET /api/complaints/:id
// @desc    Get single complaint
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .populate('updates.updatedBy', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check if user can view this complaint
    if (req.user.role === 'citizen' && complaint.user._id.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ complaint });
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({ message: 'Server error fetching complaint' });
  }
});

// @route   PUT /api/complaints/:id/status
// @desc    Update complaint status
// @access  Private (Admin/Moderator)
router.put('/:id/status', auth, [
  body('status').isIn(['open', 'in-progress', 'resolved', 'closed']).withMessage('Invalid status'),
  body('message').optional().trim().isLength({ min: 5 }).withMessage('Update message must be at least 5 characters')
], async (req, res) => {
  try {
    if (req.user.role === 'citizen') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, message, estimatedResolution } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Add update to history
    complaint.updates.push({
      message: message || `Status changed to ${status}`,
      status,
      updatedBy: req.userId
    });

    complaint.status = status;
    if (estimatedResolution) {
      complaint.estimatedResolution = new Date(estimatedResolution);
    }

    if (status === 'resolved' || status === 'closed') {
      complaint.actualResolution = new Date();
    }

    await complaint.save();

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`complaint-${complaint._id}`).emit('status-update', {
      complaint: await Complaint.findById(complaint._id).populate('user', 'name email')
    });

    res.json({
      message: 'Status updated successfully',
      complaint: await Complaint.findById(complaint._id).populate('user', 'name email')
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error updating status' });
  }
});

// @route   POST /api/complaints/:id/feedback
// @desc    Submit feedback for resolved complaint
// @access  Private
router.post('/:id/feedback', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('feedback').optional().trim().isLength({ min: 10 }).withMessage('Feedback must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, feedback } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check if user owns this complaint
    if (complaint.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if complaint is resolved
    if (complaint.status !== 'resolved' && complaint.status !== 'closed') {
      return res.status(400).json({ message: 'Can only provide feedback for resolved complaints' });
    }

    complaint.rating = rating;
    complaint.feedback = feedback;

    await complaint.save();

    res.json({
      message: 'Feedback submitted successfully',
      complaint: await Complaint.findById(complaint._id).populate('user', 'name email')
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error submitting feedback' });
  }
});

module.exports = router;
