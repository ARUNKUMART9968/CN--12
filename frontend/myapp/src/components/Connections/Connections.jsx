import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Loading, Button, Badge } from '../Common';
import connectionService from '../../services/connection';
import toast from 'react-hot-toast';
import { FiMessageSquare, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('accepted'); // 'accepted' or 'pending'
  const navigate = useNavigate();

  useEffect(() => {
    fetchConnections();
    fetchPending();
  }, []);

  const fetchConnections = async () => {
    try {
      const response = await connectionService.getConnections('accepted', 1, 20);
      console.log('Connections response:', response.data);
      
      if (response.data && response.data.connections) {
        setConnections(response.data.connections);
      } else if (Array.isArray(response.data)) {
        setConnections(response.data);
      } else {
        setConnections([]);
      }
    } catch (error) {
      console.error('Failed to load connections:', error);
      toast.error('Failed to load connections');
    }
  };

  const fetchPending = async () => {
    try {
      setLoading(true);
      const response = await connectionService.getPendingRequests();
      console.log('Pending requests response:', response.data);
      
      if (response.data && response.data.pending) {
        setPending(response.data.pending);
      } else if (Array.isArray(response.data)) {
        setPending(response.data);
      } else {
        setPending([]);
      }
    } catch (error) {
      console.error('Failed to load pending requests:', error);
      toast.error('Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (connectionId) => {
    try {
      await connectionService.acceptConnection(connectionId);
      toast.success('Connection accepted!');
      
      // Update local state
      const accepted = pending.find(p => p._id === connectionId);
      if (accepted) {
        setPending(pending.filter(p => p._id !== connectionId));
        setConnections([...connections, accepted]);
      }
    } catch (error) {
      console.error('Failed to accept connection:', error);
      toast.error('Failed to accept connection');
    }
  };

  const handleReject = async (connectionId) => {
    try {
      await connectionService.rejectConnection(connectionId);
      toast.success('Connection rejected');
      setPending(pending.filter(p => p._id !== connectionId));
    } catch (error) {
      console.error('Failed to reject connection:', error);
      toast.error('Failed to reject connection');
    }
  };

  const handleStartChat = (userId, userName) => {
    navigate(`/student/chat/${userId}`, {
      state: { receiverId: userId, receiverName: userName }
    });
  };

  if (loading) return <Loading fullScreen message="Loading connections..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-8">My Connections</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab('accepted')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'accepted'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Accepted ({connections.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'pending'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending ({pending.length})
        </button>
      </div>

      {/* Accepted Connections Tab */}
      {activeTab === 'accepted' && (
        <>
          {connections && connections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connections.map((conn) => (
                <Card key={conn._id} hover>
                  {/* Connection Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold">
                      {conn.senderName || conn.receiverName || 'Unknown'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {conn.company || conn.designation || 'Professional'}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      Connected {new Date(conn.connectedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <Badge variant="success">Connected</Badge>
                  </div>

                  {/* Action Buttons */}
                  <Button
                    onClick={() => 
                      handleStartChat(
                        conn.senderId || conn.receiverId,
                        conn.senderName || conn.receiverName
                      )
                    }
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <FiMessageSquare size={16} />
                    Send Message
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-600">No connections yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  Browse matches to find people to connect with
                </p>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Pending Requests Tab */}
      {activeTab === 'pending' && (
        <>
          {pending && pending.length > 0 ? (
            <div className="space-y-4">
              {pending.map((req) => (
                <Card key={req._id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">
                        {req.senderName || 'Unknown'}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {req.company || req.designation || 'Professional'}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        Sent {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Status */}
                    <Badge variant="warning">Pending</Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    <Button
                      onClick={() => handleAccept(req._id)}
                      variant="success"
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <FiCheckCircle size={16} />
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleReject(req._id)}
                      variant="danger"
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <FiXCircle size={16} />
                      Reject
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-600">No pending requests</p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Connections;