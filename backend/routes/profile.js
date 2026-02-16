/**
 * Profile Routes
 * Student and Alumni profile management
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const StudentProfile = require('../models/StudentProfile');
const AlumniProfile = require('../models/AlumniProfile');
const User = require('../models/User');

// ============ POST /api/profile/student ============
router.post('/student', authMiddleware, async (req, res) => {
  try {
    const { university, degree, specialization, currentYear, skills, interests, projects, experience, resume, preferredIndustry, careerGoals, lookingFor, linkedinProfile, githubProfile } = req.body;

    // Check if profile exists
    let profile = await StudentProfile.findOne({ userId: req.userId });
    if (profile) {
      return res.status(400).json({
        success: false,
        message: 'Student profile already exists'
      });
    }

    // Get user info
    const user = await User.findById(req.userId);

    // Create new profile
    profile = new StudentProfile({
      userId: req.userId,
      name: user.name,
      email: user.email,
      university,
      degree,
      specialization,
      currentYear,
      skills: skills || [],
      interests: interests || [],
      projects: projects || [],
      experience,
      resume,
      preferredIndustry,
      careerGoals,
      lookingFor: lookingFor || [],
      linkedinProfile,
      githubProfile
    });

    await profile.save();

    // Update user profile status
    await User.findByIdAndUpdate(req.userId, { isProfileComplete: true });

    res.status(201).json({
      success: true,
      message: 'Student profile created',
      profile
    });

  } catch (error) {
    console.error('Create student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============ PUT /api/profile/student ============
router.put('/student', authMiddleware, async (req, res) => {
  try {
    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.userId },
      { $set: req.body },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated',
      profile
    });

  } catch (error) {
    console.error('Update student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============ GET /api/profile/student/:id ============
router.get('/student/:id', async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.params.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    res.json({
      success: true,
      profile
    });

  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============ POST /api/profile/alumni ============
router.post('/alumni', authMiddleware, async (req, res) => {
  try {
    const { university, degree, graduationYear, company, designation, industry, yearsOfExperience, skills, interests, hiringStack, mentoringAreas, availability, canHire, canMentor, linkedinProfile, location } = req.body;

    // Check if profile exists
    let profile = await AlumniProfile.findOne({ userId: req.userId });
    if (profile) {
      return res.status(400).json({
        success: false,
        message: 'Alumni profile already exists'
      });
    }

    // Get user info
    const user = await User.findById(req.userId);

    // Create new profile
    profile = new AlumniProfile({
      userId: req.userId,
      name: user.name,
      email: user.email,
      university,
      degree,
      graduationYear,
      company,
      designation,
      industry,
      yearsOfExperience,
      skills: skills || [],
      interests: interests || [],
      hiringStack: hiringStack || [],
      mentoringAreas: mentoringAreas || [],
      availability,
      canHire: canHire || false,
      canMentor: canMentor || false,
      linkedinProfile,
      location
    });

    await profile.save();

    // Update user profile status
    await User.findByIdAndUpdate(req.userId, { isProfileComplete: true });

    res.status(201).json({
      success: true,
      message: 'Alumni profile created',
      profile
    });

  } catch (error) {
    console.error('Create alumni profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============ PUT /api/profile/alumni ============
router.put('/alumni', authMiddleware, async (req, res) => {
  try {
    const profile = await AlumniProfile.findOneAndUpdate(
      { userId: req.userId },
      { $set: req.body },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Alumni profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated',
      profile
    });

  } catch (error) {
    console.error('Update alumni profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============ GET /api/profile/alumni/:id ============
router.get('/alumni/:id', async (req, res) => {
  try {
    const profile = await AlumniProfile.findOne({ userId: req.params.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Alumni profile not found'
      });
    }

    res.json({
      success: true,
      profile
    });

  } catch (error) {
    console.error('Get alumni profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============ GET /api/profile/all/:role ============
router.get('/all/:role', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let profiles, total;

    if (req.params.role === 'student') {
      profiles = await StudentProfile.find().skip(skip).limit(limit);
      total = await StudentProfile.countDocuments();
    } else if (req.params.role === 'alumni') {
      profiles = await AlumniProfile.find().skip(skip).limit(limit);
      total = await AlumniProfile.countDocuments();
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    res.json({
      success: true,
      profiles,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Get all profiles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;