const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const mockDB = require('../mockDatabase');
const { auth } = require('../middleware/auth');
const config = require('../config.dev');

let User;
try {
  User = require('../models/User');
} catch (e) {
  User = null;
}

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      name, email, password, phone, alternateContact, location,
      aadhaarNumber, dateOfBirth, gender, fatherName, motherName,
      caste, religion, occupation, salary, hasIncome, languagesSpoken,
      nativePlace, residenceType, governmentIdNumber,
      aadhaarDocument, governmentIdDocument, citizenshipProofDocument, citizenshipProofType
    } = req.body;
    
    // Determine role based on presence of government ID
    const role = governmentIdNumber ? 'admin' : 'citizen';

    // Check if user already exists
    if (User) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const user = await User.create({
        name,
        email,
        password,
        phone,
        alternateContact,
        location,
        role,
        aadhaarNumber,
        aadhaarDocument,
        dateOfBirth,
        gender,
        fatherName,
        motherName,
        caste,
        religion,
        occupation,
        salary,
        hasIncome,
        languagesSpoken,
        nativePlace,
        residenceType,
        governmentIdNumber,
        governmentIdDocument,
        citizenshipProofDocument,
        citizenshipProofType,
        preferences: {
          language: 'en',
          notifications: {
            email: true,
            sms: false,
            push: true
          }
        },
        isActive: true,
        verificationStatus: 'pending',
        lastLogin: new Date()
      });

      const token = generateToken(user._id);
      return res.status(201).json({ message: 'User registered successfully', token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    }

    // Fallback to mockDB
    const existingUser = mockDB.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = mockDB.createUser({
      name,
      email,
      password: hashedPassword,
      phone,
      alternateContact,
      location,
      role,
      aadhaarNumber,
      aadhaarDocument,
      dateOfBirth,
      gender,
      fatherName,
      motherName,
      caste,
      religion,
      occupation,
      salary,
      hasIncome,
      languagesSpoken,
      nativePlace,
      residenceType,
      governmentIdNumber,
      governmentIdDocument,
      citizenshipProofDocument,
      citizenshipProofType,
      preferences: {
        language: 'en',
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      },
      isActive: true,
      verificationStatus: 'pending',
      lastLogin: new Date()
    });

    const token = generateToken(user._id);
    res.status(201).json({ message: 'User registered successfully', token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    if (User) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      user.lastLogin = new Date();
      await user.save();

      const token = generateToken(user._id);
      return res.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email, role: user.role, location: user.location } });
    }

    // Fallback to mockDB
    const user = mockDB.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    mockDB.updateUser(user._id, { lastLogin: new Date() });
    const token = generateToken(user._id);

    res.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email, role: user.role, location: user.location } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    if (User) {
      const user = await User.findById(req.userId).lean();
      if (!user) return res.status(404).json({ message: 'User not found' });
      const { password, ...userWithoutPassword } = user;
      return res.json({ user: userWithoutPassword });
    }

    const user = mockDB.findUserById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone(),
  body('preferences.language').optional().isLength({ min: 2, max: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = req.body;

    if (User) {
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Merge updates into user document
      Object.keys(updates).forEach(key => {
        // support nested updates like preferences
        if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
          user[key] = { ...user[key], ...updates[key] };
        } else {
          user[key] = updates[key];
        }
      });

      await user.save();
      const userObj = user.toObject();
      delete userObj.password;
      return res.json({ message: 'Profile updated successfully', user: userObj });
    }

    const user = mockDB.updateUser(req.userId, updates);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password, ...userWithoutPassword } = user;
    res.json({ message: 'Profile updated successfully', user: userWithoutPassword });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
