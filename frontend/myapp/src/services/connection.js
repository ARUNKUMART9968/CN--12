import API from './api';

const connectionService = {
  sendRequest: (receiverId) => API.post('/connect/send', { receiverId }),
  acceptConnection: (connectionId) => 
    API.put(`/connect/accept/${connectionId}`),
  rejectConnection: (connectionId) => 
    API.put(`/connect/reject/${connectionId}`),
  getConnections: (status = 'accepted', page = 1, limit = 10) => 
    API.get(`/connect/list?status=${status}&page=${page}&limit=${limit}`),
  getPendingRequests: () => API.get('/connect/pending'),
  checkConnectionStatus: (userId) => API.get(`/connect/status/${userId}`),
};

export default connectionService;