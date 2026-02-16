/**
 * Validation functions for backend
 * Input validation and data checking
 */

/**
 * Validate email format
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
const validatePassword = (password) => {
  if (password.length < 6) {
    return {
      valid: false,
      message: 'Password must be at least 6 characters'
    };
  }
  return {
    valid: true,
    message: 'Password is valid'
  };
};

/**
 * Validate required fields
 */
const validateRequiredFields = (data, requiredFields) => {
  const missing = [];
  
  requiredFields.forEach(field => {
    if (!data[field] || data[field] === '') {
      missing.push(field);
    }
  });

  if (missing.length > 0) {
    return {
      valid: false,
      message: `Missing required fields: ${missing.join(', ')}`
    };
  }

  return {
    valid: true,
    message: 'All required fields present'
  };
};

/**
 * Validate user role
 */
const validateRole = (role) => {
  const validRoles = ['student', 'alumni'];
  
  if (!validRoles.includes(role)) {
    return {
      valid: false,
      message: `Role must be one of: ${validRoles.join(', ')}`
    };
  }

  return {
    valid: true,
    message: 'Valid role'
  };
};

/**
 * Validate MongoDB ObjectId
 */
const validateObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

/**
 * Validate profile completeness
 */
const validateProfileCompleteness = (profile) => {
  const requiredFields = ['name', 'email', 'university', 'degree'];
  const hasAllFields = requiredFields.every(field => profile[field]);

  if (!hasAllFields) {
    return {
      valid: false,
      message: 'Profile incomplete',
      missingFields: requiredFields.filter(field => !profile[field])
    };
  }

  return {
    valid: true,
    message: 'Profile complete'
  };
};

/**
 * Validate array of skills
 */
const validateSkills = (skills) => {
  if (!Array.isArray(skills)) {
    return {
      valid: false,
      message: 'Skills must be an array'
    };
  }

  if (skills.length === 0) {
    return {
      valid: false,
      message: 'At least one skill is required'
    };
  }

  return {
    valid: true,
    message: 'Skills valid'
  };
};

/**
 * Validate job posting
 */
const validateJobPosting = (job) => {
  const requiredFields = ['title', 'company', 'description', 'location'];
  
  const validation = validateRequiredFields(job, requiredFields);
  
  if (!validation.valid) {
    return validation;
  }

  if (!job.deadline || new Date(job.deadline) <= new Date()) {
    return {
      valid: false,
      message: 'Deadline must be in the future'
    };
  }

  return {
    valid: true,
    message: 'Job posting valid'
  };
};

/**
 * Validate message content
 */
const validateMessage = (message) => {
  if (!message || message.trim() === '') {
    return {
      valid: false,
      message: 'Message cannot be empty'
    };
  }

  if (message.length > 5000) {
    return {
      valid: false,
      message: 'Message is too long (max 5000 characters)'
    };
  }

  return {
    valid: true,
    message: 'Message valid'
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateRequiredFields,
  validateRole,
  validateObjectId,
  validateProfileCompleteness,
  validateSkills,
  validateJobPosting,
  validateMessage
};