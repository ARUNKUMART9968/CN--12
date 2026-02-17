// src/api/matching.js
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export const getStudentMatches = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.MATCH.GET_STUDENT, {
      params: { page, limit },
    });

    // Handle multiple response formats
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data.matches) {
      return response.data.matches;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAlumniMatches = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.MATCH.GET_ALUMNI, {
      params: { page, limit },
    });

    // Handle multiple response formats
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data.matches) {
      return response.data.matches;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getMatchDetails = async (matchId) => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.MATCH.GET_DETAILS.replace(':matchId', matchId)
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};