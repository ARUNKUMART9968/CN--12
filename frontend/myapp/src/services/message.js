import API from './api';

const messageService = {
  sendMessage: (chatId, receiverId, text) => 
    API.post('/message/send', { chatId, receiverId, text }),
  markAsRead: (messageId) => 
    API.put(`/message/${messageId}/read`),
  deleteMessage: (messageId) => 
    API.delete(`/message/${messageId}`),
  searchMessages: (chatId, query) => 
    API.get(`/message/search?chatId=${chatId}&query=${query}`),
  getUnreadMessages: () => API.get('/message/unread'),
  sendTypingIndicator: (socket, receiverId, isTyping) => {
    socket.emit('typing', { receiverId, isTyping });
  },
};

export default messageService;