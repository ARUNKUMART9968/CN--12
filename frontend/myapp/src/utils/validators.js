export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validatePhoneNumber = (phone) => {
  const regex = /^[\d\s\-\+\(\)]+$/;
  return regex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && (!value || value.toString().trim() === '')) {
      errors[field] = `${field} is required`;
    }
    
    if (fieldRules.email && value && !validateEmail(value)) {
      errors[field] = 'Invalid email';
    }
    
    if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
      errors[field] = `Minimum ${fieldRules.minLength} characters required`;
    }
  });
  
  return errors;
};