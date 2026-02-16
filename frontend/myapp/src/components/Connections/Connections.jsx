import React, { useEffect, useState } from 'react';
import { Card, Loading } from '../Common';
import connectionService from '../../services/connection';
import toast from 'react-hot-toast';

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await connectionService.getConnections('accepted');
        setConnections(response.data.connections);
      } catch (error) {
        toast.error('Failed to load connections');
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  if (loading) return <Loading fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
      <h1 className="text-4xl font-bold mb-8">My Connections</h1>

      {connections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((conn) => (
            <Card key={conn._id} hover>
              <h3 className="text-lg font-bold mb-2">Connected</h3>
              <p className="text-gray-600">Since {new Date(conn.connectedAt).toLocaleDateString()}</p>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Send Message
              </button>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600">No connections yet. Browse matches to find people to connect with!</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Connections;