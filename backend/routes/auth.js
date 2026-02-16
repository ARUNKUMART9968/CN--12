const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// ============ POST /api/auth/register ============
router.post('/register', [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Valid email is required').isEmail(),
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  body('role', 'Role must be student or alumni').isIn(['student', 'alumni'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { name, email, password, role } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    // Create user - DON'T hash here, let the model do it!
    user = new User({ 
      name, 
      email, 
      password,  // Plain password - will be hashed by pre('save') middleware
      role 
    });

    // Save user (this triggers pre('save') hook which hashes the password)
    await user.save();

    // Create JWT token
    const token = jsonwebtoken.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { 
        id: user._id, 
        name, 
        email, 
        role 
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// ============ POST /api/auth/login ============
router.post('/login', [
  body('email', 'Valid email is required').isEmail(),
  body('password', 'Password is required').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find user and SELECT password field (it's hidden by default)
    let user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Compare plain password with hashed password
    const isPasswordMatch = await bcryptjs.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Create JWT token
    const token = jsonwebtoken.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email, 
        role: user.role 
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// ============ GET /api/auth/me ============
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true, 
      user 
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// ============ POST /api/auth/logout ============
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
});

module.exports = router;