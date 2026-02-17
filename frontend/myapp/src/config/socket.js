// src/config/socket.js
export const SOCKET_EVENTS = {
  // Chat events
  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',
  TYPING: 'typing',
  STOP_TYPING: 'stop_typing',
  MESSAGE_READ: 'message_read',
  
  // Connection events
  CONNECTION_REQUEST: 'connection_request',
  CONNECTION_ACCEPT: 'connection_accept',
  CONNECTION_REJECT: 'connection_reject',
  
  // Notification events
  NEW_NOTIFICATION: 'notification',
  READ_NOTIFICATION: 'read_notification',
  NOTIFICATION_COUNT: 'notification_count',
  
  // User events
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  USER_TYPING: 'user_typing',
  
  // Connection management
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
};