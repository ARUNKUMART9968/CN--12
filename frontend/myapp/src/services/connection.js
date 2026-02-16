import API from './api';

const connectionService = {
  // Send a connection request using YOUR actual backend route
  // Backend uses: GET /api/connect/list
  sendRequest: (receiverId) => 
    API.post('/connect/send', { receiverId }),
  
  // Get all connections by status
  getConnections: (status = 'accepted', page = 1, limit = 20) => 
    API.get(`/connect/list?status=${status}&page=${page}&limit=${limit}`),
  
  // Get pending connection requests
  getPendingRequests: (page = 1, limit = 20) => 
    API.get(`/connect/list?status=pending&page=${page}&limit=${limit}`),
  
  // Accept a connection request
  acceptConnection: (connectionId) => 
    API.put(`/connect/${connectionId}/accept`),
  
  // Reject a connection request
  rejectConnection: (connectionId) => 
    API.put(`/connect/${connectionId}/reject`),
  
  // Remove/cancel a connection
  removeConnection: (connectionId) => 
    API.delete(`/connect/${connectionId}`),
  
  // Get connection details
  getConnectionDetails: (connectionId) => 
    API.get(`/connect/${connectionId}`),
};

export default connectionService;