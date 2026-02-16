import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  studentProfile: null,
  alumniProfile: null,
  profiles: [],
  currentUserProfile: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setStudentProfile: (state, action) => {
      state.studentProfile = action.payload;
      state.loading = false;
      state.error = null;
    },

    setAlumniProfile: (state, action) => {
      state.alumniProfile = action.payload;
      state.loading = false;
      state.error = null;
    },

    setCurrentUserProfile: (state, action) => {
      state.currentUserProfile = action.payload;
    },

    setProfiles: (state, action) => {
      state.profiles = action.payload.profiles;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.page;
      state.loading = false;
      state.error = null;
    },

    updateStudentProfile: (state, action) => {
      state.studentProfile = { ...state.studentProfile, ...action.payload };
    },

    updateAlumniProfile: (state, action) => {
      state.alumniProfile = { ...state.alumniProfile, ...action.payload };
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

    clearProfiles: (state) => {
      state.profiles = [];
      state.totalPages = 1;
      state.currentPage = 1;
    },
  },
});

export const {
  setStudentProfile,
  setAlumniProfile,
  setCurrentUserProfile,
  setProfiles,
  updateStudentProfile,
  updateAlumniProfile,
  setLoading,
  setError,
  clearError,
  clearProfiles,
} = profileSlice.actions;

export default profileSlice.reducer;