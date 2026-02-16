import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setChats, setMessages, addMessage, setLoading } from '../store/chatSlice';
import chatService from '../services/chat';
import messageService from '../services/message';

export const useChat = () => {
  const dispatch = useDispatch();
  const { chats, currentChat, messages, loading } = useSelector(state => state.chat);
  const [socket, setSocket] = useState(null);

  const fetchChats = useCallback(async (page = 1) => {
    dispatch(setLoading(true));
    try {
      const response = await chatService.getAllChats(page);
      dispatch(setChats(response.data));
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    }
  }, [dispatch]);

  const fetchMessages = useCallback(async (chatId, page = 1) => {
    dispatch(setLoading(true));
    try {
      const response = await chatService.getMessages(chatId, page);
      dispatch(setMessages(response.data.messages));
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, [dispatch]);

  const sendMessage = useCallback(async (chatId, receiverId, text) => {
    try {
      const response = await messageService.sendMessage(chatId, receiverId, text);
      dispatch(addMessage(response.data.message));
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [dispatch]);

  return {
    chats,
    currentChat,
    messages,
    loading,
    fetchChats,
    fetchMessages,
    sendMessage,
    socket,
    setSocket,
  };
};