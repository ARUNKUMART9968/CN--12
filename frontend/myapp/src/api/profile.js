// src/api/profile.js
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export const getProfile = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.PROFILE.GET);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createProfile = async (profileData) => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.PROFILE.CREATE,
      profileData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await apiClient.put(
      API_ENDPOINTS.PROFILE.UPDATE,
      profileData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getStudentProfile = async (userId) => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.PROFILE.GET_STUDENT.replace(':userId', userId)
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAlumniProfile = async (userId) => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.PROFILE.GET_ALUMNI.replace(':userId', userId)
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};