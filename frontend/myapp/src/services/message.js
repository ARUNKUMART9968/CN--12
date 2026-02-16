import API from './api';

const messageService = {
  // Send a message
  sendMessage: (chatId, text, content = '') => 
    API.post(`/message/${chatId}`, { 
      text: text || content,
      content: text || content 
    }),
  
  // Get messages with pagination
  getMessages: (chatId, page = 1, limit = 50) => 
    API.get(`/message/${chatId}?page=${page}&limit=${limit}`),
  
  // Delete a message
  deleteMessage: (messageId) => 
    API.delete(`/message/${messageId}`),
  
  // Edit a message
  editMessage: (messageId, text) => 
    API.put(`/message/${messageId}`, { text }),
  
  // Mark message as read
  markAsRead: (messageId) => 
    API.put(`/message/${messageId}/read`),
};

export default messageService;