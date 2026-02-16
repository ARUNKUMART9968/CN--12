export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';
export const ENV = import.meta.env.VITE_ENV || 'development';

export const APP_NAME = 'Career Nexus';
export const TOAST_DURATION = 4000;

export const ROLES = {
  STUDENT: 'student',
  ALUMNI: 'alumni',
};

export const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract'];
export const EXPERIENCE_LEVELS = ['Fresher', 'Junior', 'Mid-level', 'Senior'];

export const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);