import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  matches: [],
  recommendations: [],
  selectedMatch: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  matchingStats: {
    totalMatches: 0,
    highScoredMatches: 0,
    completedMatches: 0,
  },
};

const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    setMatches: (state, action) => {
      state.matches = action.payload.matches;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.page;
      state.loading = false;
      state.error = null;
    },

    setRecommendations: (state, action) => {
      state.recommendations = action.payload.recommendations;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.page;
      state.loading = false;
      state.error = null;
    },

    setSelectedMatch: (state, action) => {
      state.selectedMatch = action.payload;
    },

    addMatch: (state, action) => {
      state.matches.unshift(action.payload);
    },

    updateMatch: (state, action) => {
      const index = state.matches.findIndex(m => m._id === action.payload._id);
      if (index !== -1) {
        state.matches[index] = action.payload;
      }
    },

    setMatchingStats: (state, action) => {
      state.matchingStats = action.payload;
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

    clearMatches: (state) => {
      state.matches = [];
      state.recommendations = [];
      state.selectedMatch = null;
      state.totalPages = 1;
      state.currentPage = 1;
    },
  },
});

export const {
  setMatches,
  setRecommendations,
  setSelectedMatch,
  addMatch,
  updateMatch,
  setMatchingStats,
  setLoading,
  setError,
  clearError,
  clearMatches,
} = matchSlice.actions;

export default matchSlice.reducer;