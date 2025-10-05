const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const volunteerSchema = new mongoose.Schema({
  // Link to existing user (for citizen volunteers)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Not required for standalone volunteer registrations
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.userId; // Required only for standalone volunteers
    },
    minlength: 6
  },
  phone: {
    type: String,
    required: true
  },
  alternateContact: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['volunteer'],
    default: 'volunteer'
  },
  // Volunteer specific fields
  skills: [{
    type: String,
    trim: true
  }],
  interests: [{
    type: String,
    trim: true
  }],
  availability: {
    weekdays: {
      type: Boolean,
      default: true
    },
    weekends: {
      type: Boolean,
      default: true
    },
    timeSlots: [{
      start: String, // e.g., "09:00"
      end: String,   // e.g., "17:00"
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      }
    }]
  },
  experience: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  previousVolunteerWork: [{
    organization: String,
    role: String,
    duration: String,
    description: String,
    startDate: Date,
    endDate: Date
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  // Location information
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  // Identity and verification
  aadhaarNumber: {
    type: String,
    trim: true
  },
  aadhaarDocument: {
    type: String, // URL or file path
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', '']
  },
  // Volunteer status and assignments
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending_approval'],
    default: 'pending_approval'
  },
  assignedTasks: [{
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VolunteerTask'
    },
    assignedDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['assigned', 'in_progress', 'completed', 'cancelled'],
      default: 'assigned'
    },
    completedDate: Date,
    feedback: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  // Performance tracking
  totalTasksCompleted: {
    type: Number,
    default: 0
  },
  totalHoursVolunteered: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  // Points and Badge System
  points: {
    type: Number,
    default: 0
  },
  badge: {
    rank: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
      default: 'bronze'
    },
    level: {
      type: Number,
      default: 1
    },
    nextRankPoints: {
      type: Number,
      default: 100 // Points needed for next rank
    }
  },
  achievements: [{
    type: {
      type: String,
      enum: ['first_task', 'ten_tasks', 'fifty_tasks', 'hundred_tasks', 'perfect_rating', 'community_hero', 'early_bird', 'night_owl'],
      required: true
    },
    earnedAt: {
      type: Date,
      default: Date.now
    },
    description: String
  }],
  // Preferences
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    taskTypes: [{
      type: String,
      enum: ['community_service', 'education', 'healthcare', 'environment', 'disaster_relief', 'social_work', 'other']
    }],
    maxDistance: {
      type: Number, // in kilometers
      default: 10
    }
  },
  // System fields
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  // Documents
  documents: [{
    type: {
      type: String,
      enum: ['identity_proof', 'address_proof', 'background_check', 'medical_certificate', 'other']
    },
    name: String,
    url: String,
    uploadedDate: {
      type: Date,
      default: Date.now
    },
    verified: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// Hash password before saving
volunteerSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
volunteerSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false; // No password set for citizen volunteers
  return bcrypt.compare(candidatePassword, this.password);
};

// Update volunteer performance
volunteerSchema.methods.updatePerformance = function(taskRating) {
  this.totalTasksCompleted += 1;
  this.averageRating = ((this.averageRating * (this.totalTasksCompleted - 1)) + taskRating) / this.totalTasksCompleted;
  return this.save();
};

// Add points and update badge
volunteerSchema.methods.addPoints = function(points) {
  this.points += points;
  this.updateBadge();
  this.checkAchievements();
  return this.save();
};

// Update badge based on points
volunteerSchema.methods.updateBadge = function() {
  const rankThresholds = {
    bronze: 0,
    silver: 100,
    gold: 500,
    platinum: 1000,
    diamond: 2500
  };

  const ranks = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
  let newRank = 'bronze';
  let newLevel = 1;
  let nextRankPoints = 100;

  // Determine current rank
  for (let i = ranks.length - 1; i >= 0; i--) {
    if (this.points >= rankThresholds[ranks[i]]) {
      newRank = ranks[i];
      break;
    }
  }

  // Calculate level within rank
  const currentRankThreshold = rankThresholds[newRank];
  const nextRankThreshold = ranks.indexOf(newRank) < ranks.length - 1 
    ? rankThresholds[ranks[ranks.indexOf(newRank) + 1]]
    : currentRankThreshold + 1000;

  newLevel = Math.floor((this.points - currentRankThreshold) / 100) + 1;
  nextRankPoints = nextRankThreshold - this.points;

  this.badge.rank = newRank;
  this.badge.level = newLevel;
  this.badge.nextRankPoints = nextRankPoints;
};

// Check and award achievements
volunteerSchema.methods.checkAchievements = function() {
  const achievements = [];

  // First task achievement
  if (this.totalTasksCompleted === 1 && !this.achievements.find(a => a.type === 'first_task')) {
    achievements.push({
      type: 'first_task',
      description: 'Completed your first volunteer task!'
    });
  }

  // Task count achievements
  if (this.totalTasksCompleted === 10 && !this.achievements.find(a => a.type === 'ten_tasks')) {
    achievements.push({
      type: 'ten_tasks',
      description: 'Completed 10 volunteer tasks!'
    });
  }

  if (this.totalTasksCompleted === 50 && !this.achievements.find(a => a.type === 'fifty_tasks')) {
    achievements.push({
      type: 'fifty_tasks',
      description: 'Completed 50 volunteer tasks!'
    });
  }

  if (this.totalTasksCompleted === 100 && !this.achievements.find(a => a.type === 'hundred_tasks')) {
    achievements.push({
      type: 'hundred_tasks',
      description: 'Completed 100 volunteer tasks!'
    });
  }

  // Perfect rating achievement
  if (this.averageRating >= 4.8 && this.totalTasksCompleted >= 5 && !this.achievements.find(a => a.type === 'perfect_rating')) {
    achievements.push({
      type: 'perfect_rating',
      description: 'Maintained excellent rating!'
    });
  }

  // Community hero achievement
  if (this.points >= 1000 && !this.achievements.find(a => a.type === 'community_hero')) {
    achievements.push({
      type: 'community_hero',
      description: 'Became a community hero!'
    });
  }

  // Add new achievements
  this.achievements.push(...achievements);
};

module.exports = mongoose.model('Volunteer', volunteerSchema);
