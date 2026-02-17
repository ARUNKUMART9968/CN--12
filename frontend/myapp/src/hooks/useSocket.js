// src/hooks/useSocket.js
import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  initializeSocket,
  closeSocket,
  getSocket,
  emitMessage,
  emitTyping,
  emitStopTyping,
  sendConnectionRequest,
  acceptConnection,
  rejectConnection,
} from '../api/socket';

export const useSocket = () => {
  const token = useSelector((state) => state.auth?.token);

  useEffect(() => {
    if (token) {
      initializeSocket(token);
    }

    return () => {
      if (!token) {
        closeSocket();
      }
    };
  }, [token]);

  const socket = getSocket();

  const sendMessage = useCallback((chatId, text) => {
    emitMessage(chatId, text);
  }, []);

  const startTyping = useCallback((chatId) => {
    emitTyping(chatId);
  }, []);

  const stopTyping = useCallback((chatId) => {
    emitStopTyping(chatId);
  }, []);

  const sendRequest = useCallback((userId) => {
    sendConnectionRequest(userId);
  }, []);

  const accept = useCallback((connectionId) => {
    acceptConnection(connectionId);
  }, []);

  const reject = useCallback((connectionId) => {
    rejectConnection(connectionId);
  }, []);

  return {
    socket,
    sendMessage,
    startTyping,
    stopTyping,
    sendRequest,
    accept,
    reject,
    isConnected: socket?.connected || false,
  };
};