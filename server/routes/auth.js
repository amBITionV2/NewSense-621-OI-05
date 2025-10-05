const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const mockDB = require('../mockDatabase');
const { auth } = require('../middleware/auth');
const config = require('../config.dev');

let User, Admin;
try {
  User = require('../models/User');
  Admin = require('../models/Admin');
} catch (e) {
  User = null;
  Admin = null;
}

const router = express.Router();

// Generate JWT token
const generateToken = (userId, userType = 'user') => {
  return jwt.sign({ userId, userType }, config.JWT_SECRET, { expiresIn: '7d' });
};

// Handle admin registration
const handleAdminRegistration = async (req, res, adminData) => {
  try {
    const { 
      name, email, password, phone, alternateContact, location, 
      aadhaarNumber, dateOfBirth, gender, fatherName, motherName, 
      governmentIdNumber, governmentIdDocument, citizenshipProofDocument, citizenshipProofType 
    } = adminData;

    // Provide default values for optional fields
    const aadhaarDoc = governmentIdDocument || '';
    const citizenshipDoc = citizenshipProofDocument || '';
    const citizenshipType = citizenshipProofType || '';
    
    if (Admin) {
      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists with this email' });
      }

      // Ensure location has proper structure
      const adminLocation = {
        address: location?.address || '',
        city: location?.city || '',
        state: location?.state || '',
        pincode: location?.pincode || '',
        country: location?.country || ''
      };

      console.log('Creating admin with data:', {
        name,
        email,
        governmentIdNumber,
        location: adminLocation
      });

      const admin = await Admin.create({
        name,
        email,
        role: 'admin',
        password,
        phone,
        alternateContact,
        location: adminLocation,
        aadhaarNumber,
        aadhaarDocument: aadhaarDoc,
        dateOfBirth,
        gender,
        fatherName,
        motherName,
        governmentIdNumber,
        governmentIdDocument: aadhaarDoc,
        citizenshipProofDocument: citizenshipDoc,
        citizenshipProofType: citizenshipType,
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

      console.log('✅ Admin created successfully:', {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        governmentIdNumber: admin.governmentIdNumber
      });

      const token = generateToken(admin._id, 'admin');
      return res.status(201).json({ 
        message: 'Admin registered successfully', 
        token, 
        user: { 
          id: admin._id, 
          name: admin.name, 
          email: admin.email, 
          role: 'admin',
          userType: 'admin'
        } 
      });
    }

    // Fallback to mockDB for admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = mockDB.createAdmin({
      name,
      email,
      role: 'admin',
      password: hashedPassword,
      phone,
      alternateContact,
      location,
      aadhaarNumber,
      aadhaarDocument: aadhaarDoc,
      dateOfBirth,
      gender,
      fatherName,
      motherName,
      governmentIdNumber,
      governmentIdDocument: aadhaarDoc,
      citizenshipProofDocument: citizenshipDoc,
      citizenshipProofType: citizenshipType,
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

    const token = generateToken(admin._id, 'admin');
    res.status(201).json({ 
      message: 'Admin registered successfully', 
      token, 
      user: { 
        id: admin._id, 
        name: admin.name, 
        email: admin.email, 
        role: 'admin',
        userType: 'admin'
      } 
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ 
      message: 'Server error during admin registration',
      error: error.message 
    });
  }
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isString().withMessage('Please provide a valid phone number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    
    console.log('Registration request received:', {
      body: req.body,
      hasName: !!req.body.name,
      hasEmail: !!req.body.email,
      hasPassword: !!req.body.password,
      hasPhone: !!req.body.phone,
      hasRole: !!req.body.role,
      hasGovernmentId: !!req.body.governmentIdNumber
    });

    const { 
      name, email, password, phone, alternateContact, location,
      aadhaarNumber, dateOfBirth, gender, fatherName, motherName,
      caste, religion, occupation, salary, hasIncome, languagesSpoken,
      nativePlace, residenceType, governmentIdNumber,
      aadhaarDocument, governmentIdDocument, citizenshipProofDocument, citizenshipProofType,
      role: selectedRole
    } = req.body;
    
    // Determine role - use selectedRole if provided, otherwise check government ID
    const role = selectedRole || (governmentIdNumber ? 'admin' : 'citizen');
    
    console.log('Registration attempt:', { 
      email, 
      selectedRole, 
      governmentIdNumber, 
      determinedRole: role 
    });
    
    // Validate admin registration requirements
    if (role === 'admin' && !governmentIdNumber) {
      return res.status(400).json({ message: 'Government ID number is required for admin registration' });
    }

    // Handle admin registration separately
    if (role === 'admin') {
      return handleAdminRegistration(req, res, {
        name, email, password, phone, alternateContact, location,
        aadhaarNumber, dateOfBirth, gender, fatherName, motherName,
        governmentIdNumber, governmentIdDocument, citizenshipProofDocument, citizenshipProofType
      });
    }

    // Check if user already exists
    if (User) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Ensure location has proper structure
      const userLocation = {
        address: location?.address || '',
        city: location?.city || '',
        state: location?.state || '',
        pincode: location?.pincode || '',
        country: location?.country || ''
      };

      console.log('Creating user with data:', {
        name,
        email,
        role,
        governmentIdNumber,
        location: userLocation
      });

      const user = await User.create({
        name,
        email,
        password,
        phone,
        alternateContact,
        location: userLocation,
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

      console.log('✅ User created successfully:', {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
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
      location: userLocation,
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
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message 
    });
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

    // For demo purposes, skip database checks and use mock database directly
    console.log('Checking mockDB for email:', email);
    console.log('Available users in mockDB:', mockDB.users.map(u => ({ email: u.email, name: u.name })));
    const user = mockDB.findUserByEmail(email);
    if (!user) {
      console.log('User not found in mockDB');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log('User found:', { email: user.email, name: user.name, hasPassword: !!user.password });
    console.log('Stored password hash:', user.password);
    console.log('Input password:', password);

    // For demo purposes, use simple password check
    const isMatch = password === 'password';
    console.log('Password match result:', isMatch);
    if (!isMatch) {
      console.log('Password does not match');
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

// Debug route to check mock database users
router.get('/debug/users', (req, res) => {
  const users = mockDB.users.map(user => ({
    email: user.email,
    name: user.name,
    role: user.role,
    password: user.password,
    isActive: user.isActive
  }));
  res.json({ users });
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // Check if it's an admin first
    if (req.userType === 'admin' && Admin) {
      const admin = await Admin.findById(req.userId).lean();
      if (!admin) return res.status(404).json({ message: 'Admin not found' });
      const { password, ...adminWithoutPassword } = admin;
      return res.json({ user: adminWithoutPassword });
    }

    // Check regular users
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
