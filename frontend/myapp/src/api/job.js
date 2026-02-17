// src/api/job.js
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export const getAllJobs = async (page = 1, limit = 10, filters = {}) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.JOB.GET_ALL, {
      params: { page, limit, ...filters },
    });

    // Handle multiple response formats
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data.jobs) {
      return response.data.jobs;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getJobById = async (jobId) => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.JOB.GET_ONE.replace(':id', jobId)
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const applyForJob = async (jobId) => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.JOB.APPLY.replace(':id', jobId)
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getJobApplicants = async (jobId) => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.JOB.GET_APPLICANTS.replace(':id', jobId)
    );

    // Handle multiple response formats
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data.applicants) {
      return response.data.applicants;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateApplicantStatus = async (jobId, studentId, status) => {
  try {
    const response = await apiClient.put(
      API_ENDPOINTS.JOB.UPDATE_APPLICANT.replace(':jobId', jobId).replace(
        ':studentId',
        studentId
      ),
      { status }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};