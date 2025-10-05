const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
    required: true,
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
    enum: ['citizen', 'admin', 'moderator', 'volunteer'],
    default: 'citizen'
  },
  // Aadhaar and Identity Information
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
  fatherName: {
    type: String,
    trim: true
  },
  motherName: {
    type: String,
    trim: true
  },
  // Additional Citizen Information
  caste: {
    type: String,
    enum: ['general', 'obc', 'sc', 'st', 'other', '']
  },
  religion: {
    type: String,
    enum: ['hinduism', 'islam', 'christianity', 'sikhism', 'buddhism', 'jainism', 'other', '']
  },
  occupation: {
    type: String,
    trim: true
  },
  salary: {
    type: String,
    trim: true
  },
  hasIncome: {
    type: String,
    enum: ['yes', 'no'],
    default: 'yes'
  },
  languagesSpoken: [{
    type: String,
    trim: true
  }],
  nativePlace: {
    type: String,
    trim: true
  },
  residenceType: {
    type: String,
    enum: ['own_house', 'rented_house', 'rented_flat', 'pg', 'hostel', 'family_house', 'other', '']
  },
  // Admin Specific Fields
  governmentIdNumber: {
    type: String,
    trim: true
  },
  governmentIdDocument: {
    type: String, // URL or file path
    trim: true
  },
  // Citizenship Proof
  citizenshipProofDocument: {
    type: String, // URL or file path
    trim: true
  },
  citizenshipProofType: {
    type: String,
    enum: ['electricity_bill', 'ration_card', 'pan_card', 'voter_id', 'other', '']
  },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    }
  },
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
  // Volunteer information (if user is also a volunteer)
  volunteerInfo: {
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Volunteer'
    },
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
      }
    },
    totalTasksCompleted: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
