/**
 * Helper functions for backend
 * Common utilities and helper functions
 */

/**
 * Generate random ID
 */
const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Format date to readable string
 */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Check if email is valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if password is strong
 */
const isStrongPassword = (password) => {
  return password.length >= 6;
};

/**
 * Hash object to string
 */
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
};

/**
 * Parse JWT token
 */
const parseToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const decoded = Buffer.from(parts[1], 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
};

/**
 * Get time difference in human readable format
 */
const getTimeDifference = (date1, date2) => {
  const diffMs = Math.abs(date2 - date1);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMinutes > 0) return `${diffMinutes}m ago`;
  return 'just now';
};

/**
 * Truncate string
 */
const truncateString = (str, length = 50) => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};

/**
 * Remove duplicates from array
 */
const removeDuplicates = (arr) => {
  return [...new Set(arr)];
};

/**
 * Sort array of objects
 */
const sortByProperty = (arr, property, ascending = true) => {
  return arr.sort((a, b) => {
    if (ascending) {
      return a[property] > b[property] ? 1 : -1;
    } else {
      return a[property] < b[property] ? 1 : -1;
    }
  });
};

module.exports = {
  generateRandomId,
  formatDate,
  isValidEmail,
  isStrongPassword,
  hashString,
  parseToken,
  getTimeDifference,
  truncateString,
  removeDuplicates,
  sortByProperty
};