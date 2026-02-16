export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDatetime = (date) => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const truncate = (str, length = 100) => {
  return str?.length > length ? `${str.substring(0, length)}...` : str;
};

export const capitalizeFirst = (str) => {
  return str?.charAt(0).toUpperCase() + str?.slice(1);
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const getInitials = (name) => {
  return name
    ?.split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'AN';
};

export const calculateAge = (birthDate) => {
  const today = new Date();
  let age = today.getFullYear() - new Date(birthDate).getFullYear();
  const monthDiff = today.getMonth() - new Date(birthDate).getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < new Date(birthDate).getDate())) {
    age--;
  }
  return age;
};