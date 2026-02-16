import API from './api';

const chatService = {
  startChat: (receiverId) => API.post('/chat/start', { receiverId }),
  getAllChats: (page = 1, limit = 10) => 
    API.get(`/chat/list?page=${page}&limit=${limit}`),
  getMessages: (chatId, page = 1, limit = 20) => 
    API.get(`/chat/${chatId}/messages?page=${page}&limit=${limit}`),
  getUnreadCount: () => API.get('/chat/unread/count'),
  searchChats: (query) => API.get(`/chat/search?query=${query}`),
  archiveChat: (chatId) => API.put(`/chat/${chatId}/archive`),
};

export default chatService;