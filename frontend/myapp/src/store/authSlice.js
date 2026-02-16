import { createSlice } from '@reduxjs/toolkit';
import authService from '../services/auth';

const initialState = {
  user: authService.getUser(),
  isAuthenticated: authService.isAuthenticated(),
  token: authService.getToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      authService.setToken(action.payload.token);
      authService.setUser(action.payload.user);
    },

    registerSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      authService.setToken(action.payload.token);
      authService.setUser(action.payload.user);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      authService.logout();
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

    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      authService.setUser(state.user);
    },
  },
});

export const { 
  loginSuccess, 
  registerSuccess, 
  logout, 
  setLoading, 
  setError, 
  clearError,
  updateUser 
} = authSlice.actions;

export default authSlice.reducer;