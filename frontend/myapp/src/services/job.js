import API from './api';

const jobService = {
  createJob: (data) => API.post('/job/create', data),
  getAllJobs: (status = 'open', page = 1, limit = 10) => 
    API.get(`/job/list?status=${status}&page=${page}&limit=${limit}`),
  getJobDetails: (jobId) => API.get(`/job/${jobId}`),
  applyForJob: (jobId) => API.post(`/job/${jobId}/apply`),
  getJobApplicants: (jobId) => API.get(`/job/${jobId}/applicants`),
  updateApplicantStatus: (jobId, studentId, status) => 
    API.put(`/job/${jobId}/applicants/${studentId}`, { status }),
  searchJobs: (query) => API.get(`/job/search?query=${query}`),
  filterJobs: (filters) => API.post('/job/filter', filters),
  getMyJobs: (page = 1, limit = 10) => 
    API.get(`/job/my-jobs?page=${page}&limit=${limit}`),
  getMyApplications: (page = 1, limit = 10) => 
    API.get(`/job/my-applications?page=${page}&limit=${limit}`),
};

export default jobService;