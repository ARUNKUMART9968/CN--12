import API from './api';

const matchingService = {
  runMatching: (studentId) => API.post('/match/run', { studentId }),
  getStudentRecommendations: (studentId, page = 1, limit = 10) => 
    API.get(`/match/student/${studentId}?page=${page}&limit=${limit}`),
  getAlumniMatches: (alumniId, page = 1, limit = 10) => 
    API.get(`/match/alumni/${alumniId}?page=${page}&limit=${limit}`),
  getMatchDetails: (studentId, alumniId) => 
    API.get(`/match/${studentId}/${alumniId}`),
  searchMatches: (studentId, filters) => 
    API.post('/match/search', { studentId, filters }),
};

export default matchingService;