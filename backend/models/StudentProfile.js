const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
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
  yearOfGraduation: {
    type: Number,
    default: null
  },
  currentYear: {
    type: String,
    enum: ['1st', '2nd', '3rd', '4th', '1', '2', '3', '4'],
    default: null
  },
  skills: [{
    type: String,
    lowercase: true
  }],
  interests: [{
    type: String,
    lowercase: true
  }],
  projects: [{
    title: String,
    description: String,
    link: String,
    technologies: [String]
  }],
  experience: {
    type: String,
    default: null
  },
  internships: [{
    company: String,
    position: String,
    duration: String,
    description: String
  }],
  resume: {
    type: String,
    default: null
  },
  location: {
    type: String,
    default: null
  },
  preferredIndustry: {
    type: String,
    default: null
  },
  careerGoals: {
    type: String,
    default: null
  },
  lookingFor: [{
    type: String,
    enum: ['Mentorship', 'Job Opportunity', 'Guidance', 'Network', 'Job'],
    default: null
  }],
  portfolio: {
    type: String,
    default: null
  },
  linkedinProfile: {
    type: String,
    default: null
  },
  githubProfile: {
    type: String,
    default: null
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

module.exports = mongoose.model('StudentProfile', studentProfileSchema);