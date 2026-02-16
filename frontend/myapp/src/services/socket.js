import io from 'socket.io-client';

let socket = null;

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const initSocket = (token) => {
  if (socket) return socket;
  
  socket = io(SOCKET_URL, {
    auth: {
      token: token || localStorage.getItem('token'),
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const getSocket = () => socket;

export const emitEvent = (event, data) => {
  if (socket && socket.connected) {
    socket.emit(event, data);
  } else {
    console.warn('Socket not connected');
  }
};

export const onEvent = (event, callback) => {
  if (socket) {
    socket.on(event, callback);
  }
};

export const offEvent = (event, callback) => {
  if (socket) {
    socket.off(event, callback);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default {
  initSocket,
  getSocket,
  emitEvent,
  onEvent,
  offEvent,
  disconnectSocket,
};