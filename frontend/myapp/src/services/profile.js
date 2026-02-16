import API from './api';

const profileService = {
  createStudentProfile: (data) => API.post('/profile/student', data),
  updateStudentProfile: (data) => API.put('/profile/student', data),
  getStudentProfile: (userId) => API.get(`/profile/student/${userId}`),
  createAlumniProfile: (data) => API.post('/profile/alumni', data),
  updateAlumniProfile: (data) => API.put('/profile/alumni', data),
  getAlumniProfile: (userId) => API.get(`/profile/alumni/${userId}`),
  getAllProfiles: (role, page = 1, limit = 10) => 
    API.get(`/profile/all/${role}?page=${page}&limit=${limit}`),
  getProfile: (role, userId) => API.get(`/profile/${role}/${userId}`),
};

export default profileService;import API from './api';

