import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Loading, Button } from '../Common';
import { FiSend, FiArrowLeft } from 'react-icons/fi';
import chatService from '../../services/chat';
import messageService from '../../services/message';
import { getSocket, initSocket, emitEvent } from '../../services/socket';
import toast from 'react-hot-toast';

const ChatWindow = () => {
  const { chatId } = useParams();
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize socket and fetch messages
  useEffect(() => {
    if (!chatId) {
      toast.error('Invalid chat ID');
      navigate('/student/messages');
      return;
    }

    fetchChatData();
    
    // Initialize Socket.io
    if (!getSocket()) {
      const token = localStorage.getItem('token');
      if (token) {
        initSocket(token);
      }
    }

    return () => {
      // Cleanup socket listeners
    };
  }, [chatId]);

  // Listen for new messages via Socket.io
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (message) => {
      console.log('New message received:', message);
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    };

    const handleUserTyping = (data) => {
      if (data.userId !== user.id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    };

    socket.on('message', handleNewMessage);
    socket.on('typing', handleUserTyping);

    return () => {
      socket.off('message', handleNewMessage);
      socket.off('typing', handleUserTyping);
    };
  }, [user.id]);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const fetchChatData = async () => {
    try {
      setLoading(true);
      const response = await chatService.getMessages(chatId, 1, 50);
      
      console.log('Chat data response:', response.data);
      
      if (response.data) {
        setMessages(response.data.messages || []);
        setChat(response.data.chat || { _id: chatId });
      }
      
      scrollToBottom();
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error(error.response?.data?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    setSendingMessage(true);

    try {
      const response = await messageService.sendMessage(chatId, '', newMessage);
      
      console.log('Message sent:', response.data);
      
      if (response.data.message) {
        // Add message to local state
        setMessages(prev => [...prev, response.data.message]);
        setNewMessage('');
        scrollToBottom();
        
        // Emit via socket
        const socket = getSocket();
        if (socket) {
          emitEvent('message', response.data.message);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleTyping = () => {
    const socket = getSocket();
    if (socket && chat) {
      emitEvent('typing', {
        chatId: chatId,
        userId: user.id,
        isTyping: true
      });
    }
  };

  if (loading) return <Loading fullScreen message="Loading chat..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28 flex flex-col h-[calc(100vh-8rem)]">
      {/* Chat Header */}
      <Card className="mb-4 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/student/messages')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold">
              {chat?.participantName || 'Chat'}
            </h2>
            {isTyping && (
              <p className="text-sm text-gray-500 italic">typing...</p>
            )}
          </div>
        </div>
      </Card>

      {/* Messages Area */}
      <Card className="flex-1 mb-4 overflow-y-auto p-4">
        {messages && messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={msg._id || idx}
                className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.senderId === user.id
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="break-words">{msg.text || msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.senderId === user.id ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">
              No messages yet. Start the conversation!
            </p>
          </div>
        )}
      </Card>

      {/* Message Input Area */}
      <Card className="p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Type your message... (Enter to send)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={sendingMessage}
          />
          <Button
            type="submit"
            disabled={sendingMessage || !newMessage.trim()}
            className="flex items-center gap-2"
          >
            <FiSend size={20} />
            {sendingMessage ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </Card>

      {/* Helper Text */}
      <p className="text-center text-gray-600 text-xs mt-4">
        Messages are encrypted and secure
      </p>
    </div>
  );
};

export default ChatWindow;