import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Loading, Button } from '../Common';
import { FiPlus, FiSearch } from 'react-icons/fi';
import chatService from '../../services/chat';
import toast from 'react-hot-toast';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    // Filter chats based on search query
    if (searchQuery.trim() === '') {
      setFilteredChats(chats);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredChats(
        chats.filter(chat =>
          (chat.participantName && chat.participantName.toLowerCase().includes(query)) ||
          (chat.lastMessage && chat.lastMessage.toLowerCase().includes(query))
        )
      );
    }
  }, [searchQuery, chats]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await chatService.getAllChats(1, 20);
      
      console.log('Chats response:', response.data);
      
      if (response.data && response.data.chats) {
        setChats(response.data.chats);
      } else if (Array.isArray(response.data)) {
        setChats(response.data);
      } else {
        setChats([]);
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
      toast.error(error.response?.data?.message || 'Failed to load chats');
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (chatId) => {
    navigate(`/student/chat/${chatId}`);
  };

  const handleStartNewChat = () => {
    navigate('/student/connections');
  };

  if (loading) return <Loading fullScreen message="Loading messages..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">
            {filteredChats.length} {filteredChats.length === 1 ? 'conversation' : 'conversations'}
          </p>
        </div>
        <Button onClick={handleStartNewChat} className="flex items-center gap-2">
          <FiPlus size={20} />
          New Chat
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Chats List */}
      {filteredChats && filteredChats.length > 0 ? (
        <div className="space-y-2">
          {filteredChats.map((chat) => (
            <Card
              key={chat._id}
              hover
              className="cursor-pointer p-4"
              onClick={() => handleChatClick(chat._id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  {/* Participant Name */}
                  <h3 className="font-bold text-gray-900 truncate">
                    {chat.participantName || 'Unknown User'}
                  </h3>
                  
                  {/* Last Message Preview */}
                  <p className="text-gray-600 text-sm truncate">
                    {chat.lastMessage || 'No messages yet'}
                  </p>
                </div>

                {/* Time and Unread Badge */}
                <div className="text-right ml-4">
                  <p className="text-gray-500 text-xs whitespace-nowrap">
                    {chat.lastMessageTime
                      ? new Date(chat.lastMessageTime).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'No messages'}
                  </p>
                  
                  {/* Unread Count */}
                  {chat.unreadCount > 0 && (
                    <div className="mt-1 inline-block bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">
              {chats.length === 0
                ? "No conversations yet. Start a new chat!"
                : "No conversations match your search"}
            </p>
            {chats.length === 0 && (
              <Button onClick={handleStartNewChat} className="inline-flex items-center gap-2">
                <FiPlus size={20} />
                Start a Chat
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ChatList;