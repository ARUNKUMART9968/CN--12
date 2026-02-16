import React, { useEffect, useState } from 'react';
import { Card, Loading, Button } from '../Common';
import connectionService from '../../services/connection';
import toast from 'react-hot-toast';

const PendingRequests = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const response = await connectionService.getPendingRequests();
        setPending(response.data.pending);
      } catch (error) {
        toast.error('Failed to load pending requests');
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  const handleAccept = async (connectionId) => {
    try {
      await connectionService.acceptConnection(connectionId);
      setPending(pending.filter(p => p._id !== connectionId));
      toast.success('Connection accepted!');
    } catch (error) {
      toast.error('Failed to accept connection');
    }
  };

  const handleReject = async (connectionId) => {
    try {
      await connectionService.rejectConnection(connectionId);
      setPending(pending.filter(p => p._id !== connectionId));
      toast.success('Connection rejected');
    } catch (error) {
      toast.error('Failed to reject connection');
    }
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
      <h1 className="text-4xl font-bold mb-8">Pending Requests ({pending.length})</h1>

      {pending.length > 0 ? (
        <div className="space-y-4">
          {pending.map((req) => (
            <Card key={req._id}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">{req.senderName}</h3>
                  <p className="text-gray-600 text-sm">Sent {new Date(req.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleAccept(req._id)} size="sm">Accept</Button>
                  <Button onClick={() => handleReject(req._id)} variant="secondary" size="sm">Reject</Button>
                </div>
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
    </div>
  );
};

export default PendingRequests;