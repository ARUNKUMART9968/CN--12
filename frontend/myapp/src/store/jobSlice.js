import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobs: [],
  myJobs: [],
  selectedJob: null,
  applicants: [],
  myApplications: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  jobStats: {
    totalJobs: 0,
    openJobs: 0,
    appliedJobs: 0,
  },
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload.jobs;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.page;
      state.loading = false;
      state.error = null;
    },

    setMyJobs: (state, action) => {
      state.myJobs = action.payload;
    },

    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
    },

    setApplicants: (state, action) => {
      state.applicants = action.payload;
    },

    setMyApplications: (state, action) => {
      state.myApplications = action.payload;
    },

    addJob: (state, action) => {
      state.myJobs.unshift(action.payload);
    },

    updateJob: (state, action) => {
      const index = state.jobs.findIndex(j => j._id === action.payload._id);
      if (index !== -1) {
        state.jobs[index] = action.payload;
      }
    },

    applyForJob: (state, action) => {
      state.myApplications.push(action.payload);
    },

    setJobStats: (state, action) => {
      state.jobStats = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearJobs: (state) => {
      state.jobs = [];
      state.myJobs = [];
      state.selectedJob = null;
      state.totalPages = 1;
      state.currentPage = 1;
    },
  },
});

export const {
  setJobs,
  setMyJobs,
  setSelectedJob,
  setApplicants,
  setMyApplications,
  addJob,
  updateJob,
  applyForJob,
  setJobStats,
  setLoading,
  setError,
  clearError,
  clearJobs,
} = jobSlice.actions;

export default jobSlice.reducer;
























































