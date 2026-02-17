// src/api/connection.js
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export const getConnections = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.CONNECTION.GET_LIST, {
      params: { page, limit },
    });

    // Handle multiple response formats
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data.connections) {
      return response.data.connections;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPendingRequests = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.CONNECTION.GET_PENDING,
      {
        params: { page, limit },
      }
    );

    // Handle multiple response formats
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data.requests) {
      return response.data.requests;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const sendConnectionRequest = async (userId) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.CONNECTION.SEND, {
      receiverId: userId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const acceptConnection = async (connectionId) => {
  try {
    const response = await apiClient.put(
      API_ENDPOINTS.CONNECTION.ACCEPT.replace(':id', connectionId)
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const rejectConnection = async (connectionId) => {
  try {
    const response = await apiClient.put(
      API_ENDPOINTS.CONNECTION.REJECT.replace(':id', connectionId)
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};