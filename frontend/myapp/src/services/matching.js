import API from './api';

const matchingService = {
  // Get student recommendations using YOUR actual backend route
  // Backend uses: GET /api/match/student/:userId
  getStudentRecommendations: (userId, page = 1, limit = 10) => 
    API.get(`/match/student/${userId}?page=${page}&limit=${limit}`),
  
  // Get alumni matches
  getAlumniMatches: (userId, page = 1, limit = 10) => 
    API.get(`/match/alumni/${userId}?page=${page}&limit=${limit}`),
  
  // Get detailed match information
  getMatchDetails: (userId, matchId) => 
    API.get(`/match/${userId}/${matchId}`),
  
  // Get match score breakdown
  getMatchScore: (userId1, userId2) => 
    API.get(`/match/score/${userId1}/${userId2}`),
};

export default matchingService;