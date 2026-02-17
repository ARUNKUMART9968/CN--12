// src/api/message.js
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export const getMessages = async (chatId, page = 1, limit = 20) => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.MESSAGE.GET_BY_CHAT.replace(':chatId', chatId),
      {
        params: { page, limit },
      }
    );

    // Handle multiple response formats
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data.messages) {
      return response.data.messages;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const sendMessage = async (chatId, text) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.MESSAGE.SEND, {
      chatId,
      text,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const markMessageAsRead = async (messageId) => {
  try {
    const response = await apiClient.put(
      API_ENDPOINTS.MESSAGE.MARK_READ.replace(':id', messageId)
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteMessage = async (messageId) => {
  try {
    const response = await apiClient.delete(
      API_ENDPOINTS.MESSAGE.DELETE.replace(':id', messageId)
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};