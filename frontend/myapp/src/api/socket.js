// src/api/socket.js
import io from 'socket.io-client';
import { SOCKET_EVENTS } from '../config/socket';

const SOCKET_URL = process.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initializeSocket = (token) => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on(SOCKET_EVENTS.CONNECT, () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    console.log('Socket disconnected');
  });

  socket.on(SOCKET_EVENTS.CONNECT_ERROR, (error) => {
    console.error('Socket connection error:', error);
  });

  socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (message) => {
    console.log('New message received:', message);
    window.dispatchEvent(
      new CustomEvent('newMessage', { detail: message })
    );
  });

  socket.on(SOCKET_EVENTS.TYPING, (data) => {
    console.log('User typing:', data);
    window.dispatchEvent(new CustomEvent('userTyping', { detail: data }));
  });

  socket.on(SOCKET_EVENTS.NEW_NOTIFICATION, (notification) => {
    console.log('New notification:', notification);
    window.dispatchEvent(
      new CustomEvent('newNotification', { detail: notification })
    );
  });

  socket.on(SOCKET_EVENTS.CONNECTION_REQUEST, (request) => {
    console.log('Connection request:', request);
    window.dispatchEvent(
      new CustomEvent('connectionRequest', { detail: request })
    );
  });

  return socket;
};

export const getSocket = () => socket;

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const emitMessage = (chatId, text) => {
  if (socket?.connected) {
    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, { chatId, text });
  }
};

export const emitTyping = (chatId) => {
  if (socket?.connected) {
    socket.emit(SOCKET_EVENTS.TYPING, { chatId });
  }
};

export const emitStopTyping = (chatId) => {
  if (socket?.connected) {
    socket.emit(SOCKET_EVENTS.STOP_TYPING, { chatId });
  }
};

export const sendConnectionRequest = (userId) => {
  if (socket?.connected) {
    socket.emit(SOCKET_EVENTS.CONNECTION_REQUEST, { userId });
  }
};

export const acceptConnection = (connectionId) => {
  if (socket?.connected) {
    socket.emit(SOCKET_EVENTS.CONNECTION_ACCEPT, { connectionId });
  }
};

export const rejectConnection = (connectionId) => {
  if (socket?.connected) {
    socket.emit(SOCKET_EVENTS.CONNECTION_REJECT, { connectionId });
  }
};