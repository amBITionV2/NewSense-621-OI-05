const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
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
  // Admin Specific Fields
  governmentIdNumber: {
    type: String,
    required: true,
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
  // Admin specific permissions
  permissions: {
    canManageUsers: { type: Boolean, default: true },
    canManageComplaints: { type: Boolean, default: true },
    canViewAnalytics: { type: Boolean, default: true },
    canManageSystem: { type: Boolean, default: false }
  },
  // Admin department/role
  department: {
    type: String,
    enum: ['administration', 'public-works', 'sanitation', 'transport', 'environment', 'health', 'education', 'other'],
    default: 'administration'
  },
  adminLevel: {
    type: String,
    enum: ['super-admin', 'admin', 'moderator'],
    default: 'admin'
  }
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
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
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
