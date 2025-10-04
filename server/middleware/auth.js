const jwt = require('jsonwebtoken');
const mockDB = require('../mockDatabase');
const config = require('../config.dev');

let User;
try {
  User = require('../models/User');
} catch (e) {
  // if model can't be loaded, we'll fallback to mockDB
  User = null;
}

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);

    let user = null;
    if (User) {
      user = await User.findById(decoded.userId).lean();
    }

    if (!user) {
      // fallback to mockDB (demo)
      user = mockDB.findUserById(decoded.userId);
    }

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.userId = user._id;
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
      }
      next();
    });
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { auth, adminAuth };
