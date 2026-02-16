import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Loading, Input, Button } from '../Common';
import { FiSend } from 'react-icons/fi';
import chatService from '../../services/chat';
import messageService from '../../services/message';
import toast from 'react-hot-toast';

const ChatWindow = () => {
  const { chatId } = useParams();
  const { user } = useSelector(state => state.auth);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await chatService.getMessages(chatId);
        setMessages(response.data.messages);
      } catch (error) {
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setSendingMessage(true);
    try {
      const response = await messageService.sendMessage(chatId, '', newMessage);
      setMessages([...messages, response.data.message]);
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28 flex flex-col h-screen">
      <Card className="flex-1 mb-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.senderId === user.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
          />
          <Button onClick={handleSendMessage} loading={sendingMessage} size="sm">
            <FiSend />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChatWindow;