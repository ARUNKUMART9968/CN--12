import API from './api';

const chatService = {
  // Get all chats using YOUR actual backend route
  getAllChats: (page = 1, limit = 20) => 
    API.get(`/chat/list?page=${page}&limit=${limit}`),
  
  // Get messages in a specific chat
  getMessages: (chatId, page = 1, limit = 50) => 
    API.get(`/chat/${chatId}/messages?page=${page}&limit=${limit}`),
  
  // Start a new chat with a user
  startChat: (receiverId) => 
    API.post('/chat/start', { receiverId }),
  
  // Get single chat details
  getChat: (chatId) => 
    API.get(`/chat/${chatId}`),
  
  // Delete chat
  deleteChat: (chatId) => 
    API.delete(`/chat/${chatId}`),
};

export default chatService;