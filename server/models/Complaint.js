const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: [
      'potholes',
      'garbage',
      'street-lighting',
      'water-supply',
      'sewage',
      'traffic-signals',
      'road-maintenance',
      'public-transport',
      'parks-recreation',
      'noise-pollution',
      'air-pollution',
      'other'
    ],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    },
    city: String,
    state: String,
    country: String,
    pincode: String
  },
  images: [{
    url: String,
    filename: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  videos: [{
    url: String,
    filename: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  department: {
    type: String,
    enum: [
      'public-works',
      'sanitation',
      'transport',
      'environment',
      'health',
      'education',
      'other'
    ]
  },
  estimatedResolution: Date,
  actualResolution: Date,
  socialMediaPosts: [{
    platform: {
      type: String,
      enum: ['twitter', 'instagram']
    },
    postId: String,
    url: String,
    postedAt: Date,
    status: {
      type: String,
      enum: ['posted', 'failed', 'scheduled'],
      default: 'scheduled'
    }
  }],
  updates: [{
    message: String,
    status: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String,
  tags: [String],
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for location-based queries
complaintSchema.index({ 'location.coordinates': '2dsphere' });
complaintSchema.index({ category: 1, status: 1 });
complaintSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Complaint', complaintSchema);
