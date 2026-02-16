const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  alumniId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Job title is required']
  },
  company: {
    type: String,
    required: [true, 'Company name is required']
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  location: {
    type: String,
    required: [true, 'Job location is required']
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['Fresher', 'Junior', 'Mid-level', 'Senior'],
    required: true
  },
  skillsRequired: [{
    type: String,
    lowercase: true
  }],
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'INR' }
  },
  applicants: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'shortlisted', 'rejected'],
      default: 'pending'
    }
  }],
  status: {
    type: String,
    enum: ['open', 'closed', 'filled'],
    default: 'open'
  },
  deadline: {
    type: Date,
    required: true
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

// Index for job searches
jobSchema.index({ alumniId: 1, status: 1 });
jobSchema.index({ skillsRequired: 1 });

module.exports = mongoose.model('Job', jobSchema);