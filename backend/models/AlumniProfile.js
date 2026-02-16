const mongoose = require('mongoose');

const alumniProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    default: null
  },
  email: {
    type: String,
    default: null
  },
  university: {
    type: String,
    required: [true, 'University is required']
  },
  degree: {
    type: String,
    required: [true, 'Degree is required']
  },
  specialization: {
    type: String,
    default: null
  },
  graduationYear: {
    type: Number,
    required: [true, 'Graduation year is required']
  },
  company: {
    type: String,
    required: [true, 'Current company is required']
  },
  designation: {
    type: String,
    required: [true, 'Job designation is required']
  },
  industry: {
    type: String,
    required: [true, 'Industry is required']
  },
  currentPosition: {
    type: String,
    default: null
  },
  yearsOfExperience: {
    type: Number,
    required: true
  },
  skills: [{
    type: String,
    lowercase: true
  }],
  interests: [{
    type: String,
    lowercase: true
  }],
  hiringStack: [{
    type: String,
    lowercase: true
  }],
  mentoringAreas: [{
    type: String,
    lowercase: true
  }],
  companyDescription: {
    type: String,
    default: null
  },
  location: {
    type: String,
    default: null
  },
  availability: {
    type: String,
    enum: ['Available', 'Limited', 'Not Available'],
    default: 'Available'
  },
  mentorshipExperience: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    default: null
  },
  profileImage: {
    type: String,
    default: null
  },
  linkedinProfile: {
    type: String,
    default: null
  },
  twitterProfile: {
    type: String,
    default: null
  },
  websiteUrl: {
    type: String,
    default: null
  },
  canHire: {
    type: Boolean,
    default: false
  },
  canMentor: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AlumniProfile', alumniProfileSchema);