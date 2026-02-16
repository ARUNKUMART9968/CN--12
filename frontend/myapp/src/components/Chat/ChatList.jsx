import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Loading } from '../Common';
import chatService from '../../services/chat';
import toast from 'react-hot-toast';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await chatService.getAllChats();
        setChats(response.data.chats);
      } catch (error) {
        toast.error('Failed to load chats');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) return <Loading fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
      <h1 className="text-4xl font-bold mb-8">Messages</h1>

      {chats.length > 0 ? (
        <div className="space-y-2">
          {chats.map((chat) => (
            <Card
              key={chat._id}
              hover
              className="cursor-pointer p-4"
              onClick={() => navigate(`/chat/${chat._id}`)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">Chat</h3>
                  <p className="text-gray-600 text-sm">{chat.lastMessage}</p>
                </div>
                <p className="text-gray-500 text-sm">
                  {new Date(chat.lastMessageTime).toLocaleDateString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600">No chats yet. Start a conversation!</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ChatList;